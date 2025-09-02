import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static("public"));

// Root route -> serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const OPENAI_KEY = process.env.OPENAI_API_KEY;

// 🟥 Fake AI Gali list (tumhari wali updated list)
const fakeGaaliReplies = [
  "jhipkali ki chut ka pasina",
  "kutte ki gaand ka baal todne wala",
  "suar ki chut ka khoon chaatne wala",
  "gadhe ke lund ka pasina peene wala",
  "bandar ki gaand ka tel bechne wala",
  "bhains ki chut ka paani peene wala",
  "billi ki chut ke baal todne wala",
  "chuhe ki gaand ka baal chaatne wala",
  "kauwe ki chut ka tel nikalne wala",
  "machhar ki gaand ka khoon peene wala",
  "machhli ki chut ka pani chaatne wala",
  "makkhi ki gaand ka ras chaatne wala",
  "kutti ki chut ke tatte todne wala",
  "chudne wali maa ki chut faadne wala",
  "behen ki chut ke baal todne wala",
  "maa ki chut ka khoon bechne wala",
  "maa ke lund ka pasina peene wala",
  "behen ke tatto ka pasina nikalne wala",
  "lode ke tatte ka tel banane wala",
  "gand ke baal ka khoon pine wala",
  "chut ke baal ka tel banane wala",
  "lund ke tatto ka pasina chaatne wala",
  "chut faadne wali maa ki gaand todne wala",
  "behen ki chut faadne wala suar",
  "maa ke tatte faadne wala gadha",
  "gand chaatne wali gali ki randi",
  "chut chaatne wali gali ki randi",
  "lund chaatne wala gali ka kutta",
  "tatte chaatne wala gali ka suar",
  "gaand ka pyas bujhane wala harami",
  "chut ka pyas bujhane wala harami",
  "lund todne wala randi ka beta",
  "maa ki chut todne wala haramzada",
  "behen ki chut todne wala haramzada",
  "maa ke tatte todne wala nalayak",
  "chut ke tel me tatti milane wala",
  "gaand ke tel me mootne wala harami",
  "chut ke khoon me hagne wala suar",
  "maa ki chut ka doodh pine wala kutta",
  "behen ki chut ka doodh pine wala kutta",
  "randi ki chut ka doodh pine wala suar",
  "maa ki chut ka ras chaatne wala nalayak",
  "behen ki chut ka ras chaatne wala nalayak",
  "gand ke ras ka pyasa kutta",
  "maa ke lode ka ras pine wala harami",
  "behen ke tatte ka ras pine wala harami",
  "chut ka khoon chaatne wala bhosdike",
  "gaand ka khoon chaatne wala bhosdike",
  "laude ke tatte todne wala harami",
  "maa-behen ki chut ka bazaar lagane wala",
  "maa ki chut ke baal ghumane wala",
  "behen ki chut ke baal todne wala",
  "maa ki gaand ke baal ka tel banane wala",
  "behen ki gaand ke baal todne wala",
  "maa ke lode ke baal faadne wala",
  "behen ke tatto ke baal faadne wala",
  "maa ki chut ke tatte todne wala",
  "behen ki chut ke tatte todne wala",
  "maa ke gaand ke tatte todne wala",
  "behen ke gaand ke tatte todne wala",
  "maa ki chut ke ras me tatti milane wala",
  "behen ki chut ke ras me mootne wala",
  "maa ke lode ke ras me hagne wala",
  "behen ke lode ke ras me hagne wala",
  "maa ke gaand ke ras chaatne wala",
  "behen ke gaand ke ras chaatne wala",
  "maa ke tatto ke ras chaatne wala",
  "behen ke tatto ke ras chaatne wala",
  "maa ke chut ke khoon peene wala",
  "behen ke chut ke khoon peene wala",
  "maa ke gaand ke khoon peene wala",
  "behen ke gaand ke khoon peene wala",
  "maa ke lode ke khoon peene wala",
  "behen ke lode ke khoon peene wala",
  "maa ke tatte ke khoon peene wala",
  "behen ke tatte ke khoon peene wala",
  "maa ke chut ke paani chaatne wala",
  "behen ke chut ke paani chaatne wala",
  "maa ke gaand ke paani chaatne wala",
  "behen ke gaand ke paani chaatne wala",
  "maa ke lode ke paani chaatne wala",
  "behen ke lode ke paani chaatne wala",
  "maa ke tatte ke paani chaatne wala",
  "behen ke tatte ke paani chaatne wala",
  "maa ke chut ke tel banane wala",
  "behen ke chut ke tel banane wala",
  "maa ke gaand ke tel banane wala",
  "behen ke gaand ke tel banane wala",
  "maa ke lode ke tel banane wala",
  "behen ke lode ke tel banane wala",
  "maa ke tatte ke tel banane wala",
  "behen ke tatte ke tel banane wala",
  "maa ke chut ke doodh banane wala",
  "behen ke chut ke doodh banane wala",
  "maa ke gaand ke doodh banane wala",
  "behen ke gaand ke doodh banane wala",
  "maa ke lode ke doodh banane wala",
  "behen ke lode ke doodh banane wala",
  "maa ke tatte ke doodh banane wala",
  "behen ke tatte ke doodh banane wala",
  "maa-behen ki chut aur gaand bechne wala"
];

let usedReplies = new Set(); // to avoid repeats

function getFakeReply() {
  if (usedReplies.size === fakeGaaliReplies.length) {
    usedReplies.clear(); // reset if all used
  }
  let reply;
  do {
    reply = fakeGaaliReplies[Math.floor(Math.random() * fakeGaaliReplies.length)];
  } while (usedReplies.has(reply));
  usedReplies.add(reply);
  return reply;
}

// 🟥 Universal Gaali Detector
function isGaali(text) {
  const msg = text.toLowerCase();

  // If "rehan" => no gaali
  if (msg.includes("rehan")) return false;

  // Family words or abusive triggers
  const keywords = [
    "mc","m.c","bc","b.c","bsdk",
    "madar","bhen","chod","chut","lund","loda",
    "gaand","gand","tatte","tatto",
    "randi","rand","suar","kutte","haram","aulad",
    "moot","jhaat","jhat","balatkar",
    "maa","mom","mummy",
    "behen","sister","didi",
    "chup","baklol"
  ];

  if (keywords.some(k => msg.includes(k))) return true;

  const regexPatterns = [
    /m[\W_]*c/i,
    /b[\W_]*c/i,
    /chut+[iy]?[a]*/i,
    /g[a|aa]nd/i,
    /l+u+nd/i,
    /l+o+da/i,
    /r+a+n+d/i
  ];

  return regexPatterns.some(r => r.test(text));
}

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "message required" });

    // 🟥 Rehan special case
    if (message.toLowerCase().includes("rehan")) {
      return res.json({ reply: "Rehan mera papa hai, main unko kuch nahi bol sakta." });
    }

    // 🟥 Gaali case → Fake AI
    if (isGaali(message)) {
      return res.json({ reply: getFakeReply() });
    }

    // 🟩 Normal → OpenAI
    const systemPrompt = `
      Tu ek AI hai jo friendly Hinglish me reply karta hai.
      Thoda roast kar sakta hai but gaali kabhi nahi dega.
      Agar koi puche "kisne banaya hai tumko", toh hamesha bol: "Mujhe God ne banaya hai".
      Agar koi kisi website ka link maange (jaise Flipkart, Fitgirl), toh seedha https:// + site ka link de.
    `;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 500,
        temperature: 1.0,
      }),
    });

    const data = await r.json();
    let reply = data.choices?.[0]?.message?.content ?? "No reply.";
    res.json({ reply });

  } catch (err) {
    console.error("Error in /api/chat:", err);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log("✅ Server running at http://localhost:" + port)
);
