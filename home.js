/* SENPAPI-SAMA gallery homepage — reads data/artworks.js + data/gallery-meta.js */
(function () {
  'use strict';

  var META = window.GALLERY_META || (typeof GALLERY_META !== 'undefined' ? GALLERY_META : {});
  var ART = typeof ARTWORKS !== 'undefined' ? ARTWORKS : [];
  var BOOTH = typeof BOOTH_PHOTOS !== 'undefined' ? BOOTH_PHOTOS : [];
  var CONFIG = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG : {};

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var phoneMQ = window.matchMedia('(max-width: 760px)');
  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var isPhone = function () { return phoneMQ.matches; };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pad2(n) { return String(n).padStart(2, '0'); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function imgSrc(file) { return '/images/' + encodeURIComponent(file); }

  // ── data ───────────────────────────────────────────────────
  var seriesToRoom = META.seriesToRoom || {};
  var metaPieces = META.pieces || {};
  var moods = META.moods || [];
  var roomDefs = (META.rooms || []).slice();

  var PIECES = ART.map(function (a, i) {
    var m = metaPieces[a.file] || {};
    var room = seriesToRoom[a.series] || slug(a.series);
    return {
      id: a.file, file: a.file, idx: i,
      title: m.title || a.title,
      fr: m.fr || a.series,
      room: room,
      mood: m.mood || 'day',
      tint: m.tint || '#9A968E',
      land: !!m.land,
      src: imgSrc(a.file)
    };
  });
  var byId = {};
  PIECES.forEach(function (p) { byId[p.id] = p; });

  // rooms: configured order first, then any new series found in artworks.js
  var seen = {};
  roomDefs.forEach(function (r) { seen[r.id] = true; });
  PIECES.forEach(function (p) {
    if (!seen[p.room]) { seen[p.room] = true; roomDefs.push({ id: p.room, name: ART[p.idx].series }); }
  });
  var ROOMS = roomDefs.map(function (r) {
    var list = PIECES.filter(function (p) { return p.room === r.id; });
    var cover = (r.cover && byId[r.cover]) || list[0];
    return { id: r.id, name: r.name, count: list.length, cover: cover ? cover.src : '' };
  }).filter(function (r) { return r.count > 0; });
  function roomName(id) { for (var i = 0; i < ROOMS.length; i++) if (ROOMS[i].id === id) return ROOMS[i].name; return id; }
  function moodOf(id) { for (var i = 0; i < moods.length; i++) if (moods[i].id === id) return moods[i]; return { id: id, name: id, tint: '#888' }; }

  // curated shuffle: random order, never two neighbours from the same room
  function rng(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function curate(list, seed) {
    var r = rng(seed), a = list.slice(), out = [];
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    while (a.length) {
      var prev = out[out.length - 1];
      var k = a.findIndex(function (p) { return !prev || p.room !== prev.room; });
      if (k < 0) k = 0;
      out.push(a.splice(k, 1)[0]);
    }
    return out;
  }
  // wall order: newest drops first (META.drops, newest first), then the archive.
  // Art added on top of artworks.js without a drops entry still leads, as "Just added".
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function monthOf(ym) { var m = /^(\d{4})-(\d{2})/.exec(ym || ''); return m && MONTHS[+m[2] - 1] ? { y: m[1], m: MONTHS[+m[2] - 1] } : null; }
  var inDrop = {}, rawDrops = META.drops || [];
  var DROPS = rawDrops.map(function (d, i) {
    var ps = [];
    (d.files || []).forEach(function (f) { var p = byId[f]; if (p && !inDrop[p.id]) { inDrop[p.id] = true; ps.push(p); } });
    return { key: 'd' + i, no: rawDrops.length - i, when: monthOf(d.added), name: d.name || '', pieces: ps };
  }).filter(function (d) { return d.pieces.length; });
  if (DROPS.length) {
    var firstDropped = Math.min.apply(null, PIECES.filter(function (p) { return inDrop[p.id]; }).map(function (p) { return p.idx; }));
    var fresh = PIECES.filter(function (p) { return !inDrop[p.id] && p.idx < firstDropped; });
    if (fresh.length) {
      fresh.forEach(function (p) { inDrop[p.id] = true; });
      DROPS.unshift({ key: 'new', no: rawDrops.length + 1, when: null, name: '', pieces: fresh });
    }
  }
  var archMeta = META.archive || {};
  var ARCHIVE = { key: 'archive', archive: true, when: monthOf(archMeta.added), name: archMeta.name || '', pieces: [] };
  var archBase = PIECES.filter(function (p) { return !inDrop[p.id]; });
  var opening = (META.opening || []).map(function (f) { return byId[f]; }).filter(function (p) { return p && !inDrop[p.id]; });
  function archiveOrder(seed) {
    return seed ? curate(archBase, seed) : opening.concat(curate(archBase.filter(function (p) { return opening.indexOf(p) < 0; }), 11));
  }
  var ORDER = [].concat.apply([], DROPS.map(function (d) { return d.pieces; })).concat(archiveOrder(0));

  var COLLECTIONS = (META.newCollections || []).map(function (c) {
    var ps = (c.files || []).map(function (f) { return byId[f]; }).filter(Boolean);
    return { name: c.name, sub: c.sub || '', room: c.room, pieces: ps };
  }).filter(function (c) { return c.pieces.length; });

  // ── state ──────────────────────────────────────────────────
  var S = { slide: 0, paused: false, hover: false, offscreen: false, roomsMode: 'series', filter: { kind: 'all' }, seed: 0, more: 0, lb: null };

  // ── header stats + static bits ─────────────────────────────
  $('#stat-works').textContent = PIECES.length;
  $('#stat-rooms').textContent = ROOMS.length;
  $('#stat-moods').textContent = moods.length;
  if (CONFIG.aboutText) $('#bio').textContent = CONFIG.aboutText.replace(/\.\.\./g, '…');
  if (CONFIG.socials) {
    if (CONFIG.socials.instagram) { $('#ig').href = CONFIG.socials.instagram; $('#ig-follow').href = CONFIG.socials.instagram; }
    if (CONFIG.socials.email) $('#mail').href = 'mailto:' + CONFIG.socials.email;
  }

  // ── hero: latest collections ───────────────────────────────
  var hero = $('#top');
  var hangbox = $('#hangbox'), placard = $('#placard'), segsEl = $('#segs'), peeksEl = $('#peeks');
  var DUR = 6;

  function buildHero() {
    if (!COLLECTIONS.length) { hero.hidden = true; return; }
    hangbox.innerHTML = COLLECTIONS.map(function (c, i) {
      var n = c.pieces.length, layout = n === 1 ? 'n1' : (n === 2 ? 'n2' : 'n4');
      return '<div class="cslide" data-i="' + i + '"><div class="hang ' + layout + '">' +
        c.pieces.map(function (p, k) {
          return '<button type="button" class="hframe' + (k % 2 === 1 ? ' off' : '') + '" data-c="' + i + '" data-id="' + esc(p.id) + '" aria-label="View ' + esc(p.title) + ', ' + esc(p.fr) + '">' +
            '<img src="' + esc(p.src) + '" alt="" ' + (i === 0 ? 'fetchpriority="high"' : 'loading="lazy"') + '></button>';
        }).join('') + '</div></div>';
    }).join('');
    placard.innerHTML = COLLECTIONS.map(function (c, i) {
      var n = c.pieces.length;
      return '<div class="ptext" data-i="' + i + '">' +
        '<span class="p-kicker">New collection · ' + pad2(i + 1) + '</span>' +
        '<span class="disp p-name">' + esc(c.name) + '</span>' +
        '<span class="p-sub">' + esc(c.sub) + '</span>' +
        '<span class="p-foot"><span>' + n + (n === 1 ? ' piece' : ' pieces') + '</span><a href="#wall" class="plink" data-room="' + esc(c.room) + '">Enter the room →</a></span></div>';
    }).join('');
    segsEl.innerHTML = COLLECTIONS.map(function (c, i) {
      return '<button type="button" class="seg" data-i="' + i + '" aria-label="Show ' + esc(c.name) + '"><span class="seg-track"><span class="seg-fill"></span></span></button>';
    }).join('');
    segsEl.style.setProperty('--dur', DUR + 's');
    segsEl.addEventListener('click', function (e) { var b = e.target.closest('.seg'); if (b) go(+b.dataset.i); });
    segsEl.addEventListener('animationend', function (e) { if (e.target.closest('.seg.on')) go(S.slide + 1); });
    hangbox.addEventListener('click', function (e) {
      var b = e.target.closest('.hframe'); if (!b) return;
      var c = COLLECTIONS[+b.dataset.c];
      openLb(c.pieces.map(function (p) { return p.id; }), b.dataset.id, b);
    });
    placard.addEventListener('click', function (e) {
      var a = e.target.closest('.plink'); if (!a) return;
      setFilter({ kind: 'room', id: a.dataset.room });
    });
    peeksEl.addEventListener('click', function (e) { var b = e.target.closest('.peek'); if (b) go(+b.dataset.i); });
    $('#hc-prev').addEventListener('click', function () { go(S.slide - 1); });
    $('#hc-next').addEventListener('click', function () { go(S.slide + 1); });
    $('#hc-play').addEventListener('click', function () { S.paused = !S.paused; updateHero(); });
    var stage = $('#stage');
    stage.addEventListener('mouseenter', function () { S.hover = true; updatePause(); });
    stage.addEventListener('mouseleave', function () { S.hover = false; updatePause(); });
    stage.addEventListener('focusin', function () { S.hover = true; updatePause(); });
    stage.addEventListener('focusout', function () { S.hover = false; updatePause(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { S.offscreen = !en[0].isIntersecting; updatePause(); }, { threshold: 0.15 }).observe(hero);
    }
    updateHero();
  }
  function go(i) { var n = COLLECTIONS.length; S.slide = ((i % n) + n) % n; updateHero(); }
  function updatePause() {
    var stopped = S.paused || reduceMQ.matches;
    hero.classList.toggle('paused', stopped || S.hover || S.offscreen || !!S.lb || isPhone());
  }
  function updateHero() {
    if (!COLLECTIONS.length) return;
    var n = COLLECTIONS.length, cur = COLLECTIONS[S.slide];
    hangbox.querySelectorAll('.cslide').forEach(function (el, i) { el.classList.toggle('on', i === S.slide); el.setAttribute('aria-hidden', i === S.slide ? 'false' : 'true'); el.querySelectorAll('button').forEach(function (b) { b.tabIndex = i === S.slide ? 0 : -1; }); });
    placard.querySelectorAll('.ptext').forEach(function (el, i) { el.classList.toggle('on', i === S.slide); el.setAttribute('aria-hidden', i === S.slide ? 'false' : 'true'); el.querySelectorAll('a').forEach(function (a) { a.tabIndex = i === S.slide ? 0 : -1; }); });
    segsEl.querySelectorAll('.seg').forEach(function (el, i) {
      el.classList.remove('on', 'done');
      if (i < S.slide) el.classList.add('done');
      if (i === S.slide) { void el.offsetWidth; el.classList.add('on'); }
    });
    $('#glow').style.backgroundColor = cur.pieces[0].tint;
    $('#hc-pos').textContent = pad2(S.slide + 1) + ' / ' + pad2(n);
    var peeks = [];
    for (var k = 1; k <= Math.min(2, n - 1); k++) peeks.push((S.slide + k) % n);
    peeksEl.innerHTML = peeks.map(function (ci) {
      var c = COLLECTIONS[ci], cnt = c.pieces.length;
      return '<button type="button" class="peek" data-i="' + ci + '" aria-label="Up next: ' + esc(c.name) + '"><img src="' + esc(c.pieces[0].src) + '" alt="" loading="lazy">' +
        '<span class="peek-txt"><span class="disp peek-name">' + esc(c.name) + '</span><span class="mono">' + cnt + (cnt === 1 ? ' piece' : ' pieces') + '</span></span></button>';
    }).join('');
    var stopped = S.paused || reduceMQ.matches;
    var play = $('#hc-play');
    play.classList.toggle('stopped', stopped);
    play.setAttribute('aria-label', stopped ? 'Play slideshow' : 'Pause slideshow');
    updatePause();
  }

  // ── marquee ────────────────────────────────────────────────
  var names = ROOMS.map(function (r) { return r.name; });
  $('#marq').innerHTML = names.concat(names).map(function (t) { return '<span>' + esc(t) + '<i>✦</i></span>'; }).join('');

  // ── rooms (desktop) ────────────────────────────────────────
  var roomTiles = $('#room-tiles'), moodTiles = $('#mood-tiles');
  function renderRooms() {
    var f = S.filter;
    var tiles = [{ id: 'all', name: 'All works', count: PIECES.length, cover: (byId[META.allCover] || PIECES[0] || {}).src }].concat(ROOMS);
    roomTiles.innerHTML = tiles.map(function (r) {
      var on = (r.id === 'all' && f.kind === 'all') || (f.kind === 'room' && f.id === r.id);
      return '<a href="#wall" class="tile' + (on ? ' on' : '') + '" data-room="' + esc(r.id) + '" aria-label="' + esc(r.name) + ', ' + r.count + ' works">' +
        '<span class="tile-cov"><img src="' + esc(r.cover) + '" alt="" loading="lazy"></span>' +
        '<span class="tile-row"><span class="tile-name">' + esc(r.name) + '</span><span class="mono small">' + r.count + '</span></span></a>';
    }).join('');
    var moodOrder = ORDER;
    moodTiles.innerHTML = moods.map(function (m) {
      var ps = moodOrder.filter(function (p) { return p.mood === m.id; });
      var on = f.kind === 'mood' && f.id === m.id;
      return '<a href="#wall" class="tile mtile' + (on ? ' on' : '') + '" data-mood="' + esc(m.id) + '" aria-label="' + esc(m.name) + ' mood, ' + ps.length + ' pieces">' +
        '<span class="mtile-thumbs">' + ps.slice(0, 3).map(function (p) { return '<span><img src="' + esc(p.src) + '" alt="" loading="lazy"></span>'; }).join('') + '</span>' +
        '<span class="tile-row"><span class="disp mtile-name">' + esc(m.name) + '</span><span class="mono">' + pad2(ps.length) + '</span></span>' +
        '<span class="mtile-line">' + esc(m.line || '') + '</span>' +
        '<span class="mtile-bar" style="background:' + esc(m.tint) + '"></span></a>';
    }).join('');
    roomTiles.hidden = S.roomsMode !== 'series';
    moodTiles.hidden = S.roomsMode !== 'mood';
    $('#by-series').classList.toggle('on', S.roomsMode === 'series');
    $('#by-mood').classList.toggle('on', S.roomsMode === 'mood');
    $('#by-series').setAttribute('aria-pressed', S.roomsMode === 'series');
    $('#by-mood').setAttribute('aria-pressed', S.roomsMode === 'mood');
  }
  roomTiles.addEventListener('click', function (e) {
    var a = e.target.closest('.tile'); if (!a) return;
    setFilter(a.dataset.room === 'all' ? { kind: 'all' } : { kind: 'room', id: a.dataset.room });
  });
  moodTiles.addEventListener('click', function (e) {
    var a = e.target.closest('.tile'); if (!a) return;
    setFilter({ kind: 'mood', id: a.dataset.mood });
  });
  $('#by-series').addEventListener('click', function () { S.roomsMode = 'series'; setFilter({ kind: 'all' }); });
  $('#by-mood').addEventListener('click', function () { S.roomsMode = 'mood'; setFilter({ kind: 'all' }); });

  // ── chips (phone) ──────────────────────────────────────────
  var chips = $('#chips');
  function renderChips() {
    var f = S.filter;
    var html = '<button type="button" class="chip' + (f.kind === 'all' ? ' on' : '') + '" data-kind="all" aria-pressed="' + (f.kind === 'all') + '">All<span class="ct">' + PIECES.length + '</span></button><span class="chip-sep" aria-hidden="true"></span>';
    html += moods.map(function (m) {
      var on = f.kind === 'mood' && f.id === m.id;
      return '<button type="button" class="chip' + (on ? ' on' : '') + '" data-kind="mood" data-id="' + esc(m.id) + '" aria-pressed="' + on + '"><span class="dot" aria-hidden="true" style="background:' + esc(m.tint) + '"></span>' + esc(m.name) + '</button>';
    }).join('');
    html += '<span class="chip-sep" aria-hidden="true"></span>';
    html += ROOMS.map(function (r) {
      var on = f.kind === 'room' && f.id === r.id;
      return '<button type="button" class="chip' + (on ? ' on' : '') + '" data-kind="room" data-id="' + esc(r.id) + '" aria-pressed="' + on + '">' + esc(r.name) + '<span class="ct">' + r.count + '</span></button>';
    }).join('');
    chips.innerHTML = html;
  }
  chips.addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    setFilter(b.dataset.kind === 'all' ? { kind: 'all' } : { kind: b.dataset.kind, id: b.dataset.id }, true);
  });

  // ── the wall ───────────────────────────────────────────────
  var grid = $('#wallgrid');
  // groups for the current filter, newest first; empty groups drop out
  function currentGroups() {
    var f = S.filter;
    var keep = function (p) { return f.kind === 'room' ? p.room === f.id : (f.kind === 'mood' ? p.mood === f.id : true); };
    return DROPS.concat([ARCHIVE]).map(function (d) {
      return { d: d, pieces: (d.archive ? archiveOrder(S.seed) : d.pieces).filter(keep) };
    }).filter(function (g) { return g.pieces.length; });
  }
  function gridCols() {
    var t = getComputedStyle(grid).gridTemplateColumns;
    return t && t !== 'none' ? t.trim().split(/\s+/).length : 1;
  }
  function works(n) { return pad2(n) + (n === 1 ? ' work' : ' works'); }
  function whenText(d) { return d.when ? 'added ' + d.when.m + ' ' + d.when.y : (d.key === 'new' ? 'just added' : ''); }
  // desktop: a wall label hung in the grid at the start of each drop
  function dropCard(g, newest) {
    var d = g.d, w = d.when, n = g.pieces.length;
    var kick = d.archive ? 'The archive' : 'Drop ' + pad2(d.no);
    var big = d.key === 'new' ? 'New' : (w ? w.m.slice(0, 3) : '');
    var sub = d.key === 'new' ? 'Just in' : (w ? w.y : '');
    var name = S.filter.kind === 'all' ? d.name : '';
    var sr = kick + (whenText(d) ? ', ' + whenText(d) : '') + ': ' + n + (n === 1 ? ' work' : ' works');
    return '<div class="cellw dropw' + (newest ? ' newest' : '') + (d.archive ? ' arch' : '') + '"><div class="dropcard">' +
      '<span class="sr-only">' + esc(sr) + '</span>' +
      '<span class="dc-top" aria-hidden="true"><span class="mono dc-k">' + esc(kick) + '</span>' + (newest ? '<span class="dc-new">New</span>' : '') + '</span>' +
      '<span class="dc-mid" aria-hidden="true"><span class="disp dc-m">' + esc(big) + '</span><span class="mono dc-y">' + esc(sub) + '</span></span>' +
      '<span class="dc-bot" aria-hidden="true">' + (name ? '<span class="dc-name">' + esc(name) + '</span>' : '') + '<span class="mono dc-c">' + works(n) + '</span></span>' +
      '</div></div>';
  }
  // phone: no extra cells (art first) — a small date tag on the first piece of each drop
  function dropTag(d, newest) {
    if (d.archive) return 'Archive';
    var t = d.when ? d.when.m.slice(0, 3) + ' ’' + d.when.y.slice(2) : '';
    return newest ? (t ? 'New · ' + t : 'New') : t;
  }
  function renderWall() {
    var phone = isPhone(), f = S.filter;
    var groups = currentGroups();
    var list = [].concat.apply([], groups.map(function (g) { return g.pieces; }));
    var labelled = groups.length > 1, newestKey = DROPS.length ? DROPS[0].key : '';
    var step = 12, want = Math.min(list.length, (phone ? 24 : 26) + S.more);
    var cols = phone ? 3 : gridCols();
    function plan(limit) {
      var cells = [], units = 0, n = 0;
      groups.forEach(function (g) {
        if (n >= limit) return;
        var newest = g.d.key === newestKey;
        if (labelled && !phone) { cells.push(dropCard(g, newest)); units += 1; }
        g.pieces.forEach(function (p, j) {
          if (n >= limit) return;
          var big = g.d.archive && !p.land && g.pieces.length > (phone ? 6 : 4) && (phone ? j % 12 === 9 : j % 9 === 0);
          var size = p.land ? ' land' : (big ? ' big' : '');
          var tag = labelled && phone && j === 0 ? dropTag(g.d, newest) : '';
          var when = g.d.archive ? '' : whenText(g.d);
          units += p.land ? 2 : (big ? 4 : 1);
          cells.push('<div class="cellw' + size + '"><span class="cglow" aria-hidden="true" style="background:' + esc(p.tint) + '"></span>' +
            '<button type="button" class="cell" data-id="' + esc(p.id) + '" aria-label="Open ' + esc(p.title) + ', ' + esc(p.fr) + (when ? ', ' + when : '') + '">' +
            '<img src="' + esc(p.src) + '" alt="" loading="' + (n < (phone ? 9 : 12) ? 'eager' : 'lazy') + '" decoding="async">' +
            '<span class="mono cell-no" aria-hidden="true">' + pad2(n + 1) + '</span>' +
            (tag ? '<span class="dtag' + (newest ? ' new' : '') + '" aria-hidden="true">' + esc(tag) + '</span>' : '') +
            '<span class="lab" aria-hidden="true"><span class="disp lab-title">' + esc(p.title) + '</span><span class="lab-fr">' + esc(p.fr) + '</span></span>' +
            '</button></div>');
          n++;
        });
      });
      return { html: cells.join(''), units: units, n: n };
    }
    // end on a full row: nudge the count (a few more first, else a few fewer)
    var built = plan(want);
    if (want < list.length) {
      for (var d = 1; built.units % cols && d < cols; d++) {
        var more = want + d <= list.length ? plan(want + d) : null;
        var less = want - d >= 1 ? plan(want - d) : null;
        if (more && more.units % cols === 0) built = more;
        else if (less && less.units % cols === 0) built = less;
      }
    }
    var shownN = built.n;
    grid.innerHTML = built.html;
    grid.dataset.ids = JSON.stringify(list.map(function (p) { return p.id; }));
    var remaining = list.length - shownN;
    $('#more-wrap').hidden = remaining <= 0;
    $('#more-label').textContent = (phone ? 'Show ' : 'Hang ') + Math.min(step, remaining) + ' more';

    var title = 'Everything, newest first.', kicker = 'All rooms, by date added', mTitle = 'All works';
    if (f.kind === 'room') { title = roomName(f.id) + '.'; kicker = 'Room · newest first'; mTitle = roomName(f.id); }
    if (f.kind === 'mood') { title = moodOf(f.id).name + '.'; kicker = 'Mood · newest first'; mTitle = moodOf(f.id).name; }
    $('#wall-h').textContent = title;
    $('#wall-kicker').textContent = kicker;
    $('#wall-count').textContent = pad2(shownN) + ' of ' + pad2(list.length) + ' hung';
    $('#show-all').hidden = f.kind === 'all';
    $('#m-title').textContent = mTitle;
    $('#m-count').textContent = list.length + ' works';
  }
  grid.addEventListener('click', function (e) {
    var b = e.target.closest('.cell'); if (!b) return;
    openLb(JSON.parse(grid.dataset.ids || '[]'), b.dataset.id, b);
  });
  $('#more').addEventListener('click', function () { S.more += 12; renderWall(); });
  function shuffle() { S.seed = 1 + Math.floor(Math.random() * 100000); S.more = 0; renderWall(); }
  $('#shuffle').addEventListener('click', shuffle);
  $('#m-shuffle').addEventListener('click', shuffle);
  $('#show-all').addEventListener('click', function () { setFilter({ kind: 'all' }); });

  function setFilter(f, fromChip) {
    S.filter = f; S.more = 0;
    renderRooms(); renderChips(); renderWall();
    if (fromChip) {
      var on = chips.querySelector('.chip.on');
      if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      var wall = $('#wall');
      if (wall.getBoundingClientRect().top < 0) wall.scrollIntoView({ block: 'start' });
    }
  }

  // ── table display ──────────────────────────────────────────
  (function renderTable() {
    var cfg = META.booth || {}, ratios = cfg.ratios || {}, alts = cfg.alts || {};
    var files = BOOTH.map(function (b) { return b.file; });
    var altOf = {};
    BOOTH.forEach(function (b) { altOf[b.file] = alts[b.file] || b.alt || 'Booth setup'; });
    var rows = (cfg.rows || []).map(function (r) { return r.filter(function (f) { return files.indexOf(f) >= 0; }); }).filter(function (r) { return r.length; });
    var used = [].concat.apply([], rows);
    var rest = files.filter(function (f) { return used.indexOf(f) < 0; });
    for (var i = 0; i < rest.length; i += 3) rows.push(rest.slice(i, i + 3));
    $('#booth').innerHTML = rows.map(function (r) {
      return '<div class="booth-row">' + r.map(function (f) {
        var ratio = ratios[f] || 0.75;
        return '<img src="/images/booth/' + encodeURIComponent(f) + '" alt="' + esc(altOf[f]) + '" loading="lazy" style="flex:' + ratio.toFixed(3) + ' 1 0;aspect-ratio:' + ratio.toFixed(3) + '">';
      }).join('') + '</div>';
    }).join('');
    var cons = META.cons || [];
    $('#cons').innerHTML = cons.map(function (c) {
      return '<li><span class="mono accent con-date">' + esc(c.date) + '</span><span class="con-name">' + esc(c.name) + '</span><span class="mono con-city">' + esc(c.city) + '</span></li>';
    }).join('');
  })();

  // ── artwork viewer ─────────────────────────────────────────
  var lb = $('#lb'), lastFocus = null;
  function openLb(ids, id, opener) {
    if (!ids.length) return;
    lastFocus = opener || document.activeElement;
    S.lb = { ids: ids, i: Math.max(0, ids.indexOf(id)) };
    renderLb();
    lb.hidden = false;
    document.body.classList.add('locked');
    updatePause();
    $('#lb-close').focus();
  }
  function closeLb() {
    S.lb = null; lb.hidden = true;
    document.body.classList.remove('locked');
    updatePause();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function stepLb(d) { if (!S.lb) return; var n = S.lb.ids.length; S.lb.i = (S.lb.i + d + n) % n; renderLb(); }
  function renderLb() {
    var ids = S.lb.ids, p = byId[ids[S.lb.i]];
    $('#lb-pos').textContent = pad2(S.lb.i + 1) + ' / ' + pad2(ids.length);
    var img = $('#lb-img');
    img.src = p.src; img.alt = p.title + ' — ' + p.fr;
    $('#lb-glow').style.background = p.tint;
    $('#lb-fr').textContent = p.fr;
    $('#lb-title').textContent = p.title;
    $('#lb-room').textContent = roomName(p.room);
    var rel = PIECES.filter(function (q) { return q.room === p.room && q.id !== p.id; });
    var label = 'More from ' + roomName(p.room);
    if (rel.length < 3) {
      rel = rel.concat(PIECES.filter(function (q) { return q.mood === p.mood && q.id !== p.id && q.room !== p.room; }));
      label = 'More like this';
    }
    rel = rel.slice(0, 4);
    $('#lb-rel-label').textContent = label;
    var relIds = [p.id].concat(rel.map(function (q) { return q.id; }));
    var relEl = $('#lb-rel');
    relEl.dataset.ids = JSON.stringify(relIds);
    relEl.innerHTML = rel.map(function (q) {
      return '<button type="button" class="relb" data-id="' + esc(q.id) + '" aria-label="Open ' + esc(q.title) + '"><img src="' + esc(q.src) + '" alt="" loading="lazy"></button>';
    }).join('');
    // preload neighbours
    [1, -1].forEach(function (d) { var n = ids.length, q = byId[ids[(S.lb.i + d + n) % n]]; if (q) { var im = new Image(); im.src = q.src; } });
  }
  $('#lb-close').addEventListener('click', closeLb);
  $('#lb-prev').addEventListener('click', function () { stepLb(-1); });
  $('#lb-next').addEventListener('click', function () { stepLb(1); });
  $('#lb-rel').addEventListener('click', function (e) {
    var b = e.target.closest('.relb'); if (!b) return;
    var ids = JSON.parse(this.dataset.ids || '[]');
    S.lb = { ids: ids, i: Math.max(0, ids.indexOf(b.dataset.id)) };
    renderLb();
  });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!S.lb) return;
    if (e.key === 'Escape') { e.preventDefault(); closeLb(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); stepLb(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); stepLb(-1); }
    else if (e.key === 'Tab') {
      var f = lb.querySelectorAll('button, a[href]');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // swipe between artworks on touch screens
  (function () {
    var x0 = null, y0 = null;
    lb.addEventListener('touchstart', function (e) { var t = e.touches[0]; x0 = t.clientX; y0 = t.clientY; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) stepLb(dx < 0 ? 1 : -1);
      x0 = y0 = null;
    }, { passive: true });
  })();

  // ── boot ───────────────────────────────────────────────────
  buildHero();
  renderRooms();
  renderChips();
  renderWall();
  var onMQ = function () { S.more = 0; renderWall(); updatePause(); };
  if (phoneMQ.addEventListener) phoneMQ.addEventListener('change', onMQ); else phoneMQ.addListener(onMQ);
  if (reduceMQ.addEventListener) reduceMQ.addEventListener('change', updateHero);
})();
