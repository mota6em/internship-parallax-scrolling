// Parallax scrolling with smooth performance optimization

const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;

// Store scroll position
let scrollPosition = 0;
let ticking = false;

function handleParallaxScroll() {
  scrollPosition = window.pageYOffset;

  if (!ticking && !isMobile) {
    window.requestAnimationFrame(() => {
      updateParallaxElements();
      ticking = false;
    });
    ticking = true;
  }
}

function updateParallaxElements() {
  const parallaxLayers = document.querySelectorAll(".parallax-layer");

  parallaxLayers.forEach((layer) => {
    const speed = parseFloat(layer.getAttribute("data-speed")) || 0.5;
    const yPos = -(scrollPosition * speed);
    layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
  });

  const floatingElements = document.querySelectorAll(".floating-element");

  floatingElements.forEach((element) => {
    const speed = parseFloat(element.getAttribute("data-speed")) || 0.5;
    const yPos = -(scrollPosition * speed);
    element.style.transform = `translate3d(0, ${yPos}px, 0)`;
  });
}

function initScrollAnimations() {
  const fadeElements = document.querySelectorAll(".fade-in");

  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach((element) => {
    observer.observe(element);
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

function addScrollDirection() {
  let lastScrollTop = 0;

  window.addEventListener(
    "scroll",
    () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        document.body.setAttribute("data-scroll-direction", "down");
      } else {
        document.body.setAttribute("data-scroll-direction", "up");
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    },
    false
  );
}

let resizeTimer;
function handleResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    updateParallaxElements();
  }, 250);
}

function init() {
  initScrollAnimations();
  initSmoothScroll();
  addScrollDirection();

  // Desktop only for performance
  if (!isMobile) {
    window.addEventListener("scroll", handleParallaxScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    updateParallaxElements();
  }

  console.log("🎨 Parallax scrolling initialized!");
  if (isMobile) {
    console.log(
      "📱 Mobile device detected - parallax disabled for performance"
    );
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  console.log("Page fully loaded");
});
