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

// Pop up features and their animations

let lastScrollTop = window.pageYOffset;

function revealElementsOnScroll() {
   const reveals = document.querySelectorAll(".reveal");
   const windowHeight = window.innerHeight;
   const revealPoint = 115;

   const currentScrollTop = window.pageYOffset;
   const scrollingDown = currentScrollTop > lastScrollTop;
   lastScrollTop = currentScrollTop;

   reveals.forEach((el, i) => {
      const topEl = el.getBoundingClientRect().top;
      const bottomEl = el.getBoundingClientRect().bottom;

      const isAboveViewport = bottomEl < 0;
      const isBelowViewport = topEl > windowHeight;
      const isInViewport = topEl < windowHeight - revealPoint && bottomEl > 0;

      if (scrollingDown) {
         // SCROLLING DOWN → animate if entering viewport from below
         if (isInViewport && !el.classList.contains("active")) {
            setTimeout(() => {
               el.style.setProperty("--delay", `${i * 100}ms`);
               el.classList.add("active");
            }, i * 100);
         }
      }

      if (isBelowViewport && el.classList.contains("active")) {
         el.classList.remove("active");
      }
   });
}

window.addEventListener("scroll", revealElementsOnScroll);

///////////////////////////////////////////////////////////////////////////////////////////////

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
