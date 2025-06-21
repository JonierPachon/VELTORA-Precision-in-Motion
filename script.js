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
