// products.js

async function loadProducts() {
  try {
    const response = await fetch('assets/data/products.json');
    if (!response.ok) throw new Error('Failed to fetch products');
    const products = await response.json();
    displayFeaturedProducts(products);
    displayAllProducts(products);
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

function getPriceRange(variants) {
  if (!variants || variants.length === 0) return 'Price not available';
  const prices = variants.map(variant => variant.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  return minPrice === maxPrice ? `${minPrice}$` : `${minPrice} - ${maxPrice}$`;
}

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
  
  setupSlider(featuredContainer);
}

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

function setupSlider(container) {
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');
  let scrollAmount = 0;

  leftArrow.addEventListener('click', () => {
    const containerWidth = container.offsetWidth;
    scrollAmount = Math.max(scrollAmount - containerWidth, 0);
    container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
  });

  rightArrow.addEventListener('click', () => {
    const containerWidth = container.offsetWidth;
    const maxScroll = container.scrollWidth - containerWidth;
    scrollAmount = Math.min(scrollAmount + containerWidth, maxScroll);
    container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
  });
}

function normalizeImagePath(path) {
  return path.replace(/^\.\.\//g, '');
}

function messageUs(id, name, price, imageUrl) {
  const baseGithubUrl = "https://sh40l.github.io/shaoltech/";
  const normalizedPath = normalizeImagePath(imageUrl);
  let fullImageUrl = baseGithubUrl + normalizedPath;
  
  // Only replace spaces with %20 in the image URL
  fullImageUrl = fullImageUrl.replace(/ /g, '%20');
  
  // Keep other parameters with original spaces
  const messageText = `I'm interested in this product:
ID: ${id}
Name: ${name}
Price: ${price}
Image: ${fullImageUrl}`;

  const fbLink = `https://m.me/429980123522052?text=${encodeURIComponent(messageText)}`;
  window.open(fbLink, '_blank');
}

document.addEventListener('DOMContentLoaded', loadProducts);