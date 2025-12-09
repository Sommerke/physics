function startSimulationAmaliy7() {
  const q1 = parseFloat(document.getElementById('q1').value) * 1e-9; // nKl → Kl
  const q2 = parseFloat(document.getElementById('q2').value) * 1e-9;
  const r = parseFloat(document.getElementById('r').value) / 100;   // cm → m

  if (isNaN(q1) || isNaN(q2) || isNaN(r) || r <= 0) {
    alert("❌ Barcha qiymatlarni to‘g‘ri kiriting.");
    return;
  }

  const k = 9e9; // Kulon doimiysi
  const F = k * q1 * q2 / (r * r); // Newton

  document.getElementById("resultText").innerText =
    ` Taʼsir kuchi: F = ${F.toFixed(6)} N ≈ ${(F * 1000).toFixed(3)} mN`;

  drawKulonSimulation(F);
}

function drawKulonSimulation(F) {
  const canvas = document.getElementById("simCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const x1 = 100;
  const x2 = 500;
  const y = 125;

  // q1
  ctx.beginPath();
  ctx.arc(x1, y, 20, 0, 2 * Math.PI);
  ctx.fillStyle = "#ff4d4d";
  ctx.fill();
  ctx.fillStyle = "#000";
  ctx.fillText("q₁", x1 - 7, y + 5);

  // q2
  ctx.beginPath();
  ctx.arc(x2, y, 20, 0, 2 * Math.PI);
  ctx.fillStyle = "#4da6ff";
  ctx.fill();
  ctx.fillStyle = "#000";
  ctx.fillText("q₂", x2 - 7, y + 5);

  // Line between charges
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.moveTo(x1 + 20, y);
  ctx.lineTo(x2 - 20, y);
  ctx.stroke();

  // Force vectors
  const arrowLength = Math.min(F * 1e4, 100); // limit for display
  ctx.strokeStyle = "green";
  ctx.fillStyle = "green";

  // Left arrow (q₁)
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x1 - arrowLength, y);
  ctx.stroke();
  ctx.fillText("F", x1 - arrowLength - 10, y - 5);

  // Right arrow (q₂)
  ctx.beginPath();
  ctx.moveTo(x2, y);
  ctx.lineTo(x2 + arrowLength, y);
  ctx.stroke();
  ctx.fillText("F", x2 + arrowLength + 5, y - 5);
}
