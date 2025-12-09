function startSimulationAmaliy14() {
  // Inputlarni olish
  const lambda1 = parseFloat(document.getElementById("lambda1Input14").value); // nm
  const lambda2 = parseFloat(document.getElementById("lambda2Input14").value); // nm

  const resultBox = document.getElementById("resultAmaliy14");
  const container = document.getElementById("amaliy14-container");

  if (isNaN(lambda1) || isNaN(lambda2) || lambda1 <= 0 || lambda2 <= 0) {
    resultBox.className = "alert alert-danger";
    resultBox.innerHTML = "❌ Iltimos, to‘lqin uzunliklarini to‘g‘ri kiriting!";
    return;
  }

  // Interferensiya yo‘llari masofasi: Δx ~ λ
  const ratio = lambda2 / lambda1;

  resultBox.className = "alert alert-success fw-bold";
  resultBox.innerHTML = `
    <b>Yashil yorug‘lik (λ₁):</b> ${lambda1} nm<br>
    <b>Qizil yorug‘lik (λ₂):</b> ${lambda2} nm<br>
    <b>Qo‘shni interferensiya yo‘llari masofasi</b> <u>${ratio.toFixed(2)}</u> marta oshadi.
  `;

  // Vizualizatsiya (animatsiya)
  container.innerHTML = "";
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 120;
  canvas.style.border = "1px solid gray";
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  let progress = 0; // 0...1
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Yashil interferensiya yo‘llari (statik)
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = "#28a745";
      ctx.fillRect(50 + i * lambda1 / 2, 20, 10, 30);
    }
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText("Yashil (λ₁)", 10, 35);

    // Qizil interferensiya yo‘llari (animatsion)
    let animatedStep = lambda1 / 2 + (lambda2 / 2 - lambda1 / 2) * progress;
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = "#dc3545";
      ctx.fillRect(50 + i * animatedStep, 70, 10, 30);
    }
    ctx.fillStyle = "black";
    ctx.fillText("Qizil (λ₂)", 10, 85);

    // Oshish koeffitsienti
    ctx.fillText(`Oshish koeffitsienti: ${(1 + (ratio - 1) * progress).toFixed(2)}x`, 300, 60);

    if (progress < 1) {
      progress += 0.02;
      requestAnimationFrame(animate);
    } else {
      // Yakuniy natija
      ctx.fillStyle = "#dc3545";
      ctx.font = "bold 15px Arial";
      ctx.fillText(`Qizil yo‘llar to‘liq ochildi!`, 300, 100);
    }
  }

  animate();
}