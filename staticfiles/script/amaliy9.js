function solveAmaliy9() {
  const eyk = parseFloat(document.getElementById("eykInput").value);
  const r = parseFloat(document.getElementById("rInput").value);
  const R = parseFloat(document.getElementById("rExtInput").value);
  const resultBox = document.getElementById("resultAmaliy9");

  if (isNaN(eyk) || isNaN(r) || isNaN(R) || eyk <= 0 || r <= 0 || R <= 0) {
    resultBox.style.display = "block";
    resultBox.className = "alert alert-danger";
    resultBox.innerHTML = "❌ Iltimos, barcha qiymatlarni to‘g‘ri va musbat kiriting!";
    return;
  }

  const I = eyk / (R + r); 
  const U = I * R;         

  resultBox.style.display = "block";
  resultBox.className = "alert alert-success fw-bold";
  resultBox.innerHTML = `
      Zanjirdagi tok kuchi: <b>${I.toFixed(2)} A</b><br>
      Rezistordagi kuchlanish: <b>${U.toFixed(2)} V</b>
  `;

  // 💡 Interaktiv animatsiya:
  const canvasContainer = document.getElementById("canvasBox");
  canvasContainer.innerHTML = ""; // oldingi chizmalarni tozalash
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 200;
  canvas.style.border = "1px solid #ccc";
  canvasContainer.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let electrons = Array.from({ length: 10 }, (_, i) => 50 + i * 50);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Manba (batareya)
    ctx.fillStyle = "#f39c12";
    ctx.fillRect(50, 70, 60, 60);
    ctx.fillStyle = "black";
    ctx.fillText("𝓔", 70, 105);

    // Ichki qarshilik
    ctx.fillStyle = "#ccc";
    ctx.fillRect(110, 85, 40, 30);
    ctx.fillStyle = "black";
    ctx.fillText("r", 125, 105);

    // Sim
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(150, 100);
    ctx.lineTo(300, 100);
    ctx.stroke();

    // Tashqi rezistor
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(300, 85, 60, 30);
    ctx.fillStyle = "white";
    ctx.fillText("R", 320, 105);

    // Sim tugashi
    ctx.beginPath();
    ctx.moveTo(360, 100);
    ctx.lineTo(550, 100);
    ctx.lineTo(550, 30);
    ctx.lineTo(50, 30);
    ctx.lineTo(50, 70);
    ctx.stroke();

    // Elektronlar (harakatlanuvchi aylanalar)
    ctx.fillStyle = "#3498db";
    electrons.forEach((x, i) => {
      ctx.beginPath();
      ctx.arc(x, 100, 6, 0, 2 * Math.PI);
      ctx.fill();
      electrons[i] += 1 + I * 5; // tezlik tok kuchiga proporsional
      if (electrons[i] > 550) electrons[i] = 50;
    });

    requestAnimationFrame(draw);
  }

  draw();
}
