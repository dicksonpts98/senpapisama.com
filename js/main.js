/* ═══════════════════════════════════════════════════════════
   SENPAPI-SAMA — Portfolio Engine
   ═══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  // Filter bar uses the explicit CATEGORY_ORDER from artworks.js
  const FILTERS = CATEGORY_ORDER;
  const SERIES = FILTERS.filter(f => f !== "ALL WORKS");

  // ── MOUSE GLITTER TRAIL ──────────────────────────────────
  (function initGlitter() {
    const gc = document.getElementById("glitter-canvas");
    if (!gc) return;
    const gctx = gc.getContext("2d");

    function resize() {
      gc.width = window.innerWidth * devicePixelRatio;
      gc.height = window.innerHeight * devicePixelRatio;
      gctx.scale(devicePixelRatio, devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", () => {
      gc.width = window.innerWidth * devicePixelRatio;
      gc.height = window.innerHeight * devicePixelRatio;
      gctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    });

    const sparks = [];
    const PALETTE = [
      "rgba(255, 255, 255, ",   // white
      "rgba(255, 245, 200, ",   // soft gold
      "rgba(200, 255, 230, ",   // mint
      "rgba(220, 220, 255, "    // pale violet
    ];

    let lastSpawn = 0;
    window.addEventListener("pointermove", (e) => {
      const now = performance.now();
      if (now - lastSpawn < 12) return; // throttle spawn rate
      lastSpawn = now;

      // Spawn 1–2 sparks per move
      const count = 1 + (Math.random() < 0.3 ? 1 : 0);
      for (let i = 0; i < count; i++) {
        sparks.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.3) * 0.6 - 0.2, // slight upward drift
          size: Math.random() * 2.2 + 0.8,
          life: 1.0,
          decay: Math.random() * 0.015 + 0.012,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.1
        });
      }
      if (sparks.length > 180) sparks.splice(0, sparks.length - 180);
    }, { passive: true });

    function drawStar(x, y, size, alpha, color, rot) {
      gctx.save();
      gctx.translate(x, y);
      gctx.rotate(rot);
      // 4-point star / sparkle shape
      gctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const sx = Math.cos(angle) * size;
        const sy = Math.sin(angle) * size;
        const sx2 = Math.cos(angle + Math.PI / 4) * size * 0.35;
        const sy2 = Math.sin(angle + Math.PI / 4) * size * 0.35;
        if (i === 0) gctx.moveTo(sx, sy);
        else gctx.lineTo(sx, sy);
        gctx.lineTo(sx2, sy2);
      }
      gctx.closePath();
      gctx.fillStyle = color + alpha + ")";
      gctx.shadowBlur = size * 3;
      gctx.shadowColor = color + (alpha * 0.8) + ")";
      gctx.fill();
      gctx.restore();
    }

    function tick() {
      gctx.clearRect(0, 0, gc.width, gc.height);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.008;   // tiny gravity
        s.rot += s.rotSpeed;
        s.life -= s.decay;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        drawStar(s.x, s.y, s.size, s.life, s.color, s.rot);
      }
      requestAnimationFrame(tick);
    }
    tick();

    // Disable on touch devices (distracting, battery drain)
    window.addEventListener("touchstart", () => {
      gc.style.display = "none";
    }, { once: true, passive: true });
  })();


  // ── KEYBOARD CLICK SOUND (Web Audio, synthesized) ────────
  const SOUND = (function () {
    let ctx = null;
    let lastPlay = 0;

    function ensure() {
      if (ctx) return ctx;
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { return null; }
      return ctx;
    }

    // Wakes the AudioContext if browser suspended it. Must be called
    // from inside a user-gesture handler or the resume is ignored.
    function wake(c) {
      if (c && c.state === "suspended" && typeof c.resume === "function") {
        try { c.resume(); } catch (e) {}
      }
    }

    // ── HOVER SOUND: light keyboard tick ──
    function playHover() {
      const c = ensure();
      if (!c) return;
      wake(c);
      if (c.state !== "running") return;
      const now = c.currentTime;

      // High-frequency tick — keytop snap
      const o1 = c.createOscillator();
      const g1 = c.createGain();
      o1.type = "square";
      o1.frequency.setValueAtTime(2400, now);
      o1.frequency.exponentialRampToValueAtTime(900, now + 0.02);
      g1.gain.setValueAtTime(0.055, now);
      g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
      o1.connect(g1).connect(c.destination);
      o1.start(now); o1.stop(now + 0.05);

      // Low thock — key-bottom landing
      const o2 = c.createOscillator();
      const g2 = c.createGain();
      o2.type = "triangle";
      o2.frequency.setValueAtTime(180, now + 0.005);
      o2.frequency.exponentialRampToValueAtTime(60, now + 0.06);
      g2.gain.setValueAtTime(0.035, now + 0.005);
      g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      o2.connect(g2).connect(c.destination);
      o2.start(now + 0.005); o2.stop(now + 0.1);
    }

    // ── CLICK SOUND: heavier mechanical "clack" — noise burst + punchy tone ──
    function playClick() {
      const c = ensure();
      if (!c) return;
      wake(c);
      // If first-ever gesture: schedule the sound once context resumes.
      if (c.state !== "running") {
        const tryPlay = () => {
          if (c.state === "running") { actuallyPlayClick(c); }
          else { setTimeout(tryPlay, 30); }
        };
        setTimeout(tryPlay, 30);
        return;
      }
      actuallyPlayClick(c);
    }

    function actuallyPlayClick(c) {
      const now = c.currentTime;

      // Short white-noise burst filtered for a "snap"
      const bufSize = Math.floor(c.sampleRate * 0.05);
      const buf = c.createBuffer(1, bufSize, c.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
      }
      const src = c.createBufferSource();
      src.buffer = buf;
      const bp = c.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 2800;
      bp.Q.value = 2;
      const ng = c.createGain();
      ng.gain.setValueAtTime(0.06, now);
      ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      src.connect(bp).connect(ng).connect(c.destination);
      src.start(now); src.stop(now + 0.06);

      // Punchy low tone — switch closing / key bottoming-out
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(260, now);
      o.frequency.exponentialRampToValueAtTime(70, now + 0.1);
      g.gain.setValueAtTime(0.035, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      o.connect(g).connect(c.destination);
      o.start(now); o.stop(now + 0.14);
    }

    function throttledHover() {
      const t = performance.now();
      if (t - lastPlay < 40) return;
      lastPlay = t;
      playHover();
    }

    function attachToSelector(sel) {
      document.querySelectorAll(sel).forEach(el => {
        el.addEventListener("mouseenter", throttledHover);
        el.addEventListener("click", playClick);
      });
    }

    // Unlock audio context on first user gesture
    function unlock() {
      const c = ensure();
      if (c && c.state === "suspended") c.resume();
    }
    document.addEventListener("click",    unlock, { once: true });
    document.addEventListener("keydown",  unlock, { once: true });
    document.addEventListener("touchend", unlock, { once: true });

    return { attachToSelector, play: throttledHover, playClick };
  })();

  // ── PARTICLE SYSTEM ──────────────────────────────────────
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let mouse = { x: -1000, y: -1000 };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.6 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = (Math.random() - 0.5) * 0.35;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.color = Math.random() > 0.85 ? "#b8bfc2" : "#4fb87a";
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        const force = (140 - dist) / 140;
        this.x += (dx / dist) * force * 1.8;
        this.y += (dy / dist) * force * 1.8;
      }
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function initParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 9500), 160);
    particles = [];
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }
  initParticles();

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "#4fb87a";
          ctx.globalAlpha = (1 - dist / 130) * 0.12;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  let animatingLogin = true;
  function animateParticles() {
    if (!animatingLogin) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  document.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });


  // ── CLOCK ────────────────────────────────────────────────
  // Uses the VISITOR's local browser timezone (not a hard-coded one).
  // Each viewer sees their own time + their own zone abbreviation.
  function updateClocks() {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour12: false });
    // Extract the visitor's timezone abbreviation (e.g. "PDT", "BST", "JST")
    let tzAbbr = "";
    try {
      const parts = new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        timeZoneName: "short"
      }).formatToParts(now);
      const tzPart = parts.find(p => p.type === "timeZoneName");
      if (tzPart) tzAbbr = " " + tzPart.value;
    } catch (e) { /* older browsers */ }

    const display = time + tzAbbr;
    const el1 = document.getElementById("hud-clock");
    const el2 = document.querySelector(".nav-clock");
    if (el1) el1.textContent = display;
    if (el2) el2.textContent = display;
  }
  updateClocks();
  setInterval(updateClocks, 1000);


  // ── TYPEWRITER ───────────────────────────────────────────
  function typewriter(el, text, speed = 60) {
    let i = 0;
    el.textContent = "";
    return new Promise(resolve => {
      const interval = setInterval(() => {
        el.textContent += text[i];
        i++;
        if (i >= text.length) { clearInterval(interval); resolve(); }
      }, speed);
    });
  }


  // ── LOGIN SCREEN BOOT ────────────────────────────────────
  const loginScreen = document.getElementById("login-screen");
  const enterBtn = document.getElementById("enter-btn");
  const portfolio = document.getElementById("portfolio");
  const subtitle = document.querySelector(".login-subtitle");
  const countEl = document.getElementById("artwork-count");
  const loadingFill = document.querySelector(".hud-loading-fill");

  countEl.textContent = `${ARTWORKS.length} WORKS LOADED`;
  setTimeout(() => typewriter(subtitle, SITE_CONFIG.tagline, 70), 600);
  setTimeout(() => { loadingFill.style.width = "100%"; }, 300);

  function enterPortfolio() {
    loginScreen.classList.add("exiting");
    setTimeout(() => {
      loginScreen.classList.add("gone");
      portfolio.classList.remove("hidden");
      animatingLogin = false;
      initPortfolio();
    }, 900);
  }

  enterBtn.addEventListener("click", enterPortfolio);
  enterBtn.addEventListener("click", SOUND.playClick);
  enterBtn.addEventListener("mouseenter", SOUND.play);
  document.addEventListener("keydown", e => {
    if (e.key === "Enter" && !loginScreen.classList.contains("gone")) {
      enterPortfolio();
    }
  });


  // ── PORTFOLIO INIT ───────────────────────────────────────
  function initPortfolio() {
    buildFilters();
    buildGallery();
    buildBooth();
    setupHero();
    setupAbout();
    setupNavSections();
    animateStats();
    setup3DScrollEffects();
  }


  // ── SCROLL PARALLAX ──────────────────────────────────────
  function setup3DScrollEffects() {
    const heroBg = document.querySelector(".hero-bg");
    const heroContent = document.querySelector(".hero-content");
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (heroBg)      heroBg.style.transform      = `translateY(${y * 0.35}px) scale(1.05)`;
        if (heroContent) heroContent.style.transform = `translateY(${y * 0.18}px)`;
        ticking = false;
      });
    }, { passive: true });

    // Attach key-click sound to all portfolio buttons now that they exist
    SOUND.attachToSelector([
      ".nav-link",
      ".filter-btn",
      ".nav-brand",
      ".lb-close",
      ".lb-prev",
      ".lb-next",
      ".about-close",
      ".social-link"
    ].join(","));
  }


  // ── TABLE DISPLAY (booth photos) ─────────────────────────
  function buildBooth() {
    const grid = document.getElementById("booth-grid");
    if (!grid || typeof BOOTH_PHOTOS === "undefined") return;
    grid.innerHTML = "";

    BOOTH_PHOTOS.forEach((photo) => {
      const card = document.createElement("div");
      card.className = "booth-card";
      card.innerHTML = `
        <div class="booth-card-img-wrap">
          <img class="booth-card-img"
               src="images/booth/${encodeURIComponent(photo.file)}"
               alt="${photo.alt || ""}"
               loading="lazy"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="booth-missing" style="display:none;">
            Drop <strong style="margin:0 4px;">${photo.file}</strong> into<br>
            <code style="color: var(--green);">/site/images/booth/</code>
          </div>
        </div>
      `;
      card.addEventListener("click", () => openBoothLightbox(photo));
      grid.appendChild(card);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("visible"), Math.random() * 160);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".booth-card").forEach(c => observer.observe(c));
  }

  function openBoothLightbox(photo) {
    const lb = document.getElementById("lightbox");
    const img = document.getElementById("lb-image");
    img.src = `images/booth/${encodeURIComponent(photo.file)}`;
    img.alt = photo.alt || "";
    img.style.animation = "none";
    img.offsetHeight;
    img.style.animation = "";

    document.querySelector(".lb-category").textContent = "TABLE DISPLAY";
    document.querySelector(".lb-title").textContent = photo.alt || "";
    document.querySelector(".lb-description").textContent = "";
    document.querySelector(".lb-tags").innerHTML = "";
    document.querySelector(".lb-counter").textContent = "";

    lb.classList.add("active");
    document.body.style.overflow = "hidden";
  }


  // ── SECTION SWITCHING (Gallery ↔ Table Display) ──────────
  function setupNavSections() {
    const gallerySection = document.getElementById("gallery-section");
    const filterSection = document.getElementById("filter-section");
    const boothSection = document.getElementById("booth-section");
    const aboutOverlay = document.getElementById("about-overlay");

    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        const target = link.dataset.section;

        if (target === "about") {
          aboutOverlay.classList.add("active");
          document.body.style.overflow = "hidden";
          return;
        }

        // Switch active state between gallery and table
        document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        if (target === "gallery") {
          gallerySection.hidden = false;
          filterSection.hidden = false;
          boothSection.hidden = true;
        } else if (target === "table") {
          gallerySection.hidden = true;
          filterSection.hidden = true;
          boothSection.hidden = false;
        }

        // Scroll past hero so the switched content is visible
        window.scrollTo({
          top: window.innerHeight * 0.9,
          behavior: "smooth"
        });
      });
    });
  }


  // ── HERO ─────────────────────────────────────────────────
  function setupHero() {
    const heroBg = document.querySelector(".hero-bg");
    const featured = ARTWORKS.slice(0, 8);
    if (featured.length > 0) {
      let idx = 0;
      function setHeroBg() {
        heroBg.style.backgroundImage = `url('images/${encodeURIComponent(featured[idx].file)}')`;
        idx = (idx + 1) % featured.length;
      }
      setHeroBg();
      setInterval(setHeroBg, 5500);
    }
  }


  // ── STATS COUNTER ────────────────────────────────────────
  function animateStats() {
    const worksEl = document.getElementById("stat-works");
    const catEl = document.getElementById("stat-categories");
    // Count unique series the user actually has work in
    const usedSeries = new Set(ARTWORKS.map(a => a.series));
    animateNumber(worksEl, ARTWORKS.length, 1500);
    animateNumber(catEl, usedSeries.size, 1200);
  }

  function animateNumber(el, target, duration) {
    const startTime = performance.now();
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }


  // ── FILTERS ──────────────────────────────────────────────
  let activeFilter = "ALL WORKS";

  function buildFilters() {
    const bar = document.getElementById("filter-bar");
    bar.innerHTML = "";
    FILTERS.forEach(label => {
      const btn = document.createElement("button");
      btn.className = "filter-btn" + (label === activeFilter ? " active" : "");
      btn.textContent = label.toUpperCase();
      btn.addEventListener("click", () => {
        activeFilter = label;
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        applyFilter();
        // Scroll so the filter bar sits right under the fixed nav and the
        // first row of the filtered gallery is fully visible (not cropped).
        const filterSection = document.getElementById("filter-section");
        const nav = document.querySelector(".nav");
        const navH = nav ? nav.offsetHeight : 68;
        const targetY =
          filterSection.getBoundingClientRect().top + window.pageYOffset - navH - 4;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      });
      bar.appendChild(btn);
    });
  }

  function applyFilter() {
    const cards = document.querySelectorAll(".art-card");
    cards.forEach((card, i) => {
      const artwork = ARTWORKS[card.dataset.index];
      const show =
        activeFilter === "ALL WORKS" ||
        artwork.series === activeFilter;

      if (show) {
        card.style.display = "";
        card.classList.remove("visible");
        setTimeout(() => card.classList.add("visible"), i * 30);
      } else {
        card.style.display = "none";
        card.classList.remove("visible");
      }
    });
  }


  // ── GALLERY ──────────────────────────────────────────────
  function buildGallery() {
    const grid = document.getElementById("gallery-grid");
    grid.innerHTML = "";

    ARTWORKS.forEach((art, i) => {
      const card = document.createElement("div");
      card.className = "art-card" + (art.layout === "wide" ? " art-card-wide" : "");
      card.dataset.index = i;
      card.innerHTML = `
        <div class="art-card-img-wrap">
          <img class="art-card-img art-card-skeleton"
               data-src="images/${encodeURIComponent(art.file)}"
               alt="${art.title}"
               loading="lazy">
          <div class="art-card-overlay"></div>
          <div class="art-card-info">
            <div class="art-card-category">${art.series}</div>
            <div class="art-card-title">${art.title}</div>
          </div>
        </div>
      `;
      card.addEventListener("click", () => openLightbox(i));
      grid.appendChild(card);
    });

    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => img.classList.remove("art-card-skeleton");
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: "300px" });

    document.querySelectorAll(".art-card-img[data-src]").forEach(img => imgObserver.observe(img));

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("visible"), Math.random() * 180);
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".art-card").forEach(card => cardObserver.observe(card));
  }


  // ── LIGHTBOX ─────────────────────────────────────────────
  let currentLbIndex = 0;
  let filteredIndices = [];

  function getFilteredIndices() {
    if (activeFilter === "ALL WORKS") return ARTWORKS.map((_, i) => i);
    return ARTWORKS.map((a, i) => a.series === activeFilter ? i : -1).filter(i => i >= 0);
  }

  function openLightbox(index) {
    filteredIndices = getFilteredIndices();
    currentLbIndex = filteredIndices.indexOf(index);
    if (currentLbIndex === -1) currentLbIndex = 0;
    showLightboxItem();
    document.getElementById("lightbox").classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function showLightboxItem() {
    const realIndex = filteredIndices[currentLbIndex];
    const art = ARTWORKS[realIndex];
    const img = document.getElementById("lb-image");
    img.src = `images/${encodeURIComponent(art.file)}`;
    img.alt = art.title;
    img.style.animation = "none";
    img.offsetHeight;
    img.style.animation = "";

    document.querySelector(".lb-category").textContent = art.series;
    document.querySelector(".lb-title").textContent = art.title;
    document.querySelector(".lb-description").textContent = "";
    document.querySelector(".lb-counter").textContent = `${currentLbIndex + 1} / ${filteredIndices.length}`;

    const tagsEl = document.querySelector(".lb-tags");
    tagsEl.innerHTML = (art.tags || []).map(t => `<span class="lb-tag">${t}</span>`).join("");
  }

  function closeLightbox() {
    document.getElementById("lightbox").classList.remove("active");
    document.body.style.overflow = "";
  }

  document.getElementById("lb-close").addEventListener("click", closeLightbox);
  document.getElementById("lb-prev").addEventListener("click", () => {
    currentLbIndex = (currentLbIndex - 1 + filteredIndices.length) % filteredIndices.length;
    showLightboxItem();
  });
  document.getElementById("lb-next").addEventListener("click", () => {
    currentLbIndex = (currentLbIndex + 1) % filteredIndices.length;
    showLightboxItem();
  });

  document.addEventListener("keydown", e => {
    if (!document.getElementById("lightbox").classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") {
      currentLbIndex = (currentLbIndex - 1 + filteredIndices.length) % filteredIndices.length;
      showLightboxItem();
    }
    if (e.key === "ArrowRight") {
      currentLbIndex = (currentLbIndex + 1) % filteredIndices.length;
      showLightboxItem();
    }
  });

  document.getElementById("lightbox").addEventListener("click", e => {
    if (e.target.id === "lightbox") closeLightbox();
  });


  // ── ABOUT MODAL ──────────────────────────────────────────
  function setupAbout() {
    const overlay = document.getElementById("about-overlay");
    const closeBtn = document.getElementById("about-close");

    document.querySelector(".about-name").textContent = SITE_CONFIG.artistName;
    document.querySelector(".about-tagline").textContent = SITE_CONFIG.tagline;
    document.querySelector(".about-bio").textContent = SITE_CONFIG.aboutText;

    const socialsEl = document.getElementById("about-socials");
    socialsEl.innerHTML = "";
    const labels = { instagram: "INSTAGRAM", email: "EMAIL", pixiv: "PIXIV", artstation: "ARTSTATION", youtube: "YOUTUBE" };
    Object.entries(SITE_CONFIG.socials || {}).forEach(([key, url]) => {
      if (!url) return;
      const a = document.createElement("a");
      a.className = "about-social-link";
      a.textContent = labels[key] || key.toUpperCase();
      a.href = key === "email" ? `mailto:${url}` : url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      socialsEl.appendChild(a);
    });

    closeBtn.addEventListener("click", () => {
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    });

    overlay.addEventListener("click", e => {
      if (e.target === overlay) {
        overlay.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  document.getElementById("nav-home").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  // ── SCROLL EFFECTS (nav stays sticky — no auto-hide) ─────
  window.addEventListener("scroll", () => {
    const hero = document.querySelector(".hero-bg");
    if (hero) hero.style.transform = `scale(1.1) translateY(${window.scrollY * 0.3}px)`;
  }, { passive: true });
})();
