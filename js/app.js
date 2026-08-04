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
     Specialty tabs (specialties.html)
     --------------------------------------------------------------------- */
  const tabs = document.querySelectorAll(".specialty-tab");
  const panels = document.querySelectorAll(".specialty-panel");

  // Capture and strip a #hash arriving from an external link (e.g. the mega
  // menu) immediately, before the browser gets a chance to run its own
  // native fragment-scroll. The native jump doesn't know about the sticky
  // tabs bar and — worse — can fire late (around window "load", after this
  // script has already run) and silently override our own corrective
  // scroll below. Removing the hash up front means there's nothing left
  // for the browser to act on; we re-add it after positioning ourselves.
  const initialSpecialtyHash =
    tabs.length && window.location.hash ? window.location.hash.slice(1) : null;
  if (initialSpecialtyHash && document.getElementById(initialSpecialtyHash)) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }

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
    // Panels are display:none until active, so elements inside them never
    // intersect the viewport and the scroll-reveal observer never fires —
    // reveal the newly active panel's content immediately instead.
    forceReveal(document.getElementById(id));
  }

  // .specialty-panel has scroll-margin-top set in CSS to clear the fixed
  // header + sticky tabs bar, so scrollIntoView() lands in the right place
  // without us hand-computing that geometry in JS (which proved fragile —
  // getBoundingClientRect() on the sticky tabs bar only reflects the right
  // numbers once it has actually engaged its stuck position).
  function scrollToPanel(panel, behavior) {
    if (!panel) return;
    if (behavior === "smooth") {
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // html has `scroll-behavior: smooth` site-wide, which governs every
      // programmatic scroll (scrollIntoView included) unless overridden —
      // force a true instant jump here instead.
      const html = document.documentElement;
      const prevScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      panel.scrollIntoView({ behavior: "auto", block: "start" });
      html.style.scrollBehavior = prevScrollBehavior;
    }
  }

  if (tabs.length && panels.length) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        const id = tab.getAttribute("data-target");
        activatePanel(id, true);
        scrollToPanel(document.getElementById(id), "smooth");
        // Center the active tab in the scrolling tabs list
        tab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });
    });

    // Scroll buttons & fade triggers for tabs list
    const tabsWrapper = document.querySelector(".specialty-tabs-wrapper");
    if (tabsWrapper) {
      const tabList = tabsWrapper.querySelector(".specialty-tabs");
      const leftBtn = tabsWrapper.querySelector(".tabs-scroll-btn.left");
      const rightBtn = tabsWrapper.querySelector(".tabs-scroll-btn.right");

      function updateArrows() {
        if (!tabList) return;
        const scrollLeft = tabList.scrollLeft;
        const maxScroll = tabList.scrollWidth - tabList.clientWidth;
        
        leftBtn && leftBtn.classList.toggle("is-visible", scrollLeft > 10);
        rightBtn && rightBtn.classList.toggle("is-visible", scrollLeft < maxScroll - 10);
        
        tabsWrapper.classList.toggle("has-scroll-left", scrollLeft > 10);
        tabsWrapper.classList.toggle("has-scroll-right", scrollLeft < maxScroll - 10);
      }

      if (leftBtn && rightBtn && tabList) {
        leftBtn.addEventListener("click", () => {
          tabList.scrollBy({ left: -240, behavior: "smooth" });
        });
        rightBtn.addEventListener("click", () => {
          tabList.scrollBy({ left: 240, behavior: "smooth" });
        });
        tabList.addEventListener("scroll", updateArrows, { passive: true });
        window.addEventListener("resize", updateArrows);
        
        // Run initial check once content is fully loaded
        setTimeout(updateArrows, 150);
      }
    }

    // Arrow-key navigation for the tablist (standard ARIA tabs pattern)
    const tabList = document.querySelector(".specialty-tabs");
    if (tabList) {
      tabList.addEventListener("keydown", (e) => {
        const tabArray = Array.from(tabs);
        const currentIndex = tabArray.indexOf(document.activeElement);
        if (currentIndex === -1) return;

        let nextIndex = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") nextIndex = (currentIndex + 1) % tabArray.length;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") nextIndex = (currentIndex - 1 + tabArray.length) % tabArray.length;
        else if (e.key === "Home") nextIndex = 0;
        else if (e.key === "End") nextIndex = tabArray.length - 1;

        if (nextIndex === null) return;
        e.preventDefault();
        const nextTab = tabArray[nextIndex];
        nextTab.focus();
        activatePanel(nextTab.getAttribute("data-target"), true);
        nextTab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });
    }

    // Precisely snap the given panel to sit just below the tabs bar's
    if (initialSpecialtyHash && document.getElementById(initialSpecialtyHash)) {
      activatePanel(initialSpecialtyHash, false);
      const snap = () => {
        const targetPanel = document.getElementById(initialSpecialtyHash);
        scrollToPanel(targetPanel, "auto");
        const activeTab = document.querySelector(`.specialty-tab[data-target="${initialSpecialtyHash}"]`);
        activeTab && activeTab.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
      };
      requestAnimationFrame(snap);
      setTimeout(() => {
        snap();
        history.replaceState(null, "", "#" + initialSpecialtyHash);
      }, 650);
    } else if (panels.length) {
      activatePanel(panels[0].id, false);
    }

    // Handle hash changes if the user clicks a dropdown link while already on the page
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.substring(1);
      if (hash && document.getElementById(hash) && document.querySelector(`.specialty-tab[data-target="${hash}"]`)) {
        activatePanel(hash, false);
        const targetPanel = document.getElementById(hash);
        scrollToPanel(targetPanel, "smooth");
        const activeTab = document.querySelector(`.specialty-tab[data-target="${hash}"]`);
        if (activeTab) {
          activeTab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
      }
    });
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
