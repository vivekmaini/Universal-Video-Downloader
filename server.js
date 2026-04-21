const express = require("express");
const ytDlp = require("yt-dlp-exec");

const app = express();

app.use(express.static(__dirname));
app.use(express.json());

// URL clean function
function cleanUrl(url) {
  if (!url) return "";
  return url.split("&")[0]; // remove extra params
}

// COMMON yt-dlp options (IMPORTANT)
const ytdlpOptions = {
  noCheckCertificates: true,
  noWarnings: true,
  preferFreeFormats: true,
  addHeader: [
    "user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "accept-language:en-US,en;q=0.9"
  ],
  extractorArgs: "youtube:player_client=android"
};

// INFO API
app.get("/info", async (req, res) => {
  try {
    let url = cleanUrl(req.query.url);

    const info = await ytDlp(url, {
      ...ytdlpOptions,
      dumpSingleJson: true
    });

    res.json({
      title: info.title,
      thumbnail: info.thumbnail
    });

  } catch (err) {
    console.log("INFO ERROR:", err.stderr || err.message);

    res.json({
      error: "Video fetch failed. Try another link."
    });
  }
});

// DOWNLOAD API
app.get("/download", async (req, res) => {
  try {
    let url = cleanUrl(req.query.url);
    const format = req.query.format;
    const quality = req.query.quality;

    const info = await ytDlp(url, {
      ...ytdlpOptions,
      dumpSingleJson: true
    });

    let title = info.title.replace(/[^\w\s]/gi, "").replace(/\s+/g, "_");
    const uniqueName = `${title}_${Date.now()}`;

    let ytFormat = "best";

    if (quality === "720") ytFormat = "bestvideo[height<=720]+bestaudio";
    else if (quality === "480") ytFormat = "bestvideo[height<=480]+bestaudio";
    else if (quality === "360") ytFormat = "bestvideo[height<=360]+bestaudio";

    if (format === "mp3") {
      res.header("Content-Disposition", `attachment; filename="${uniqueName}.mp3"`);

      const process = ytDlp.exec(url, {
        ...ytdlpOptions,
        extractAudio: true,
        audioFormat: "mp3",
        output: "-"
      });

      process.stdout.pipe(res);

    } else {
      res.header("Content-Disposition", `attachment; filename="${uniqueName}.mp4"`);

      const process = ytDlp.exec(url, {
        ...ytdlpOptions,
        format: ytFormat,
        output: "-"
      });

      process.stdout.pipe(res);
    }

  } catch (err) {
    console.log("DOWNLOAD ERROR:", err.stderr || err.message);

    res.status(500).send("Download failed. Try another video.");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
