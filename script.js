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
