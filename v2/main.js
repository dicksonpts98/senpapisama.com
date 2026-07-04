/* ═══════════════════════════════════════════════════════════
   SENPAPI-SAMA · V2 — "Dark Museum" engine
   Same data as v1 (../data/artworks.js) — new presentation.
   ═══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  const $ = s => document.querySelector(s);
  const REDUCE_MOTION = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const FILTERS = CATEGORY_ORDER;
  let activeFilter = "ALL WORKS";

  // ── Scroll progress bar ──────────────────────────────────
  const progress = $("#progress");
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const pct = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = pct + "%";
  }, { passive: true });

  // ── Hero stats ───────────────────────────────────────────
  const usedSeries = new Set(ARTWORKS.map(a => a.series));
  animateNumber($("#meta-works"), ARTWORKS.length, 1400);
  animateNumber($("#meta-series"), usedSeries.size, 1100);

  function animateNumber(el, target, duration) {
    const t0 = performance.now();
    (function tick(now) {
      const p = Math.min((now - t0) / duration, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  // ── Marquee (category names on loop) ─────────────────────
  (function buildMarquee() {
    const names = FILTERS.filter(f => f !== "ALL WORKS");
    const seq = names.map(n =>
      `<span>${n}</span><span class="mq-sep">✦</span>`).join("");
    // duplicated so the -50% translate loops seamlessly
    $("#marquee-track").innerHTML = seq + seq;
  })();

  // ── Filters ──────────────────────────────────────────────
  (function buildFilters() {
    const bar = $("#filters");
    FILTERS.forEach(label => {
      const n = label === "ALL WORKS"
        ? ARTWORKS.length
        : ARTWORKS.filter(a => a.series === label).length;
      const btn = document.createElement("button");
      btn.className = "filter-btn" + (label === activeFilter ? " active" : "");
      btn.innerHTML = `${label}<span class="n">${n}</span>`;
      btn.addEventListener("click", () => {
        activeFilter = label;
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        buildMasonry();
        const y = $("#filters-wrap").getBoundingClientRect().top + window.pageYOffset - $("#nav").offsetHeight + 1;
        if (window.scrollY > y) window.scrollTo({ top: y, behavior: "smooth" });
      });
      bar.appendChild(btn);
    });
  })();

  // ── Masonry gallery — round-robin columns, art uncropped ─
  function colCount() {
    const w = window.innerWidth;
    if (w > 1360) return 4;
    if (w > 980)  return 3;
    return 2;
  }
  let currentCols = colCount();

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.06, rootMargin: "80px" });

  function filteredList() {
    return ARTWORKS
      .map((a, i) => ({ art: a, index: i }))
      .filter(x => activeFilter === "ALL WORKS" || x.art.series === activeFilter);
  }

  function buildMasonry() {
    const wrap = $("#masonry");
    wrap.innerHTML = "";
    const n = colCount();
    currentCols = n;
    const cols = [];
    for (let i = 0; i < n; i++) {
      const c = document.createElement("div");
      c.className = "m-col";
      wrap.appendChild(c);
      cols.push(c);
    }

    filteredList().forEach((x, i) => {
      const fig = document.createElement("figure");
      fig.className = "piece";
      fig.innerHTML = `
        <div class="piece-frame">
          <img class="piece-img loading"
               src="/images/${encodeURIComponent(x.art.file)}"
               alt="${x.art.title.replace(/"/g, "&quot;")}"
               loading="lazy" decoding="async">
        </div>
        <figcaption class="piece-cap">
          <span class="piece-title">${x.art.title}</span>
          <span class="piece-series">${x.art.series}</span>
        </figcaption>
      `;
      const img = fig.querySelector("img");
      img.addEventListener("load", () => img.classList.remove("loading"));
      fig.addEventListener("click", () => openLightbox(i));
      cols[i % n].appendChild(fig);      // round-robin keeps newest on the top row
      revealObserver.observe(fig);
    });
  }
  buildMasonry();

  // Rebuild only when the column count actually changes
  let resizeT;
  window.addEventListener("resize", () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      if (colCount() !== currentCols) buildMasonry();
    }, 180);
  });

  // ── Table Display ────────────────────────────────────────
  (function buildBooth() {
    const grid = $("#booth-grid");
    (typeof BOOTH_PHOTOS !== "undefined" ? BOOTH_PHOTOS : []).forEach(photo => {
      const item = document.createElement("div");
      item.className = "booth-item";
      item.innerHTML = `
        <img src="/images/booth/${encodeURIComponent(photo.file)}"
             alt="${photo.alt || ""}" loading="lazy" decoding="async">
      `;
      item.addEventListener("click", () => openBoothLightbox(photo));
      grid.appendChild(item);
      revealObserver.observe(item);
    });
  })();

  // ── Section switching (same sections as v1) ──────────────
  const gallerySection = $("#gallery-section");
  const filtersWrap = $("#filters-wrap");
  const boothSection = $("#booth-section");
  const aboutPanel = $("#about-panel");

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      const target = link.dataset.section;

      if (target === "about") {
        openAbout();
        return;
      }

      document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      let scrollTarget = null;
      if (target === "gallery") {
        gallerySection.hidden = false;
        filtersWrap.hidden = false;
        boothSection.hidden = true;
        scrollTarget = filtersWrap;
      } else {
        gallerySection.hidden = true;
        filtersWrap.hidden = true;
        boothSection.hidden = false;
        scrollTarget = boothSection;
      }
      const navH = $("#nav").offsetHeight;
      const y = scrollTarget.getBoundingClientRect().top + window.pageYOffset - navH - 2;
      window.scrollTo({ top: Math.max(y, 0), behavior: "smooth" });
    });
  });

  $("#nav-home").addEventListener("click", e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ── About panel ──────────────────────────────────────────
  function openAbout() {
    aboutPanel.classList.add("open");
    aboutPanel.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeAbout() {
    aboutPanel.classList.remove("open");
    aboutPanel.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  $("#about-close").addEventListener("click", closeAbout);
  $("#about-backdrop").addEventListener("click", closeAbout);

  $(".about-name").textContent = SITE_CONFIG.artistName;
  $(".about-tagline").textContent = SITE_CONFIG.tagline + " — AKA WUSENSEI";
  $(".about-bio").textContent = SITE_CONFIG.aboutText;

  (function buildSocials() {
    const box = $("#about-links");
    const labels = { instagram: "Instagram", email: "Email", pixiv: "Pixiv", artstation: "ArtStation", youtube: "YouTube" };
    Object.entries(SITE_CONFIG.socials || {}).forEach(([key, url]) => {
      if (!url) return;
      const a = document.createElement("a");
      a.className = "about-link";
      a.textContent = labels[key] || key;
      a.href = key === "email" ? `mailto:${url}` : url;
      if (key !== "email") { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      box.appendChild(a);
    });
  })();

  // ── Lightbox ─────────────────────────────────────────────
  let lbList = [];      // current filtered list (objects with .art)
  let lbIndex = 0;

  const lightbox = $("#lightbox");
  const lbImage = $("#lb-image");
  const lbPrev = $("#lb-prev");
  const lbNext = $("#lb-next");

  function openLightbox(i) {
    lbList = filteredList();
    lbIndex = i;
    lbPrev.style.display = "";
    lbNext.style.display = "";
    showLb();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function openBoothLightbox(photo) {
    lbList = [];
    lbPrev.style.display = "none";
    lbNext.style.display = "none";
    lbImage.src = `/images/booth/${encodeURIComponent(photo.file)}`;
    lbImage.alt = photo.alt || "";
    restartLbAnim();
    $(".lb-series").textContent = "Table Display";
    $(".lb-title").textContent = photo.alt || "";
    $(".lb-count").textContent = "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function restartLbAnim() {
    lbImage.style.animation = "none";
    void lbImage.offsetHeight;
    lbImage.style.animation = "";
  }

  function showLb() {
    const art = lbList[lbIndex].art;
    lbImage.src = `/images/${encodeURIComponent(art.file)}`;
    lbImage.alt = art.title;
    restartLbAnim();
    $(".lb-series").textContent = art.series;
    $(".lb-title").textContent = art.title;
    $(".lb-count").textContent = `${lbIndex + 1} / ${lbList.length}`;
    // preload neighbours for instant arrows
    [lbIndex - 1, lbIndex + 1].forEach(k => {
      const item = lbList[(k + lbList.length) % lbList.length];
      if (item) { const p = new Image(); p.src = `/images/${encodeURIComponent(item.art.file)}`; }
    });
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function lbStep(dir) {
    if (!lbList.length) return;
    lbIndex = (lbIndex + dir + lbList.length) % lbList.length;
    showLb();
  }

  $("#lb-close").addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", () => lbStep(-1));
  lbNext.addEventListener("click", () => lbStep(1));
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });

  // ── Keyboard ─────────────────────────────────────────────
  document.addEventListener("keydown", e => {
    if (lightbox.classList.contains("open")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lbStep(-1);
      if (e.key === "ArrowRight") lbStep(1);
      return;
    }
    if (e.key === "Escape" && aboutPanel.classList.contains("open")) closeAbout();
  });
})();
