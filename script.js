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

let lastY = window.pageYOffset || 0;
let scrollingDown = true;

window.addEventListener(
   "scroll",
   () => {
      const y = window.pageYOffset || 0;
      scrollingDown = y > lastY;
      lastY = y;
   },
   {
      passive: true,
   }
);

const revealEls = document.querySelectorAll(".reveal");

if (!prefersReduced && revealEls.length) {
   const observer = new IntersectionObserver(
      (entries) => {
         entries.forEach((entry) => {
            const el = entry.target;

            // stagger animation based on order in parent container
            const siblings = Array.from(
               el.parentElement.querySelectorAll(".reveal")
            );
            const idx = siblings.indexOf(el);
            el.style.setProperty("--delay", `${Math.max(idx, 0) * 100}ms`);

            if (entry.isIntersecting) {
               if (scrollingDown) {
                  // scrolling DOWN → allow animation
                  el.classList.remove("active");
                  el.classList.add("active");
               } else {
                  // scrolling UP → show, but keep still
                  el.classList.remove("active");
                  el.classList.add("static");
               }
            } else {
               // out of view → reset so it can animate next time
               el.classList.remove("active", "static");
            }
         });
      },
      {
         root: null,
         threshold: 0, // trigger as soon as it it touches viewport
         rootMargin: "0px 0px -10% 0px",
      }
   );

   // Respect reduced motion: show features immediately
   revealEls.forEach((el) => observer.observe(el));
} else {
   // Reduced motion: just show them without animation
   revealEls.forEach((el) => {
      el.classList.remove("active");
      el.classList.add("static");
   });
}

// Gallery Section

// --- Slider keyboard controls ---
const slider = document.querySelector(".slider");
const track = document.querySelector(".slide-track");
let slides = [];
let uniqueCount = 0;
const indicatorsContainer = document.querySelector(".slider-indicators");
let indicatorDots = [];
const MAX_INDICATOR_DOTS = 7;

if (track) {
   const originals = Array.from(track.children);
   uniqueCount = originals.length;
   originals.forEach((slide) => track.appendChild(slide.cloneNode(true)));
   slides = Array.from(track.children);
   track.style.setProperty("--slide-count", slides.length);
   track.style.setProperty("--half-count", uniqueCount);
}

if (indicatorsContainer && uniqueCount) {
   const dotCount = Math.min(uniqueCount, MAX_INDICATOR_DOTS);
   for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement("span");
      indicatorsContainer.appendChild(dot);
      indicatorDots.push(dot);
   }
}

let index = 0;
let SLIDE_WIDTH = 250;
let isAnimating = false;

function recalcWidth() {
   const slide = track?.querySelector(".slide");
   if (slide && track) {
      const w = slide.offsetWidth;
      const styles = getComputedStyle(track);
      let gap = parseFloat(styles.gap);
      if (Number.isNaN(gap)) gap = parseFloat(styles.columnGap);
      if (Number.isNaN(gap)) gap = 0;
      SLIDE_WIDTH = w + gap;
      // Inform CSS of the current slide width (includes padding)
      track.style.setProperty("--slide-width", `${w}px`);

      // Restart the autoplay animation so new widths take effect
      track.style.animation = "none";
      void track.offsetWidth; // force reflow
      track.style.removeProperty("animation");
   }
}

window.addEventListener("load", recalcWidth);
window.addEventListener("resize", recalcWidth);
recalcWidth();

// Recalculate one Lazy-loaded images finish loading (Firefox)
track?.querySelectorAll("img").forEach((img) => {
   if (img.complete) return;
   img.addEventListener("load", recalcWidth, { once: true });
});

function updateStatus() {
   const total = uniqueCount || slides.length;
   const humanIndex = ((index % total) + total) % total; // safe positive

   const dotCount = indicatorDots.length;
   const groupIndex = total ? Math.floor((humanIndex / total) * dotCount) : 0;
   indicatorDots.forEach((dot, i) => {
      dot.classList.toggle("active", i === groupIndex);
   });
}

// keep indicators in sync while the slider auto-scrolls via CSS
function autoSyncIndicators() {
   if (!track) return;

   // stop tracking while in manual mode so manual navigation stays accurate
   if (slider?.classList.contains("is-manual")) {
      requestAnimationFrame(autoSyncIndicators);
      return;
   }

   const transform = getComputedStyle(track).transform;
   if (transform && transform !== "none") {
      const matrix = new DOMMatrixReadOnly(transform);
      const offset = -matrix.m41; // current translation (positive as we scroll left)
      const total = uniqueCount || slides.length;
      const newIndex = total ? Math.round(offset / SLIDE_WIDTH) % total : 0;
      if (newIndex !== index) {
         index = newIndex;
         updateStatus();
      }
   }

   requestAnimationFrame(autoSyncIndicators);
}

if (track) requestAnimationFrame(autoSyncIndicators);

//Switches to manual mode if user focuses slider or prefers-reduced-motion
let resumeTimer;
function enableManualMode(persist = false) {
   if (!slider || !track) return;
   // Pause the auto autoplay loop
   slider.classList.add("is-manual");
   // Immediately apply manual class so CSS animations stop
   // Without this the first click may only disable the animation
   // and the slide move won't happen until the second click
   void track.offsetWidth; // force reflow to cancel the CSS keyframe animation
   clearTimeout(resumeTimer);
   if (!persist) {
      resumeTimer = setTimeout(() => {
         slider.classList.remove("is-manual");
      }, 2000);
   }
}

// Slide forward by moving the first slide to the end
function next() {
   if (!track || isAnimating) return;
   recalcWidth();
   enableManualMode();
   isAnimating = true;
   track.style.transition = "";
   track.style.transform = `translateX(-${SLIDE_WIDTH}px)`;
   track.addEventListener(
      "transitionend",
      function handler() {
         track.removeEventListener("transitionend", handler);
         track.style.transition = "none";
         track.appendChild(track.firstElementChild);
         track.style.transform = "translateX(0)";
         // Force reflow so the browser acknowledges the style change
         void track.offsetWidth;
         track.style.transition = "";
         isAnimating = false;
      },
      {
         once: true,
      }
   );

   const total = uniqueCount || slides.length;
   index = (index + 1) % total;
   updateStatus();
}

// Slide backward by moving the last slide to the front

function prev() {
   if (!track || isAnimating) return;
   recalcWidth();
   enableManualMode();
   isAnimating = true;
   track.style.transition = "none";
   track.insertBefore(track.lastElementChild, track.firstElementChild);
   track.style.transform = `translateX(-${SLIDE_WIDTH}px)`;
   // force reflow before enabling animation
   void track.offsetWidth;
   track.style.transition = "";
   track.style.transform = "translateX(0)";
   track.addEventListener(
      "transitionend",
      () => {
         isAnimating = false;
      },
      { once: true }
   );

   const total = uniqueCount || slides.length;
   index = (index - 1 + total) % total;
   updateStatus();
}

// Keyboard: left/Right arrows when slider is focused
if (slider) {
   slider.addEventListener("focus", enableManualMode);

   slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
         e.preventDefault();
         next();
      }
      if (e.key === "ArrowLeft") {
         e.preventDefault();
         prev();
      }
   });

   // Buttons click/Enter/Space

   const prevBtn = document.querySelector(".slider-prev");
   const nextBtn = document.querySelector(".slider-next");
   prevBtn?.addEventListener("click", prev);
   nextBtn?.addEventListener("click", next);

   // Allow Dragging with pointer or touch
   let startX = null;
   let pressedSlide = null;
   let didDrag = false;
   function onStart(x, slide) {
      startX = x;
      pressedSlide = slide;
      slider.classList.add("dragging");
      enableManualMode();
      didDrag = false;
   }

   function handleSlideClick(slide) {
      const wasActive = slide.classList.contains("active");
      track
         .querySelectorAll(".slide.active")
         .forEach((el) => el.classList.remove("active"));
      if (wasActive) {
         // Second Tap on the same slide: collapse and resume autoplay
         slider.classList.remove("is-manual");
      } else {
         // Activate slide and pause carousel
         slide.classList.add("active");
         enableManualMode(true);
      }
   }

   function onEnd(x, y) {
      if (startX === null) return;
      const dx = x - startX;
      slider.classList.remove("dragging");
      if (Math.abs(dx) > 30) {
         dx < 0 ? next() : prev();
         didDrag = true;
      } else {
         const el =
            document.elementFromPoint(x, y)?.closest(".slide") || pressedSlide;
         if (el) {
            handleSlideClick(el);
            didDrag = true; // ignore the follow-up click event
         }
      }
      startX = null;
      pressedSlide = null;
   }

   if (window.PointerEvent) {
      slider.addEventListener("pointerdown", (e) => {
         if (e.target.closest(".slider-btn")) return; // Allow buttons click
         slider.setPointerCapture(e.pointerId);
         onStart(e.clientX, e.target.closest(".slide"));
      });

      slider.addEventListener("pointerup", (e) => {
         if (e.target.closest(".slider-btn")) return;
         onEnd(e.clientX, e.clientY);
      });

      slider.addEventListener("pointercancel", () => {
         startX = null;
         pressedSlide = null;
         slider.classList.remove("dragging");
      });
   } else {
      // Fallback for browsers without Pointer Events (older mobile Safari)
      slider.addEventListener(
         "touchstart",
         (e) => {
            if (e.target.closest(".slider-btn")) return;
            onStart(e.touches[0].clientX, e.target.closest(".slide"));
         },
         { passive: true }
      );

      slider.addEventListener("touchend", (e) => {
         if (e.target.closest(".slider-btn")) return;
         const t = e.changedTouches[0];
         onEnd(t.clientX, t.clientY);
      });

      slider.addEventListener("touchcancel", () => {
         startX = null;
         pressedSlide = null;
         slider.classList.remove("dragging");
      });
   }

   track.addEventListener("click", (e) => {
      if (didDrag) {
         didDrag = false;
         return;
      }

      const slide = e.target.closest(".slide");
      if (!slide) return;
      e.stopPropagation();
      handleSlideClick(slide);
   });
}

document.addEventListener("click", (e) => {
   if (!slider?.classList.contains("is-manual")) return;
   if (e.target.closest(".slide img")) return;
   slider.classList.remove("is-manual");
   track
      ?.querySelectorAll(".slide.active")
      .forEach((el) => el.classList.remove("active"));
});

updateStatus();
// slider.addEventListener("mouseenter", enableManualMode);

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
