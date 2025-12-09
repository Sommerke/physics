function startSimulationAmaliy13() {
  // Inputlarni olish
  const L = parseFloat(document.getElementById("LInput13").value) / 1000; // mH → H
  const d = parseFloat(document.getElementById("diameterInput13").value) / 100; // sm → m
  const s = parseFloat(document.getElementById("distanceInput13").value) / 100; // sm → m

  const resultBox = document.getElementById("resultAmaliy13");
  const container = document.getElementById("amaliy13-container");

  if (isNaN(L) || isNaN(d) || isNaN(s) || L <= 0 || d <= 0 || s <= 0) {
    resultBox.className = "alert alert-danger";
    resultBox.innerHTML = "❌ Iltimos, barcha qiymatlarni to‘g‘ri kiriting!";
    return;
  }

  // Kondensator sig‘imi (havo kondensatori): C = ε₀ * S / d
  const epsilon0 = 8.854e-12; // F/m
  const S = Math.PI * Math.pow(d / 2, 2); // m²
  const C = epsilon0 * S / s; // F

  // Tebranish davri: T = 2π * sqrt(L * C)
  const T = 2 * Math.PI * Math.sqrt(L * C); // s

  resultBox.className = "alert alert-success fw-bold";
  resultBox.innerHTML = `
    <b>Kondensator sig‘imi:</b> ${C.toExponential(3)} F<br>
    <b>Tebranish davri:</b> ${T.toFixed(5)} s
  `;

  // Vizualizatsiya
  container.innerHTML = "";
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 260;
  canvas.style.border = "1px solid gray";
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  // G‘altak (induktivlik)
  ctx.save();
  ctx.translate(100, 130);
  ctx.strokeStyle = "#007bff";
  ctx.lineWidth = 4;
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.arc(i * 12, 0, 10, Math.PI, 0);
    ctx.stroke();
  }
  ctx.restore();
  ctx.fillStyle = "black";
  ctx.font = "15px Arial";
  ctx.fillText("L", 100, 110);

  // Kondensator (ikkita disk)
  ctx.beginPath();
  ctx.arc(350, 90, d * 100 / 2, 0, 2 * Math.PI);
  ctx.strokeStyle = "#28a745";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(350, 170, d * 100 / 2, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.fillText("C", 350, 85);

  // Disklar orasidagi masofa
  ctx.beginPath();
  ctx.moveTo(350, 90 + d * 100 / 2);
  ctx.lineTo(350, 170 - d * 100 / 2);
  ctx.strokeStyle = "#dc3545";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillText(`s = ${s * 100} sm`, 355, 130);

  // Formulalar
  ctx.fillStyle = "black";
  ctx.font = "14px Arial";
  ctx.fillText(`T = 2π√(L·C) = ${T.toFixed(5)} s`, 20, 240);
}