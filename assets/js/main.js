// main.js
document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart count
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cart-count').textContent = 
      cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Update on initial load
  updateCartCount();

  // Listen for cart updates
  document.addEventListener('cartUpdated', updateCartCount);
});