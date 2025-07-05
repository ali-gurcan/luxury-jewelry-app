# Luxury Engagement Rings - Product Listing Application

A modern full-stack web application showcasing a collection of luxury engagement rings with dynamic pricing based on real-time gold prices.

## 🌟 Features

### Backend API
- **RESTful API** serving product data from JSON file
- **Dynamic Price Calculation** using the formula: `Price = (popularityScore + 1) × weight × goldPrice`
- **Real-time Gold Price Integration** from live market data
- **Advanced Filtering** by price range and popularity score
- **Caching System** for optimized performance
- **Error Handling** with graceful fallbacks

### Frontend Interface
- **Responsive Carousel** with swipe and arrow navigation
- **Interactive Color Picker** for different gold types (Yellow, Rose, White)
- **Star Rating System** converted from popularity scores (0-100% to 0-5 stars)
- **Modern UI/UX** with smooth animations and transitions
- **Mobile-First Design** optimized for all device sizes
- **Loading States** and error handling

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **Axios** for external API calls
- **CORS** for cross-origin requests
- **Helmet** for security
- **Compression** for performance

### Frontend
- **React 19** with hooks
- **Vite** for fast development and building
- **Swiper.js** for carousel functionality
- **React Icons** for UI icons
- **Modern CSS** with Flexbox and Grid

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd product-listing-app
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Build the frontend**
   ```bash
   npm run build:frontend
   ```

5. **Start the application**
   ```bash
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
- `GET /api/products?minPrice=100&maxPrice=500` - Get filtered products
- `GET /api/products/:index` - Get single product by index

### Gold Price
- `GET /api/gold-price` - Get current gold price per gram

### Health Check
- `GET /api/health` - Server health status

## 🧮 Price Calculation

The application calculates product prices using real-time gold prices:

```javascript
Price = (popularityScore + 1) × weight × goldPrice
```

Where:
- `popularityScore`: Product popularity (0.0 to 1.0)
- `weight`: Product weight in grams
- `goldPrice`: Current gold price per gram in USD

## 🎨 Design Features

### Color Picker
- **Three gold types**: Yellow Gold, Rose Gold, White Gold
- **Visual swatches** with gradient backgrounds
- **Active state indicators** with animations
- **Accessibility support** with ARIA labels

### Star Rating System
- **Popularity score conversion**: Percentage to 5-star rating
- **Visual indicators**: Full stars, half stars, empty stars
- **Decimal precision**: Displayed to 1 decimal place

### Responsive Carousel
- **Mobile swipe support** with touch gestures
- **Desktop navigation** with arrow buttons
- **Automatic pagination** with dot indicators
- **Breakpoint optimization** for different screen sizes

## 🔧 Configuration

### Gold Price API
The application uses `metals.live` API for real-time gold prices. You can modify the gold price source in `server.js`:

```javascript
const response = await axios.get('https://api.metals.live/v1/spot/gold');
```

### Product Data
Products are loaded from `products.json`. You can modify this file to add or update products:

```json
{
  "name": "Product Name",
  "popularityScore": 0.85,
  "weight": 2.1,
  "images": {
    "yellow": "image_url",
    "rose": "image_url", 
    "white": "image_url"
  }
}
```

## 📱 Responsive Design

The application is optimized for:
- **Mobile devices** (320px and up)
- **Tablets** (768px and up)
- **Desktop** (1024px and up)
- **Large screens** (1400px and up)

## 🚀 Deployment

### Production Build
```bash
npm run build:frontend
npm start
```

### Environment Variables
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode

### Hosting Platforms
The application is ready for deployment on:
- **Heroku**
- **Vercel**
- **Netlify**
- **DigitalOcean App Platform**

### Deployment Steps

#### Heroku
1. Create a new Heroku app
2. Add Node.js buildpack
3. Set environment variables if needed
4. Deploy via Git or GitHub integration

#### Vercel
1. Connect GitHub repository
2. Set build command: `npm run build:frontend`
3. Set output directory: `frontend/dist`
4. Deploy automatically on push

## 🔍 Performance Optimizations

- **Image lazy loading** for better performance
- **Gold price caching** (30-minute intervals)
- **Gzip compression** for smaller payload sizes
- **Code splitting** with dynamic imports
- **Optimized bundle size** with Vite

## 🛡️ Security Features

- **Helmet.js** for security headers
- **CORS** configuration
- **Input validation** and sanitization
- **Error handling** without sensitive data exposure

## 🧪 Testing

The application includes:
- **Error boundary** handling
- **Loading states** for better UX
- **Fallback mechanisms** for API failures
- **Responsive testing** across devices

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For questions or issues, please create an issue in the repository or contact the development team.

---

**Made with ❤️ for luxury jewelry enthusiasts** 