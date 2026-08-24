/* ==========================================================================
   SNOWDROP INTERIORS — SCRIPT
   Vanilla JS. No dependencies.
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     Sticky header
     ------------------------------------------------------------------------ */
  var header = document.getElementById("siteHeader");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 40) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------------ */
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");
  var mobileMenuClose = document.getElementById("mobileMenuClose");

  function openMenu() {
    mobileMenu.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    var firstLink = mobileMenu.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    mobileMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    navToggle.focus();
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.contains("is-open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener("click", closeMenu);
    }

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
        closeMenu();
      }
    });
  }

  /* ------------------------------------------------------------------------
     Smooth anchor scrolling (for in-page hash links, header offset aware)
     ------------------------------------------------------------------------ */
  document.querySelectorAll('a[href*="#"]').forEach(function (link) {
    var hrefAttr = link.getAttribute("href");
    if (!hrefAttr) return;
    var hashIndex = hrefAttr.indexOf("#");
    if (hashIndex === -1) return;
    var path = hrefAttr.substring(0, hashIndex);
    var hash = hrefAttr.substring(hashIndex + 1);
    var samePage = path === "" || path === window.location.pathname.split("/").pop();
    if (!samePage || !hash) return;

    var target = document.getElementById(hash);
    if (!target) return;

    link.addEventListener("click", function (e) {
      e.preventDefault();
      var headerH = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 16;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ------------------------------------------------------------------------
     Scroll reveal — IntersectionObserver
     ------------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      document.documentElement.classList.add("js-reveal");
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  }

  /* ------------------------------------------------------------------------
     Counter animation
     ------------------------------------------------------------------------ */
  var counterSection = document.querySelector("[data-counter-section]");
  var counterEls = counterSection ? counterSection.querySelectorAll("[data-counter-target]") : [];

  function setCounterValue(el, value) {
    el.textContent = Math.round(value).toString();
  }

  function runCounters() {
    if (!counterEls.length) return;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    counterEls.forEach(function (el) {
      var target = parseInt(el.getAttribute("data-counter-target"), 10) || 0;

      if (reduceMotion) {
        setCounterValue(el, target);
        return;
      }

      var start = null;
      var duration = 1200;

      function tick(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        setCounterValue(el, target * eased);
        if (progress < 1) window.requestAnimationFrame(tick);
      }

      window.requestAnimationFrame(tick);
    });
  }

  if (counterEls.length) {
    if ("IntersectionObserver" in window) {
      var counterObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              runCounters();
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.35 }
      );
      counterObserver.observe(counterSection);
    } else {
      runCounters();
    }
  }

  /* ------------------------------------------------------------------------
     FAQ accordion
     ------------------------------------------------------------------------ */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-question");
    var answer = item.querySelector(".faq-answer");
    if (!btn || !answer) return;

    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");

      document.querySelectorAll(".faq-item.is-open").forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove("is-open");
          openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
          openItem.querySelector(".faq-answer").style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        answer.style.maxHeight = null;
      } else {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ------------------------------------------------------------------------
     Testimonial slider
     ------------------------------------------------------------------------ */
  document.querySelectorAll("[data-testimonial-slider]").forEach(function (slider) {
    var track = slider.querySelector("[data-testimonial-slides]");
    var slides = slider.querySelectorAll(".testimonial-slide");
    var prevBtn = slider.querySelector("[data-testimonial-prev]");
    var nextBtn = slider.querySelector("[data-testimonial-next]");
    var dotsWrap = slider.querySelector("[data-testimonial-dots]");
    if (!track || !slides.length) return;

    var index = 0;
    var dots = [];

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", function () {
        goTo(i);
      });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (d, di) {
        d.classList.toggle("is-active", di === index);
      });
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1); });

    var autoplay = setInterval(function () { goTo(index + 1); }, 7000);
    slider.addEventListener("mouseenter", function () { clearInterval(autoplay); });
    slider.addEventListener("focusin", function () { clearInterval(autoplay); });
  });

  /* ------------------------------------------------------------------------
     Before / After slider (draggable, mouse + touch + keyboard)
     ------------------------------------------------------------------------ */
  document.querySelectorAll("[data-ba-slider]").forEach(function (slider) {
    var beforeWrap = slider.querySelector(".ba-before-wrap");
    var beforeImg = beforeWrap ? beforeWrap.querySelector("img") : null;
    var handle = slider.querySelector("[data-ba-handle]");
    var range = slider.querySelector("[data-ba-range]");
    if (!beforeWrap || !handle) return;

    function setPosition(percent) {
      percent = Math.max(0, Math.min(100, percent));
      beforeWrap.style.width = percent + "%";
      handle.style.left = percent + "%";
      if (beforeImg) {
        beforeImg.style.width = (100 / (percent / 100)) + "%";
      }
      if (range) range.value = percent;
    }

    function percentFromClientX(clientX) {
      var rect = slider.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    var dragging = false;

    function onMove(clientX) {
      setPosition(percentFromClientX(clientX));
    }

    handle.addEventListener("mousedown", function () { dragging = true; });
    slider.addEventListener("mousedown", function (e) {
      dragging = true;
      onMove(e.clientX);
    });
    window.addEventListener("mousemove", function (e) {
      if (dragging) onMove(e.clientX);
    });
    window.addEventListener("mouseup", function () { dragging = false; });

    slider.addEventListener("touchstart", function (e) {
      dragging = true;
      onMove(e.touches[0].clientX);
    }, { passive: true });
    slider.addEventListener("touchmove", function (e) {
      if (dragging) onMove(e.touches[0].clientX);
    }, { passive: true });
    slider.addEventListener("touchend", function () { dragging = false; });

    if (range) {
      range.addEventListener("input", function () {
        setPosition(parseFloat(range.value));
      });
    }

    setPosition(50);
  });

  /* ------------------------------------------------------------------------
     Project filter (Projects page)
     ------------------------------------------------------------------------ */
  var filterBar = document.querySelector("[data-filter-bar]");
  if (filterBar) {
    var filterBtns = filterBar.querySelectorAll(".filter-btn");
    var cards = document.querySelectorAll("[data-project-card]");

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var filter = btn.getAttribute("data-filter");

        cards.forEach(function (card) {
          var cat = card.getAttribute("data-category");
          var show = filter === "all" || filter === cat;
          card.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     Homepage project gallery filters
     ------------------------------------------------------------------------ */
  var galleryFilterBar = document.querySelector("[data-gallery-filter-bar]");
  var gallery = document.querySelector("[data-project-gallery]");

  if (galleryFilterBar && gallery) {
    var galleryFilterBtns = galleryFilterBar.querySelectorAll("[data-gallery-filter]");
    var homeGalleryItems = gallery.querySelectorAll("[data-gallery-item]");

    galleryFilterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-gallery-filter");

        galleryFilterBtns.forEach(function (button) {
          button.classList.toggle("is-active", button === btn);
        });

        homeGalleryItems.forEach(function (item) {
          var show = filter === "all" || item.getAttribute("data-category") === filter;
          item.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     Lightbox (Projects page)
     ------------------------------------------------------------------------ */
  var lightbox = document.querySelector("[data-lightbox]");
  if (lightbox) {
    var lightboxImg = lightbox.querySelector("[data-lightbox-img]");
    var lightboxCaption = lightbox.querySelector("[data-lightbox-caption]");
    var lightboxClose = lightbox.querySelector("[data-lightbox-close]");
    var lightboxPrev = lightbox.querySelector("[data-lightbox-prev]");
    var lightboxNext = lightbox.querySelector("[data-lightbox-next]");
    var galleryItems = Array.prototype.slice.call(document.querySelectorAll("[data-project-card]"));
    var currentIndex = 0;
    var lastFocused = null;

    function visibleItems() {
      return galleryItems.filter(function (item) {
        return !item.classList.contains("is-hidden");
      });
    }

    function openLightbox(item) {
      var items = visibleItems();
      currentIndex = items.indexOf(item);
      lastFocused = document.activeElement;
      renderLightbox(items);
      lightbox.classList.add("is-open");
      document.body.classList.add("menu-open");
      lightboxClose.focus();
    }

    function renderLightbox(items) {
      var item = items[currentIndex];
      if (!item) return;
      var img = item.querySelector("img");
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      var name = item.getAttribute("data-name") || "";
      var location = item.getAttribute("data-location") || "";
      lightboxCaption.textContent = name + (location ? " — " + location : "");
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      if (lastFocused) lastFocused.focus();
    }

    function step(dir) {
      var items = visibleItems();
      currentIndex = (currentIndex + dir + items.length) % items.length;
      renderLightbox(items);
    }

    galleryItems.forEach(function (item) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        openLightbox(item);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener("click", function () { step(-1); });
    if (lightboxNext) lightboxNext.addEventListener("click", function () { step(1); });

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }

  /* ------------------------------------------------------------------------
     Basic form validation (Contact page)
     ------------------------------------------------------------------------ */
  var contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    var statusBox = contactForm.querySelector(".form-status");

    function showError(field, message) {
      var wrap = field.closest(".form-field");
      var errorEl = wrap ? wrap.querySelector(".form-error") : null;
      if (wrap) wrap.classList.add("has-error");
      if (errorEl) errorEl.textContent = message;
    }

    function clearError(field) {
      var wrap = field.closest(".form-field");
      var errorEl = wrap ? wrap.querySelector(".form-error") : null;
      if (wrap) wrap.classList.remove("has-error");
      if (errorEl) errorEl.textContent = "";
    }

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var fields = contactForm.querySelectorAll("[required]");

      fields.forEach(function (field) {
        clearError(field);
        var value = field.value.trim();

        if (!value) {
          valid = false;
          showError(field, "This field is required.");
          return;
        }

        if (field.type === "email") {
          var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(value)) {
            valid = false;
            showError(field, "Enter a valid email address.");
          }
        }

        if (field.type === "tel") {
          var phonePattern = /^[0-9+\-\s()]{7,15}$/;
          if (!phonePattern.test(value)) {
            valid = false;
            showError(field, "Enter a valid phone number.");
          }
        }
      });

      if (!valid) return;

      /* No backend connected yet — this form is structured for a future
         PHP / email / API integration. Replace this block with a fetch()
         call to the processing endpoint. */
      if (statusBox) {
        statusBox.textContent = "Thank you. Your enquiry details are ready to be sent — connect this form to your email or CRM endpoint to complete submission.";
        statusBox.classList.add("is-visible");
      }
      contactForm.reset();
    });

    contactForm.querySelectorAll("[required]").forEach(function (field) {
      field.addEventListener("input", function () { clearError(field); });
      field.addEventListener("blur", function () { clearError(field); });
    });
  }
})();
