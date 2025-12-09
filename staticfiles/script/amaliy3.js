function startSimulationAmaliy3() {
    console.log("Function called");
    const mass = parseFloat(document.getElementById("massaInput").value);
    const Fx = parseFloat(document.getElementById("FxInput").value);
    const Fy = parseFloat(document.getElementById("FyInput").value);
    console.log("Input values:", mass, Fx, Fy);

    if (isNaN(mass) || isNaN(Fx) || isNaN(Fy) || mass <= 0) {
        alert("❌ Iltimos, barcha qiymatlarni to‘g‘ri kiriting.");
        return;
    }

    // Hisoblash
    const ax = Fx / mass;
    const ay = Fy / mass;
    const a = Math.sqrt(ax * ax + ay * ay);

    // Canvas tayyorlash
    const container = document.getElementById("simulyatsiya-container-3");
    container.innerHTML = "";  // eski chizmalarni o‘chirish

    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 300;
    canvas.style.border = "1px solid #888";
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    ctx.font = "16px Arial";  // Yozuvlar uchun font

    // Boshlang‘ich qiymatlar
    let x = 50, y = 200;
    let vx = 0, vy = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 🔵 Harakatlanuvchi nuqta
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, 2 * Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();

        // 🔴 aₓ vektori
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + ax * 50, y);
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.fillText("aₓ", x + ax * 50 + 5, y + 10);

        // 🟢 aᵧ vektori
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - ay * 50);
        ctx.strokeStyle = "green";
        ctx.stroke();
        ctx.fillText("aᵧ", x + 5, y - ay * 50 - 5);

        // Harakatni yangilash
        vx += ax * 0.2;
        vy += ay * 0.2;
        x += vx;
        y += vy;

        // Ekrandan chiqmaguncha davom etsin
        if (x < canvas.width && y < canvas.height && x > 0 && y > 0) {
            requestAnimationFrame(draw);
        }
    }

    draw();
}
