/* main.js */
/* Global JavaScript for SHAOL Tech website */

/**
 * updateCartCount - Reads the cart data from localStorage and updates the cart count display.
 * Assumes cart data is stored as a JSON array in localStorage under the key 'cart'.
 */
function updateCartCount() {
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
      cartCountEl.textContent = cartData.length;
    }
  }
  
  // Initialize global functionalities when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
  });
  