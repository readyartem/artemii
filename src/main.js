import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Preloader Logic
const preloader = document.querySelector('.preloader');
const preloaderCounter = document.querySelector('.preloader-counter');

let progress = 0;
const updateCounter = () => {
  progress += Math.floor(Math.random() * 15) + 5;
  if (progress > 100) progress = 100;
  preloaderCounter.textContent = progress + '%';

  if (progress < 100) {
    setTimeout(updateCounter, Math.random() * 40 + 20);
  } else {
    // Start reveal animation
    setTimeout(revealApp, 200);
  }
};

// Start loading
setTimeout(updateCounter, 100);

function revealApp() {
  const tl = gsap.timeline();

  gsap.set('.app-container', { visibility: 'visible' });

  // Hide Preloader
  tl.to(preloader, {
    yPercent: -100,
    duration: 1.2,
    ease: "power4.inOut"
  })
  
  // Reveal Navbar
  .from('.logo-asterisk, .nav-link', {
    y: -20,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out"
  }, "-=0.6")

  // Reveal Huge Title (slide up)
  .to('.title-word', {
    y: 0,
    duration: 1.2,
    stagger: 0.15,
    ease: "power4.out"
  }, "-=1.2")
  
  // Rotate Asterisk
  .to('.asterisk', {
    y: 0,
    rotation: 90,
    duration: 1.4,
    ease: "power4.out"
  }, "-=1.3")

  // Reveal Bottom elements
  .to('.bottom-left, .bottom-right', {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out",
    onComplete: () => {
      initScrollAnimations();
      ScrollTrigger.refresh();
    }
  }, "-=1");
}

// Burger Menu Logic
const burgerBtn = document.querySelector('.burger-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');
let isMenuOpen = false;

burgerBtn.addEventListener('click', () => {
  isMenuOpen = !isMenuOpen;
  
  if (isMenuOpen) {
    burgerBtn.classList.add('active');
    
    const tl = gsap.timeline();
    tl.to(mobileMenu, {
      y: '0%', /* Correctly bring menu into view */
      opacity: 1,
      duration: 0.8,
      ease: "power4.inOut"
    })
    .set(mobileMenu, { pointerEvents: 'all' }, "-=0.8")
    .to(mobileLinks, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.4");
    
  } else {
    burgerBtn.classList.remove('active');
    
    const tl = gsap.timeline();
    tl.to(mobileLinks, {
      y: 20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.in"
    })
    .to(mobileMenu, {
      y: '-100%', /* Send it back up out of view */
      opacity: 0,
      duration: 0.8,
      ease: "power4.inOut"
    }, "-=0.2")
    .set(mobileMenu, { pointerEvents: 'none' });
  }
});

// Interactive Asterisks
const asterisks = document.querySelectorAll('.logo-asterisk, .asterisk');
asterisks.forEach(ast => {
  ast.addEventListener('mouseenter', () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    gsap.to(ast, {
      color: randomColor,
      duration: 0.3,
      ease: "power2.out"
    });
  });
});

// Scroll to top on logo click
const logoAsteriskNode = document.querySelector('.logo-asterisk');
if (logoAsteriskNode) {
  logoAsteriskNode.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Hide nav blocks immediately (prevents flash before animation)
gsap.set('.nav-block', { opacity: 0, y: 40 });

// ScrollTrigger Animations
function initScrollAnimations() {
  gsap.to('.nav-block', {
    scrollTrigger: {
      trigger: ".nav-blocks",
      start: "top 95%",
      toggleActions: "play none none none"
    },
    y: 0,
    opacity: 1,
    duration: 1.2,
    stagger: 0.12,
    ease: "power4.out"
  });
}

// initScrollAnimations is called from revealApp, NOT here

// Scroll down link
const scrollLink = document.querySelector('.scroll-down');
if (scrollLink) {
  scrollLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
  });
}

// Timeline click-to-expand (mobile)
document.querySelectorAll('.timeline-item').forEach(item => {
  item.addEventListener('click', () => {
    if (window.innerWidth > 768) return; // Only on mobile
    const isActive = item.classList.contains('active');
    // Close all
    document.querySelectorAll('.timeline-item').forEach(i => i.classList.remove('active'));
    // Toggle clicked
    if (!isActive) item.classList.add('active');
  });
});

// Dynamic Sticky Footer Reveal Margin
function updateFooterMargin() {
  const footer = document.querySelector('.footer');
  const mainWrap = document.querySelector('.main-wrap');
  if (footer && mainWrap) {
    mainWrap.style.marginBottom = `${footer.offsetHeight}px`;
  }
}
window.addEventListener('resize', updateFooterMargin);
window.addEventListener('load', updateFooterMargin);
updateFooterMargin();

// Dynamic Text Scaling for perfect fit (two-pass for pixel accuracy)
function fitText() {
  const words = document.querySelectorAll('.title-word');
  const container = document.querySelector('.hero-content');
  if (!words.length || !container) return;

  const containerWidth = container.getBoundingClientRect().width;

  // Pass 1: set baseline size and compute approximate ratio
  words.forEach(w => w.style.fontSize = '100px');

  let minRatio = Infinity;
  words.forEach(w => {
    const ww = w.getBoundingClientRect().width;
    if (ww > 0) {
      const r = containerWidth / ww;
      if (r < minRatio) minRatio = r;
    }
  });

  if (minRatio === Infinity) return;

  let fontSize = 100 * minRatio;
  words.forEach(w => w.style.fontSize = `${fontSize}px`);

  // Pass 2: measure actual rendered width and correct any overflow
  // (font hinting/subpixel rendering can cause 1-5px drift at large sizes)
  let maxWordWidth = 0;
  words.forEach(w => {
    const actual = w.getBoundingClientRect().width;
    if (actual > maxWordWidth) maxWordWidth = actual;
  });

  if (maxWordWidth > containerWidth) {
    fontSize = fontSize * (containerWidth / maxWordWidth);
    words.forEach(w => w.style.fontSize = `${fontSize}px`);
  }
}

// Fit on load and resize
document.fonts.ready.then(fitText);
window.addEventListener('resize', fitText);
// Also try immediate fit just in case font is already cached
fitText();
