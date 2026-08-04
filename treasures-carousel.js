/* =====================================================================
   متحف إرث الحضارة - treasures-carousel.js
   دوّار القطع المميزة: عرض ثلاثي الأبعاد (CSS 3D) لعشر قطع مختارة من
   المجموعة، بيلف تلقائيًا وبيقف عند تمرير الماوس، وكل قطعة قابلة للضغط
   عشان تفتح تفاصيلها الكاملة (بالاستفادة من محرك البحث الموجود بالفعل).
   الصور المستخدمة هنا كلها من الصور المحلية المستخرجة (images/) لضمان
   إنها تحمّل صح دايمًا.
   ===================================================================== */

(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  const TREASURES = [
    { t: 'تمثال الإله تحوت', wingKey: 'egypt', img: 'images/artifact-001.jpg' },
    { t: 'قناع مومياء لمسحتي', wingKey: 'leaders', img: 'images/artifact-020.jpg' },
    { t: 'قلادة صدرية من الفيروز واللازورد', wingKey: 'egypt', img: 'images/artifact-009.jpg' },
    { t: 'عباد الشمس', wingKey: 'paintings', img: 'images/artifact-023.jpg' },
    { t: 'بنات بحري', wingKey: 'paintings', img: 'images/artifact-021.jpg' },
    { t: 'درع المصارع (غلاديوس)', wingKey: 'roman', img: 'images/artifact-037.jpg' },
    { t: 'قلادة عسكرية تكريمية', wingKey: 'roman', img: 'images/artifact-039.jpg' },
    { t: 'صندوق خشبي مطعم بالصدف', wingKey: 'islamic', img: 'images/artifact-041.jpg' },
    { t: 'أسطوانة فلكية (كرة سماوية)', wingKey: 'islamic', img: 'images/artifact-042.jpg' },
    { t: 'كيبو (الحبال المعقودة)', wingKey: 'world', img: 'images/artifact-043.jpg' }
  ];

  function openArtifact(title, wingKey) {
    const navSearch = document.getElementById('nav-search');
    const navSearchInput = document.getElementById('nav-search-input');
    const navSearchResults = document.getElementById('nav-search-results');
    if (!navSearch || !navSearchInput) return;
    navSearch.classList.add('active');
    navSearchInput.value = title;
    navSearchInput.dispatchEvent(new Event('input', { bubbles: true }));
    setTimeout(() => {
      const btn =
        navSearchResults?.querySelector(`.search-result-item[data-wing="${wingKey}"]`) ||
        navSearchResults?.querySelector('.search-result-item');
      if (btn) btn.click();
    }, 180);
  }

  ready(function () {
    const stage = document.getElementById('treasures-orbit');
    if (!stage) return;

    const n = TREASURES.length;
    const angleStep = 360 / n;
    /* نصف قطر الدوران بيتحسب عشان الكروت (عرضها ~170px) متتقاطعش مع بعض */
    const cardWidth = 170;
    const radius = Math.round(cardWidth / (2 * Math.sin(Math.PI / n))) + 40;

    TREASURES.forEach((item, i) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'treasure-card';
      card.dataset.baseAngle = i * angleStep;
      card.style.transform = `rotateY(${i * angleStep}deg) translateZ(${radius}px)`;
      card.innerHTML = `
        <img src="${item.img}" alt="${item.t}" loading="lazy">
        <span class="treasure-card-label">${item.t}</span>`;
      card.addEventListener('click', () => {
        if (!draggedEnough) openArtifact(item.t, item.wingKey);
      });
      stage.appendChild(card);
    });

    const cards = Array.from(stage.querySelectorAll('.treasure-card'));
    function applyRotation(deg) {
      cards.forEach((card) => {
        const base = parseFloat(card.dataset.baseAngle);
        card.style.transform = `rotateY(${base + deg}deg) translateZ(${radius}px)`;
      });
    }

    let rotation = 0;
    let paused = false;
    let dragging = false;
    let draggedEnough = false;
    let startX = 0;
    let rotationAtDragStart = 0;
    const wrap = stage.closest('.treasures-stage-wrap');

    wrap?.addEventListener('mouseenter', () => { paused = true; });
    wrap?.addEventListener('mouseleave', () => { paused = false; });

    stage.addEventListener('pointerdown', (e) => {
      dragging = true;
      draggedEnough = false;
      startX = e.clientX;
      rotationAtDragStart = rotation;
    });
    window.addEventListener('pointerup', () => { dragging = false; });
    window.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const delta = e.clientX - startX;
      if (Math.abs(delta) > 4) draggedEnough = true;
      rotation = rotationAtDragStart + delta * 0.4;
      applyRotation(rotation);
    });

    function tick() {
      if (!dragging && !paused) {
        rotation += 0.06;
        applyRotation(rotation);
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
})();
