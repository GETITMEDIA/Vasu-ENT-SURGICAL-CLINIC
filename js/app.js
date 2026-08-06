/**
 * VASU ENT SURGICAL CLINIC — app.js
 * Preloader, scroll reveal, counters, testimonials, FAQ, gallery lightbox,
 * back-to-top, button ripple, specialty tabs.
 */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     Preloader
     --------------------------------------------------------------------- */
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    if (!preloader) return;
    setTimeout(() => preloader.classList.add("is-hidden"), 350);
  });
  // Safety net in case 'load' fires late or is missed
  setTimeout(() => preloader && preloader.classList.add("is-hidden"), 3500);

  /* ---------------------------------------------------------------------
     Scroll reveal (IntersectionObserver)
     --------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  let revealObserver = null;

  function forceReveal(scopeEl) {
    if (!scopeEl) return;
    const targets = scopeEl.matches("[data-reveal]") ? [scopeEl] : [];
    scopeEl.querySelectorAll("[data-reveal]").forEach((el) => targets.push(el));
    targets.forEach((el) => {
      el.classList.add("is-revealed");
      if (revealObserver) revealObserver.unobserve(el);
    });
  }

  if ("IntersectionObserver" in window && revealEls.length) {
    document.querySelectorAll("[data-reveal-group]").forEach((group) => {
      Array.from(group.querySelectorAll("[data-reveal]")).forEach((el, i) => {
        el.style.setProperty("--stagger-index", i);
      });
    });

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-revealed"));
  }

  /* ---------------------------------------------------------------------
     Animated counters
     --------------------------------------------------------------------- */
  const counters = document.querySelectorAll("[data-counter]");
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute("data-counter"));
    const decimals = el.getAttribute("data-decimals") ? parseInt(el.getAttribute("data-decimals"), 10) : 0;
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toFixed(decimals);
      }
    }
    requestAnimationFrame(tick);
  }

  if (counters.length) {
    if ("IntersectionObserver" in window) {
      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((el) => counterObserver.observe(el));
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------------------------------------------------------------------
     Back to top
     --------------------------------------------------------------------- */
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      () => {
        backToTop.classList.toggle("is-visible", window.scrollY > 500);
      },
      { passive: true }
    );
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------------------
     Button ripple effect
     --------------------------------------------------------------------- */
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------------------------------------------------------------------
     FAQ accordion
     --------------------------------------------------------------------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      item.closest(".faq-list") &&
        item.closest(".faq-list").querySelectorAll(".faq-item").forEach((other) => {
          if (other !== item) {
            other.classList.remove("is-open");
            other.querySelector(".faq-answer").style.maxHeight = null;
            other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
          }
        });

      if (isOpen) {
        item.classList.remove("is-open");
        answer.style.maxHeight = null;
        question.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("is-open");
        answer.style.maxHeight = answer.scrollHeight + "px";
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------------------------------------------------------------------
     Testimonial slider
     --------------------------------------------------------------------- */
  const track = document.querySelector(".testimonial-track");
  if (track) {
    const slides = Array.from(track.children);
    const dotsWrap = document.querySelector(".testimonial-nav");
    const prevBtn = document.querySelector(".testimonial-arrow.prev");
    const nextBtn = document.querySelector(".testimonial-arrow.next");
    let perView = getPerView();
    let index = 0;
    let autoTimer;

    function getPerView() {
      if (window.matchMedia("(max-width: 768px)").matches) return 1;
      if (window.matchMedia("(max-width: 992px)").matches) return 2;
      return 3;
    }

    function maxIndex() {
      return Math.max(0, slides.length - perView);
    }

    function renderDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      for (let i = 0; i <= maxIndex(); i++) {
        const dot = document.createElement("button");
        dot.className = "testimonial-dot" + (i === index ? " is-active" : "");
        dot.setAttribute("aria-label", "Go to testimonial group " + (i + 1));
        dot.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    function update() {
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).gap || 26);
      track.style.transform = `translateX(-${index * (slideWidth + gap)}px)`;
      renderDots();
    }

    function goTo(i) {
      index = Math.min(Math.max(i, 0), maxIndex());
      update();
      resetAuto();
    }

    function next() {
      index = index >= maxIndex() ? 0 : index + 1;
      update();
    }

    function prev() {
      index = index <= 0 ? maxIndex() : index - 1;
      update();
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(next, 5500);
    }

    nextBtn && nextBtn.addEventListener("click", () => { next(); resetAuto(); });
    prevBtn && prevBtn.addEventListener("click", () => { prev(); resetAuto(); });

    window.addEventListener("resize", () => {
      const newPerView = getPerView();
      if (newPerView !== perView) {
        perView = newPerView;
        index = 0;
      }
      update();
    });

    update();
    resetAuto();
  }

  /* ---------------------------------------------------------------------
     Gallery lightbox
     --------------------------------------------------------------------- */
  const lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    const lightboxImg = lightbox.querySelector("img");
    const closeBtn = lightbox.querySelector(".lightbox-close");

    document.querySelectorAll(".gallery-item img").forEach((img) => {
      img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add("is-active");
        document.body.style.overflow = "hidden";
      });
    });

    function closeLightbox() {
      lightbox.classList.remove("is-active");
      document.body.style.overflow = "";
    }

    closeBtn && closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
  }

  /* ---------------------------------------------------------------------
     Specialty tabs & sub-tabs routing (OTOSCOPE, ENDOSCOPE, SUPER SPECIALITY, DESIRABLE AUDIOLOGY)
     --------------------------------------------------------------------- */
  const subtabs = document.querySelectorAll(".subtab-btn, .clinic-subtab-btn");

  function forceReveal(container) {
    if (!container) return;
    container.querySelectorAll("[data-reveal]").forEach((el) => {
      el.classList.add("is-revealed");
    });
  }

  function activateSubtab(subId) {
    if (!subId) return;
    const activeSubtab = document.querySelector(`[data-subtarget="${subId}"]`);
    if (!activeSubtab) return;
    
    // Update subtab buttons — deactivate all siblings in the same container
    const allSubtabBtns = document.querySelectorAll(".subtab-btn, .clinic-subtab-btn");
    allSubtabBtns.forEach((btn) => btn.classList.remove("is-active"));
    activeSubtab.classList.add("is-active");

    // Update subpanels
    const subpanels = document.querySelectorAll(".specialty-subpanel");
    subpanels.forEach((panel) => {
      const isActive = panel.id === subId;
      panel.classList.toggle("is-active", isActive);
      if (isActive) {
        forceReveal(panel);
      }
    });
  }

  if (subtabs.length) {
    subtabs.forEach((subtab) => {
      subtab.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = subtab.getAttribute("data-subtarget");
        activateSubtab(targetId);
        history.replaceState(null, "", "#" + targetId);
        
        // Scroll to the active subpanel
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    // Handle initial hash on load
    const initialHash = window.location.hash ? window.location.hash.slice(1) : null;
    if (initialHash && document.getElementById(initialHash)) {
      activateSubtab(initialHash);
      setTimeout(() => {
        const targetPanel = document.getElementById(initialHash);
        if (targetPanel) {
          targetPanel.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 400);
    }

    // Handle hashchange event
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.substring(1);
      if (hash && document.getElementById(hash)) {
        activateSubtab(hash);
        const targetPanel = document.getElementById(hash);
        if (targetPanel) {
          targetPanel.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  }

  // Handle traditional tabs for other pages (if any)
  const tabs = document.querySelectorAll(".specialty-tab");
  const panels = document.querySelectorAll(".specialty-panel");
  if (tabs.length && panels.length) {
    function activatePanel(id, updateHash) {
      if (!id) return;
      tabs.forEach((t) => {
        const isActive = t.getAttribute("data-target") === id;
        t.classList.toggle("is-active", isActive);
        t.setAttribute("aria-selected", String(isActive));
        t.setAttribute("tabindex", isActive ? "0" : "-1");
      });
      panels.forEach((p) => p.classList.toggle("is-active", p.id === id));
      if (updateHash) {
        history.replaceState(null, "", "#" + id);
      }
      forceReveal(document.getElementById(id));
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        const id = tab.getAttribute("data-target");
        activatePanel(id, true);
        const targetEl = document.getElementById(id);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    const initialPanelHash = window.location.hash ? window.location.hash.slice(1) : null;
    if (initialPanelHash && document.getElementById(initialPanelHash)) {
      const targetEl = document.getElementById(initialPanelHash);
      if (targetEl && targetEl.classList.contains("specialty-panel")) {
        activatePanel(initialPanelHash, false);
      }
    } else if (panels.length) {
      activatePanel(panels[0].id, false);
    }
  }

  /* ---------------------------------------------------------------------
     Current year in footer
     --------------------------------------------------------------------- */
  document.querySelectorAll("[data-current-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------------------------------------------------------------------
     Hero Image Carousel
     --------------------------------------------------------------------- */
  const carousel = document.getElementById("hero-carousel");
  if (carousel) {
    const slides = carousel.querySelectorAll(".carousel-slide");
    const dots = carousel.querySelectorAll(".dot");
    let currentSlide = 0;
    let slideInterval;

    const prevBtn = carousel.querySelector(".ctrl-prev");
    const nextBtn = carousel.querySelector(".ctrl-next");

    function showSlide(index) {
      slides.forEach((slide) => slide.classList.remove("active"));
      dots.forEach((dot) => dot.classList.remove("active"));
      slides[index].classList.add("active");
      dots[index].classList.add("active");
      currentSlide = index;
    }

    function nextSlide() {
      let next = (currentSlide + 1) % slides.length;
      showSlide(next);
    }

    function prevSlide() {
      let prev = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prev);
    }

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        startAutoSlide();
      });
      nextBtn.addEventListener("click", () => {
        nextSlide();
        startAutoSlide();
      });
    }

    function startAutoSlide() {
      stopAutoSlide();
      slideInterval = setInterval(nextSlide, 4500);
    }

    function stopAutoSlide() {
      if (slideInterval) clearInterval(slideInterval);
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const slideIndex = parseInt(dot.getAttribute("data-slide"), 10);
        showSlide(slideIndex);
        startAutoSlide();
      });
    });

    startAutoSlide();
  }

})();
