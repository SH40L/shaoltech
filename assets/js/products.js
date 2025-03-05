// products.js

// Fetch products from the JSON file
async function loadProducts() {
  try {
    const response = await fetch('/assets/data/products.json');
    const products = await response.json();
    displayFeaturedProducts(products);
    displayAllProducts(products);
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// Calculate price range for products with variants
function getPriceRange(variants) {
  if (!variants || variants.length === 0) return 'Price not available';
  const prices = variants.map(variant => variant.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  return minPrice === maxPrice ? `${minPrice}$` : `${minPrice} - ${maxPrice}$`;
}

// Display featured products in the slider (max 5 visible, slides if more)
function displayFeaturedProducts(products) {
  const featuredContainer = document.getElementById('featured-products-container');
  const featuredProducts = products.filter(product => product.featured);
  
  featuredContainer.innerHTML = featuredProducts.map(product => `
    <div class="product-card">
      <img src="${product.images[0]}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">${getPriceRange(product.variants)}</p>
      <button class="buy-now" onclick="window.location.href='product-details.html?id=${product.id}'">Buy Now</button>
      <button class="message-us" onclick="messageUs('${product.id}', '${product.name}', '${getPriceRange(product.variants)}', '${product.images[0]}')">Message Us</button>
    </div>
  `).join('');
  
  setupSlider(featuredContainer, featuredProducts.length);
}

// Display all products in a grid
function displayAllProducts(products) {
  const allProductsContainer = document.getElementById('all-products-container');
  
  allProductsContainer.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="${product.images[0]}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">${getPriceRange(product.variants)}</p>
      <button class="buy-now" onclick="window.location.href='product-details.html?id=${product.id}'">Buy Now</button>
      <button class="message-us" onclick="messageUs('${product.id}', '${product.name}', '${getPriceRange(product.variants)}', '${product.images[0]}')">Message Us</button>
    </div>
  `).join('');
}

// Slider functionality for featured products
function setupSlider(container, productCount) {
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');
  let scrollAmount = 0;
  const productWidth = 220; // Approximate width of each product card
  const visibleProducts = 5;
  const maxScroll = (productCount - visibleProducts) * productWidth;

  leftArrow.addEventListener('click', () => {
    scrollAmount = Math.max(scrollAmount - productWidth, 0);
    container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
  });

  rightArrow.addEventListener('click', () => {
    scrollAmount = Math.min(scrollAmount + productWidth, maxScroll);
    container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
  });
}

// Redirect to Messenger with pre-filled product details
function messageUs(id, name, price, imageUrl) {
  const fbLink = `https://m.me/429980123522052?text=I'm%20interested%20in%20this%20product:%0AID:%20${id}%0AName:%20${name}%0APrice:%20${price}%0AImage:%20${imageUrl}`;
  window.open(fbLink, '_blank');
}

// Initialize product loading on DOM ready
document.addEventListener('DOMContentLoaded', loadProducts);
