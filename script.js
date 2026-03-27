/* =============================================
   SURABHI FEEDS — SCRIPT.JS
   ============================================= */

/* ---- CAROUSEL ---- */
const slides      = document.querySelectorAll('.carousel-slide');
const dots        = document.querySelectorAll('.dot');
const prevBtn     = document.getElementById('prevSlide');
const nextBtn     = document.getElementById('nextSlide');
let currentSlide  = 0;
let carouselTimer = null;

function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function startCarousel() {
  carouselTimer = setInterval(() => goToSlide(currentSlide + 1), 4500);
}
function resetCarousel() {
  clearInterval(carouselTimer);
  startCarousel();
}

if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); resetCarousel(); });
if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); resetCarousel(); });
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.index));
    resetCarousel();
  });
});
startCarousel();

/* Touch/swipe support */
let touchStartX = 0;
const heroEl = document.querySelector('.hero');
if (heroEl) {
  heroEl.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  heroEl.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
      resetCarousel();
    }
  }, { passive: true });
}

/* ---- NAVBAR ---- */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

/* Close menu on link click */
allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* Close on outside click */
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

/* Active link on scroll */
const sections = document.querySelectorAll('section[id], div[id]');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      allNavLinks.forEach(link => {
        link.classList.toggle('active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });
sections.forEach(s => navObserver.observe(s));

/* ---- SCROLL ANIMATIONS ---- */
const animEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
animEls.forEach(el => animObserver.observe(el));

/* ---- BACK TO TOP ---- */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---- GALLERY FILTER ---- */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      if (filter === 'all' || item.classList.contains(filter)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* ---- CONTACT FORM ---- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = '✅ Enquiry Sent!';
      btn.style.background = '#25D366';

      // Show success message or reset after delay
      setTimeout(() => {
        btn.textContent = 'Send Enquiry';
        btn.disabled = false;
        btn.style.background = '';
        contactForm.reset();
      }, 3500);
    }, 1200);
  });
}

/* ---- SMOOTH SCROLL for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

/* ---- GALLERY LIGHTBOX (simple) ---- */
galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:9999;
      display:flex;align-items:center;justify-content:center;cursor:zoom-out;
      animation:fadeInLB .25s ease;
    `;
    const style = document.createElement('style');
    style.textContent = '@keyframes fadeInLB{from{opacity:0}to{opacity:1}}';
    document.head.appendChild(style);

    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:12px;box-shadow:0 12px 48px rgba(0,0,0,.5);object-fit:contain;';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = 'position:absolute;top:20px;right:24px;color:white;font-size:1.6rem;background:none;border:none;cursor:pointer;opacity:.8;';
    closeBtn.addEventListener('click', () => overlay.remove());

    overlay.appendChild(imgEl);
    overlay.appendChild(closeBtn);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);

    document.addEventListener('keydown', function closeOnEsc(e) {
      if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', closeOnEsc); }
    });
  });
});

/* ---- COUNTER ANIMATION for stats ---- */
function animateCounter(el, target, duration = 1600) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + (el.dataset.suffix || '');
  };
  requestAnimationFrame(step);
}

const statStrong = document.querySelectorAll('.stat strong');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const rawText = el.textContent;
      const num = parseInt(rawText);
      const suffix = rawText.replace(/[0-9]/g, '');
      el.dataset.suffix = suffix;
      animateCounter(el, num);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statStrong.forEach(el => statObserver.observe(el));

/* ---- PRODUCT CARD HOVER GLOW ---- */
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,1) 0%, rgba(250,246,238,.6) 100%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = 'white';
  });
});

/* ---- PRELOAD HERO IMAGES ---- */
const heroImages = [
  'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&q=80',
  'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1600&q=80',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80',
  'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=1600&q=80',
];
heroImages.forEach(src => { const img = new Image(); img.src = src; });

console.log('%c🐄 Surabhi Feeds', 'color:#4a8a2c;font-size:1.2rem;font-weight:bold;');
console.log('%cHigh Quality Cattle Feed for Better Milk Production', 'color:#7a8870;');
