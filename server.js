const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);
  if (req.path.includes('assets')) {
    console.log('Asset request detected:', req.path);
    const fullPath = path.join(__dirname, 'frontend/dist', req.path);
    console.log('Full path:', fullPath);
    console.log('File exists:', fs.existsSync(fullPath));
  }
  next();
});

// Serve static files from frontend build with proper MIME types
app.use(express.static(path.join(__dirname, 'frontend/dist'), {
  setHeaders: (res, path) => {
    console.log('Serving static file:', path);
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.woff2')) {
      res.setHeader('Content-Type', 'font/woff2');
    } else if (path.endsWith('.woff')) {
      res.setHeader('Content-Type', 'font/woff');
    }
  }
}));

// Cache for gold price (refresh every 6 hours)
let goldPriceCache = {
  price: null, // Will be fetched from real-time API
  lastUpdated: null,
  CACHE_DURATION: 6 * 60 * 60 * 1000 // 6 hours
};

// Function to get real-time gold price
async function getGoldPrice() {
  const now = Date.now();
  
  // Return cached price if still valid
  if (goldPriceCache.price && goldPriceCache.lastUpdated && 
      (now - goldPriceCache.lastUpdated) < goldPriceCache.CACHE_DURATION) {
    return goldPriceCache.price;
  }

  try {
    // Using gold-api.com - Free, reliable, and accurate
    const response = await axios.get('https://api.gold-api.com/price/XAU', {
      timeout: 5000
    });
    
    if (response.data && response.data.price) {
      // API returns price per troy ounce in USD
      const goldPricePerOunce = response.data.price;
      const goldPricePerGram = goldPricePerOunce / 31.1035; // Convert from ounce to gram
      
      // Update cache
      goldPriceCache.price = goldPricePerGram;
      goldPriceCache.lastUpdated = now;
      
      console.log(`💰 Real-time gold price: $${goldPricePerOunce.toFixed(2)} per ounce = $${goldPricePerGram.toFixed(2)} per gram`);
      console.log(`🕒 Last updated: ${response.data.updatedAtReadable || 'recently'}`);
      
      return goldPricePerGram;
    } else {
      throw new Error('Invalid response format from gold API');
    }
  } catch (error) {
    console.warn('Gold API failed:', error.message);
    
    // Fallback to current market price
    const fallbackPrice = 107.5; // Current market price per gram (based on $3340 per ounce)
    goldPriceCache.price = fallbackPrice;
    goldPriceCache.lastUpdated = now;
    
    console.log(`💰 Using fallback price: $${fallbackPrice} per gram`);
    return fallbackPrice;
  }
}

// Function to load products from JSON file
function loadProducts() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

// Function to calculate product price
// Price = (popularityScore + 1) * weight * goldPrice
function calculatePrice(popularityScore, weight, goldPrice) {
  return ((popularityScore + 1) * weight * goldPrice).toFixed(2);
}

// Function to convert popularity score to 5-star rating
function convertPopularityToStars(popularityScore) {
  return (popularityScore * 5).toFixed(1);
}

// API Routes

// Get all products with calculated prices and optional filtering
// Supported query parameters:
// - minPrice: Minimum price filter (e.g., ?minPrice=200)
// - maxPrice: Maximum price filter (e.g., ?maxPrice=500)
// - minPopularity: Minimum popularity score filter (e.g., ?minPopularity=0.8)
// - maxPopularity: Maximum popularity score filter (e.g., ?maxPopularity=0.95)
// - sortBy: Sort by 'price', 'popularity', or 'name' (e.g., ?sortBy=price)
// - sortOrder: 'asc' or 'desc' (e.g., ?sortOrder=desc)
app.get('/api/products', async (req, res) => {
  try {
    const products = loadProducts();
    const goldPrice = await getGoldPrice();
    
    // Extract query parameters for filtering and sorting
    const { 
      minPrice, 
      maxPrice, 
      minPopularity, 
      maxPopularity,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;
    
    // Add calculated price and star rating to each product
    let enrichedProducts = products.map(product => {
      // Convert image URLs to use proxy
      const proxiedImages = {};
      Object.keys(product.images).forEach(color => {
        const originalUrl = product.images[color];
        proxiedImages[color] = `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`;
      });
      
      return {
        ...product,
        images: proxiedImages,
        price: parseFloat(calculatePrice(product.popularityScore, product.weight, goldPrice)),
        starRating: parseFloat(convertPopularityToStars(product.popularityScore)),
        priceFormatted: `$${calculatePrice(product.popularityScore, product.weight, goldPrice)}`
      };
    });
    
    // Store original count before filtering
    const originalCount = enrichedProducts.length;
    
    // Apply filters if provided
    const appliedFilters = {};
    if (minPrice || maxPrice || minPopularity || maxPopularity) {
      if (minPrice) appliedFilters.minPrice = parseFloat(minPrice);
      if (maxPrice) appliedFilters.maxPrice = parseFloat(maxPrice);
      if (minPopularity) appliedFilters.minPopularity = parseFloat(minPopularity);
      if (maxPopularity) appliedFilters.maxPopularity = parseFloat(maxPopularity);
      
      enrichedProducts = enrichedProducts.filter(product => {
        let passes = true;
        
        if (minPrice && product.price < parseFloat(minPrice)) passes = false;
        if (maxPrice && product.price > parseFloat(maxPrice)) passes = false;
        if (minPopularity && product.popularityScore < parseFloat(minPopularity)) passes = false;
        if (maxPopularity && product.popularityScore > parseFloat(maxPopularity)) passes = false;
        
        return passes;
      });
    }
    
    // Apply sorting
    if (sortBy && ['price', 'popularity', 'name'].includes(sortBy)) {
      enrichedProducts.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'popularity':
            aValue = a.popularityScore;
            bValue = b.popularityScore;
            break;
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          default:
            return 0;
        }
        
        if (sortOrder === 'desc') {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        } else {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        }
      });
    }
    
    res.json({
      success: true,
      goldPrice: goldPrice.toFixed(2),
      totalProducts: enrichedProducts.length,
      originalCount,
      appliedFilters: Object.keys(appliedFilters).length > 0 ? appliedFilters : null,
      sorting: {
        sortBy,
        sortOrder
      },
      products: enrichedProducts
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
});

// Get filter options and ranges for products
app.get('/api/products/filters', async (req, res) => {
  try {
    const products = loadProducts();
    const goldPrice = await getGoldPrice();
    
    // Calculate prices for all products to get ranges
    const enrichedProducts = products.map(product => ({
      ...product,
      price: parseFloat(calculatePrice(product.popularityScore, product.weight, goldPrice))
    }));
    
    // Calculate price range
    const prices = enrichedProducts.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    // Calculate popularity range
    const popularityScores = products.map(p => p.popularityScore);
    const minPopularity = Math.min(...popularityScores);
    const maxPopularity = Math.max(...popularityScores);
    
    // Get available sorting options
    const sortOptions = [
      { value: 'name', label: 'Name' },
      { value: 'price', label: 'Price' },
      { value: 'popularity', label: 'Popularity' }
    ];
    
    const sortOrders = [
      { value: 'asc', label: 'Ascending' },
      { value: 'desc', label: 'Descending' }
    ];
    
    res.json({
      success: true,
      goldPrice: goldPrice.toFixed(2),
      totalProducts: products.length,
      priceRange: {
        min: Math.floor(minPrice),
        max: Math.ceil(maxPrice),
        current: { min: minPrice.toFixed(2), max: maxPrice.toFixed(2) }
      },
      popularityRange: {
        min: minPopularity,
        max: maxPopularity,
        scale: '0.0 to 1.0'
      },
      availableFilters: {
        price: {
          type: 'range',
          min: Math.floor(minPrice),
          max: Math.ceil(maxPrice),
          step: 10,
          description: 'Filter products by price range'
        },
        popularity: {
          type: 'range',
          min: 0,
          max: 1,
          step: 0.1,
          description: 'Filter products by popularity score (0-1)'
        }
      },
      sorting: {
        options: sortOptions,
        orders: sortOrders,
        default: { sortBy: 'name', sortOrder: 'asc' }
      }
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch filter options'
    });
  }
});

// Get single product by index
app.get('/api/products/:index', async (req, res) => {
  try {
    const products = loadProducts();
    const index = parseInt(req.params.index);
    
    if (index < 0 || index >= products.length) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    const goldPrice = await getGoldPrice();
    const product = products[index];
    
    const enrichedProduct = {
      ...product,
      price: parseFloat(calculatePrice(product.popularityScore, product.weight, goldPrice)),
      starRating: parseFloat(convertPopularityToStars(product.popularityScore)),
      priceFormatted: `$${calculatePrice(product.popularityScore, product.weight, goldPrice)}`
    };
    
    res.json({
      success: true,
      goldPrice: goldPrice.toFixed(2),
      product: enrichedProduct
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product'
    });
  }
});

// Get current gold price
app.get('/api/gold-price', async (req, res) => {
  try {
    const goldPrice = await getGoldPrice();
    res.json({
      success: true,
      goldPrice: goldPrice.toFixed(2),
      currency: 'USD',
      unit: 'per gram',
      lastUpdated: goldPriceCache.lastUpdated
    });
  } catch (error) {
    console.error('Error fetching gold price:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch gold price'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Product Listing API is running',
    timestamp: new Date().toISOString()
  });
});

// Image proxy endpoint to bypass CORS issues
app.get('/api/image-proxy', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter required' });
    }
    
    // Validate URL is from Shopify CDN
    if (!url.includes('cdn.shopify.com')) {
      return res.status(400).json({ error: 'Only Shopify CDN URLs allowed' });
    }
    
    const response = await axios.get(url, {
      responseType: 'stream',
      timeout: 10000
    });
    
    // Set appropriate headers
    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hours
    
    // Pipe the image data
    response.data.pipe(res);
    
  } catch (error) {
    console.error('Image proxy error:', error.message);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  console.log('Catch-all route hit for:', req.path);
  
  const indexPath = path.join(__dirname, 'frontend/dist/index.html');
  console.log('Attempting to serve:', indexPath);
  console.log('Current directory:', __dirname);
  console.log('Directory listing:', fs.readdirSync(__dirname));
  
  // Check frontend directory structure
  const frontendDir = path.join(__dirname, 'frontend');
  if (fs.existsSync(frontendDir)) {
    console.log('Frontend dir exists, contents:', fs.readdirSync(frontendDir));
    const distDir = path.join(frontendDir, 'dist');
    if (fs.existsSync(distDir)) {
      console.log('Dist dir exists, contents:', fs.readdirSync(distDir));
      const assetsDir = path.join(distDir, 'assets');
      if (fs.existsSync(assetsDir)) {
        console.log('Assets dir exists, contents:', fs.readdirSync(assetsDir));
      }
    }
  }
  
  // Check if file exists
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.log('Frontend index.html not found');
    res.status(200).json({
      message: 'Frontend files not found',
      attempted_path: indexPath,
      cwd: process.cwd(),
      dirname: __dirname,
      directory_listing: fs.readdirSync(__dirname),
      api_working: true
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api/`);
  
  // Test gold price fetch on startup
  getGoldPrice()
    .then(price => console.log(`💰 Current gold price: $${price.toFixed(2)} per gram`))
    .catch(error => console.warn('⚠️ Could not fetch initial gold price:', error.message));
});

module.exports = app; 