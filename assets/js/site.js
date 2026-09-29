/* StyledByKeana: "The Halo" motion + interactions.
   Vanilla JS with vendored GSAP 3.15 (ScrollTrigger, SplitText, DrawSVG) and Lenis 1.3.
   Every effect has a prefers-reduced-motion off-ramp; content is fully visible without JS. */
(function () {
  "use strict";

  var d = document;
  var root = d.documentElement;
  var reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduce = reduceMQ.matches;
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  var Split = window.SplitText;
  var Draw = window.DrawSVGPlugin;
  var motion = !!(gsap && ST) && !reduce;
  var lenis = null;

  function $(sel, ctx) { return (ctx || d).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || d).querySelectorAll(sel)); }

  /* ---------------------------------------------------------------- header */
  var header = $("[data-header]");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", (window.scrollY || window.pageYOffset) > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------------------------------------------------------- today in hours (salon time) */
  try {
    var today = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "America/Los_Angeles" })
      .format(new Date()).toLowerCase().slice(0, 3);
    $$('.hours tr[data-day="' + today + '"]').forEach(function (tr) { tr.classList.add("is-today"); });
  } catch (e) { /* no-op */ }

  /* ---------------------------------------------------------------- smooth scroll (Lenis) */
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    if (motion) {
      lenis.on("scroll", ST.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var rafLoop = function (t) { lenis.raf(t); requestAnimationFrame(rafLoop); };
      requestAnimationFrame(rafLoop);
    }
  }

  function headerOffset() {
    var off = header ? header.offsetHeight : 0;
    var tools = $("[data-menu-tools]");
    if (tools) off += tools.offsetHeight;
    return off + 12;
  }

  /* In-page anchors: account for the fixed header and sticky service tools */
  d.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var hash = a.getAttribute("href");
    if (!hash || hash.length < 2) return;
    var target = d.getElementById(hash.slice(1));
    if (!target) return;
    if (a.classList.contains("skip-link")) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: false });
      return;
    }
    e.preventDefault();
    var off = headerOffset();
    var y = target.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - off;
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(y, { duration: 1.1, force: true });
    } else {
      window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    }
    if (history.replaceState) history.replaceState(null, "", hash);
  });

  /* ---------------------------------------------------------------- mobile menu */
  var toggle = $("[data-menu-toggle]");
  var panel = $("[data-menu]");
  var closeTimer = null;
  function focusables(ctx) {
    return $$('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])', ctx)
      .filter(function (el) { return el.offsetParent !== null || el === d.activeElement; });
  }
  function setLabel(text) {
    var l = toggle && $(".menu-toggle-label", toggle);
    if (l) l.textContent = text;
  }
  function openMenu() {
    if (!panel || !toggle) return;
    clearTimeout(closeTimer);
    panel.hidden = false;
    requestAnimationFrame(function () { panel.classList.add("is-open"); });
    toggle.setAttribute("aria-expanded", "true");
    setLabel("Close");
    if (lenis) lenis.stop();
    d.body.style.overflow = "hidden";
    var first = $("a", panel);
    if (first) setTimeout(function () { first.focus(); }, 60);
  }
  function closeMenu(returnFocus) {
    if (!panel || !toggle || panel.hidden) return;
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    setLabel("Menu");
    if (lenis) lenis.start();
    d.body.style.overflow = "";
    closeTimer = setTimeout(function () { panel.hidden = true; }, reduce ? 0 : 380);
    if (returnFocus) toggle.focus();
  }
  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      if (toggle.getAttribute("aria-expanded") === "true") closeMenu(true); else openMenu();
    });
    d.addEventListener("keydown", function (e) {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (e.key === "Escape") { e.preventDefault(); closeMenu(true); return; }
      if (e.key === "Tab") {
        var list = [toggle].concat(focusables(panel));
        var i = list.indexOf(d.activeElement);
        if (e.shiftKey && (i <= 0)) { e.preventDefault(); list[list.length - 1].focus(); }
        else if (!e.shiftKey && i === list.length - 1) { e.preventDefault(); list[0].focus(); }
        else if (i === -1) { e.preventDefault(); list[0].focus(); }
      }
    });
    $$("a", panel).forEach(function (a) { a.addEventListener("click", function () { closeMenu(false); }); });
    window.matchMedia("(min-width: 960px)").addEventListener("change", function (m) { if (m.matches) closeMenu(false); });
  }

  /* ---------------------------------------------------------------- services: chips + search */
  var chipList = $("[data-chips]");
  var groups = $$("[data-group]");
  if (chipList && groups.length) {
    var chips = $$("[data-chip]", chipList);
    var setActive = function (id) {
      chips.forEach(function (c) {
        var on = c.getAttribute("data-chip") === id;
        if (on) c.setAttribute("aria-current", "true"); else c.removeAttribute("aria-current");
        if (on) {
          var left = c.offsetLeft - chipList.clientWidth / 2 + c.offsetWidth / 2;
          chipList.scrollTo({ left: Math.max(0, left), behavior: reduce ? "auto" : "smooth" });
        }
      });
    };
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.id); });
      }, { rootMargin: "-35% 0px -60% 0px" });
      groups.forEach(function (g) { io.observe(g); });
    }
  }
  var search = $("[data-search]");
  if (search) {
    var items = $$(".mi");
    var empty = $("[data-empty]");
    var status = $("[data-search-status]");
    var runSearch = function () {
      var q = search.value.trim().toLowerCase();
      var tokens = q.split(/\s+/).filter(Boolean);
      var shown = 0;
      items.forEach(function (li) {
        var hay = li.getAttribute("data-search") || "";
        var ok = tokens.every(function (t) { return hay.indexOf(t) > -1; });
        li.hidden = !ok;
        if (ok) shown++;
      });
      groups.forEach(function (g) { g.hidden = !$$(".mi", g).some(function (li) { return !li.hidden; }); });
      if (empty) empty.hidden = shown !== 0;
      if (status) status.textContent = q ? shown + (shown === 1 ? " service matches" : " services match") + " “" + search.value.trim() + "”" : "Showing all services";
      revealAll();
      if (motion) ST.refresh();
    };
    search.addEventListener("input", runSearch);
  }

  /* ---------------------------------------------------------------- gallery: filters + lightbox */
  var gallery = $("[data-gallery]");
  if (gallery) {
    var filterBtns = $$("[data-filter]");
    var tiles = $$(".g-item", gallery);
    var count = $("[data-g-count]");
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        filterBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        var n = 0;
        tiles.forEach(function (t) {
          var ok = f === "all" || t.getAttribute("data-cat") === f;
          t.hidden = !ok;
          if (ok) n++;
        });
        if (count) count.textContent = n + (n === 1 ? " photo" : " photos");
        revealAll();
        if (motion) {
          gsap.fromTo(tiles.filter(function (t) { return !t.hidden; }), { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.04, clearProps: "transform,opacity,visibility" });
          ST.refresh();
        }
      });
    });

    var dlg = $("[data-lb]");
    if (dlg && typeof dlg.showModal === "function") {
      var lbImg = $("[data-lb-img]", dlg);
      var lbCap = $("[data-lb-caption]", dlg);
      var lbCat = $("[data-lb-cat]", dlg);
      var lbAlt = $("[data-lb-alt]", dlg);
      var lbCount = $("[data-lb-count]", dlg);
      var lbClose = $("[data-lb-close]", dlg);
      var lbPrev = $("[data-lb-prev]", dlg);
      var lbNext = $("[data-lb-next]", dlg);
      var list = [];
      var idx = 0;
      var opener = null;
      var show = function (i) {
        idx = (i + list.length) % list.length;
        var b = list[idx];
        var thumb = $("img", b);
        lbImg.src = b.getAttribute("data-full");
        lbImg.alt = thumb ? thumb.alt : "";
        lbCap.textContent = b.getAttribute("data-caption");
        lbCat.textContent = b.getAttribute("data-cat-name");
        lbAlt.textContent = thumb ? thumb.alt : "";
        lbCount.textContent = (idx + 1) + " / " + list.length;
        if (motion) gsap.fromTo(lbImg, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" });
      };
      $$("[data-lightbox]", gallery).forEach(function (b) {
        b.addEventListener("click", function () {
          list = $$("[data-lightbox]", gallery).filter(function (x) { return !x.closest(".g-item").hidden; });
          opener = b;
          show(list.indexOf(b));
          dlg.showModal();
          if (lenis) lenis.stop();
          lbClose.focus();
        });
      });
      lbPrev.addEventListener("click", function () { show(idx - 1); });
      lbNext.addEventListener("click", function () { show(idx + 1); });
      lbClose.addEventListener("click", function () { dlg.close(); });
      dlg.addEventListener("click", function (e) {
        if (e.target === dlg || e.target.classList.contains("lb-inner")) dlg.close();
      });
      dlg.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") { e.preventDefault(); show(idx - 1); }
        else if (e.key === "ArrowRight") { e.preventDefault(); show(idx + 1); }
        else if (e.key === "Tab") {
          var f = [lbClose, lbPrev, lbNext];
          var i = f.indexOf(d.activeElement);
          if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
          else if (!e.shiftKey && (i === f.length - 1 || i === -1)) { e.preventDefault(); f[0].focus(); }
        }
      });
      dlg.addEventListener("close", function () {
        if (lenis) lenis.start();
        if (opener) opener.focus();
      });
    }
  }

  /* ---------------------------------------------------------------- THE HALO: motion */
  var halos = $$("[data-halo]");
  var apertures = $$("[data-aperture]");

  function revealAll() {
    if (!motion) return;
    halos.concat(apertures).forEach(function (el) {
      if (el.__revealed) return;
      if (el.__play && el.getBoundingClientRect().top < window.innerHeight * 1.1) el.__play();
    });
  }

  function heroFallback() {
    $$("[data-hero-split]").forEach(function (el) { el.style.opacity = "1"; });
  }

  if (!motion) {
    heroFallback();
    return;
  }

  gsap.registerPlugin(ST);
  if (Split) gsap.registerPlugin(Split);
  if (Draw) gsap.registerPlugin(Draw);

  /* Lazy images inside a closed aperture have no visible area, so the browser never fetches them.
     Promote them to eager loading shortly before they scroll into view. */
  function preload(el) {
    var im = $("img", el);
    if (!im || im.loading !== "lazy") return;
    ST.create({ trigger: el, start: "top bottom+=900", once: true, onEnter: function () { im.loading = "eager"; } });
  }

  /* 1. Halo reveal: circular aperture opens + glowing ring draws itself, like a ring light switching on */
  halos.forEach(function (el) {
    var media = $(".halo-media", el);
    var ring = $(".halo-ring circle", el);
    var dot = $(".halo-dot", el);
    var im = media ? $("img", media) : null;
    if (!media) return;
    if (el.getBoundingClientRect().top < window.innerHeight) {
      /* Already on screen at load (often the LCP image): never hide it, just light the ring. */
      el.__revealed = true;
      if (ring && Draw) gsap.fromTo(ring, { drawSVG: "0%" }, { drawSVG: "100%", duration: 2, ease: "power2.inOut", delay: 0.2 });
      if (dot) gsap.fromTo(dot, { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: "back.out(3)", delay: 1.6 });
      return;
    }
    preload(el);
    gsap.set(media, { clipPath: "circle(0% at 50% 50%)" });
    if (ring && Draw) gsap.set(ring, { drawSVG: "0%" });
    if (dot) gsap.set(dot, { autoAlpha: 0, scale: 0 });
    el.__play = function () {
      if (el.__revealed) return;
      el.__revealed = true;
      var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      if (im) { im.style.transition = "none"; tl.fromTo(im, { scale: 1.28 }, { scale: 1, duration: 1.9, clearProps: "transform", onComplete: function () { im.style.transition = ""; } }, 0); }
      tl.to(media, { clipPath: "circle(50% at 50% 50%)", duration: 1.5, clearProps: "clipPath" }, 0);
      if (ring && Draw) tl.to(ring, { drawSVG: "100%", duration: 1.7, ease: "power2.inOut" }, 0.05);
      if (dot) tl.to(dot, { autoAlpha: 1, scale: 1, duration: 0.7, ease: "back.out(3)" }, 1.15);
    };
    ST.create({ trigger: el, start: "top 90%", once: true, onEnter: el.__play });
  });

  /* 1b. Gallery tiles: the same aperture, opening to fill the square */
  apertures.forEach(function (el, i) {
    var im = $("img", el);
    if (el.getBoundingClientRect().top < window.innerHeight) { el.__revealed = true; return; }
    preload(el);
    gsap.set(el, { clipPath: "circle(0% at 50% 50%)" });
    el.__play = function () {
      if (el.__revealed) return;
      el.__revealed = true;
      var tl = gsap.timeline({ delay: (i % 4) * 0.08, defaults: { ease: "expo.out" } });
      tl.to(el, { clipPath: "circle(75% at 50% 50%)", duration: 1.4, clearProps: "clipPath" }, 0);
      if (im) { im.style.transition = "none"; tl.fromTo(im, { scale: 1.2 }, { scale: 1, duration: 1.7, clearProps: "transform", onComplete: function () { im.style.transition = ""; } }, 0); }
    };
    ST.create({ trigger: el, start: "top 92%", once: true, onEnter: el.__play });
  });

  /* 2. Hero: headline words fade up, ring draws around the photo, big halo turns with scroll */
  var heroLine = $("[data-hero-split]");
  var runHeroSplit = function () {
    if (!heroLine) return;
    if (Split) {
      var s = Split.create(heroLine, { type: "words", wordsClass: "split-word" });
      heroLine.classList.add("is-split");
      heroLine.style.opacity = "1";
      gsap.fromTo(s.words, { yPercent: 55, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.15, ease: "expo.out", stagger: 0.075, delay: 0.05 });
    } else {
      heroLine.style.opacity = "1";
    }
  };
  var fontsReady = d.fonts && d.fonts.ready ? Promise.race([d.fonts.ready, new Promise(function (r) { setTimeout(r, 700); })]) : Promise.resolve();
  fontsReady.then(function () {
    runHeroSplit();
    splitHeadings();
    ST.refresh();
  });

  var heroHalo = $("[data-hero-halo]");
  if (heroHalo) {
    var heroRing = $(".halo-ring circle", heroHalo);
    var heroDot = $(".halo-dot", heroHalo);
    var startHeroRing = function () {
      var tl = gsap.timeline();
      if (heroRing && Draw) tl.fromTo(heroRing, { drawSVG: "0%" }, { drawSVG: "100%", duration: 2.2, ease: "power2.inOut" }, 0);
      if (heroDot) tl.fromTo(heroDot, { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: "back.out(3)" }, 1.6);
      tl.fromTo(".hero-chip", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.15 }, 0.9);
    };
    if (d.readyState === "complete") startHeroRing(); else window.addEventListener("load", startHeroRing, { once: true });
    gsap.to(heroHalo, { yPercent: 7, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  }
  $$("[data-orbit]").forEach(function (orbit) {
    var a = $(".orbit-a", orbit);
    if (a) gsap.to(a, { rotation: 360, duration: 26, ease: "none", repeat: -1 });
    var scope = orbit.closest("section") || orbit.parentNode;
    gsap.fromTo(orbit, { rotation: 0, scale: 1 }, { rotation: 120, scale: 1.2, ease: "none", scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: 0.8 } });
  });
  $$("[data-orbit-slow]").forEach(function (o) {
    gsap.fromTo(o, { rotation: -30, scale: 0.9 }, { rotation: 60, scale: 1.05, ease: "none", scrollTrigger: { trigger: o.parentNode, start: "top bottom", end: "bottom top", scrub: 1 } });
  });

  /* 3. Section headings: words fade up on scroll */
  function splitHeadings() {
    if (!Split) return;
    $$("[data-split]").forEach(function (h) {
      var s = Split.create(h, { type: "words", wordsClass: "split-word" });
      h.classList.add("is-split");
      gsap.set(s.words, { yPercent: 55, opacity: 0 });
      ST.create({
        trigger: h, start: "top 90%", once: true,
        onEnter: function () { gsap.to(s.words, { yPercent: 0, opacity: 1, duration: 1.05, ease: "expo.out", stagger: 0.06 }); }
      });
    });
    $$("[data-split-lines]").forEach(function (q) {
      var p = $("p", q);
      if (!p) return;
      var s = Split.create(p, { type: "lines", linesClass: "split-line" });
      p.classList.add("is-split");
      gsap.set(s.lines, { y: 28, opacity: 0 });
      ST.create({
        trigger: q, start: "top 85%", once: true,
        onEnter: function () { gsap.to(s.lines, { y: 0, opacity: 1, duration: 1.1, ease: "power3.out", stagger: 0.12 }); }
      });
    });
  }

  /* 4. Halo band: the ring-light portfolio drifts sideways as you scroll */
  var band = $("[data-band]");
  var track = $("[data-band-track]");
  if (band && track) {
    band.classList.add("is-scrubbed");
    gsap.to(track, {
      x: function () { return -Math.max(0, track.scrollWidth - band.clientWidth); },
      ease: "none",
      scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true }
    });
  }

  /* 5. Reviews: gentle rise */
  var reviews = $$(".review");
  if (reviews.length) {
    gsap.set(reviews, { y: 30, opacity: 0 });
    ST.batch(reviews, {
      start: "top 92%", once: true,
      onEnter: function (b) { gsap.to(b, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.08 }); }
    });
  }

  window.addEventListener("load", function () { ST.refresh(); });
  reduceMQ.addEventListener && reduceMQ.addEventListener("change", function () { window.location.reload(); });
})();
