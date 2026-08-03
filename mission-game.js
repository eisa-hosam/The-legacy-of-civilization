/* =====================================================================
   متحف إرث الحضارة - mission-game.js
   لعبة "مهمة إنقاذ الحضارة": قصة تفاعلية بيها 6 محطات (حضارات المتحف)،
   كل محطة فيها لغز/سؤال، الزائر يحل عشان ياخد مفتاح وقطعة أثرية،
   وبعد ما يجمع الكل يفتح اللقب النهائي "حارس الحضارة" 👑.
   الحالة (التقدّم) بتتخزن في localStorage عشان تفضل محفوظة للزيارة الجاية.
   ===================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'mg_civ_rescue_progress_v1';

  /* ---------- 1) بيانات المحطات (الحضارات الست) ---------- */
  const STATIONS = [
    {
      id: 'egypt',
      icon: '𓂀',
      title: 'مصر القديمة',
      artifact: { name: 'قناع توت عنخ آمون الذهبي', icon: '👑' },
      flavor: 'حدث خلل زمني فوق أهرامات الجيزة، وضاع <strong>قناع الفرعون الذهبي</strong> بين الرمال والزمن! لازم تجاوب صح عشان تسترجعه وتفتح باب الجناح المصري.',
      question: 'أي ملك مصري قديم اشتهر بقناعه الذهبي الذي اكتُشف في مقبرته عام 1922؟',
      options: ['توت عنخ آمون', 'رمسيس الثاني', 'أخناتون'],
      correct: 0,
      hint: 'مقبرته كانت شبه سليمة في وادي الملوك، ولقبوه بـ"الملك الصبي".'
    },
    {
      id: 'mesopotamia',
      icon: '𒀭',
      title: 'حضارة بلاد الرافدين',
      artifact: { name: 'لوح شريعة حمورابي', icon: '📜' },
      flavor: 'الخلل الزمني وصل لبابل القديمة، ولوح <strong>أول قانون مكتوب في التاريخ</strong> اختفى من مكانه! ساعدنا نرجّعه لمكانه الصحيح.',
      question: 'من الملك البابلي الذي سنّ أول مجموعة قوانين مكتوبة معروفة في التاريخ؟',
      options: ['سرجون الأكدي', 'حمورابي', 'نبوخذ نصر'],
      correct: 1,
      hint: 'اسمه مرتبط بأشهر "شريعة" في تاريخ بلاد الرافدين، محفورة على عمود حجري.'
    },
    {
      id: 'greek',
      icon: '🏺',
      title: 'الحضارة اليونانية',
      artifact: { name: 'تمثال أثينا المصغّر', icon: '🗿' },
      flavor: 'فوق تل الأكروبوليس، اختفى <strong>تمثال الإلهة الحارسة</strong> وسط دوامة زمنية غريبة. أعد الأمور لنصابها بإجابة صحيحة.',
      question: 'في أي مدينة يقع معبد البارثينون الشهير؟',
      options: ['إسبرطة', 'دلفي', 'أثينا'],
      correct: 2,
      hint: 'المدينة سُمّيت باسم إلهة الحكمة نفسها.'
    },
    {
      id: 'roman',
      icon: '🏛️',
      title: 'الحضارة الرومانية',
      artifact: { name: 'خوذة مصارع من الكولوسيوم', icon: '⚔️' },
      flavor: 'وسط صخب الكولوسيوم، طارت <strong>خوذة أحد المصارعين</strong> عبر الزمن! رجّعها قبل ما تضيع للأبد.',
      question: 'ما اسم الملعب الروماني الضخم الذي كانت تقام فيه معارك المصارعين؟',
      options: ['البانثيون', 'الكولوسيوم', 'قوس النصر'],
      correct: 1,
      hint: 'اسمه مأخوذ من كلمة تعني "ضخم/عملاق"، ولسّه موجود في روما لحد النهاردة.'
    },
    {
      id: 'islamic',
      icon: '🕌',
      title: 'الحضارة الإسلامية',
      artifact: { name: 'بلاطة زخرفية من قصر الحمراء', icon: '🔷' },
      flavor: 'زخارف <strong>قصر الحمراء</strong> الهندسية بدأت تتلاشى بسبب الخلل الزمني. لازم نثبّت الزخرفة قبل ما تختفي تمامًا.',
      question: 'في أي مدينة إسبانية يقع قصر الحمراء الشهير بزخارفه الإسلامية؟',
      options: ['قرطبة', 'إشبيلية', 'غرناطة'],
      correct: 2,
      hint: 'المدينة كانت آخر معاقل الحكم الإسلامي في الأندلس.'
    },
    {
      id: 'world',
      icon: '🌍',
      title: 'حضارات العالم',
      artifact: { name: 'قناع حجري من ماتشو بيتشو', icon: '🗻' },
      flavor: 'فوق قمم جبال الأنديز، اختفى <strong>قناع حجري مقدّس</strong> من مدينة ماتشو بيتشو. دي آخر محطة في مهمتك!',
      question: 'أي حضارة قديمة بنت مدينة ماتشو بيتشو المرتفعة في جبال الأنديز؟',
      options: ['المايا', 'الإنكا', 'الأزتيك'],
      correct: 1,
      hint: 'نفس الحضارة اللي حكمت إمبراطورية واسعة في جبال بيرو قبل وصول الإسبان.'
    }
  ];

  /* ---------- 2) الحالة (التقدّم المحفوظ) ---------- */
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { completed: {}, name: '' };
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  let state = loadState();

  function completedCount() {
    return STATIONS.filter(s => state.completed[s.id]).length;
  }
  function isAllDone() {
    return completedCount() === STATIONS.length;
  }

  /* ---------- 3) بناء واجهة اللعبة ---------- */
  let root, overlay, box;
  let currentStationId = null;

  function buildUI() {
    root = document.createElement('div');
    root.innerHTML = `
      <div class="mission-overlay" id="mission-overlay" role="dialog" aria-modal="true" aria-label="مهمة إنقاذ الحضارة">
        <div class="mission-box">
          <button type="button" class="mission-close-btn" id="mission-close-btn" aria-label="إغلاق">✕</button>
          <div class="mission-confetti" id="mission-confetti"></div>

          <!-- شاشة القصة -->
          <section class="mission-screen" data-screen="intro">
            <div class="mission-hero-icon">🕹️🏛️</div>
            <h2 class="mission-title">مهمة إنقاذ الحضارة</h2>
            <div class="mission-story">
              حدث خلل زمني غريب في متحف إرث الحضارة، وتناثرت <strong>قطع أثرية نادرة</strong> عبر الزمن بين ست حضارات عظيمة!<br><br>
              مهمتك أنت — أيها الزائر — إنك تنتقل بين الحضارات، <strong>تحل الألغاز</strong>، <strong>تجمع المفاتيح</strong>، وتسترجع القطع المفقودة واحدة واحدة.<br><br>
              كل ما تفتح باب حضارة جديدة، تقرب أكتر من اللقب الأسطوري:
              <strong>👑 حارس الحضارة</strong>. جاهز تبدأ الرحلة؟
            </div>
            <div class="mission-cta-row">
              <button type="button" class="btn btn-gold" id="mission-start-btn">ابدأ المهمة 🚀</button>
            </div>
          </section>

          <!-- شاشة الخريطة / المحطات -->
          <section class="mission-screen" data-screen="map">
            <h2 class="mission-title" style="margin-bottom:4px;">اختر حضارة لتبدأ الإنقاذ</h2>
            <div class="mission-progress-label">
              <span>تقدّم المهمة</span>
              <span class="mission-keys-count" id="mission-keys-count">0 / ${STATIONS.length} 🔑</span>
            </div>
            <div class="mission-progress-bar"><div class="mission-progress-fill" id="mission-progress-fill"></div></div>
            <div class="mission-stations-grid" id="mission-stations-grid"></div>
          </section>

          <!-- شاشة المحطة/اللغز -->
          <section class="mission-screen" data-screen="station">
            <div class="mission-station-header">
              <span class="ms-big-icon" id="ms-header-icon"></span>
              <div>
                <h3 id="ms-header-title"></h3>
                <p id="ms-header-artifact"></p>
              </div>
            </div>
            <div class="mission-flavor" id="ms-flavor"></div>
            <div class="mission-question" id="ms-question"></div>
            <div class="mission-options" id="ms-options"></div>
            <div class="mission-feedback" id="ms-feedback"></div>
            <div class="mission-hint-row">
              <button type="button" class="mission-hint-btn" id="ms-hint-btn">💡 محتاج تلميح؟</button>
              <button type="button" class="btn btn-line btn-sm" id="ms-back-btn">↩ رجوع للخريطة</button>
            </div>
            <div class="mission-hint-text" id="ms-hint-text" style="display:none;"></div>
          </section>

          <!-- شاشة الانتصار -->
          <section class="mission-screen" data-screen="victory">
            <div class="mission-victory">
              <div class="mission-crown">👑</div>
              <h2 class="mission-title">مبروك.. أنت الآن حارس الحضارة!</h2>
              <p style="opacity:.85;font-size:.94rem;max-width:480px;margin:0 auto;">
                جمعت كل القطع الأثرية الست وأغلقت الخلل الزمني في متحف إرث الحضارة.
                شكرًا إنك حافظت على تراث الإنسانية!
              </p>
              <div class="mission-certificate">
                <div class="mc-eyebrow">شهادة تقدير</div>
                <div class="mc-title">👑 حارس الحضارة</div>
                <div class="mc-name" id="mc-name-display">زائر متحف إرث الحضارة</div>
                <div class="mc-artifacts" id="mc-artifacts-row"></div>
              </div>
              <div class="mission-name-input">
                <input type="text" id="mission-name-field" placeholder="اكتب اسمك على الشهادة (اختياري)" maxlength="30">
                <button type="button" class="btn btn-line btn-sm" id="mission-save-name-btn">حفظ الاسم</button>
              </div>
              <div class="mission-cta-row" style="margin-top:18px;">
                <button type="button" class="btn btn-gold" id="mission-photobooth-btn">📸 صورة تذكارية</button>
                <button type="button" class="btn btn-outline" id="mission-share-btn">📤 شارك إنجازك</button>
                <button type="button" class="btn btn-outline" id="mission-replay-btn">🔄 إعادة اللعب</button>
              </div>
              <p class="mission-restart-note">تقدّمك بيتحفظ تلقائيًا على جهازك، تقدر تكمل المهمة في أي وقت.</p>
            </div>
          </section>

          <!-- شاشة صندوق الصور التذكارية -->
          <section class="mission-screen" data-screen="photobooth">
            <div class="mission-station-header">
              <span class="ms-big-icon" id="pb-header-icon">📸</span>
              <div>
                <h3>صورة تذكارية</h3>
                <p>التقط صورتك بإطار فرعوني أو روماني واحتفظ بذكرى زيارتك</p>
              </div>
            </div>

            <div class="pb-frame-chips" id="pb-frame-chips">
              <button type="button" class="pb-frame-chip active" data-frame="egypt">𓂀 إطار فرعوني</button>
              <button type="button" class="pb-frame-chip" data-frame="roman">🏛️ إطار روماني</button>
            </div>

            <div class="pb-stage" id="pb-stage">
              <video id="pb-video" autoplay playsinline muted></video>
              <img id="pb-result-img" alt="صورتك التذكارية" style="display:none;">
              <canvas id="pb-canvas" style="display:none;"></canvas>
              <div class="pb-hint" id="pb-hint">بنجهّز الكاميرا... 🎥</div>
            </div>

            <input type="file" accept="image/*" capture="environment" id="pb-file-input" style="display:none;">

            <div class="mission-actions-row" id="pb-actions-live">
              <button type="button" class="btn btn-line btn-sm" id="pb-upload-btn">📁 اختر صورة بدل الكاميرا</button>
              <button type="button" class="btn btn-gold" id="pb-capture-btn">📸 التقط الصورة</button>
            </div>

            <div class="mission-actions-row" id="pb-actions-result" style="display:none;">
              <button type="button" class="btn btn-line btn-sm" id="pb-retake-btn">🔄 صورة تانية</button>
              <button type="button" class="btn btn-gold" id="pb-download-btn">⬇ تحميل الصورة</button>
            </div>

            <div class="mission-cta-row" style="margin-top:14px;">
              <button type="button" class="btn btn-line btn-sm" id="pb-back-btn">↩ رجوع لشهادة التقدير</button>
            </div>
          </section>

        </div>
      </div>
    `;
    document.body.appendChild(root.firstElementChild);
    overlay = document.getElementById('mission-overlay');
    box = overlay.querySelector('.mission-box');

    document.getElementById('mission-close-btn').addEventListener('click', closeMission);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeMission(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('active')) closeMission(); });

    document.getElementById('mission-start-btn').addEventListener('click', () => showScreen('map'));
    document.getElementById('ms-back-btn').addEventListener('click', () => showScreen('map'));
    document.getElementById('ms-hint-btn').addEventListener('click', toggleHint);
    document.getElementById('mission-replay-btn').addEventListener('click', resetProgress);
    document.getElementById('mission-share-btn').addEventListener('click', shareAchievement);
    document.getElementById('mission-save-name-btn').addEventListener('click', saveName);
    document.getElementById('mission-name-field').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveName();
    });

    document.getElementById('mission-photobooth-btn').addEventListener('click', () => showScreen('photobooth'));
    document.getElementById('pb-back-btn').addEventListener('click', () => showScreen('victory'));
    document.getElementById('pb-capture-btn').addEventListener('click', capturePhoto);
    document.getElementById('pb-retake-btn').addEventListener('click', retakePhoto);
    document.getElementById('pb-download-btn').addEventListener('click', downloadPhoto);
    document.getElementById('pb-upload-btn').addEventListener('click', () => {
      stopCamera();
      document.getElementById('pb-file-input').click();
    });
    document.getElementById('pb-file-input').addEventListener('change', handleFileUpload);
    document.getElementById('pb-frame-chips').querySelectorAll('.pb-frame-chip').forEach(chip => {
      chip.addEventListener('click', () => selectFrame(chip.dataset.frame, chip));
    });
  }

  /* ---------- 4) التنقل بين الشاشات ---------- */
  function showScreen(name) {
    overlay.querySelectorAll('.mission-screen').forEach(s => {
      s.classList.toggle('active', s.dataset.screen === name);
    });
    if (name === 'map') renderMap();
    if (name === 'victory') renderVictory();
    if (name === 'photobooth') openPhotoBooth();
    else stopCamera();
    box.scrollTop = 0;
  }

  function openMission() {
    if (!overlay) buildUI();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    showScreen(isAllDone() ? 'victory' : (completedCount() > 0 ? 'map' : 'intro'));
  }

  function closeMission() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    stopCamera();
  }

  /* ---------- 5) شاشة الخريطة ---------- */
  function renderMap() {
    const grid = document.getElementById('mission-stations-grid');
    grid.innerHTML = STATIONS.map(s => {
      const done = !!state.completed[s.id];
      return `
        <div class="mission-station-card${done ? ' done' : ''}" data-id="${s.id}" tabindex="0" role="button" aria-label="${s.title}">
          ${done ? `<span class="ms-key">🔑</span>` : ''}
          <span class="ms-icon">${s.icon}</span>
          <h4>${s.title}</h4>
          <span class="ms-tag">${done ? 'تم الإنقاذ ✔' : 'يحتاج إنقاذ'}</span>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.mission-station-card').forEach(card => {
      card.addEventListener('click', () => openStation(card.dataset.id));
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter') openStation(card.dataset.id); });
    });

    const count = completedCount();
    document.getElementById('mission-keys-count').textContent = `${count} / ${STATIONS.length} 🔑`;
    document.getElementById('mission-progress-fill').style.width = `${(count / STATIONS.length) * 100}%`;

    if (isAllDone()) { showScreen('victory'); }
  }

  /* ---------- 6) شاشة المحطة/اللغز ---------- */
  function openStation(id) {
    const station = STATIONS.find(s => s.id === id);
    if (!station) return;
    currentStationId = id;

    document.getElementById('ms-header-icon').textContent = station.icon;
    document.getElementById('ms-header-title').textContent = station.title;
    document.getElementById('ms-header-artifact').textContent = `القطعة المفقودة: ${station.artifact.icon} ${station.artifact.name}`;
    document.getElementById('ms-flavor').innerHTML = station.flavor;
    document.getElementById('ms-question').textContent = station.question;

    const feedback = document.getElementById('ms-feedback');
    feedback.textContent = '';
    feedback.className = 'mission-feedback';

    const hintText = document.getElementById('ms-hint-text');
    hintText.style.display = 'none';
    hintText.textContent = station.hint;

    const alreadyDone = !!state.completed[id];
    const optionsWrap = document.getElementById('ms-options');
    optionsWrap.innerHTML = station.options.map((opt, i) =>
      `<button type="button" class="mission-option-btn" data-i="${i}" ${alreadyDone ? 'disabled' : ''}>${opt}</button>`
    ).join('');

    if (alreadyDone) {
      feedback.textContent = `✔ اتحلّت بالفعل — استرجعت "${station.artifact.name}" بنجاح!`;
      feedback.classList.add('ok');
      optionsWrap.querySelectorAll('.mission-option-btn').forEach((btn, i) => {
        if (i === station.correct) btn.classList.add('correct');
      });
    } else {
      optionsWrap.querySelectorAll('.mission-option-btn').forEach(btn => {
        btn.addEventListener('click', () => handleAnswer(station, Number(btn.dataset.i)));
      });
    }

    showScreen('station');
  }

  function handleAnswer(station, chosenIndex) {
    const optionsWrap = document.getElementById('ms-options');
    const buttons = [...optionsWrap.querySelectorAll('.mission-option-btn')];
    const feedback = document.getElementById('ms-feedback');
    const correct = chosenIndex === station.correct;

    buttons.forEach(b => b.disabled = true);

    if (correct) {
      buttons[chosenIndex].classList.add('correct');
      feedback.textContent = `🎉 صح! استرجعت "${station.artifact.name}" وحصلت على مفتاح جديد.`;
      feedback.classList.add('ok');
      state.completed[station.id] = true;
      saveState();
      spawnConfetti(18);
      setTimeout(() => {
        if (isAllDone()) { showScreen('victory'); }
        else { showScreen('map'); }
      }, 1300);
    } else {
      buttons[chosenIndex].classList.add('wrong');
      buttons[station.correct].classList.add('correct');
      feedback.textContent = 'مش الإجابة الصح، بس محاولتك حلوة! جرّب المحطة تاني بعد شوية.';
      feedback.classList.add('bad');
      setTimeout(() => { buttons.forEach(b => b.disabled = false); buttons.forEach(b => b.classList.remove('wrong','correct')); feedback.textContent = ''; feedback.className = 'mission-feedback'; }, 1800);
    }
  }

  function toggleHint() {
    const hintText = document.getElementById('ms-hint-text');
    hintText.style.display = hintText.style.display === 'none' ? 'block' : 'none';
  }

  /* ---------- 7) شاشة الانتصار ---------- */
  function renderVictory() {
    document.getElementById('mc-name-display').textContent = state.name
      ? `${state.name} — حارس الحضارة`
      : 'زائر متحف إرث الحضارة';
    document.getElementById('mission-name-field').value = state.name || '';
    document.getElementById('mc-artifacts-row').innerHTML = STATIONS.map(s => `<span title="${s.artifact.name}">${s.artifact.icon}</span>`).join('');
    spawnConfetti(28);
  }

  function saveName() {
    const field = document.getElementById('mission-name-field');
    state.name = (field.value || '').trim().slice(0, 30);
    saveState();
    document.getElementById('mc-name-display').textContent = state.name
      ? `${state.name} — حارس الحضارة`
      : 'زائر متحف إرث الحضارة';
  }

  function shareAchievement() {
    const text = `🏛️👑 استرجعت كل القطع الأثرية وبقيت "حارس الحضارة" في متحف إرث الحضارة الرقمي! تعالوا جربوا مهمة إنقاذ الحضارة بنفسكم.`;
    const url = location.href.split('#')[0];
    if (navigator.share) {
      navigator.share({ title: 'حارس الحضارة 👑', text, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text}\n${url}`).then(() => {
        const btn = document.getElementById('mission-share-btn');
        const old = btn.textContent;
        btn.textContent = '✔ تم النسخ!';
        setTimeout(() => { btn.textContent = old; }, 1800);
      }).catch(() => {});
    }
  }

  /* ---------- 7.5) صندوق الصور التذكارية (Photo Booth) ---------- */
  let pbStream = null;
  let pbFrame = 'egypt';

  function selectFrame(frame, chipEl) {
    pbFrame = frame;
    document.querySelectorAll('#pb-frame-chips .pb-frame-chip').forEach(c => c.classList.remove('active'));
    if (chipEl) chipEl.classList.add('active');
  }

  function openPhotoBooth() {
    const video = document.getElementById('pb-video');
    const resultImg = document.getElementById('pb-result-img');
    const hint = document.getElementById('pb-hint');
    const actionsLive = document.getElementById('pb-actions-live');
    const actionsResult = document.getElementById('pb-actions-result');
    if (!video) return;

    resultImg.style.display = 'none';
    resultImg.removeAttribute('src');
    video.style.display = 'block';
    actionsLive.style.display = 'flex';
    actionsResult.style.display = 'none';
    hint.style.display = 'block';
    hint.textContent = 'بنجهّز الكاميرا... 🎥';

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      hint.textContent = 'الكاميرا مش متاحة على المتصفح ده — اختر صورة من جهازك بدلاً من ذلك 👇';
      video.style.display = 'none';
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then(stream => {
        pbStream = stream;
        video.srcObject = stream;
        hint.style.display = 'none';
      })
      .catch(() => {
        hint.textContent = 'تعذّر الوصول للكاميرا — اختر صورة من جهازك بدلاً من ذلك 👇';
        video.style.display = 'none';
      });
  }

  function stopCamera() {
    if (pbStream) {
      pbStream.getTracks().forEach(t => t.stop());
      pbStream = null;
    }
    const video = document.getElementById('pb-video');
    if (video) video.srcObject = null;
  }

  function drawFrameDecoration(ctx, w, h, frame) {
    const isEgypt = frame === 'egypt';
    const gold = '#d4af37';
    const goldLight = '#f3d97a';
    const ornament = isEgypt ? '𓂀' : '🏛️';
    const captionTitle = isEgypt ? '👑 حارس الحضارة — الجناح المصري' : '👑 حارس الحضارة — الجناح الروماني';

    ctx.save();

    const borderW = Math.max(14, w * 0.035);
    ctx.strokeStyle = gold;
    ctx.lineWidth = borderW;
    ctx.strokeRect(borderW / 2, borderW / 2, w - borderW, h - borderW);

    const innerOffset = borderW * 1.7;
    ctx.strokeStyle = goldLight;
    ctx.lineWidth = Math.max(2, borderW * 0.15);
    ctx.strokeRect(innerOffset, innerOffset, w - innerOffset * 2, h - innerOffset * 2);

    const cornerSize = Math.max(26, w * 0.075);
    ctx.font = `${cornerSize}px serif`;
    ctx.fillStyle = goldLight;
    const pad = borderW * 1.9;

    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillText(ornament, pad, pad);
    ctx.textAlign = 'right';
    ctx.fillText(ornament, w - pad, pad);
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'left';
    ctx.fillText(ornament, pad, h - pad);
    ctx.textAlign = 'right';
    ctx.fillText(ornament, w - pad, h - pad);

    const bandH = Math.max(50, h * 0.1);
    ctx.fillStyle = 'rgba(4,18,51,0.72)';
    ctx.fillRect(innerOffset, h - innerOffset - bandH, w - innerOffset * 2, bandH);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = goldLight;
    ctx.font = `bold ${Math.max(16, bandH * 0.32)}px sans-serif`;
    ctx.fillText(captionTitle, w / 2, h - innerOffset - bandH * 0.42);
    ctx.fillStyle = '#f2e8cf';
    ctx.font = `${Math.max(12, bandH * 0.22)}px sans-serif`;
    ctx.fillText('متحف إرث الحضارة الرقمي', w / 2, h - innerOffset - bandH * 0.1);

    ctx.restore();
  }

  function showPhotoResult(dataUrl) {
    const video = document.getElementById('pb-video');
    const resultImg = document.getElementById('pb-result-img');
    const actionsLive = document.getElementById('pb-actions-live');
    const actionsResult = document.getElementById('pb-actions-result');
    resultImg.src = dataUrl;
    resultImg.style.display = 'block';
    video.style.display = 'none';
    actionsLive.style.display = 'none';
    actionsResult.style.display = 'flex';
  }

  function capturePhoto() {
    const video = document.getElementById('pb-video');
    const hint = document.getElementById('pb-hint');
    if (!video || !video.videoWidth) {
      if (hint) { hint.style.display = 'block'; hint.textContent = 'استنى لحظة لحد ما الكاميرا تشتغل، أو اختر صورة من جهازك.'; }
      return;
    }
    const canvas = document.getElementById('pb-canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    drawFrameDecoration(ctx, canvas.width, canvas.height, pbFrame);
    showPhotoResult(canvas.toDataURL('image/png'));
    stopCamera();
  }

  function handleFileUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.getElementById('pb-canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      drawFrameDecoration(ctx, canvas.width, canvas.height, pbFrame);
      showPhotoResult(canvas.toDataURL('image/png'));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
    e.target.value = '';
  }

  function retakePhoto() {
    openPhotoBooth();
  }

  function downloadPhoto() {
    const resultImg = document.getElementById('pb-result-img');
    if (!resultImg || !resultImg.src) return;
    const a = document.createElement('a');
    a.href = resultImg.src;
    a.download = `صورة-تذكارية-${pbFrame === 'egypt' ? 'فرعوني' : 'روماني'}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function resetProgress() {
    if (!confirm('هل تريد إعادة المهمة من الصفر؟ هيتم مسح كل التقدّم المحفوظ.')) return;
    state = { completed: {}, name: state.name };
    saveState();
    showScreen('intro');
  }

  /* ---------- 8) كونفيتي بسيط ---------- */
  function spawnConfetti(count) {
    const wrap = document.getElementById('mission-confetti');
    if (!wrap) return;
    const emojis = ['✨', '🏺', '👑', '⭐', '🔑', '🎉'];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('span');
      piece.className = 'mg-confetti-piece';
      piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      piece.style.left = Math.random() * 100 + '%';
      piece.style.animationDuration = (2 + Math.random() * 1.8) + 's';
      piece.style.animationDelay = (Math.random() * 0.6) + 's';
      piece.style.fontSize = (0.9 + Math.random() * 0.9) + 'rem';
      wrap.appendChild(piece);
      setTimeout(() => piece.remove(), 4500);
    }
  }

  /* ---------- 9) ربط زر الدخول باللعبة ---------- */
  function initTrigger() {
    document.querySelectorAll('[data-mission-trigger]').forEach(btn => {
      btn.addEventListener('click', (e) => { e.preventDefault(); openMission(); });
    });
  }

  function init() {
    initTrigger();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // إتاحة فتح اللعبة برمجيًا لو حبيت تربطها بزرار تاني في أي مكان في الموقع
  window.openCivilizationMission = openMission;
})();
