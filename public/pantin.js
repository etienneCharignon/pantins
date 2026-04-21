const parts = [
  { id: 'tete', label: 'Tête', images: ['tete1.png', 'tete2.png', 'tete3.png'] },
  { id: 'corp', label: 'Corps', images: ['corps1.png', 'corps2.png', 'corps3.png'] },
  { id: 'pied', label: 'Pieds', images: ['pieds1.png', 'pieds2.png', 'pieds3.png'] },
];

const state = { tete: 0, corp: 0, pied: 0 };
const strips = {};

function setPosition(partId, index, dragOffset = 0, animate = false) {
  const strip = strips[partId];
  const imgWidth = strip.parentElement.offsetWidth;
  strip.style.transition = animate ? 'transform 0.3s ease' : 'none';
  strip.style.transform = `translateX(${-index * imgWidth + dragOffset}px)`;
}

function goTo(partId, index) {
  const part = parts.find(p => p.id === partId);
  state[partId] = (index + part.images.length) % part.images.length;
  setPosition(partId, state[partId], 0, true);
  document.getElementById(`dots-${partId}`).querySelectorAll('button').forEach((dot, i) => {
    dot.classList.toggle('active', i === state[partId]);
  });
}

function build() {
  const pantin = document.getElementById('pantin');
  pantin.innerHTML = '';

  parts.forEach(part => {
    const row = document.createElement('div');
    row.className = 'part';

    const btnPrev = document.createElement('button');
    btnPrev.className = 'arrow';
    btnPrev.textContent = '‹';
    btnPrev.setAttribute('aria-label', `${part.label} précédente`);
    btnPrev.addEventListener('click', () => goTo(part.id, state[part.id] - 1));

    const viewport = document.createElement('div');
    viewport.className = 'part-viewport';

    const strip = document.createElement('div');
    strip.className = 'part-strip';
    strips[part.id] = strip;

    part.images.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${part.label} ${i + 1}`;
      strip.appendChild(img);
    });

    viewport.appendChild(strip);

    let touchStartX = null;

    viewport.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    viewport.addEventListener('touchmove', e => {
      if (touchStartX === null) return;
      const dx = e.touches[0].clientX - touchStartX;
      setPosition(part.id, state[part.id], dx);
    }, { passive: true });

    viewport.addEventListener('touchend', e => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      goTo(part.id, Math.abs(dx) > 40 ? state[part.id] + (dx < 0 ? 1 : -1) : state[part.id]);
      touchStartX = null;
    }, { passive: true });

    const btnNext = document.createElement('button');
    btnNext.className = 'arrow';
    btnNext.textContent = '›';
    btnNext.setAttribute('aria-label', `${part.label} suivante`);
    btnNext.addEventListener('click', () => goTo(part.id, state[part.id] + 1));

    row.appendChild(btnPrev);
    row.appendChild(viewport);
    row.appendChild(btnNext);
    pantin.appendChild(row);

    const dotsContainer = document.getElementById(`dots-${part.id}`);
    dotsContainer.innerHTML = '';
    part.images.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `${part.label} ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(part.id, i));
      dotsContainer.appendChild(dot);
    });
  });
}

build();
