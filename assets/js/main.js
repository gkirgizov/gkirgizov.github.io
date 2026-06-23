/* Minimal progressive enhancement: theme toggle, sticky-nav state,
   scroll-spy, and reveal-on-scroll. No dependencies. */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ── Theme toggle ───────────────────────────────────────────────────────── */
  var toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = next;
      try { localStorage.theme = next; } catch (e) { /* private mode: ignore */ }
    });
  }

  /* ── Sticky nav: solidify after a little scroll ─────────────────────────── */
  var nav = document.querySelector("[data-nav]");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ── Reveal-on-scroll ───────────────────────────────────────────────────── */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var revealObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { revealObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ── Scroll-spy: highlight the active nav link ──────────────────────────── */
  var spyLinks = document.querySelectorAll("[data-spy]");
  if ("IntersectionObserver" in window && spyLinks.length) {
    var byId = {};
    spyLinks.forEach(function (a) { byId[a.getAttribute("data-spy")] = a; });

    var sections = [];
    Object.keys(byId).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) sections.push(sec);
    });

    var setActive = function (id) {
      spyLinks.forEach(function (a) {
        a.classList.toggle("is-active", a.getAttribute("data-spy") === id);
      });
    };

    var spyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (sec) { spyObs.observe(sec); });
  }
})();
