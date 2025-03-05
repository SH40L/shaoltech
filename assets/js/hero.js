/* hero.js */
/* JavaScript for handling the carousel (hero) functionality */

const slides = document.querySelectorAll('.carousel-slides .slide');
const indicators = document.querySelectorAll('.carousel-indicators .indicator');
let currentSlide = 0;
let slideInterval;

/**
 * updateIndicators - Updates each indicator's inner text based on the active slide.
 * Active indicator shows "⦿", inactive shows "○".
 */
function updateIndicators() {
  indicators.forEach((indicator, index) => {
    indicator.textContent = (index === currentSlide) ? "⦿" : "○";
  });
}

/**
 * goToSlide - Switches the carousel to the slide at the given index.
 * @param {number} n - The index of the slide to show.
 */
function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  updateIndicators();
}

/**
 * startSlideShow - Starts the automatic carousel slideshow.
 * The slide changes every 3 seconds.
 */
function startSlideShow() {
  slideInterval = setInterval(function () {
    goToSlide(currentSlide + 1);
  }, 3000);
}

// Add click event listeners to carousel indicators for manual slide change
indicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => {
    clearInterval(slideInterval);
    goToSlide(index);
    startSlideShow();
  });
});

// Start the carousel slideshow when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  updateIndicators();
  startSlideShow();
});
