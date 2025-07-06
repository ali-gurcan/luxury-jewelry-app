# 💎 Luxury Engagement Rings

A full-stack jewelry e-commerce application with dynamic pricing based on real-time gold prices.

🌐 **Live Demo**: [https://luxury-jewelry-app.vercel.app/](https://luxury-jewelry-app.vercel.app/)

## 🌟 Features

- **Dynamic Pricing** with real-time gold price integration
- **Responsive Carousel** with 4 rings on desktop, swipe on mobile
- **Color Picker** for gold types (Yellow, Rose, White)
- **Star Rating System** based on popularity scores
- **Modern UI** with smooth animations and hover effects

## 🛠️ Tech Stack

**Backend**: Node.js, Express.js, Axios  
**Frontend**: React 19, Vite, Swiper.js  
**Deployment**: Vercel

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/ali-gurcan/luxury-jewelry-app.git
cd luxury-jewelry-app
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Build and start
npm run vercel-build
npm start
```

## 📊 API Endpoints

- `GET /api/products` - All products with calculated prices
- `GET /api/products?minPrice=100&maxPrice=500` - Filtered products
- `GET /api/gold-price` - Current gold price per gram
- `GET /api/health` - Server health check

## 🧮 Price Formula

```javascript
Price = (popularityScore + 1) × weight × goldPrice
```

## 📱 Responsive Design

- **Desktop**: 4 products visible
- **Tablet**: 3 products visible  
- **Mobile**: 2 products visible with swipe

## 👨‍💻 Author

**Ali Gürcan**  
GitHub: [@ali-gurcan](https://github.com/ali-gurcan)  
Email: m.aligurcan@outlook.com 