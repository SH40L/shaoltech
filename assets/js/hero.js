// hero.js
const carouselSlides = document.querySelector('.carousel-slides');
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
const prevArrow = document.querySelector('.left-arrow');
const nextArrow = document.querySelector('.right-arrow');
let currentSlide = 0;
let slideInterval;

function updateIndicators() {
  indicators.forEach((indicator, index) => {
    indicator.textContent = index === currentSlide ? "⦿" : "○";
  });
}

function updateSlidePosition() {
  carouselSlides.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  updateSlidePosition();
  updateIndicators();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateSlidePosition();
  updateIndicators();
}

function startAutoplay() {
  slideInterval = setInterval(nextSlide, 3000);
}

// Event Listeners
prevArrow.addEventListener('click', () => {
  clearInterval(slideInterval);
  prevSlide();
  startAutoplay();
});

nextArrow.addEventListener('click', () => {
  clearInterval(slideInterval);
  nextSlide();
  startAutoplay();
});

indicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => {
    clearInterval(slideInterval);
    currentSlide = index;
    updateSlidePosition();
    updateIndicators();
    startAutoplay();
  });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateIndicators();
  startAutoplay();
});