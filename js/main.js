/* ═══════════════════════════════════════════════════════════
   SENPAPI-SAMA — Portfolio Engine
   ═══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  // Filter bar uses the explicit CATEGORY_ORDER from artworks.js
  const FILTERS = CATEGORY_ORDER;
  const SERIES = FILTERS.filter(f => f !== "ALL WORKS");

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
  function updateClocks() {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour12: false });
    const el1 = document.getElementById("hud-clock");
    const el2 = document.querySelector(".nav-clock");
    if (el1) el1.textContent = time;
    if (el2) el2.textContent = time;
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


  // ── 3D MOUSE TILT on cards + scroll parallax ─────────────
  function setup3DScrollEffects() {
    const cards = document.querySelectorAll(".art-card, .booth-card");
    cards.forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width - 0.5;
        const cy = (e.clientY - r.top) / r.height - 0.5;
        const rx = (-cy * 8).toFixed(2);
        const ry = (cx * 10).toFixed(2);
        card.style.transform =
          `translateY(-10px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });

    // Hero parallax on scroll
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
        document.getElementById("gallery-section").scrollIntoView({ behavior: "smooth", block: "start" });
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
