// products.js
async function loadProducts() {
  try {
    const response = await fetch('assets/data/products.json');
    if (!response.ok) throw new Error(`Network error: ${response.status}`);
    const products = await response.json();
    
    // Validate products
    const validProducts = products.filter(p => 
      p.id && p.name && p.variants?.length > 0 && p.images?.length > 0
    );

    if (!validProducts.length) {
      console.warn('No valid products found');
      return showEmptyState();
    }

    displayFeaturedProducts(validProducts);
    displayAllProducts(validProducts);
  } catch (error) {
    console.error('Product loading failed:', error);
    showErrorState();
  }
}

function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function getPriceRange(variants) {
  if (!variants?.length) return 'Price unavailable';
  const prices = variants.map(v => parseFloat(v.price));
  if (prices.some(isNaN)) return 'Invalid price';
  
  const min = Math.min(...prices).toFixed(2);
  const max = Math.max(...prices).toFixed(2);
  return min === max ? `$${min}` : `$${min} - $${max}`;
}

function createProductCard(product) {
  const safeName = sanitize(product.name);
  const safePrice = sanitize(getPriceRange(product.variants));
  const safeImage = product.images?.length 
    ? encodeURI(product.images[0])
    : 'assets/images/placeholder.jpg';

  return `
    <div class="product-card">
      <img src="${safeImage}" alt="${safeName}" loading="lazy">
      <a href="product-details.html?id=${product.id}" class="product-name-link">
        <h3>${safeName}</h3>
      </a>
      <p class="price">${safePrice}</p>
      <button class="buy-now" 
        onclick="window.location.href='product-details.html?id=${product.id}'">
        Buy Now
      </button>
      <button class="message-us" 
        onclick="messageUs('${product.id}', '${sanitize(product.name)}', '${getPriceRange(product.variants)}', '${safeImage}')">
        Message Us
      </button>
    </div>
  `;
}

// Keep rest of the functions
function displayFeaturedProducts(products) {
  const container = document.getElementById('featured-products-container');
  const featured = products.filter(p => p.featured);
  
  container.innerHTML = featured.length 
    ? featured.map(createProductCard).join('') 
    : '<p class="empty">No featured products found</p>';
    
  setupSlider(container);
}

function displayAllProducts(products) {
  const container = document.getElementById('all-products-container');
  container.innerHTML = products.map(createProductCard).join('');
}

function setupSlider(container) {
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');
  let scrollAmount = 0;
  let maxScroll = 0;

  function updateArrows() {
    leftArrow.disabled = scrollAmount <= 0;
    rightArrow.disabled = scrollAmount >= maxScroll;
    maxScroll = container.scrollWidth - container.offsetWidth;
  }

  leftArrow.addEventListener('click', () => {
    scrollAmount = Math.max(scrollAmount - container.offsetWidth, 0);
    container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    updateArrows();
  });

  rightArrow.addEventListener('click', () => {
    scrollAmount = Math.min(scrollAmount + container.offsetWidth, maxScroll);
    container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    updateArrows();
  });

  new ResizeObserver(updateArrows).observe(container);
  updateArrows();
}

function normalizeImagePath(path) {
  return path.replace(/^\.\.\//g, '');
}

function messageUs(id, name, price, imageUrl) {
  const baseGithubUrl = "https://sh40l.github.io/shaoltech/";
  const normalizedPath = normalizeImagePath(imageUrl);
  let fullImageUrl = baseGithubUrl + normalizedPath;
  fullImageUrl = fullImageUrl.replace(/ /g, '%20');
  
  const messageText = `I'm interested in this product:
ID: ${id}
Name: ${name}
Price: ${price}
Image: ${fullImageUrl}`;

  const fbLink = `https://m.me/429980123522052?text=${encodeURIComponent(messageText)}`;
  window.open(fbLink, '_blank');
}

function showEmptyState() {
  document.querySelectorAll('.products-container').forEach(container => {
    container.innerHTML = `<p class="empty">No products available at the moment</p>`;
  });
}

function showErrorState() {
  document.querySelectorAll('.products-container').forEach(container => {
    container.innerHTML = `<p class="error">Failed to load products. Please try again later.</p>`;
  });
}

document.addEventListener('DOMContentLoaded', loadProducts);