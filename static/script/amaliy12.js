function startSimulationAmaliy12() {
  // Inputlarni olish
  const R = parseFloat(document.getElementById("rInput12").value); // Om
  const a = parseFloat(document.getElementById("aInput12").value) / 100; // sm → m
  const I = parseFloat(document.getElementById("iInput12").value) / 1000; // mA → A

  const resultBox = document.getElementById("resultAmaliy12");
  const container = document.getElementById("amaliy12-container");

  if (isNaN(R) || isNaN(a) || isNaN(I) || R <= 0 || a <= 0 || I <= 0) {
    resultBox.className = "alert alert-danger";
    resultBox.innerHTML = "❌ Iltimos, barcha qiymatlarni to‘g‘ri kiriting!";
    return;
  }

  // Kvadrat kontur yuzasi
  const S = a * a; // m²

  // Faraday qonuni: I = |dΦ/dt| / R → dΦ/dt = I * R
  const dPhi_dt = I * R; // Wb/s

  // Magnit oqimi Φ = B * S → dΦ/dt = S * dB/dt → dB/dt = dΦ/dt / S
  const dB_dt = dPhi_dt / S; // T/s

  resultBox.className = "alert alert-success fw-bold";
  resultBox.innerHTML = `
    <b>Magnit oqimi o‘zgarish tezligi:</b> ${dPhi_dt.toExponential(3)} Wb/s<br>
    <b>Magnit induksiya o‘zgarish tezligi:</b> ${dB_dt.toFixed(3)} T/s
  `;

  // Vizualizatsiya
  container.innerHTML = "";
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 300;
  canvas.style.border = "1px solid gray";
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  // Kvadrat kontur
  ctx.save();
  ctx.translate(250, 120);
  ctx.strokeStyle = "#007bff";
  ctx.lineWidth = 3;
  ctx.strokeRect(-50, -50, 100, 100);
  ctx.restore();

  // Magnit maydon chiziqlari
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(60 * i, 0);
    ctx.lineTo(60 * i, 300);
    ctx.strokeStyle = "rgba(0,200,0,0.2)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Tok kuchi va formulalar
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText(`Tok kuchi: ${I * 1000} mA`, 20, 270);
  ctx.fillText(`R = ${R} Ω, a = ${a * 100} sm`, 20, 290);
  ctx.fillText(`dΦ/dt = I·R = ${dPhi_dt.toExponential(2)} Wb/s`, 270, 270);
  ctx.fillText(`dB/dt = dΦ/dt / S = ${dB_dt.toFixed(3)} T/s`, 270, 290);
}