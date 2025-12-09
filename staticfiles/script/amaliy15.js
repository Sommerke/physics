// Interaktiv "15.8 λ_min" vidjet — init funksiyasi global export qilinadi
window.initAmaliy158 = function initAmaliy158(rootId = 'am15') {
  const root = document.getElementById(rootId);
  if (!root) return;

  // Fizik konstantalar
  const h = 6.62607015e-34, c = 299792458, e = 1.602176634e-19;

  const volt = root.querySelector('#volt');
  const voltRange = root.querySelector('#voltRange');
  const vLabel = root.querySelector('#vLabel');

  const E_keV = root.querySelector('#E_keV');
  const E_J = root.querySelector('#E_J');
  const f_Hz = root.querySelector('#f_Hz');
  const f_THz = root.querySelector('#f_THz');
  const lam_nm = root.querySelector('#lam_nm');
  const lam_pm = root.querySelector('#lam_pm');

  const marker = root.querySelector('#marker');
  const spectrum = root.querySelector('#spectrum');

  const AX_MIN_NM = 1e-4, AX_MAX_NM = 1e3;
  const log10 = (x)=>Math.log10(x);
  const clamp = (x,min,max)=>Math.max(min,Math.min(max,x));

  function sci(x){ if(x===0) return '0'; const exp=Math.floor(Math.log10(Math.abs(x))); const mant=x/Math.pow(10,exp); return mant.toFixed(3)+'×10^'+exp; }

  function update(){
    const VkV = parseFloat(volt.value || voltRange.value || '30');
    const V = VkV * 1e3;

    volt.value = voltRange.value = VkV;
    vLabel.textContent = VkV.toFixed(2);

    const E = e * V;           // J
    const f = E / h;           // Hz
    const lambda = (h*c)/E;    // m

    E_keV.textContent = VkV.toFixed(2) + ' keV';
    E_J.textContent   = sci(E) + ' J';
    f_Hz.textContent  = sci(f) + ' Hz';
    f_THz.textContent = (f/1e12).toFixed(2) + ' THz';

    const nm = lambda * 1e9, pm = lambda * 1e12;
    lam_nm.textContent = (nm<0.1?nm.toFixed(4):nm.toFixed(3)) + ' nm';
    lam_pm.textContent = pm.toFixed(1) + ' pm';

    const L = spectrum.clientWidth || 600;
    const pos = (log10(clamp(nm,AX_MIN_NM,AX_MAX_NM)) - log10(AX_MIN_NM)) / (log10(AX_MAX_NM)-log10(AX_MIN_NM));
    marker.style.left = Math.max(2, Math.min(L-2, pos*L)) + 'px';
  }

  volt.addEventListener('input', update);
  voltRange.addEventListener('input', (e)=>{ volt.value = e.target.value; update(); });
  window.addEventListener('resize', update, { passive:true });
  update();
};
