// text animation
document.addEventListener("DOMContentLoaded", () => {
   const text =
      "Experience the thrill of VELTORA. Built for those who demand more.";
   const target = document.querySelector("#typing-text");
   let i = 0;

   function type() {
      if (i < text.length) {
         target.textContent += text.charAt(i);
         i++;
         setTimeout(type, 45); // delays next letter
      }
   }
   type(); // starts the typing when page Loads
});

// Pop up features
// window.addEventListener("scroll", debounce(revealElements, 10));
// window.addEventListener("scroll", observer);

// This ensure smoother behavior on mobile and prevents skipped animations.
// function debounce(func, wait = 15, immediate = true) {
//    let timeout;
//    return function () {
//       const context = this,
//          args = arguments;
//       const later = function () {
//          timeout = null;
//          if (!immediate) func.apply(context, args);
//       };
//       const callNow = immediate && !timeout;
//       clearTimeout(timeout);
//       timeout = setTimeout(later, wait);
//       if (callNow) func.apply(context, args);
//    };
// }

// function revealElements() {
//    const reveals = document.querySelectorAll(".reveal");

//    for (let i = 0; i < reveals.length; i++) {
//       const windowHeight = window.innerHeight;
//       const elementTop = reveals[i].getBoundingClientRect().top;
//       const elementBottom = reveals[i].getBoundingClientRect().bottom;
//       const revealPoint = 250;

//       // Only add active when element is in view
//       if (elementTop < windowHeight - revealPoint && elementBottom > 0) {
//          reveals[i].classList.add("active");
//          // Optional: only remove if it's completely off screen (top or bottom)
//       } else if (elementBottom < 0 || elementTop > windowHeight) {
//          reveals[i].classList.remove("active"); //removes it when out of view
//       }
//    }
// }

const observer = new IntersectionObserver(
   (entries) => {
      entries.forEach((entry) => {
         if (entry.isIntersecting) {
            entry.target.classList.add("active");
         } else {
            // Replay the animation on scroll up/down
            entry.target.classList.remove("active");
         }
      });
   },
   {
      threshold: [0, 0.1, 0.25], // Trigger when 10% of the element is visible
   }
);

// Observe each reveal element
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Display the images at a larger scale
const galleryItems = document.querySelectorAll(".gallery-item img");
const lightbox = document.querySelector("#lightbox");
const lightboxImg = document.querySelector("#lightbox-img");
const closeBtn = document.querySelector(".close-btn");

galleryItems.forEach((img) => {
   img.addEventListener("click", () => {
      lightbox.style.display = "flex";
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
   });
});

closeBtn.addEventListener("click", () => {
   lightbox.style.display = "none";
});

lightbox.addEventListener("click", (e) => {
   if (e.target === lightbox) {
      lightbox.style.display = "none";
   }
});

// Contact form behavior
const form = document.querySelector(".contact-form");
const modal = document.querySelector("#modal");
const closeModal = document.querySelector(".close-modal");

form.addEventListener("submit", function (e) {
   e.preventDefault(); // Prevent actual form submission
   modal.style.display = "flex";
});

closeModal.addEventListener("click", (e) => {
   if (e.target === closeModal) {
      modal.style.display = "none";
   }
});
