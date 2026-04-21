const express = require("express");
const ytDlp = require("yt-dlp-exec");

const app = express();

app.use(express.static(__dirname));
app.use(express.json());

// 🔹 URL clean + normalize
function cleanUrl(url) {
  if (!url) return "";

  url = url.split("?")[0];

  // youtu.be → youtube.com
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1];
    url = `https://www.youtube.com/watch?v=${id}`;
  }

  return url;
}

// 🔹 COMMON OPTIONS (IMPORTANT)
const baseOptions = {
  noCheckCertificates: true,
  noWarnings: true,
  preferFreeFormats: true,

  addHeader: [
    "user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "accept-language:en-US,en;q=0.9",
    "referer:https://www.youtube.com/"
  ],

  extractorArgs: "youtube:player_client=android,web,ios",

  retries: 5,
  sleepInterval: 3,
  concurrentFragments: 1,
};

// ================= INFO =================
app.get("/info", async (req, res) => {
  try {
    let url = cleanUrl(req.query.url);

    let info;

    // 🔥 Try 1
    try {
      info = await ytDlp(url, {
        ...baseOptions,
        dumpSingleJson: true,
      });
    } catch {
      // 🔥 Try 2 (fallback)
      info = await ytDlp(url, {
        ...baseOptions,
        dumpSingleJson: true,
        extractorArgs: "youtube:player_client=web"
      });
    }

    res.json({
      title: info.title,
      thumbnail: info.thumbnail,
    });

  } catch (err) {
    console.log("INFO ERROR:", err.stderr || err.message);

    res.json({
      error: "Video blocked or unsupported (try another link)"
    });
  }
});

// ================= DOWNLOAD =================
app.get("/download", async (req, res) => {
  try {
    let url = cleanUrl(req.query.url);
    const format = req.query.format;

    const info = await ytDlp(url, {
      ...baseOptions,
      dumpSingleJson: true,
    });

    let title = info.title
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "_");

    const filename = `${title}_${Date.now()}`;

    // 🔥 MP3
    if (format === "mp3") {
      res.header(
        "Content-Disposition",
        `attachment; filename="${filename}.mp3"`
      );

      const process = ytDlp.exec(url, {
        ...baseOptions,
        extractAudio: true,
        audioFormat: "mp3",
        output: "-"
      });

      process.stdout.pipe(res);

      process.on("error", () => {
        res.status(500).send("Audio download blocked");
      });

    } 
    // 🔥 MP4
    else {
      res.header(
        "Content-Disposition",
        `attachment; filename="${filename}.mp4"`
      );

      const process = ytDlp.exec(url, {
        ...baseOptions,
        format: "best", // simple (stable)
        output: "-"
      });

      process.stdout.pipe(res);

      process.on("error", () => {
        res.status(500).send("Video download blocked");
      });
    }

  } catch (err) {
    console.log("DOWNLOAD ERROR:", err.stderr || err.message);

    res.status(500).send("Download failed (try another video)");
  }
});

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// ================= START =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
