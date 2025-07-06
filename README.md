# 💎 Luxury Engagement Rings - Product Listing Application

A full-stack luxury jewelry e-commerce application showcasing engagement rings with dynamic pricing, interactive features, and modern UI/UX design.

🌐 **Live Demo**: [https://luxury-jewelry-app.vercel.app/](https://luxury-jewelry-app.vercel.app/)

## 🌟 Features

### 🔧 Backend Features
- **RESTful API** with Express.js server
- **Dynamic Price Calculation** using real-time gold prices
- **Real-time Gold Price Integration** with caching (30-minute intervals)
- **Advanced Filtering & Sorting** by price range and popularity
- **Image Proxy Service** to handle CORS issues with external CDNs
- **Comprehensive Error Handling** with graceful fallbacks
- **Security Headers** and CORS configuration

### 🎨 Frontend Features
- **Responsive Carousel** with Swiper.js (4 products on desktop)
- **Interactive Color Picker** for gold types (Yellow, Rose, White)
- **Star Rating System** with elegant styling
- **Modern Minimalist Design** with luxury aesthetics
- **Mobile-First Responsive Design**
- **Smooth Animations** and hover effects
- **Loading States** and error handling

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client for external APIs
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Compression** - Response compression

### Frontend
- **React 19** - Frontend framework
- **Vite** - Build tool and development server
- **Swiper.js** - Modern carousel/slider library
- **React Icons** - Icon library (Font Awesome)
- **Modern CSS** - Flexbox, Grid, and animations

### Fonts & Design
- **Avenir** - Primary font family
- **Montserrat** - Secondary font family
- **Custom Color Palette** - Gold (#F0D49E), Rose (#E1A4A9), White (#D9D9D9)

### Deployment
- **Vercel** - Hosting platform
- **Git** - Version control
- **GitHub** - Repository hosting

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ali-gurcan/luxury-jewelry-app.git
   cd luxury-jewelry-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Build and start the application**
   ```bash
   npm run vercel-build
   npm start
   ```

The application will be available at `http://localhost:3000`

### Development Mode

For development with hot reload:

1. **Start the backend server**
   ```bash
   npm run dev
   ```

2. **In a new terminal, start the frontend**
   ```bash
   cd frontend
   npm run dev
   ```

Frontend will be available at `http://localhost:5173` with API proxy to backend.

## 📊 API Endpoints

### Products
- `GET /api/products` - Get all products with calculated prices
  ```json
  {
    "products": [
      {
        "name": "Solitaire Engagement Ring",
        "popularityScore": 0.85,
        "weight": 2.1,
        "price": 378.00,
        "priceFormatted": "$378.00",
        "starRating": 4.3,
        "images": {
          "yellow": "https://...",
          "rose": "https://...",
          "white": "https://..."
        }
      }
    ]
  }
  ```

- `GET /api/products?minPrice=100&maxPrice=500` - Get filtered products
- `GET /api/products?minPopularity=0.5&maxPopularity=1.0` - Filter by popularity
- `GET /api/products?sortBy=price&order=asc` - Sort products
- `GET /api/products/:index` - Get single product by index

### Gold Price
- `GET /api/gold-price` - Get current gold price per gram
  ```json
  {
    "goldPrice": 65.23,
    "currency": "USD",
    "unit": "gram",
    "lastUpdated": "2024-01-01T12:00:00Z"
  }
  ```

### Image Proxy
- `GET /api/image-proxy?url=<encoded_url>` - Proxy external images to bypass CORS

### Health Check
- `GET /api/health` - Server health status
  ```json
  {
    "status": "healthy",
    "timestamp": "2024-01-01T12:00:00Z",
    "uptime": "2h 30m"
  }
  ```

## 🧮 Price Calculation Formula

The application calculates product prices using real-time gold prices:

```javascript
Price = (popularityScore + 1) × weight × goldPrice
```

**Where:**
- `popularityScore`: Product popularity (0.0 to 1.0)
- `weight`: Product weight in grams
- `goldPrice`: Current gold price per gram in USD

**Example:**
- Popularity: 0.85
- Weight: 2.1g
- Gold Price: $65/gram
- **Final Price:** (0.85 + 1) × 2.1 × 65 = **$252.53**

## 🎨 Design Features

### Color Picker
- **Three gold types**: Yellow Gold (#E6CA97), Rose Gold (#E1A4A9), White Gold (#D9D9D9)
- **Visual swatches** with gradient backgrounds
- **Active state indicators** with smooth animations
- **Accessibility support** with ARIA labels and tooltips

### Star Rating System
- **Popularity conversion**: 0-100% mapped to 0-5 stars
- **Visual indicators**: Full stars, half stars, empty stars with golden outline
- **Decimal precision**: Displayed to 1 decimal place (e.g., 4.3/5)

### Responsive Carousel
- **Desktop**: 4 products visible with navigation arrows
- **Tablet**: 3 products visible
- **Mobile**: 2 products visible with touch swipe
- **Scrollbar**: Horizontal scrollbar for navigation
- **Smooth transitions** and hover effects

## 🔧 Configuration

### Gold Price API
The application uses `metals.live` API for real-time gold prices with 30-minute caching:

```javascript
const GOLD_PRICE_API = 'https://api.metals.live/v1/spot/gold';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
```

### Product Data
Products are loaded from `products.json`. Structure:

```json
{
  "name": "Product Name",
  "popularityScore": 0.85,
  "weight": 2.1,
  "images": {
    "yellow": "https://shopify-cdn-url/yellow-gold-ring.jpg",
    "rose": "https://shopify-cdn-url/rose-gold-ring.jpg",
    "white": "https://shopify-cdn-url/white-gold-ring.jpg"
  }
}
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 767px (2 products)
- **Tablet**: 768px - 1023px (3 products)
- **Desktop**: 1024px - 1399px (4 products)
- **Large Desktop**: 1400px+ (4 products, larger images)

### Mobile Optimizations
- Touch-friendly swipe gestures
- Optimized image sizes
- Simplified navigation
- Responsive typography

## 🚀 Deployment

### Vercel Configuration
```json
{
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

### Production Build
```bash
npm run vercel-build  # Builds frontend
npm start            # Starts production server
```

### Environment Variables
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode

## 🔒 Security Features

### Backend Security
- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Input validation** and sanitization
- **Error handling** without exposing sensitive data

### Frontend Security
- **Content Security Policy** headers
- **XSS protection** through React's built-in sanitization
- **HTTPS enforcement** in production

## 📁 Project Structure

```
luxury-jewelry-app/
├── 📁 frontend/              # React frontend
│   ├── 📁 src/
│   │   ├── App.jsx          # Main React component
│   │   ├── App.css          # Styling
│   │   └── main.jsx         # Entry point
│   ├── 📁 public/           # Static assets
│   └── package.json         # Frontend dependencies
├── 📁 Fonts/                # Custom fonts
├── products.json            # Product data
├── server.js               # Express server
├── package.json            # Backend dependencies
├── vercel.json             # Vercel configuration
└── README.md               # This file
```

## 🎯 Key Achievements

- ✅ **Full-stack application** with modern tech stack
- ✅ **Real-time gold pricing** with caching
- ✅ **Responsive design** for all devices
- ✅ **Interactive UI** with smooth animations
- ✅ **Production deployment** on Vercel
- ✅ **SEO-friendly** with proper meta tags
- ✅ **Performance optimized** with compression and caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Ali Gürcan**
- GitHub: [@ali-gurcan](https://github.com/ali-gurcan)
- Email: m.aligurcan@outlook.com

---

**Built with ❤️ using React, Node.js, and modern web technologies** 