function startAmaliy10Simulation() {
  const Vmax = parseFloat(document.getElementById("vmaxInput").value);
  const Vdesired = parseFloat(document.getElementById("vdesiredInput").value);
  const Rinternal = parseFloat(document.getElementById("rInternalInput").value);

  const resultBox = document.getElementById("resultAmaliy10");
  const canvas = document.getElementById("voltmetrCanvas");
  const ctx = canvas.getContext("2d");

  if (
    isNaN(Vmax) || isNaN(Vdesired) || isNaN(Rinternal) ||
    Vmax <= 0 || Vdesired <= Vmax || Rinternal <= 0
  ) {
    resultBox.className = "alert alert-danger";
    resultBox.innerHTML = "❌ Iltimos, qiymatlarni to‘g‘ri va mos kiriting (Vdesired > Vmax).";
    return;
  }

  const Radd = Rinternal * (Vdesired / Vmax - 1);

  // Raqamli animatsiya: natijani asta-sekin ko‘rsatish
  let current = 0;
  function animateText() {
    resultBox.className = "alert alert-success fw-bold";
    resultBox.innerHTML = `<b>Qo‘shimcha ketma-ket ulanadigan qarshilik:</b> ${current.toFixed(1)} Ω`;
    if (current < Radd) {
      current += Radd / 50;
      requestAnimationFrame(animateText);
    } else {
      resultBox.innerHTML = `<b>Qo‘shimcha ketma-ket ulanadigan qarshilik:</b> ${Radd.toFixed(2)} Ω`;
    }
  }

  animateText();

  // Vizual simulyatsiya
  drawCircuit(ctx, Vmax, Vdesired, Rinternal, Radd);
}


function drawCircuit(ctx, Vmax, Vdesired, Rint, Radd) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  let progress = 0;

  function animate() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Voltmetr bloki
    ctx.fillStyle = "#007bff";
    ctx.fillRect(100, 80, 100, 50);
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText("Voltmetr", 120, 110);

    // Qo‘shimcha qarshilik – asta-sekin chiziladi
    const barWidth = Math.min(100, progress);
    ctx.fillStyle = "#ffc107";
    ctx.fillRect(220, 80, barWidth, 50);
    if (progress >= 100) {
      ctx.fillStyle = "black";
      ctx.fillText("R qo‘sh: " + Radd.toFixed(1) + "Ω", 230, 110);
    }

    // Zanjir – kuchlanishga qarab rang o‘zgaradi
    ctx.beginPath();
    const wireColor = Vdesired > 700 ? "#dc3545" : Vdesired > 400 ? "#ffc107" : "#28a745";
    ctx.strokeStyle = wireColor;
    ctx.lineWidth = 3;
    ctx.moveTo(50, 105);
    ctx.lineTo(100, 105); // → Voltmetr
    ctx.lineTo(200, 105);
    ctx.lineTo(220, 105); // → qo‘shimcha qarshilik
    ctx.lineTo(320, 105);
    ctx.lineTo(320, 150); // ↓ pastga
    ctx.lineTo(50, 150);  // ← chapga
    ctx.lineTo(50, 105);  // ↑ yopiladi
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.fillText("Umumiy kuchlanish: " + Vdesired + " V", 100, 180);

    if (progress < 100) {
      progress += 2;
      requestAnimationFrame(animate);
    }
  }

  animate();
}
