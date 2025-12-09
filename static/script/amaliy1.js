let canvas, ctx, interval;
let pos = 0, v = 20, totalDistance = 1200;
let t = 0, stopAt = totalDistance / v;
let pixelScale = 450 / totalDistance;
let kolonnaLengthPx = 250;
let shaharchaStartX = 100, shaharchaWidth = 350;

function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Shaharcha
  ctx.fillStyle = "#e0e0e0";
  ctx.fillRect(shaharchaStartX, 100, shaharchaWidth, 60);
  ctx.fillStyle = "red";
  ctx.fillRect(shaharchaStartX, 100, 3, 60);
  ctx.fillStyle = "green";
  ctx.fillRect(shaharchaStartX + shaharchaWidth, 100, 3, 60);

  // Kolonna
  ctx.fillStyle = "#007bff";
  ctx.fillRect(shaharchaStartX + pos, 105, kolonnaLengthPx, 50);

  // Matnlar
  ctx.fillStyle = "black";
  ctx.font = "14px Arial";
  ctx.fillText("🚛 BOSHI", shaharchaStartX + pos, 100);
  ctx.fillText("OXIRI 🚛", shaharchaStartX + pos + kolonnaLengthPx - 50, 180);

  // Yo‘l
  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(50, 160);
  ctx.lineTo(550, 160);
  ctx.stroke();

  // Vaqt va masofa
  ctx.fillText(`t = ${t.toFixed(1)} s`, 20, 30);
  ctx.fillText(`Boshi: ${Math.round(pos / pixelScale)} m`, 20, 50);
  ctx.fillText(`Oxiri: ${Math.round((pos + kolonnaLengthPx) / pixelScale)} m`, 20, 70);

  if (t >= stopAt) {
    clearInterval(interval);
    ctx.fillStyle = "darkgreen";
    ctx.fillText("🏁 Kolonna shaharchadan chiqdi!", 120, 250);
  }
}

function startMotion() {
  canvas = document.getElementById("motionCanvas");

  if (!canvas) {
    alert("⚠️ canvas topilmadi");
    return;
  }

  ctx = canvas.getContext("2d");

  clearInterval(interval);
  pos = 0;
  t = 0;

  drawScene();

  interval = setInterval(() => {
    if (t >= stopAt) {
      drawScene();
      return;
    }
    t += 0.1;
    pos += (v / 10) * pixelScale;
    drawScene();
  }, 100);
}
