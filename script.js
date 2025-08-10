/*
  VELTORA | Precision in Motion
  Created by Jonier Pachon
  Licensed under CC BY-NC 4.0 — https://creativecommons.org/licenses/by-nc/4.0/
  © 2025 Jonier Pachon — All Rights Reserved
*/
// text animation
// --- Reduced motion preference ---
const prefersReduced = window.matchMedia(
   "(prefers-reduced-motion: reduce)"
).matches;

// 2) Typing effect
const typingEl = document.querySelector("#typing-text");
if (typingEl) {
   const text =
      "Experience the thrill of VELTORA. Built for those who demand more.";

   if (prefersReduced) {
      // No animation — show text right away
      typingEl.textContent = text;
   } else {
      // Show text letter by letter
      let i = 0;
      function typeNext() {
         if (i < text.length) {
            typingEl.textContent += text[i];
            i++;
            setTimeout(typeNext, 45); // wait 45ms before next letter
         }
      }
      typeNext();
   }
}

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

// Gallery Section

// Reveal-on-scroll: only run if not reduced motion
if (!prefersReduced) {
   window.addEventListener("scroll", revealElementsOnScroll);
} else {
   document
      .querySelectorAll(".reveal")
      .forEach((el) => el.classList.add("active"));
}

// --- Slider keyboard controls ---
const slider = document.querySelector(".slider");
const track = document.querySelector(".slide-track");
const slides = track ? Array.from(track.querySelectorAll(".slide")) : [];
let index = 0;
const SLIDE_WIDTH = slides[0]?.getBoundingClientRect().width || 250;
const statusEl = document.querySelector(".slider-status");

function updateStatus() {
   if (!statusEl) return;

   const total = slides.length;
   const humanIndex = ((index % total) + total) % total; // safe positive
   statusEl.textContent = `Slide ${humanIndex + 1} of ${total}`;
}

//Switches to manual mode if user focuses slider or prefers-reduced-motion
function enableManualMode() {
   if (!slider || !track) return;
   slider.classList.add("is-manual"); // disables CSS marquee via CSS rule
}
if (prefersReduced) enableManualMode();

// Move by one slide
function goTo(i) {
   if (!track) return;
   index = i;
   track.style.transform = `translateX(-${index * SLIDE_WIDTH}px)`;
   updateStatus();
}

function next() {
   enableManualMode();
   goTo(index + 1);
}

function prev() {
   enableManualMode();
   goTo(index - 1);
}

// Keyboard: left/Right arrows when slider is focused
if (slider) {
   slider.addEventListener("focus", enableManualMode, { once: true });

   slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
         e.preventDefault();
         next();
      }
      if (e.key === "ArrowLeft") {
         e.preventDefault();
         prev();
      }
      if (e.key === "Home") {
         e.preventDefault();
         enableManualMode();
         goTo(0);
      }
      if (e.key === "End") {
         e.preventDefault();
         enableManualMode();
         goTo(slides.length - 1);
      }
   });

   // Buttons click/Enter/Space

   const prevBtn = document.querySelector(".slider-prev");
   const nextBtn = document.querySelector(".slider-next");
   prevBtn?.addEventListener("click", prev);
   nextBtn?.addEventListener("click", next);
}

updateStatus();

// submit form/////////////////////////////////////////////////////////
const form = document.querySelector(".contact-form");
const modal = document.querySelector("#modal");
const dialog = modal.querySelector(".modal-content");
const closeBtn = modal.querySelector(".close-modal");

let lastFocusedEl = null;

function getFocusable(container) {
   return container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
   );
}

function openModal() {
   lastFocusedEl = document.activeElement; // remember what was focused
   modal.style.display = "flex"; //show the overlay

   // Move focus into the dialog
   const focusables = getFocusable(dialog);
   (focusables[0] || dialog).focus();

   // Listen for key events (Escape, Tab trapping)
   document.addEventListener("keydown", onKeydown);

   // Prevent page scrolling when modal is open
   document.body.style.overflow = "hidden";
}

function closeModal() {
   modal.style.display = "none"; // hide overlay
   document.removeEventListener("keydown", onKeydown);

   // Give focus back to what was focused before (Form submit button)
   if (lastFocusedEl) lastFocusedEl.focus();

   // Allow scrolling again
   document.body.style.overflow = "";
}

function onKeydown(e) {
   // Close on Escape
   if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
      return;
   }

   // Basic focus trap with Tab / Shift+Tab
   // Focus trap: keep tab focus inside modal
   if (e.key === "Tab") {
      const focusables = Array.from(getFocusable(dialog));
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      // Shift + Tab → Loop backwards
      if (e.shiftKey && document.activeElement === first) {
         e.preventDefault();
         last.focus();
      }
      // Tab → Loop forwards
      else if (!e.shiftKey && document.activeElement === last) {
         e.preventDefault();
         first.focus();
      }
   }
}

// Open modal when hte form is submitted
form.addEventListener("submit", (e) => {
   e.preventDefault();
   openModal();
});

// Close on close button click
closeBtn.addEventListener("click", closeModal);

// Close if clicking outside dialog (on overlay)
modal.addEventListener("click", (e) => {
   if (e.target === modal) closeModal();
});
