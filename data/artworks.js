// ============================================================
//  ARTWORKS DATA — EDIT THIS FILE TO CUSTOMIZE YOUR PORTFOLIO
// ============================================================
//
//  Each artwork has:
//    - title:       display name
//    - file:        filename inside /images/
//    - series:      MUST be one of the 14 categories below
//    - description: your caption / story behind the piece
//    - tags:        optional tags
//
//  The 14 categories (spelled exactly as shown):
//    ALL WORKS (auto — displays every piece)
//    Featured
//    Original Arts
//    Bocchi The Rock
//    One Piece
//    Bleach
//    KPOP Demon Hunter
//    Street Fighters
//    Advent Hololive
//    Justice Hololive
//    Genshin Impact
//    Hitman Reborn
//    Zenless Zone Zero
//    Chainsaw Man
// ============================================================

const ARTWORKS = [
  // ── FEATURED ─────────────────────────────────────────────
  { title: "Baiken",            file: "10_Baiken.jpg",           series: "Featured", description: "Edit this description — tell the story behind this piece.", tags: ["game"] },
  { title: "Blue Lock",         file: "10_Blue Lock.jpg",        series: "Featured", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Kaiju",             file: "10_Kaiju.jpg",            series: "Featured", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Sun Wukong",        file: "10_SunWuKong.jpg",        series: "Featured", description: "Edit this description — tell the story behind this piece.", tags: ["mythology"] },
  { title: "Kafka",             file: "10_kafuka.jpg",           series: "Featured", description: "Edit this description — tell the story behind this piece.", tags: ["game"] },
  { title: "Dandadan",          file: "15_Dandadan.jpg",         series: "Featured", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Solo Leveling",     file: "15_Solo Leveling.jpg",    series: "Featured", description: "Edit this description — tell the story behind this piece.", tags: ["manhwa"] },
  { title: "Maomao",            file: "15_maomao.jpg",           series: "Featured", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Ai Hoshino",        file: "5_Ai Hoshino.jpg",        series: "Featured", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Dragon's Maid",     file: "5_Dragon's Maid.jpg",     series: "Featured", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Dark Magician Girl",file: "15_DMG.jpg",              series: "Featured", description: "Edit this description — tell the story behind this piece.", tags: ["yu-gi-oh"] },
  { title: "The Fragrant Flower Blooms With Dignity", file: "10_Flower.jpg", series: "Featured", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },

  // ── ORIGINAL ARTS ────────────────────────────────────────
  { title: "Kaitlynn",          file: "5_Kaitlynn.jpg",          series: "Original Arts", description: "Edit this description — tell the story behind this piece.", tags: ["original"], layout: "wide" },
  { title: "Isabelle",          file: "5_Isabelle.jpg",          series: "Original Arts", description: "Edit this description — tell the story behind this piece.", tags: ["original"] },

  // ── BOCCHI THE ROCK ──────────────────────────────────────
  { title: "Hitori",            file: "0_Hitori.jpg",            series: "Bocchi The Rock", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Kikuri",            file: "0_Kikuri.jpg",            series: "Bocchi The Rock", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Kita",              file: "0_Kita.jpg",              series: "Bocchi The Rock", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Nijika",            file: "0_Nijika poster.jpg",     series: "Bocchi The Rock", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Ryo",               file: "0_Ryo poster.jpg",        series: "Bocchi The Rock", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Bocchi Main",       file: "10_Bocchi main.jpg",      series: "Bocchi The Rock", description: "Edit this description — tell the story behind this piece.", tags: ["key visual"], layout: "wide" },

  // ── ONE PIECE ────────────────────────────────────────────
  { title: "Nami",              file: "15_Nami.jpg",             series: "One Piece", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Sanji",             file: "15_Sanji.jpg",            series: "One Piece", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Zoro",              file: "15_Zoro.jpg",             series: "One Piece", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Robin",             file: "15_Robin.jpg",            series: "One Piece", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },

  // ── BLEACH ───────────────────────────────────────────────
  { title: "Renji",             file: "15_Renji.jpg",            series: "Bleach", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Rukia",             file: "15_Rukia.jpg",            series: "Bleach", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Aizen",             file: "20_Aizen.jpg",            series: "Bleach", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Byakuya",           file: "20_Byakuya.jpg",          series: "Bleach", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Grimmjow",          file: "20_Grimmjow.jpg",         series: "Bleach", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Ichigo",            file: "20_Ichigo.jpg",           series: "Bleach", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Kenpachi",          file: "20_Kenpachi.jpg",         series: "Bleach", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Nel",               file: "20_Nel.jpg",              series: "Bleach", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Orihime",           file: "20_Orihime.jpg",          series: "Bleach", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Shunsui",           file: "20_Shunsui.jpg",          series: "Bleach", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Soifon",            file: "20_Soifon.jpg",           series: "Bleach", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Toshiro",           file: "20_Toshiro.jpg",          series: "Bleach", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Ulquiorra",         file: "20_Ulqiorra.jpg",         series: "Bleach", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Unohana",           file: "20_Unohana.jpg",          series: "Bleach", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Urahara",           file: "20_Urahara.jpg",          series: "Bleach", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Yamamoto",          file: "20_Yamamoto.jpg",         series: "Bleach", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Yoruichi",          file: "20_Yoruichi.jpg",         series: "Bleach", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Yhwach",            file: "20_yhw.jpg",              series: "Bleach", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },

  // ── KPOP DEMON HUNTER ────────────────────────────────────
  { title: "Rumi",              file: "15_Rumi.jpg",             series: "KPOP Demon Hunter", description: "Edit this description — tell the story behind this piece.", tags: ["film"] },
  { title: "Mira",              file: "15_Mira.jpg",             series: "KPOP Demon Hunter", description: "Edit this description — tell the story behind this piece.", tags: ["film"] },
  { title: "Zoey",              file: "15_Zoey.jpg",             series: "KPOP Demon Hunter", description: "Edit this description — tell the story behind this piece.", tags: ["film"] },

  // ── STREET FIGHTERS ──────────────────────────────────────
  { title: "Cammy",             file: "15_Cammy.jpg",            series: "Street Fighters", description: "Edit this description — tell the story behind this piece.", tags: ["game"] },
  { title: "Chun-Li",           file: "15_Chunli.jpg",           series: "Street Fighters", description: "Edit this description — tell the story behind this piece.", tags: ["game"] },
  { title: "Juri",              file: "15_Juri.jpg",             series: "Street Fighters", description: "Edit this description — tell the story behind this piece.", tags: ["game"] },
  { title: "Mai",               file: "15_Mai.jpg",              series: "Street Fighters", description: "Edit this description — tell the story behind this piece.", tags: ["game"] },

  // ── ADVENT HOLOLIVE ──────────────────────────────────────
  { title: "Shiori Novella",    file: "15_Shiori Nevella.jpg",   series: "Advent Hololive", description: "Edit this description — tell the story behind this piece.", tags: ["vtuber"] },

  // ── JUSTICE HOLOLIVE ─────────────────────────────────────
  { title: "Elizabeth",         file: "15_Elizabeth.jpg",        series: "Justice Hololive", description: "Edit this description — tell the story behind this piece.", tags: ["vtuber"] },
  { title: "Gigi Murin",        file: "15_Gigi Murin.jpg",       series: "Justice Hololive", description: "Edit this description — tell the story behind this piece.", tags: ["vtuber"] },
  { title: "Cecilia",           file: "15_Cecilia.jpg",          series: "Justice Hololive", description: "Edit this description — tell the story behind this piece.", tags: ["vtuber"] },
  { title: "Raora",             file: "15_Raora.jpg",            series: "Justice Hololive", description: "Edit this description — tell the story behind this piece.", tags: ["vtuber"] },

  // ── GENSHIN IMPACT ───────────────────────────────────────
  { title: "Ganyu",             file: "5_Ganyu.jpg",             series: "Genshin Impact", description: "Edit this description — tell the story behind this piece.", tags: ["game"] },
  { title: "Kazuha",            file: "5_Kazuha.jpg",            series: "Genshin Impact", description: "Edit this description — tell the story behind this piece.", tags: ["game"] },
  { title: "Kirara",            file: "5_Kirara.jpg",            series: "Genshin Impact", description: "Edit this description — tell the story behind this piece.", tags: ["game"] },
  { title: "ShenHe",            file: "5_ShenHe.jpg",            series: "Genshin Impact", description: "Edit this description — tell the story behind this piece.", tags: ["game"] },
  { title: "XianYun",           file: "5_XianYun.jpg",           series: "Genshin Impact", description: "Edit this description — tell the story behind this piece.", tags: ["game"] },

  // ── HITMAN REBORN ────────────────────────────────────────
  { title: "Gokudera",          file: "10_Gokudera.jpg",         series: "Hitman Reborn", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Reborn × Haikyuu",  file: "10_Reborn X Haikyuu.jpg", series: "Hitman Reborn", description: "Edit this description — tell the story behind this piece.", tags: ["anime", "crossover"], layout: "wide" },

  // ── ZENLESS ZONE ZERO ────────────────────────────────────
  { title: "Burnice",           file: "15_Burnice.jpg",          series: "Zenless Zone Zero", description: "Edit this description — tell the story behind this piece.", tags: ["game"] },
  { title: "Jane",              file: "15_Jane.jpg",             series: "Zenless Zone Zero", description: "Edit this description — tell the story behind this piece.", tags: ["game"] },
  { title: "Zhu Yuan",          file: "15_Zhu Yuan.jpg",         series: "Zenless Zone Zero", description: "Edit this description — tell the story behind this piece.", tags: ["game"] },

  // ── CHAINSAW MAN ─────────────────────────────────────────
  { title: "Makima",            file: "10_Makima.jpg",           series: "Chainsaw Man", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] },
  { title: "Reze",              file: "15_Reze.jpg",             series: "Chainsaw Man", description: "Edit this description — tell the story behind this piece.", tags: ["anime"] }
];


// ============================================================
//  CATEGORY DISPLAY ORDER — edit to reorder the filter bar
// ============================================================

const CATEGORY_ORDER = [
  "ALL WORKS",
  "Featured",
  "Original Arts",
  "Bocchi The Rock",
  "One Piece",
  "Bleach",
  "KPOP Demon Hunter",
  "Street Fighters",
  "Advent Hololive",
  "Justice Hololive",
  "Genshin Impact",
  "Hitman Reborn",
  "Zenless Zone Zero",
  "Chainsaw Man"
];


// ============================================================
//  SITE SETTINGS — edit to customize your site
// ============================================================

// ============================================================
//  TABLE DISPLAY (booth photos) — edit to add/remove booth shots
//  Place the image files in /images/booth/
// ============================================================

const BOOTH_PHOTOS = [
  { file: "booth-01.jpeg", alt: "Booth setup 1" },
  { file: "booth-02.jpeg", alt: "Booth setup 2" },
  { file: "booth-03.jpeg", alt: "Booth setup 3" },
  { file: "booth-04.jpeg", alt: "Booth setup 4" },
  { file: "booth-05.jpeg", alt: "Booth setup 5" }
];


const SITE_CONFIG = {
  artistName: "SENPAPI-SAMA",
  tagline: "DIGITAL ARTIST & ILLUSTRATOR",
  loginSubtitle: "ENTER THE GALLERY",

  aboutText: "24/7 Zen mode amateur artist, anime enthusiast, video game novice, overly talkative if close, pretty shy otherwise... I tend to draw characters from my favourite anime and video games! Catch me at conventions!",

  socials: {
    instagram: "https://www.instagram.com/senpapi.sama/",
    email: "senpapi-sama@hotmail.com"
  }
};
