import { useState, useEffect } from 'react'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Scrollbar } from 'swiper/modules'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [goldPrice, setGoldPrice] = useState(null)
  const [selectedColors, setSelectedColors] = useState({})
  const [sortOption, setSortOption] = useState('name-asc')

  useEffect(() => {
    fetchProducts()
  }, [sortOption])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      // Parse combined sort option
      const [sortBy, sortOrder] = sortOption.split('-')
      
      const response = await axios.get('/api/products', {
        params: {
          sortBy,
          sortOrder
        }
      })
      
      if (response.data.success) {
        console.log('API Response:', response.data);
        console.log('Products:', response.data.products);
        setProducts(response.data.products)
        setGoldPrice(response.data.goldPrice)
        
        // Initialize selected colors (default to 'yellow')
        const initialColors = {}
        response.data.products.forEach((_, index) => {
          initialColors[index] = 'yellow'
        })
        setSelectedColors(initialColors)
      } else {
        setError('Failed to load products')
      }
    } catch (err) {
      setError('Failed to connect to the server')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleColorChange = (productIndex, color) => {
    setSelectedColors(prev => ({
      ...prev,
      [productIndex]: color
    }))
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="star star-full" />)
    }

    // Half star
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="star star-half" />)
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star star-empty" />)
    }

    return stars
  }

  const getColorName = (color) => {
    const colorNames = {
      yellow: 'Yellow Gold',
      rose: 'Rose Gold',
      white: 'White Gold'
    }
    return colorNames[color] || color
  }

  const getColorHex = (color) => {
    const colorHexes = {
      yellow: '#E6CA97',
      rose: '#E1A4A9',
      white: '#D9D9D9'
    }
    return colorHexes[color] || '#000000'
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading beautiful jewelry...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={fetchProducts} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="title">Product List</h1>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="carousel-container">
            {/* Sorting Controls - Top Right */}
            <div className="sorting-controls">
              <div className="sorting-group">
                <label htmlFor="sortOption">Sort:</label>
                <select 
                  id="sortOption"
                  value={sortOption} 
                  onChange={(e) => setSortOption(e.target.value)}
                  className="sort-select"
                >
                  <option value="name-asc">Name A→Z</option>
                  <option value="name-desc">Name Z→A</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="popularity-asc">Popularity: Low to High</option>
                  <option value="popularity-desc">Popularity: High to Low</option>
                </select>
              </div>
            </div>
            <Swiper
              modules={[Navigation, Scrollbar]}
              spaceBetween={50}
              slidesPerView={1}
              navigation={{
                prevEl: '.swiper-button-prev-custom',
                nextEl: '.swiper-button-next-custom',
              }}
              scrollbar={{
                hide: false,
                draggable: true,
              }}

              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 40,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 45,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 50,
                },
                1200: {
                  slidesPerView: 4,
                  spaceBetween: 50,
                },
              }}
              className="products-swiper"
            >
              {products.map((product, index) => (
                <SwiperSlide key={index}>
                  <div className="product-card">
                    <div className="product-image-container">
                      <img
                        src={product.images[selectedColors[index]]}
                        alt={`${product.name} in ${getColorName(selectedColors[index])}`}
                        className="product-image"
                        loading="lazy"
                        onError={(e) => {
                          console.error('Image failed to load:', e.target.src);
                          e.target.style.backgroundColor = '#f0f0f0';
                          e.target.style.display = 'flex';
                          e.target.style.alignItems = 'center';
                          e.target.style.justifyContent = 'center';
                          e.target.innerHTML = 'Image not available';
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', product.images[selectedColors[index]]);
                        }}
                      />

                    </div>
                    
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-price">{product.priceFormatted}</div>
                      
                      <div className="color-picker">
                        <div className="color-options">
                          {Object.keys(product.images).map((color) => (
                            <button
                              key={color}
                              className={`color-option color-${color} ${
                                selectedColors[index] === color ? 'active' : ''
                              }`}
                              onClick={() => handleColorChange(index, color)}
                              title={getColorName(color)}
                              aria-label={`Select ${getColorName(color)}`}
                            >
                              <span className="color-swatch"></span>
                            </button>
                          ))}
                        </div>
                        <span className="selected-color">
                          {getColorName(selectedColors[index])}
                        </span>
                      </div>
                      
                      <div className="product-rating">
                        <div className="stars">
                          {renderStars(product.starRating)}
                        </div>
                        <span className="rating-text">{product.starRating}/5</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Custom Navigation Buttons */}
            <div className="swiper-button-prev-custom navigation-button">
              &#8249;
            </div>
            <div className="swiper-button-next-custom navigation-button">
              &#8250;
            </div>
          </div>
        </div>
      </main>


    </div>
  )
}

export default App
