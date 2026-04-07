const parts = [
  {
    id: 'tete',
    label: 'Tête',
    images: ['tete1.jpg', 'tete2.jpg', 'tete3.jpg'],
  },
  {
    id: 'corp',
    label: 'Corps',
    images: ['corps1.jpg', 'corps2.jpg', 'corps3.jpg'],
  },
  {
    id: 'pied',
    label: 'Pieds',
    images: ['pieds1.jpg', 'pieds2.jpg', 'pieds3.jpg'],
  },
];

const state = { tete: 0, corp: 0, pied: 0 };

function render() {
  const pantin = document.getElementById('pantin');
  pantin.innerHTML = '';

  parts.forEach(part => {
    const row = document.createElement('div');
    row.className = 'part';

    const btnPrev = document.createElement('button');
    btnPrev.className = 'arrow';
    btnPrev.textContent = '‹';
    btnPrev.setAttribute('aria-label', `${part.label} précédente`);
    btnPrev.addEventListener('click', () => {
      state[part.id] = (state[part.id] - 1 + part.images.length) % part.images.length;
      render();
    });

    const img = document.createElement('img');
    img.src = part.images[state[part.id]];
    img.alt = `${part.label} ${state[part.id] + 1}`;

    const btnNext = document.createElement('button');
    btnNext.className = 'arrow';
    btnNext.textContent = '›';
    btnNext.setAttribute('aria-label', `${part.label} suivante`);
    btnNext.addEventListener('click', () => {
      state[part.id] = (state[part.id] + 1) % part.images.length;
      render();
    });

    row.appendChild(btnPrev);
    row.appendChild(img);
    row.appendChild(btnNext);
    pantin.appendChild(row);

    // Indicateurs (points)
    const dotsContainer = document.getElementById(`dots-${part.id}`);
    dotsContainer.innerHTML = '';
    part.images.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `${part.label} ${i + 1}`);
      if (i === state[part.id]) dot.classList.add('active');
      dot.addEventListener('click', () => {
        state[part.id] = i;
        render();
      });
      dotsContainer.appendChild(dot);
    });
  });
}

render();
