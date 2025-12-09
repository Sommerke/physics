function startSimulationAmaliy6() {
  const Q = parseFloat(document.getElementById("qInput").value);
  if (isNaN(Q) || Q <= 0) {
    alert("❌ Iltimos, ijobiy issiqlik qiymatini kiriting (masalan: 14)");
    return;
  }

  const container = document.getElementById("iso-container");
  container.innerHTML = "";

  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 300;
  canvas.style.border = "1px solid #aaa";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  // Parametrlar
  let pistonX = 100;
  const pistonY = 80;
  const pistonHeight = 140;
  const pistonWidth = 30;
  const pistonMaxX = 420;

  let workDone = 0;
  let velocity = Q / 120;
  let heatFrame = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1️⃣ Silindr devori
    ctx.fillStyle = "#ddd";
    ctx.fillRect(50, pistonY, 400, pistonHeight);
    ctx.strokeRect(50, pistonY, 400, pistonHeight);

    // 2️⃣ Gaz ichidagi rangli fon (ko‘proq gaz – to‘liq to‘ldiradi)
    ctx.fillStyle = "#ffe082"; // sariq
    ctx.fillRect(50, pistonY + 2, pistonX - 50, pistonHeight - 4);

    // 3️⃣ Issiqlik oqimi (animatsiya)
    ctx.strokeStyle = "orange";
    for (let i = 0; i < 6; i++) {
      const x = 460 + ((heatFrame + i * 40) % 100);
      ctx.beginPath();
      ctx.moveTo(x, pistonY + 10);
      ctx.lineTo(x, pistonY + pistonHeight - 10);
      ctx.stroke();
    }

    // 4️⃣ Porshen
    ctx.fillStyle = "#2196f3";
    ctx.fillRect(pistonX, pistonY, pistonWidth, pistonHeight);

    // 5️⃣ Matnlar
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText(`Q = ${Q} J`, 50, 25);
    ctx.fillText(`A = ${workDone.toFixed(2)} J`, 50, 45);
    ctx.fillText(`Izotermik kengayish: Q = A`, 50, 65);

    // 6️⃣ Harakat
    if (pistonX < pistonMaxX) {
      pistonX += velocity * 0.3;
      workDone += velocity * 0.3;
      heatFrame += 1;
      requestAnimationFrame(draw);
    } else {
      ctx.fillStyle = "green";
      ctx.fillText(" Kengayish yakunlandi", 50, 280);
    }
  }

  draw();
}

