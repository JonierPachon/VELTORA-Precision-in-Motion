const track = document.getElementById("carousel-track");
const slides = Array.from(track.children);
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
let currentIndex = 0;
const visibleCount = 3;

function updateVisibleSlides() {
   slides.forEach((slide, index) => {
      slide.classList.remove("visible");
      if (index >= currentIndex && index < currentIndex + visibleCount) {
         slide.classList.add("visible");
      }
   });
}

function showNextSlides() {
   currentIndex += visibleCount;
   if (currentIndex >= slides.length) {
      currentIndex = 0;
   }
   updateVisibleSlides();
}

function showPrevSlides() {
   currentIndex -= visibleCount;
   if (currentIndex < 0) {
      currentIndex = slides.length - visibleCount;
      if (currentIndex < 0) currentIndex = 0;
   }
   updateVisibleSlides();
}

nextButton.addEventListener("click", showNextSlides);
prevButton.addEventListener("click", showPrevSlides);

updateVisibleSlides();
setInterval(showNextSlides, 2000); // autoplay every 2 seconds
