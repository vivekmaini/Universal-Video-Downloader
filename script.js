async function getVideo() {
  const url = document.getElementById("url").value;
  const format = document.getElementById("format").value;
  const quality = document.getElementById("quality").value;

  const res = await fetch(`/info?url=${encodeURIComponent(url)}`);
  const data = await res.json();

  document.getElementById("result").innerHTML = `
    <h3>${data.title}</h3>
    <img src="${data.thumbnail}">
    <br><br>
    <a href="/download?url=${encodeURIComponent(url)}&format=${format}&quality=${quality}">
      <button> Download Now</button>
    </a>
  `;
}