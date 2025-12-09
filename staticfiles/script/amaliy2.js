function startSimulationAmaliy2() {
    
    const R = parseFloat(document.getElementById("radiusInput").value);
    const omega = parseFloat(document.getElementById("omegaInput").value);
    const natijaEl = document.getElementById("natija");

    if (isNaN(R) || isNaN(omega)) {
        natijaEl.textContent = "❌ Radius va burchakli tezlikni to‘g‘ri kiriting.";
        return;
    }

    const v = omega * R;
    natijaEl.innerHTML = `✅ <strong>Chiziqli tezlik</strong>: v = ω × R = ${omega} × ${R} = <strong>${v.toFixed(2)} m/s</strong>`;

    const container = document.getElementById("simulyatsiya-container");
    if (!container) return;

    container.innerHTML = "";

    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 300;
    canvas.style.border = "1px solid #aaa";
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = R * 50;

    let angle = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (!canvas) {
    alert("⚠️ canvas topilmadi");
    return;
  }


        // Aylana
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = "#999";
        ctx.stroke();

        // Nuqta
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();

        angle += omega * 0.02;
        requestAnimationFrame(draw);
    }

    draw();
}

