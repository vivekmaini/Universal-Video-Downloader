async function getVideo() {
  const url = document.getElementById("url").value;
  const format = document.getElementById("format").value;
  const quality = document.getElementById("quality").value;

  const loader = document.getElementById("loader");
  const result = document.getElementById("result");

  loader.style.display = "block";
  result.innerHTML = "";

  try {
    const res = await fetch(`/info?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    loader.style.display = "none";

    if (data.error) {
      result.innerHTML = "❌ Invalid link!";
      return;
    }

    // ✅ FINAL FIX HERE
    result.innerHTML = `
      <h3>${data.title}</h3>
      <img src="${data.thumbnail}">
      <br><br>

      <button class="download-btn"
        onclick="startDownload('${encodeURIComponent(url)}','${format}','${quality}')">
        ⬇ Download Now
      </button>

      <p id="status"></p>
    `;

  } catch {
    loader.style.display = "none";
    result.innerHTML = "❌ Error fetching data";
  }
}

function startDownload(url, format, quality) {
  const status = document.getElementById("status");
  status.innerText = "⬇ Download started...";
  window.open(`/download?url=${url}&format=${format}&quality=${quality}`);
}

function toggleTheme() {
  document.body.classList.toggle("light");

  const btn = document.querySelector(".theme-btn");

  if (document.body.classList.contains("light")) {
    btn.innerText = "☀️";
  } else {
    btn.innerText = "🌙";
  }
}

result.innerHTML = `
  <h3>${data.title}</h3>
  <img src="${data.thumbnail}">
  <br><br>

  <button class="download-btn" 
    onclick="startDownload('${encodeURIComponent(url)}','${format}','${quality}')">
    ⬇ Download Now
  </button>

  <p id="status"></p>
`;