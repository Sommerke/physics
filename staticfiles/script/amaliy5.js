function startSimulationAmaliy5() {
    const E = parseFloat(document.getElementById("energyInput").value);
    const v = parseFloat(document.getElementById("velocityInput").value);
    const T = parseFloat(document.getElementById("tempInput").value);

    if (isNaN(E) || isNaN(v) || isNaN(T) || v <= 0 || T <= 0) {
        alert("❌ Iltimos, barcha qiymatlarni to‘g‘ri kiriting.");
        return;
    }

    // Doimiylar
    const mu = 28; // Azotning molyar massasi (kg/kmol)
    const R = 8.31e3; // Gaz doimiysi (J/kmol·K)
    const V = 0.02; // Hajm m³

    // Massani topamiz
    const m = (2 * E) / (v * v); // kg

    // Bosim
    const p = (m / mu) * R * T / V; // N/m²

    // Natijani chiqarish
    const result = `
         <b>Azot massasi (kg):</b> ${m.toFixed(4)}<br>
         <b>Bosim (N/m²):</b> ${p.toExponential(2)}<br>
    `;
    document.getElementById("result-amaliy5").innerHTML = result;

    // 🔁 Simulyatsiya
    const container = document.getElementById("canvas-container");
    container.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.width = container.clientWidth;
    canvas.height = 300;
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    const particles = [];
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "blue";

        for (let p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
            if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    animate();
}
