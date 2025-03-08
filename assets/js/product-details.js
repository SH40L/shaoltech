document.addEventListener('DOMContentLoaded', () => {
    const productId = new URLSearchParams(window.location.search).get('id');
    if (!productId) return handleProductError(new Error('Missing product ID'));
    loadProductDetails(productId);
});

let currentProduct = null;

async function loadProductDetails(productId) {
    try {
        // Show loading state
        document.querySelector('.product-main').style.opacity = '0.5';
        
        const response = await fetch('assets/data/products.json');
        if (!response.ok) throw new Error('Failed to load products');
        const products = await response.json();
        currentProduct = products.find(p => p.id == productId);
        
        if (!currentProduct) throw new Error('Product not found');
        
        sessionStorage.setItem('currentProduct', JSON.stringify(currentProduct));
        
        updatePageContent(currentProduct);
        setupImageGallery(currentProduct);
        setupVariants(currentProduct);
        setupProductDetails(currentProduct);
        setupReviewsAndFAQ(currentProduct);
        setupQuantitySelector();
        setupAddToCart();
        setupBuyNow();
        setupTabSwitching();
        setupThumbnailArrows();

        // Hide loading state
        document.querySelector('.product-main').style.opacity = '1';

    } catch (error) {
        handleProductError(error);
    }
}

// ======== NEW BUY NOW FUNCTIONALITY ======== //
function setupBuyNow() {
    document.querySelector('.buy-now').addEventListener('click', () => {
        const product = JSON.parse(sessionStorage.getItem('currentProduct'));
        const quantity = parseInt(document.querySelector('.quantity-input').value);
        const selectedSize = document.querySelector('.variant-group:first-child .selected')?.textContent;
        const selectedDesign = document.querySelector('.variant-group:last-child .selected')?.dataset.design;

        const checkoutItem = {
            ...product,
            quantity,
            selectedOptions: {
                size: selectedSize,
                design: selectedDesign
            },
            price: product.variants.find(v => 
                v.size === selectedSize && v.design === selectedDesign
            )?.price,
            immediateCheckout: true
        };

        // Store for checkout page
        sessionStorage.setItem('checkoutItem', JSON.stringify(checkoutItem));
        
        // Clear current cart and add this single item
        const newCart = [checkoutItem];
        localStorage.setItem('cart', JSON.stringify(newCart));
        
        window.location.href = 'checkout.html';
    });
}

// ======== REST OF THE FUNCTIONS REMAIN SAME AS PREVIOUS VERSION ======== //
// [Keep all other functions exactly as in previous 200+ line version]
// [Ensure all functions from previous answer are present]


function updatePageContent(product) {
    document.title = `${product.name} - SHAOL Tech`;
    document.querySelectorAll('.product-name').forEach(el => el.textContent = product.name);
    document.querySelector('.product-title').textContent = product.name;
    const categoryLink = document.querySelector('.product-category');
    categoryLink.textContent = product.category;
    categoryLink.href = `categories.html?category=${encodeURIComponent(product.category.toLowerCase())}`;
    updatePriceDisplay(product.variants[0].price);
}

function updatePriceDisplay(price) {
    document.querySelector('.product-price').textContent = `$${price.toFixed(2)}`;
}

function setupImageGallery(product) {
    const mainImg = document.querySelector('.main-image');
    const thumbnails = document.querySelector('.thumbnails');
    thumbnails.innerHTML = '';

    const allImages = [...new Set([
        ...product.images,
        ...product.variants.map(v => v.image)
    ])];

    allImages.forEach((img, index) => {
        const thumb = document.createElement('img');
        thumb.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumb.src = img;
        thumb.alt = `Thumbnail ${index + 1}`;
        thumb.addEventListener('click', () => {
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            mainImg.src = img;
        });
        thumbnails.appendChild(thumb);
    });

    if (allImages.length > 0) mainImg.src = allImages[0];
}

function setupVariants(product) {
    const container = document.querySelector('.variant-options');
    container.innerHTML = '';

    // Size Variants
    const sizeGroup = document.createElement('div');
    sizeGroup.className = 'variant-group';
    sizeGroup.innerHTML = '<h4>SIZE:</h4><div class="options-container"></div>';
    
    const sizes = [...new Set(product.variants.map(v => v.size))];
    sizes.forEach(size => {
        const option = document.createElement('div');
        option.className = 'variant-option';
        option.textContent = size;
        option.addEventListener('click', () => {
            document.querySelectorAll('.variant-group:first-child .variant-option')
                .forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
        sizeGroup.querySelector('.options-container').appendChild(option);
    });

    // Design Variants
    const designGroup = document.createElement('div');
    designGroup.className = 'variant-group';
    designGroup.innerHTML = '<h4>DESIGN:</h4><div class="options-container"></div>';
    
    product.variants.forEach(variant => {
        const option = document.createElement('div');
        option.className = 'variant-option';
        option.dataset.design = variant.design;
        option.innerHTML = `<img src="${variant.design_image}" alt="${variant.design}" class="variant-image">`;
        option.addEventListener('click', () => {
            document.querySelector('.main-image').src = variant.image;
            updatePriceDisplay(variant.price);
            document.querySelectorAll('.variant-group:last-child .variant-option')
                .forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
        designGroup.querySelector('.options-container').appendChild(option);
    });

    container.append(sizeGroup, designGroup);
}

function setupProductDetails(product) {
    document.querySelector('.description-content').innerHTML = product.description;
}

function setupReviewsAndFAQ(product) {
    const reviewsContent = document.querySelector('.reviews-content');
    const faqItems = document.querySelector('.faq-items');

    reviewsContent.innerHTML = product.reviews?.map(review => `
        <div class="review">
            <div class="review-header">
                <strong>${review.user}</strong>
                <div class="stars">${'★'.repeat(review.rating)}</div>
            </div>
            <p>${review.comment}</p>
            ${review.images?.map(img => `
                <img src="${img}" class="review-image">
            `).join('')}
        </div>
    `).join('') || '<p>No reviews yet</p>';

    faqItems.innerHTML = product.faqs?.map(faq => `
        <div class="faq-item">
            <div class="faq-question">${faq.question} <span>+</span></div>
            <div class="faq-answer">${faq.answer}</div>
        </div>
    `).join('') || '<p>No FAQs available</p>';

    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
            question.querySelector('span').textContent = answer.style.display === 'block' ? '−' : '+';
        });
    });
}

function setupQuantitySelector() {
    const quantityInput = document.querySelector('.quantity-input');
    document.querySelector('.quantity-btn.plus').addEventListener('click', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });
    document.querySelector('.quantity-btn.minus').addEventListener('click', () => {
        quantityInput.value = Math.max(1, parseInt(quantityInput.value) - 1);
    });
}

function setupAddToCart() {
    document.querySelector('.add-to-cart').addEventListener('click', () => {
        const product = JSON.parse(sessionStorage.getItem('currentProduct'));
        const quantity = parseInt(document.querySelector('.quantity-input').value);
        const selectedSize = document.querySelector('.variant-group:first-child .selected')?.textContent;
        const selectedDesign = document.querySelector('.variant-group:last-child .selected')?.dataset.design;

        const cartItem = {
            ...product,
            quantity,
            selectedOptions: {
                size: selectedSize,
                design: selectedDesign
            },
            price: product.variants.find(v => 
                v.size === selectedSize && v.design === selectedDesign
            )?.price
        };

        addToCart(cartItem);
        alert(`${quantity}x ${product.name} added to cart!`);
    });
}

function setupTabSwitching() {
    document.querySelectorAll('.detail-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            document.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.style.display = pane.id === tabId ? 'block' : 'none';
            });
        });
    });
}

function setupThumbnailArrows() {
    const thumbnails = document.querySelector('.thumbnails');
    const leftArrow = document.querySelector('.thumb-arrow.left');
    const rightArrow = document.querySelector('.thumb-arrow.right');

    leftArrow.addEventListener('click', () => {
        thumbnails.scrollBy({ left: -100, behavior: 'smooth' });
    });

    rightArrow.addEventListener('click', () => {
        thumbnails.scrollBy({ left: 100, behavior: 'smooth' });
    });
}

function handleProductError(error) {
    console.error('Error:', error);
    const mainSection = document.querySelector('.product-main');
    if (mainSection) {
        mainSection.innerHTML = `
            <div class="error">
                <h2>Product Not Found</h2>
                <p>${error.message}</p>
                <a href="products.html" class="browse-btn">Browse Products</a>
            </div>
        `;
    }
}