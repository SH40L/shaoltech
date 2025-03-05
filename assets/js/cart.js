/* cart.js */
/* JavaScript to handle cart functionality, such as adding items to the cart */

/**
 * addToCart - Adds a product object to the cart stored in localStorage.
 * @param {object} product - The product details (id, name, price, etc.)
 */
function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    // Update the cart count displayed in the header (function defined in main.js)
    updateCartCount();
  }
  