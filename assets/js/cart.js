// cart.js
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  existingItem ? existingItem.quantity++ : cart.push({ ...product, quantity: 1 });
  updateCartStorage();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartStorage();
}

function updateQuantity(productId, newQuantity) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = Math.max(1, newQuantity);
    updateCartStorage();
  }
}

function clearCart() {
  cart = [];
  updateCartStorage();
}

function updateCartStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
  document.dispatchEvent(new Event('cartUpdated'));
  renderCartItems();
}

function calculateTotal() {
  return cart.reduce((total, item) => 
    total + (item.price * item.quantity), 0).toFixed(2);
}

function renderCartItems() {
  if (!document.getElementById('cart-items')) return;
  
  const container = document.getElementById('cart-items');
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.images[0]}" alt="${item.name}">
      <h3>${item.name}</h3>
      <div class="quantity-controls">
        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
      </div>
      <p>$${(item.price * item.quantity).toFixed(2)}</p>
      <button onclick="removeFromCart(${item.id})">Remove</button>
    </div>
  `).join('');
  
  document.getElementById('cart-total').textContent = calculateTotal();
}

document.addEventListener('DOMContentLoaded', () => {
  renderCartItems();
  document.addEventListener('cartUpdated', () => {
    document.getElementById('cart-count').textContent = 
      cart.reduce((sum, item) => sum + item.quantity, 0);
  });
});