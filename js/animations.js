/**
 * PREMIUM ANIMATIONS JS — Vasu ENT Surgical Clinic
 * 3D Card Tilt · Scroll Progress · Magnetic Buttons · Particle Glow · Type-On
 */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     1. SCROLL PROGRESS BAR
  ───────────────────────────────────────────────────────────── */
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = ((scrolled / maxScroll) * 100).toFixed(2) + '%';
  }, { passive: true });


  /* ─────────────────────────────────────────────────────────────
     2. 3D CARD TILT on hover
  ───────────────────────────────────────────────────────────── */
  const TILT_SELECTORS = [
    '.feature-card',
    '.service-card',
    '.sp-card',
    '.testimonial-card',
    '.booking-info-card',
    '.contact-info-card',
    '.about-quality-card',
    '.stat-box'
  ].join(',');

  function applyTilt(card) {
    const MAX = 7;

    card.addEventListener('mousemove', (e) => {
      const r   = card.getBoundingClientRect();
      const x   = (e.clientX - r.left) / r.width  - 0.5;
      const y   = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = [
        'perspective(700px)',
        `rotateX(${(-y * MAX).toFixed(2)}deg)`,
        `rotateY(${(x  * MAX).toFixed(2)}deg)`,
        'translateZ(6px)'
      ].join(' ');
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform =
        'perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  }

  document.querySelectorAll(TILT_SELECTORS).forEach(applyTilt);


  /* ─────────────────────────────────────────────────────────────
     3. MAGNETIC BUTTON EFFECT (subtle attraction toward cursor)
  ───────────────────────────────────────────────────────────── */
  document.querySelectorAll('.btn-primary, .btn-ghost').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r    = btn.getBoundingClientRect();
      const dx   = (e.clientX - (r.left + r.width  / 2)) * 0.2;
      const dy   = (e.clientY - (r.top  + r.height / 2)) * 0.2;
      btn.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });


  /* ─────────────────────────────────────────────────────────────
     4. STAT COUNTER POP — bounce when counter finishes
  ───────────────────────────────────────────────────────────── */
  const counterEls = document.querySelectorAll('[data-counter]');

  if (counterEls.length && 'IntersectionObserver' in window) {
    const popObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        setTimeout(() => {
          const numEl = el.closest('.stat-number, .stat-value');
          if (numEl) {
            numEl.classList.add('pop');
            numEl.addEventListener('animationend', () => numEl.classList.remove('pop'), { once: true });
          }
        }, 1900); // fires just after counter finishes (1800ms)
        popObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    counterEls.forEach((el) => popObserver.observe(el));
  }


  /* ─────────────────────────────────────────────────────────────
     5. SMOOTH TYPING EFFECT for hero title words
  ───────────────────────────────────────────────────────────── */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    // Add a subtle cursor-blink class to the last span in hero-title
    const spans = heroTitle.querySelectorAll('span');
    if (spans.length) {
      spans[spans.length - 1].style.cssText += '; position:relative;';
    }
  }


  /* ─────────────────────────────────────────────────────────────
     6. SECTION TITLE REVEAL — highlight underline draw on scroll
  ───────────────────────────────────────────────────────────── */
  const sectionTitles = document.querySelectorAll('.section-title');

  if ('IntersectionObserver' in window && sectionTitles.length) {
    const titleObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('title-revealed');
          titleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    sectionTitles.forEach((t) => titleObserver.observe(t));
  }


  /* ─────────────────────────────────────────────────────────────
     7. FLOATING PARTICLE DOTS in hero background
  ───────────────────────────────────────────────────────────── */
  const hero = document.querySelector('.hero');
  if (hero) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = [
      'position:absolute',
      'inset:0',
      'width:100%',
      'height:100%',
      'pointer-events:none',
      'z-index:2',
      'opacity:0.35'
    ].join(';');
    hero.style.position = 'relative';
    hero.insertBefore(canvas, hero.firstChild);

    const ctx   = canvas.getContext('2d');
    const COUNT = 28;
    let W, H, dots;

    function resize() {
      W = canvas.width  = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    }

    function makeDot() {
      return {
        x:    Math.random() * W,
        y:    Math.random() * H,
        r:    1 + Math.random() * 2.5,
        vx:   (Math.random() - 0.5) * 0.4,
        vy:   (Math.random() - 0.5) * 0.4,
        a:    0.3 + Math.random() * 0.5
      };
    }

    function init() { dots = Array.from({ length: COUNT }, makeDot); }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      dots.forEach((d) => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(36,169,174,${d.a})`;
        ctx.fill();
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -5) d.x = W + 5;
        if (d.x > W + 5) d.x = -5;
        if (d.y < -5) d.y = H + 5;
        if (d.y > H + 5) d.y = -5;
      });
      requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();

    window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
  }


  /* ─────────────────────────────────────────────────────────────
     8. FOOTER LINK HOVER — slide colour from left
  ───────────────────────────────────────────────────────────── */
  document.querySelectorAll('.footer-col a').forEach((link) => {
    link.style.transition = 'color 0.25s ease, padding-left 0.25s ease';
  });


  /* ─────────────────────────────────────────────────────────────
     9. SCROLL-AWARE HEADER SHADOW
  ───────────────────────────────────────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
      } else {
        header.style.boxShadow = '';
      }
    }, { passive: true });
  }

})();
