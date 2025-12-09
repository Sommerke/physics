function startSimulationAmaliy11() {
  const N = parseFloat(document.getElementById("nInput").value);          // o‘ramlar soni
  const S = parseFloat(document.getElementById("sInput").value) / 10000;  // sm² → m²
  const E = parseFloat(document.getElementById("eykInput").value) / 1000; // mV → V
  const t = parseFloat(document.getElementById("tInput").value);          // s

  const resultBox = document.getElementById("resultAmaliy11");
  const container = document.getElementById("amaliy11-container");

  if (isNaN(N) || isNaN(S) || isNaN(E) || isNaN(t) || N <= 0 || S <= 0 || E <= 0 || t <= 0) {
    resultBox.className = "alert alert-danger";
    resultBox.innerHTML = "❌ Iltimos, barcha qiymatlarni to‘g‘ri kiriting!";
    return;
  }

  // Magnit induksiya B ni hisoblash
  const dPhi = N * S * (Math.cos(0) - Math.cos(Math.PI / 2)); // cos(0) - cos(90°) = 1
  const B = E * t / dPhi;

  resultBox.className = "alert alert-success fw-bold";
  resultBox.innerHTML = `Hisoblangan magnit induksiya: <b>${B.toFixed(3)} T</b>`;

  // 🎬 Canvas animatsiyasi
  container.innerHTML = "";
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 350;
  canvas.style.border = "1px solid gray";
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  let angle = 0; // boshlang'ich burchak (radyan)
  let startTime = null;

  function drawFrame(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = (timestamp - startTime) / 1000; // sekundlarda

    // har 90° ga t sekundda buriladi → burchak = π/2 * (elapsed / t)
    angle = Math.min(Math.PI / 2, (Math.PI / 2) * (elapsed / t));

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ramka
    ctx.save();
    ctx.translate(300, 150);
    ctx.rotate(angle);
    ctx.fillStyle = "#007bff";
    ctx.fillRect(-60, -60, 120, 120);
    ctx.restore();

    // Magnit oqimi va EYK
    const phi = B * S * Math.cos(angle);
    const eykInst = Math.abs(-B * S * Math.sin(angle) * (Math.PI / 2) / t);

    // Oqim chiziqlari
    for (let y = 0; y < 300; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(600, y);
      ctx.strokeStyle = "rgba(255,0,0,0.1)";
      ctx.stroke();
    }

    // Matnlar
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(`Burilish burchagi: ${(angle * 180 / Math.PI).toFixed(1)}°`, 20, 300);
    ctx.fillText(`Magnit oqimi (Φ): ${phi.toFixed(5)} Wb`, 20, 320);
    ctx.fillText(`Induksiya kuchi (EYK): ${eykInst.toFixed(3)} V`, 20, 340);

    if (angle < Math.PI / 2) {
      requestAnimationFrame(drawFrame);
    } else {
      ctx.fillStyle = "green";
      ctx.fillText(" Ramka burilishi yakunlandi", 20, 250);
    }
  }

  requestAnimationFrame(drawFrame);
}
