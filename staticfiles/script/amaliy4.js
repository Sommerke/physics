function startSimulationAmaliy4() {
    const m = parseFloat(document.getElementById("massInput").value);
    const k = parseFloat(document.getElementById("kInput").value);
    const mu = parseFloat(document.getElementById("muInput").value);
    const a = parseFloat(document.getElementById("aInput").value);

    if (isNaN(m) || isNaN(k) || isNaN(mu) || isNaN(a) || m <= 0 || k <= 0) {
        alert("❌ Iltimos, barcha qiymatlarni to‘g‘ri kiriting.");
        return;
    }

    const g = 9.8;
    const Ff = mu * m * g;
    const x = (m * a + Ff) / k; // prujinaning cho‘zilishi

    // DOM
    const container = document.getElementById("spring-container");
    container.innerHTML = "";

    const canvas = document.createElement("canvas");
    canvas.width = 700;
    canvas.height = 300;
    canvas.style.border = "1px solid #ccc";
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    let blockX = 100;
    const blockY = 150;
    const springStartX = 20;
    const springRestLength = 80;
    const springStretchedLength = springRestLength + x * 100;
    const blockWidth = 60;

    let frame = 0;

    function drawFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 🧵 Prujina (simple line)
        ctx.beginPath();
        ctx.moveTo(springStartX, blockY);
        ctx.lineTo(blockX, blockY);
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 5;
        ctx.stroke();

        // 🔷 Yog'och blok
        ctx.fillStyle = "#3399cc";
        ctx.fillRect(blockX, blockY - 30, blockWidth, 60);

        // 📐 Vektorlar
        ctx.beginPath();
        ctx.moveTo(blockX + blockWidth / 2, blockY - 40);
        ctx.lineTo(blockX + blockWidth / 2 + a * 50, blockY - 40);
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.fillStyle = "red";
        ctx.fillText("a", blockX + blockWidth / 2 + a * 50 + 5, blockY - 35);

        // Matn: prujina cho‘zilishi
        ctx.fillStyle = "#000";
        ctx.font = "16px Arial";
        ctx.fillText(`Prujinaning cho‘zilishi: ${x.toFixed(2)} m`, 400, 30);

        // Harakat
        blockX += a * 0.5;
        if (blockX < canvas.width - 100) {
            requestAnimationFrame(drawFrame);
        }
    }

    drawFrame();
}

