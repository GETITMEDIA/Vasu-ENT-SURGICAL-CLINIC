/**
 * VASU ENT SURGICAL CLINIC — navigation.js
 * Sticky header, mobile menu, mega-dropdown interactions.
 */
(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const megaItems = document.querySelectorAll(".nav-item.has-mega");
  const body = document.body;

  /* Sticky header on scroll */
  function updateHeaderState() {
    if (!header) return;
    if (window.scrollY > 30) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  /* Mobile menu toggle */
  function closeMobileMenu() {
    navToggle && navToggle.classList.remove("is-active");
    navMenu && navMenu.classList.remove("is-open");
    navToggle && navToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("nav-open");
    megaItems.forEach((item) => item.classList.remove("is-open"));
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.classList.toggle("is-active", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      body.classList.toggle("nav-open", isOpen);
    });
  }

  /* Close button inside the drawer */
  const drawerClose = document.getElementById("drawer-close");
  if (drawerClose) {
    drawerClose.addEventListener("click", closeMobileMenu);
  }


  /* Close mobile menu on outside click / escape */
  document.addEventListener("click", (e) => {
    if (!navMenu || !navToggle) return;
    if (
      navMenu.classList.contains("is-open") &&
      !navMenu.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileMenu();
  });

  /* Mega menu: click-to-toggle on touch/mobile, hover works via CSS on desktop */
  megaItems.forEach((item) => {
    const trigger = item.querySelector(".nav-link");
    if (!trigger) return;

    trigger.addEventListener("click", (e) => {
      const isMobile = window.matchMedia("(max-width: 992px)").matches;
      if (isMobile) {
        e.preventDefault();
        const willOpen = !item.classList.contains("is-open");
        megaItems.forEach((other) => {
          if (other !== item) other.classList.remove("is-open");
        });
        item.classList.toggle("is-open", willOpen);
      }
    });
  });

  /* Standard Dropdown toggle for mobile */
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      const parentItem = toggle.closest(".has-dropdown");
      if (parentItem) {
        const willOpen = !parentItem.classList.contains("is-open");
        
        // Close other dropdowns if needed
        document.querySelectorAll(".has-dropdown").forEach((item) => {
          if (item !== parentItem) item.classList.remove("is-open");
        });
        
        parentItem.classList.toggle("is-open", willOpen);

        // Remove focus so :focus-within doesn't inadvertently keep it open
        if (!willOpen) {
          toggle.blur();
        }
      }
    });
  });

  /* Mega menu: gap-tolerant hover on desktop.
     The dropdown is position:fixed and sits a few pixels below the
     trigger, so a plain CSS :hover chain breaks while the cursor
     crosses that gap. Track hover on both the trigger and the menu
     itself, and close after a short delay so brief gap-crossing or
     accidental mouse-outs don't collapse it. */
  const HOVER_CLOSE_DELAY = 250;

  function isDesktopNav() {
    return window.matchMedia("(min-width: 993px)").matches;
  }

  megaItems.forEach((item) => {
    const megaMenu = item.querySelector(".mega-menu");
    let closeTimer = null;

    function openNow() {
      if (!isDesktopNav()) return;
      clearTimeout(closeTimer);
      megaItems.forEach((other) => {
        if (other !== item) other.classList.remove("is-open");
      });
      item.classList.add("is-open");
    }

    function closeSoon() {
      if (!isDesktopNav()) return;
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        item.classList.remove("is-open");
      }, HOVER_CLOSE_DELAY);
    }

    item.addEventListener("mouseenter", openNow);
    item.addEventListener("mouseleave", closeSoon);
    if (megaMenu) {
      megaMenu.addEventListener("mouseenter", openNow);
      megaMenu.addEventListener("mouseleave", closeSoon);
    }
  });

  /* Mega menu sub-item accordion for mobile/touch */
  document.querySelectorAll(".mega-link-group").forEach((group) => {
    const head = group.querySelector(".mega-group-head");
    if (!head) return;
    head.addEventListener("click", (e) => {
      const isMobile = window.matchMedia("(max-width: 992px)").matches;
      if (isMobile) {
        e.preventDefault();
        e.stopPropagation();
        group.classList.toggle("is-expanded");
      }
    });
  });

  /* Close mobile nav when a real link is clicked */
  document.querySelectorAll(".nav-menu a:not(.nav-link)").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
  document.querySelectorAll(".mega-sub-link").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
  document.querySelectorAll(".mega-sub-item").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
  document.querySelectorAll(".nav-cta, .mobile-menu-actions a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  /* Mark active nav link based on current page */
  const currentPage = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav-link[data-page]").forEach((link) => {
    if (link.getAttribute("data-page") === currentPage) {
      link.classList.add("is-active");
    }
  });
})();
