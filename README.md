# Universal-Video-Downloader
# Universal Video Downloader

A web-based application that allows users to download videos and audio from multiple platforms using a Node.js backend.

---

## Overview

This project demonstrates backend processing, media extraction, and file streaming. Users can provide a video URL, preview metadata, and download content in different formats and qualities.

---

## Features

- Download videos in MP4 format  
- Extract audio in MP3 format  
- Select video quality (360p, 480p, 720p, Best)  
- Supports multiple public platforms  
- Displays video title and thumbnail  
- Simple and responsive user interface  

---

## Tech Stack

- Frontend: HTML, CSS, JavaScript  
- Backend: Node.js with Express  
- Media Processing: yt-dlp  
- Audio Conversion: FFmpeg  

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/video-downloader.git
cd video-downloader
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Install Python

```bash
brew install python
```

Verify installation:

```bash
python --version
```

---

### 4. Install yt-dlp

```bash
pip3 install yt-dlp
```

---

### 5. Install FFmpeg

```bash
brew install ffmpeg
```

Verify:

```bash
ffmpeg -version
```

---

### 6. Install additional package

```bash
npm install yt-dlp-exec
```

---

### 7. Run the application

```bash
node server.js
```

---

### 8. Access the application

Open in browser:

```
http://localhost:3000
```

---

## Usage

1. Enter a valid video URL  
2. Click "Fetch Video"  
3. Select format and quality  
4. Download the file  

---

## Notes

- Works with publicly accessible videos only  
- Some platforms may restrict downloads  
- Intended for educational and demonstration purposes  

---

## Deployment

This application can be deployed on platforms like Render or Railway.

---

## Author

Vivek Maini
