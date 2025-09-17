(() => {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.carousel').forEach((root) => {
      const rail   = root.querySelector('.rail');
      const btn    = root.querySelector('.next');
      const slides = Array.from(root.querySelectorAll('.slide'));
      if (!rail || !btn || slides.length === 0) return;

      let cards = 1;
      let gapPx = 0;
      let cardW = 0;

      const readVars = () => {
        const cs = getComputedStyle(root);
        cards = parseInt(cs.getPropertyValue('--cards')) || 1;
        gapPx = parseFloat(cs.getPropertyValue('--gap')) || 0;
      };

      const step = () => cardW + gapPx; // one-card movement
      const maxLeft = () => Math.max(0, rail.scrollWidth - root.clientWidth);
      const atEnd = () => rail.scrollLeft >= maxLeft() - 1; // tolerance
      const clamp = (x, lo, hi) => Math.min(Math.max(x, lo), hi);

      const sizeSlides = () => {
        readVars();
        const viewport = root.clientWidth;
        cardW = (viewport - gapPx * (cards - 1)) / cards;
        slides.forEach(s => (s.style.minWidth = cardW + 'px'));
        // keep current view valid after resize
        rail.scrollLeft = clamp(rail.scrollLeft, 0, maxLeft());
      };

      sizeSlides();
      window.addEventListener('resize', sizeSlides);

      btn.addEventListener('click', () => {
        if (atEnd()) {
          rail.scrollTo({ left: 0, behavior: 'smooth' });      // loop only from true end
        } else {
          const nextLeft = clamp(rail.scrollLeft + step(), 0, maxLeft());
          rail.scrollTo({ left: nextLeft, behavior: 'smooth' }); // advance by one card
        }
      });
    });
  });
})();
