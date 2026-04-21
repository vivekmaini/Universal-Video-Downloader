const express = require("express");
const ytDlp = require("yt-dlp-exec");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.static(__dirname));
app.use(express.json());

// 🔹 Clean URL
function cleanUrl(url) {
  if (!url) return "";
  url = url.split("?")[0];

  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1];
    url = `https://www.youtube.com/watch?v=${id}`;
  }

  return url;
}

// 🔹 COMMON OPTIONS
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
  geoBypass: true
};

// ================= INFO =================
app.get("/info", async (req, res) => {
  try {
    let url = cleanUrl(req.query.url);
    let info;

    try {
      info = await ytDlp(url, {
        ...baseOptions,
        dumpSingleJson: true
      });
    } catch {
      try {
        info = await ytDlp(url, {
          ...baseOptions,
          dumpSingleJson: true,
          extractorArgs: "youtube:player_client=web"
        });
      } catch {
        info = await ytDlp(url, {
          ...baseOptions,
          dumpSingleJson: true,
          extractorArgs: "youtube:player_client=android"
        });
      }
    }

    res.json({
      title: info.title,
      thumbnail: info.thumbnail,
      duration: info.duration,
      resolution: info.resolution
    });

  } catch (err) {
    console.log("INFO ERROR:", err.stderr || err.message);

    res.json({
      error: "Video not supported or restricted. Try another platform."
    });
  }
});

// ================= DOWNLOAD =================
app.get("/download", async (req, res) => {
  try {
    let url = cleanUrl(req.query.url);
    const format = req.query.format;
    const quality = req.query.quality;

    const info = await ytDlp(url, {
      ...baseOptions,
      dumpSingleJson: true
    });

    let title = info.title
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "_");

    const filename = `${title}_${Date.now()}`;

    // 🔹 Quality mapping (stable)
    let ytFormat = "best";

    if (quality === "720") ytFormat = "best[height<=720]";
    else if (quality === "480") ytFormat = "best[height<=480]";
    else if (quality === "360") ytFormat = "best[height<=360]";

    // 🔥 MP3
    if (format === "mp3") {
      const filePath = path.join(__dirname, `${filename}.mp3`);

      await ytDlp(url, {
        ...baseOptions,
        extractAudio: true,
        audioFormat: "mp3",
        output: filePath
      });

      res.download(filePath, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });

    } 
    // 🔥 MP4
    else {
      const filePath = path.join(__dirname, `${filename}.mp4`);

      await ytDlp(url, {
        ...baseOptions,
        format: ytFormat,
        output: filePath
      });

      res.download(filePath, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

  } catch (err) {
    console.log("DOWNLOAD ERROR:", err.stderr || err.message);

    res.status(500).send("Download failed. Platform may restrict this video.");
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
