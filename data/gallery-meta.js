// ============================================================
//  GALLERY HOMEPAGE SETTINGS (used by home.js)
//  Your artworks still live in data/artworks.js. This file only
//  adds the homepage extras:
//   - newCollections: the "Latest collections" slideshow up top
//                     (newest first; files must match artworks.js)
//   - opening:        the hand-picked first pieces on the wall
//   - cons:           upcoming conventions in "Table display"
//   - pieces:         per-artwork mood (ink / neon / day / dusk),
//                     glow colour, series label, optional title
//                     override, and land:true for wide pieces
//  A new artwork with no entry here still shows up automatically
//  (mood "day", neutral glow).
// ============================================================

const GALLERY_META = {
  "seriesToRoom": {
    "Featured": "featured",
    "Original Arts": "orig",
    "Bocchi The Rock": "bocchi",
    "One Piece": "op",
    "Bleach": "bleach",
    "KPOP Demon Hunter": "kdh",
    "Street Fighters": "sf",
    "Advent Hololive": "holo",
    "Council Hololive": "holo",
    "Justice Hololive": "holo",
    "Genshin Impact": "genshin",
    "Hitman Reborn": "reborn",
    "Zenless Zone Zero": "zzz",
    "Chainsaw Man": "csm",
    "JoJo's Bizarre Adventure": "jojo"
  },
  "rooms": [
    {
      "id": "featured",
      "name": "Featured",
      "cover": "10_Kaiju.jpg"
    },
    {
      "id": "bleach",
      "name": "Bleach",
      "cover": "20_Ulqiorra.jpg"
    },
    {
      "id": "holo",
      "name": "Hololive",
      "cover": "15_FuwaMoco.jpg"
    },
    {
      "id": "bocchi",
      "name": "Bocchi the Rock!",
      "cover": "10_Bocchi main.jpg"
    },
    {
      "id": "genshin",
      "name": "Genshin Impact",
      "cover": "5_Ganyu.jpg"
    },
    {
      "id": "op",
      "name": "One Piece",
      "cover": "15_Nami.jpg"
    },
    {
      "id": "sf",
      "name": "Street Fighter",
      "cover": "15_Chunli.jpg"
    },
    {
      "id": "kdh",
      "name": "KPop Demon Hunters",
      "cover": "15_Rumi.jpg"
    },
    {
      "id": "zzz",
      "name": "Zenless Zone Zero",
      "cover": "15_Burnice.jpg"
    },
    {
      "id": "csm",
      "name": "Chainsaw Man",
      "cover": "15_Reze.jpg"
    },
    {
      "id": "jojo",
      "name": "JoJo’s Bizarre Adventure",
      "cover": "15_Gyro Zeppeli.jpg"
    },
    {
      "id": "reborn",
      "name": "Hitman Reborn!",
      "cover": "10_Gokudera.jpg"
    },
    {
      "id": "orig",
      "name": "Original Arts",
      "cover": "5_Isabelle.jpg"
    }
  ],
  "allCover": "15_Jujutsu Kaisen.jpg",
  "moods": [
    {
      "id": "ink",
      "name": "Ink",
      "line": "Black, white and one loud colour.",
      "tint": "#E9E4DA"
    },
    {
      "id": "neon",
      "name": "Neon",
      "line": "Acid greens and hot pinks at full volume.",
      "tint": "#2BE36B"
    },
    {
      "id": "day",
      "name": "Daylight",
      "line": "Open skies, soft pastels, sea air.",
      "tint": "#8FD3F4"
    },
    {
      "id": "dusk",
      "name": "Dusk",
      "line": "Low light, deep reds, quiet menace.",
      "tint": "#7A5CC9"
    }
  ],
  "newCollections": [
    {
      "name": "Steel Ball Run",
      "sub": "JoJo’s Bizarre Adventure",
      "room": "jojo",
      "files": [
        "15_Johnny Joestar.jpg",
        "15_Gyro Zeppeli.jpg"
      ]
    },
    {
      "name": "Jujutsu Kaisen",
      "sub": "Gojo, Yuji, Megumi & Nobara",
      "room": "featured",
      "files": [
        "15_Jujutsu Kaisen.jpg"
      ]
    },
    {
      "name": "Hololive",
      "sub": "Advent & Council",
      "room": "holo",
      "files": [
        "15_FuwaMoco.jpg",
        "15_Kronii.jpg",
        "15_Nerissa.jpg",
        "15_Koseki.jpg"
      ]
    }
  ],
  "opening": [
    "15_Dandadan.jpg",
    "15_Chunli.jpg",
    "15_Reze.jpg",
    "15_Burnice.jpg",
    "15_FuwaMoco.jpg",
    "20_Ulqiorra.jpg",
    "15_Juri.jpg",
    "10_Bocchi main.jpg",
    "10_Kaiju.jpg",
    "5_Ganyu.jpg",
    "10_Makima.jpg",
    "15_Rumi.jpg",
    "15_Johnny Joestar.jpg",
    "15_maomao.jpg",
    "15_Elizabeth.jpg",
    "15_Nami.jpg",
    "20_Grimmjow.jpg",
    "10_kafuka.jpg",
    "0_Hitori.jpg",
    "15_Mai.jpg",
    "15_Solo Leveling.jpg",
    "5_XianYun.jpg",
    "15_Zhu Yuan.jpg",
    "15_DMG.jpg"
  ],
  "booth": {
    "rows": [
      [
        "booth-03.jpeg",
        "booth-01.jpeg"
      ],
      [
        "booth-02.jpeg",
        "booth-04.jpeg",
        "booth-05.jpeg"
      ]
    ],
    "ratios": {
      "booth-03.jpeg": 1.3333333333333333
    },
    "alts": {
      "booth-01.jpeg": "Corner booth with poster walls on both sides and prints on easels along the table",
      "booth-02.jpeg": "Aisle view of the booth with poster walls running the length of the table",
      "booth-03.jpeg": "Booth from the front: three poster walls above a long table of prints",
      "booth-04.jpeg": "Booth from across the aisle: poster grid behind a row of display easels",
      "booth-05.jpeg": "Close view of the table: framed prints and the SENPAPI-SAMA sign"
    }
  },
  "cons": [
    {
      "date": "Oct 29 – Nov 1",
      "name": "Youmacon",
      "city": "Detroit, MI"
    },
    {
      "date": "Nov 19–22",
      "name": "Anime Weekend Atlanta",
      "city": "Atlanta, GA"
    },
    {
      "date": "Nov 20–22",
      "name": "Twin Cities Con",
      "city": "Minneapolis, MN"
    }
  ],
  "pieces": {
    "15_Dandadan.jpg": {
      "mood": "neon",
      "tint": "#2BE36B",
      "fr": "Dandadan"
    },
    "15_Chunli.jpg": {
      "mood": "day",
      "tint": "#8FD3F4",
      "fr": "Street Fighter"
    },
    "15_Reze.jpg": {
      "mood": "dusk",
      "tint": "#7A5CC9",
      "fr": "Chainsaw Man"
    },
    "15_Burnice.jpg": {
      "mood": "neon",
      "tint": "#E0262B",
      "fr": "Zenless Zone Zero"
    },
    "15_FuwaMoco.jpg": {
      "mood": "day",
      "tint": "#F7A8C8",
      "fr": "Hololive Advent"
    },
    "20_Ulqiorra.jpg": {
      "mood": "ink",
      "tint": "#CFE8E4",
      "fr": "Bleach"
    },
    "15_Juri.jpg": {
      "mood": "neon",
      "tint": "#C86CF0",
      "fr": "Street Fighter"
    },
    "10_Bocchi main.jpg": {
      "mood": "dusk",
      "tint": "#E58FB0",
      "fr": "Bocchi the Rock!",
      "title": "Bocchi",
      "land": true
    },
    "10_Kaiju.jpg": {
      "mood": "neon",
      "tint": "#33D6C8",
      "fr": "Kaiju No. 8",
      "title": "Kaiju No. 8"
    },
    "5_Ganyu.jpg": {
      "mood": "day",
      "tint": "#7FB6F0",
      "fr": "Genshin Impact"
    },
    "10_Makima.jpg": {
      "mood": "dusk",
      "tint": "#C2463A",
      "fr": "Chainsaw Man"
    },
    "15_Rumi.jpg": {
      "mood": "neon",
      "tint": "#F5C518",
      "fr": "KPop Demon Hunters"
    },
    "15_Johnny Joestar.jpg": {
      "mood": "day",
      "tint": "#9BE3B5",
      "fr": "JoJo’s Bizarre Adventure"
    },
    "15_maomao.jpg": {
      "mood": "dusk",
      "tint": "#C9A34A",
      "fr": "The Apothecary Diaries"
    },
    "15_Nami.jpg": {
      "mood": "day",
      "tint": "#F28C38",
      "fr": "One Piece"
    },
    "15_Solo Leveling.jpg": {
      "mood": "dusk",
      "tint": "#6B4BD8",
      "fr": "Solo Leveling",
      "title": "Sung Jinwoo"
    },
    "10_Gokudera.jpg": {
      "mood": "dusk",
      "tint": "#B3262E",
      "fr": "Hitman Reborn!"
    },
    "20_Ichigo.jpg": {
      "mood": "ink",
      "tint": "#F29A5C",
      "fr": "Bleach"
    },
    "15_Kronii.jpg": {
      "mood": "day",
      "tint": "#8FA7B8",
      "fr": "Hololive Council"
    },
    "15_Mira.jpg": {
      "mood": "neon",
      "tint": "#F06292",
      "fr": "KPop Demon Hunters"
    },
    "10_Baiken.jpg": {
      "mood": "ink",
      "tint": "#B8322A",
      "fr": "Guilty Gear"
    },
    "15_Zoro.jpg": {
      "mood": "day",
      "tint": "#6FBF6A",
      "fr": "One Piece"
    },
    "15_Jujutsu Kaisen.jpg": {
      "mood": "neon",
      "tint": "#E8572E",
      "fr": "Jujutsu Kaisen",
      "title": "Gojo, Yuji, Megumi & Nobara"
    },
    "5_Kaitlynn.jpg": {
      "mood": "dusk",
      "tint": "#B03A3A",
      "fr": "Original",
      "land": true
    },
    "15_Gyro Zeppeli.jpg": {
      "mood": "neon",
      "tint": "#F23D8E",
      "fr": "JoJo’s Bizarre Adventure"
    },
    "5_Isabelle.jpg": {
      "mood": "ink",
      "tint": "#C9C2D6",
      "fr": "Original"
    },
    "5_Ai Hoshino.jpg": {
      "mood": "day",
      "tint": "#9FC3F0",
      "fr": "Oshi no Ko"
    },
    "20_Aizen.jpg": {
      "mood": "ink",
      "tint": "#D9D4CA",
      "fr": "Bleach"
    },
    "10_Blue Lock.jpg": {
      "mood": "day",
      "tint": "#6FA8E8",
      "fr": "Blue Lock"
    },
    "20_Byakuya.jpg": {
      "mood": "ink",
      "tint": "#E9E4DA",
      "fr": "Bleach"
    },
    "15_Cammy.jpg": {
      "mood": "dusk",
      "tint": "#4A6FA8",
      "fr": "Street Fighter"
    },
    "15_Cecilia.jpg": {
      "mood": "neon",
      "tint": "#3FD08A",
      "fr": "Hololive Justice"
    },
    "15_DMG.jpg": {
      "mood": "day",
      "tint": "#C9A4F0",
      "fr": "Yu-Gi-Oh!"
    },
    "5_Dragon's Maid.jpg": {
      "mood": "day",
      "tint": "#E8B04A",
      "fr": "Miss Kobayashi’s Dragon Maid",
      "title": "Dragon Maid"
    },
    "15_Elizabeth.jpg": {
      "mood": "neon",
      "tint": "#E0262B",
      "fr": "Hololive Justice"
    },
    "10_Flower.jpg": {
      "mood": "day",
      "tint": "#C9B8E0",
      "fr": "The Fragrant Flower Blooms with Dignity",
      "title": "Rintaro & Kaoruko"
    },
    "15_Gigi Murin.jpg": {
      "mood": "neon",
      "tint": "#F5B81C",
      "fr": "Hololive Justice"
    },
    "20_Grimmjow.jpg": {
      "mood": "ink",
      "tint": "#7FD4E8",
      "fr": "Bleach"
    },
    "0_Hitori.jpg": {
      "mood": "day",
      "tint": "#F5A3C0",
      "fr": "Bocchi the Rock!"
    },
    "15_Jane.jpg": {
      "mood": "dusk",
      "tint": "#FF6A2B",
      "fr": "Zenless Zone Zero"
    },
    "10_kafuka.jpg": {
      "mood": "dusk",
      "tint": "#A04DD8",
      "fr": "Honkai: Star Rail"
    },
    "5_Kazuha.jpg": {
      "mood": "neon",
      "tint": "#C8372D",
      "fr": "Genshin Impact"
    },
    "20_Kenpachi.jpg": {
      "mood": "ink",
      "tint": "#F2D84A",
      "fr": "Bleach"
    },
    "0_Kikuri.jpg": {
      "mood": "day",
      "tint": "#E86FA8",
      "fr": "Bocchi the Rock!"
    },
    "5_Kirara.jpg": {
      "mood": "day",
      "tint": "#8FCB8A",
      "fr": "Genshin Impact"
    },
    "0_Kita.jpg": {
      "mood": "day",
      "tint": "#F07A6A",
      "fr": "Bocchi the Rock!"
    },
    "15_Koseki.jpg": {
      "mood": "day",
      "tint": "#B9A2E8",
      "fr": "Hololive Advent",
      "title": "Koseki Bijou"
    },
    "15_Mai.jpg": {
      "mood": "neon",
      "tint": "#F26A2B",
      "fr": "Street Fighter"
    },
    "20_Nel.jpg": {
      "mood": "ink",
      "tint": "#3FD8D0",
      "fr": "Bleach"
    },
    "15_Nerissa.jpg": {
      "mood": "dusk",
      "tint": "#3B5BD8",
      "fr": "Hololive Advent"
    },
    "0_Nijika poster.jpg": {
      "mood": "day",
      "tint": "#F2D64B",
      "fr": "Bocchi the Rock!"
    },
    "20_Orihime.jpg": {
      "mood": "ink",
      "tint": "#F29A5C",
      "fr": "Bleach"
    },
    "15_Raora.jpg": {
      "mood": "neon",
      "tint": "#F05A9A",
      "fr": "Hololive Justice"
    },
    "10_Reborn X Haikyuu.jpg": {
      "mood": "dusk",
      "tint": "#E0913A",
      "fr": "Hitman Reborn!",
      "land": true
    },
    "15_Renji.jpg": {
      "mood": "ink",
      "tint": "#D8323A",
      "fr": "Bleach"
    },
    "15_Robin.jpg": {
      "mood": "day",
      "tint": "#5AA9E6",
      "fr": "One Piece"
    },
    "15_Rukia.jpg": {
      "mood": "ink",
      "tint": "#CFD6E8",
      "fr": "Bleach"
    },
    "0_Ryo poster.jpg": {
      "mood": "day",
      "tint": "#7FB8E8",
      "fr": "Bocchi the Rock!"
    },
    "15_Sanji.jpg": {
      "mood": "dusk",
      "tint": "#E0B04A",
      "fr": "One Piece"
    },
    "5_ShenHe.jpg": {
      "mood": "dusk",
      "tint": "#7FA0E0",
      "fr": "Genshin Impact",
      "title": "Shenhe"
    },
    "15_Shiori Nevella.jpg": {
      "mood": "dusk",
      "tint": "#9A8AB8",
      "fr": "Hololive Advent"
    },
    "20_Shunsui.jpg": {
      "mood": "ink",
      "tint": "#F28AB0",
      "fr": "Bleach"
    },
    "20_Soifon.jpg": {
      "mood": "ink",
      "tint": "#F2E6B8",
      "fr": "Bleach"
    },
    "10_SunWuKong.jpg": {
      "mood": "ink",
      "tint": "#B89A5A",
      "fr": "Black Myth: Wukong"
    },
    "20_Toshiro.jpg": {
      "mood": "ink",
      "tint": "#6FC6E8",
      "fr": "Bleach"
    },
    "20_Unohana.jpg": {
      "mood": "ink",
      "tint": "#D8323A",
      "fr": "Bleach"
    },
    "20_Urahara.jpg": {
      "mood": "ink",
      "tint": "#3FB8A8",
      "fr": "Bleach"
    },
    "5_XianYun.jpg": {
      "mood": "day",
      "tint": "#3FBFA0",
      "fr": "Genshin Impact",
      "title": "Xianyun"
    },
    "20_Yamamoto.jpg": {
      "mood": "ink",
      "tint": "#E9E4DA",
      "fr": "Bleach"
    },
    "20_yhw.jpg": {
      "mood": "ink",
      "tint": "#E0262B",
      "fr": "Bleach"
    },
    "20_Yoruichi.jpg": {
      "mood": "ink",
      "tint": "#A070D0",
      "fr": "Bleach"
    },
    "15_Zhu Yuan.jpg": {
      "mood": "neon",
      "tint": "#FF6A2B",
      "fr": "Zenless Zone Zero"
    },
    "15_Zoey.jpg": {
      "mood": "neon",
      "tint": "#2EC4D8",
      "fr": "KPop Demon Hunters"
    }
  }
};
