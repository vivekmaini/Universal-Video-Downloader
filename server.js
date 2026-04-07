const express = require("express");
const ytDlp = require("yt-dlp-exec");

const app = express();

app.use(express.static(__dirname));

// INFO API
app.get("/info", async (req, res) => {
  try {
    const url = req.query.url;

    const info = await ytDlp(url, {
      dumpSingleJson: true
    });

    res.json({
      title: info.title,
      thumbnail: info.thumbnail
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Invalid link" });
  }
});

// DOWNLOAD API
app.get("/download", async (req, res) => {
  try {
    const url = req.query.url;
    const format = req.query.format;
    const quality = req.query.quality;

    let ytFormat = "best";

    if (quality === "720") ytFormat = "bestvideo[height<=720]+bestaudio";
    else if (quality === "480") ytFormat = "bestvideo[height<=480]+bestaudio";
    else if (quality === "360") ytFormat = "bestvideo[height<=360]+bestaudio";

    if (format === "mp3") {
      res.header("Content-Disposition", "attachment; filename=audio.mp3");

      const process = ytDlp.exec(url, {
        extractAudio: true,
        audioFormat: "mp3",
        output: "-"
      });

      process.stdout.pipe(res);
    } else {
      res.header("Content-Disposition", "attachment; filename=video.mp4");

      const process = ytDlp.exec(url, {
        format: ytFormat,
        output: "-"
      });

      process.stdout.pipe(res);
    }

  } catch (err) {
    console.log(err);
    res.status(500).send("Download failed");
  }
});

// PORT FIX (deployment ready)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});