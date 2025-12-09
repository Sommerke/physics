function startSimulationAmaliy8() {
  const C = parseFloat(document.getElementById("capacitanceInput").value) * 1e-12;
  const V = parseFloat(document.getElementById("voltageInput").value);
  const d = parseFloat(document.getElementById("distanceInput").value) / 1000;

  if (isNaN(C) || isNaN(V) || isNaN(d) || C <= 0 || V <= 0 || d <= 0) {
    alert("❌ Iltimos, sig‘im (pF), kuchlanish (V) va masofani (mm) to‘g‘ri kiriting.");
    return;
  }

  const epsilon0 = 8.85e-12;
  const S = (C * d) / epsilon0;
  const F = 0.5 * epsilon0 * V * V * S / (d * d);

  const container = document.getElementById("condensator-container");
  container.innerHTML = "";

  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 300;
  canvas.style.border = "1px solid #aaa";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  // Dastlabki plastinka koordinatalari
  let topY = 80;
  let bottomY = 200;
  let velocity = 0;
  let acceleration = F * 5;
  let finished = false;
  let startTime = null;
  let finalTime = null;

  function draw(timestamp) {
    if (!startTime) startTime = timestamp;
    const timeElapsed = ((timestamp - startTime) / 1000).toFixed(2);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Chiziqlar
    ctx.fillStyle = "#007bff";
    ctx.fillRect(100, topY, 400, 10); // Yuqori
    ctx.fillRect(100, bottomY, 400, 10); // Pastki

    // Elektr maydon chiziqlari
    ctx.strokeStyle = "rgba(255, 0, 0, 0.4)";
    for (let i = 120; i < 480; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, topY + 10);
      ctx.lineTo(i, bottomY);
      ctx.stroke();
    }

    // Matnlar
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(`Kuch: ${F.toFixed(4)} N`, 100, 30);
    ctx.fillText(`Plastinkalar orasidagi masofa: ${(bottomY - topY)} px`, 100, 50);
    ctx.fillText(`⏱️ Vaqt: ${timeElapsed} s`, 100, 70);

    // Harakat
    if ((bottomY - topY) > 40 && !finished) {
      velocity += acceleration;
      topY += velocity;
      bottomY -= velocity;
      requestAnimationFrame(draw);
    } else if (!finished) {
      finished = true;
      finalTime = timeElapsed;
      // Vibratsiya boshlanadi
      let vibrateFrame = 0;

      function vibrate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let dy = 2 * Math.sin(vibrateFrame / 2);
        ctx.fillStyle = "#007bff";
        ctx.fillRect(100, topY + dy, 400, 10);
        ctx.fillRect(100, bottomY - dy, 400, 10);

        // Elektr maydon chiziqlari
        ctx.strokeStyle = "rgba(255, 0, 0, 0.4)";
        for (let i = 120; i < 480; i += 40) {
          ctx.beginPath();
          ctx.moveTo(i, topY + dy + 10);
          ctx.lineTo(i, bottomY - dy);
          ctx.stroke();
        }

        // Matnlarni qayta chizamiz
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.fillText(`Kuch: ${F.toFixed(4)} N`, 100, 30);
        ctx.fillText(`Plastinkalar orasidagi masofa: ${(bottomY - topY)} px`, 100, 50);
        ctx.fillText(`⏱️ Vaqt: ${finalTime} s`, 100, 70);

        // Yaqinlashganlik xabari
        ctx.fillStyle = "green";
        ctx.fillText(" Plastinkalar yaqinlashdi (Kuch maksimal!)", 100, 270);

        vibrateFrame++;
        if (vibrateFrame < 20) {
          requestAnimationFrame(vibrate);
        }
      }

      vibrate();
    }
  }

  requestAnimationFrame(draw);
}
