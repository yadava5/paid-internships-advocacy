// Simple animated number counter for the salary differential
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-target]').forEach(el => {
      const target = +el.dataset.target;      // numeric value
      const step   = target / 120;            // 60 fps × 2 s
      let current  = 0;
  
      const tick = () => {
        current += step;
        if (current >= target) {
          current = target;
        } else {
          requestAnimationFrame(tick);
        }
        el.textContent = '$' + Math.round(current).toLocaleString();
      };
      requestAnimationFrame(tick);
    });
  });
  