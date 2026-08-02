/* =====================================================================
   متحف إرث الحضارة - community-features.js
   يضيف 4 قدرات جديدة فوق الموقع الموجود، من غير ما يلمس منطق script.js
   الأساسي (بيسمع بس لحدث museum:wingOpened اللي script.js بيبعته):

   1) تتبّع الأجنحة اللي زارها المستخدم محليًا + شهادة إتمام رحلة (Canvas).
   2) تحميل نسخة PDF لكل جناح (عبر نافذة طباعة مخصّصة، تشتغل حتى من
      غير إنترنت لأنها من غير أي مكتبة خارجية).
   3) قصص من مجتمعات محلية: تُخزَّن وتُعرض فعليًا لكل الزوار عبر Firestore
      (نفس مشروع Firebase المستخدم بالفعل في auth.js)، والصور عبر
      Firebase Storage. لو Firebase مش متاح لأي سبب، بيظهر نص توضيحي
      بدل قسم فاضي.
   4) إحصائيات أثر حقيقية (مش تقديرية): إجمالي الزيارات، عدد الدول،
      عدد استخدامات وضع المعلم — كلها عدّادات مُجمَّعة في مستند Firestore
      واحد (museum_impact_stats/global) بييتحدّث من كل الزوار.
   ===================================================================== */

(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  const hasFirebase = typeof firebase !== 'undefined' && typeof db !== 'undefined';

  /* =====================================================================
     1) تتبّع الأجنحة + شهادة الإتمام
     ===================================================================== */
  const CERT_WINGS = ['egypt', 'mesopotamia', 'greek', 'roman', 'islamic', 'world'];
  const VISITED_KEY = 'museum_wings_visited';
  const lastWing = { key: null, data: null };

  function getVisitedWings() {
    try { return JSON.parse(localStorage.getItem(VISITED_KEY) || '[]'); }
    catch (e) { return []; }
  }
  function saveVisitedWing(key) {
    if (!CERT_WINGS.includes(key)) return;
    const list = getVisitedWings();
    if (!list.includes(key)) {
      list.push(key);
      localStorage.setItem(VISITED_KEY, JSON.stringify(list));
    }
  }

  function updateImpactWingsUI() {
    const el = document.getElementById('impact-wings');
    const visited = getVisitedWings().filter((k) => CERT_WINGS.includes(k));
    if (el) el.textContent = visited.length + '/' + CERT_WINGS.length;

    const statusEl = document.getElementById('certificate-status');
    const formEl = document.getElementById('certificate-form');
    if (!statusEl || !formEl) return;
    if (visited.length >= CERT_WINGS.length) {
      statusEl.textContent = 'مبروك! خلّصت كل الأجنحة الستة — اكتب اسمك وحمّل شهادتك.';
      formEl.style.display = 'flex';
    } else {
      statusEl.textContent = 'استكشفت ' + visited.length + ' من ' + CERT_WINGS.length + ' أجنحة رئيسية. كمّل الباقي عشان تفتح شهادة إتمام الرحلة.';
      formEl.style.display = 'none';
    }
  }

  function drawCertificate(name) {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1130;
    const ctx = canvas.getContext('2d');

    // خلفية
    const grad = ctx.createLinearGradient(0, 0, 1600, 1130);
    grad.addColorStop(0, '#0f1115');
    grad.addColorStop(1, '#1c1a12');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1600, 1130);

    // إطار ذهبي
    ctx.strokeStyle = '#1034a6';
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, 1520, 1050);
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, 1480, 1010);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#1034a6';
    ctx.font = '600 32px Tahoma, Arial';
    ctx.fillText('متحف إرث الحضارة', 800, 190);

    ctx.fillStyle = '#f4ecd8';
    ctx.font = 'bold 56px Tahoma, Arial';
    ctx.fillText('شهادة إتمام رحلة تعليمية', 800, 300);

    ctx.font = '28px Tahoma, Arial';
    ctx.fillStyle = '#cfcfcf';
    ctx.fillText('تُمنح هذه الشهادة إلى', 800, 420);

    ctx.font = 'bold 64px Tahoma, Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(name || 'زائر المتحف', 800, 510);

    ctx.font = '26px Tahoma, Arial';
    ctx.fillStyle = '#cfcfcf';
    ctx.fillText('لاستكشافه/ها كل الأجنحة الرئيسية الستة في متحف إرث الحضارة الرقمي:', 800, 600);

    const wingNames = {
      egypt: 'مصر القديمة', mesopotamia: 'بلاد الرافدين', greek: 'اليونانية',
      roman: 'الرومانية', islamic: 'الإسلامية', world: 'حضارات العالم'
    };
    ctx.font = '24px Tahoma, Arial';
    ctx.fillStyle = '#1034a6';
    ctx.fillText(CERT_WINGS.map((k) => wingNames[k]).join('  •  '), 800, 660);

    const dateStr = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.font = '22px Tahoma, Arial';
    ctx.fillStyle = '#9a9a9a';
    ctx.fillText('تاريخ الإصدار: ' + dateStr, 800, 950);
    ctx.fillText('برنامج تعليمي رقمي مجاني — متحف إرث الحضارة', 800, 990);

    return canvas;
  }

  function initCertificate() {
    document.getElementById('certificate-download-btn')?.addEventListener('click', () => {
      const nameInput = document.getElementById('certificate-name');
      const name = (nameInput?.value || '').trim();
      if (!name) { nameInput?.focus(); return; }
      const canvas = drawCertificate(name);
      const link = document.createElement('a');
      link.download = 'شهادة-متحف-إرث-الحضارة.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

  /* =====================================================================
     2) تحميل نسخة PDF لكل جناح (نافذة طباعة، Save as PDF من المتصفح)
     ===================================================================== */
  function buildWingPrintSheet(key, data) {
    const items = (typeof WINGS_ARTIFACTS !== 'undefined' && WINGS_ARTIFACTS[key]) || [];
    const wrap = document.createElement('div');
    wrap.className = 'wing-print-sheet active';
    wrap.innerHTML =
      '<button class="btn btn-gold wing-print-close" id="wing-print-close-btn">إغلاق</button>' +
      '<h1>' + (data?.title || key) + '</h1>' +
      '<p class="wp-tag">' + (data?.tag || '') + '</p>' +
      '<p class="wp-desc">' + (data?.desc || '') + '</p>' +
      (data?.fact ? '<p class="wp-desc"><strong>هل تعلم؟</strong> ' + data.fact + '</p>' : '') +
      '<h2>القطع الأثرية (' + items.length + ')</h2>' +
      items.map((it) =>
        '<div class="wp-artifact"><h4>' + (it.t || '') + (it.d ? ' — ' + it.d : '') + '</h4><p>' + (it.i || '') + '</p></div>'
      ).join('');
    document.body.appendChild(wrap);
    document.getElementById('wing-print-close-btn').addEventListener('click', () => wrap.remove());
    setTimeout(() => {
      window.print();
    }, 200);
    window.addEventListener('afterprint', function cleanup() {
      wrap.remove();
      window.removeEventListener('afterprint', cleanup);
    });
  }

  function initWingPdfButton() {
    document.getElementById('wing-pdf-btn')?.addEventListener('click', () => {
      if (!lastWing.key) return;
      buildWingPrintSheet(lastWing.key, lastWing.data);
    });
  }

  document.addEventListener('museum:wingOpened', (e) => {
    lastWing.key = e.detail.key;
    lastWing.data = e.detail.data;
    saveVisitedWing(e.detail.key);
    updateImpactWingsUI();
  });

  /* =====================================================================
     3) قصص من مجتمعات محلية (Firestore + Storage)
     ===================================================================== */
  const STORIES_COLLECTION = 'museum_community_stories';

  function storyCardHtml(d) {
    const img = d.imageUrl ? '<img src="' + d.imageUrl + '" alt="' + (d.name || '') + '" loading="lazy">' : '';
    const name = (d.name || 'زائر المتحف').toString().slice(0, 60);
    const region = (d.region || '').toString().slice(0, 60);
    const story = (d.story || '').toString().slice(0, 700);
    return '<article class="story-card">' + img +
      '<h3>' + name + '</h3>' +
      (region ? '<div class="story-region">📍 ' + region + '</div>' : '') +
      '<p class="story-text">' + story + '</p>' +
      '</article>';
  }

  async function loadStories() {
    const grid = document.getElementById('community-stories-grid');
    if (!grid) return;
    if (!hasFirebase) {
      grid.innerHTML = '<p class="story-card-empty">قصص المجتمع محتاجة اتصال بقاعدة بيانات المتحف، وهو مش متاح دلوقتي.</p>';
      return;
    }
    try {
      const snap = await db.collection(STORIES_COLLECTION).orderBy('createdAt', 'desc').limit(24).get();
      if (snap.empty) {
        grid.innerHTML = '<p class="story-card-empty">لسه مفيش قصص من الزوار — كن أول من يشارك قصة عن تراث عائلته أو منطقته!</p>';
        return;
      }
      grid.innerHTML = snap.docs.map((doc) => storyCardHtml(doc.data())).join('');
    } catch (e) {
      console.warn('تعذّر تحميل قصص المجتمع:', e);
      grid.innerHTML = '<p class="story-card-empty">تعذّر تحميل القصص حاليًا، حاول تاني بعد شوية.</p>';
    }
  }

  function prependStory(d) {
    const grid = document.getElementById('community-stories-grid');
    if (!grid) return;
    const empty = grid.querySelector('.story-card-empty');
    if (empty) empty.remove();
    grid.insertAdjacentHTML('afterbegin', storyCardHtml(d));
  }

  function readImageAsResizedDataUrl(file, maxDim) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          let w = img.width, h = img.height;
          if (w > h && w > maxDim) { h = Math.round(h * maxDim / w); w = maxDim; }
          else if (h > maxDim) { w = Math.round(w * maxDim / h); h = maxDim; }
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function uploadStoryImage(file) {
    if (!file || typeof firebase.storage !== 'function') return null;
    try {
      const dataUrl = await readImageAsResizedDataUrl(file, 900);
      const storage = firebase.storage();
      const path = 'community_stories/' + Date.now() + '_' + Math.random().toString(36).slice(2) + '.jpg';
      const ref = storage.ref(path);
      await ref.putString(dataUrl, 'data_url');
      return await ref.getDownloadURL();
    } catch (e) {
      console.warn('تعذّر رفع صورة القصة:', e);
      return null;
    }
  }

  function initCommunityForm() {
    const form = document.getElementById('community-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const name = document.getElementById('community-name').value.trim().slice(0, 60);
      const region = document.getElementById('community-region').value.trim().slice(0, 60);
      const story = document.getElementById('community-text').value.trim().slice(0, 700);
      const fileInput = document.getElementById('community-image');
      const file = fileInput?.files?.[0] || null;
      if (!name || !region || !story) return;
      if (!hasFirebase) { alert('تعذّر النشر: قاعدة بيانات المتحف مش متاحة دلوقتي.'); return; }

      submitBtn.disabled = true;
      submitBtn.textContent = 'جارٍ النشر...';
      try {
        const imageUrl = file ? await uploadStoryImage(file) : null;
        const payload = { name, region, story, imageUrl: imageUrl || null, createdAt: firebase.firestore.FieldValue.serverTimestamp() };
        await db.collection(STORIES_COLLECTION).add(payload);
        prependStory({ ...payload, createdAt: null });
        form.reset();
        document.getElementById('community-modal')?.classList.remove('active');
        document.body.style.overflow = '';
      } catch (err) {
        console.warn('تعذّر نشر القصة:', err);
        alert('تعذّر نشر القصة، حاول تاني.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'نشر القصة';
      }
    });
  }

  /* =====================================================================
     4) إحصائيات أثر حقيقية (Firestore counters يشاركها كل الزوار)
     ===================================================================== */
  const IMPACT_DOC = 'museum_impact_stats';
  const SESSION_VISIT_KEY = 'museum_visit_counted_session';
  const COUNTRY_CACHE_KEY = 'museum_country_code_cache';

  async function detectCountryCode() {
    try {
      const cached = JSON.parse(localStorage.getItem(COUNTRY_CACHE_KEY) || 'null');
      if (cached && cached.at && Date.now() - cached.at < 30 * 24 * 60 * 60 * 1000) return cached.code;
    } catch (e) { /* تجاهل */ }
    try {
      const res = await fetch('https://ipwho.is/');
      const j = await res.json();
      const code = j && j.success !== false ? j.country_code : null;
      if (code) localStorage.setItem(COUNTRY_CACHE_KEY, JSON.stringify({ code, at: Date.now() }));
      return code;
    } catch (e) {
      return null;
    }
  }

  async function registerVisitAndStats() {
    if (!hasFirebase) return;
    const ref = db.collection(IMPACT_DOC).doc('global');
    if (!sessionStorage.getItem(SESSION_VISIT_KEY)) {
      sessionStorage.setItem(SESSION_VISIT_KEY, '1');
      try { await ref.set({ totalVisits: firebase.firestore.FieldValue.increment(1) }, { merge: true }); }
      catch (e) { console.warn('تعذّر تسجيل الزيارة:', e); }
      const code = await detectCountryCode();
      if (code) {
        try { await ref.set({ countries: firebase.firestore.FieldValue.arrayUnion(code) }, { merge: true }); }
        catch (e) { /* تجاهل */ }
      }
    }
    renderImpactStats();
  }

  function renderImpactStats() {
    if (!hasFirebase) {
      ['impact-visits', 'impact-country', 'impact-teacher'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = '—';
      });
      const sub = document.getElementById('impact-sub');
      if (sub) sub.textContent = 'إحصائيات المتحف العامة مش متاحة دلوقتي.';
      return;
    }
    const ref = db.collection(IMPACT_DOC).doc('global');
    ref.onSnapshot((snap) => {
      const d = snap.data() || {};
      const visitsEl = document.getElementById('impact-visits');
      const countryEl = document.getElementById('impact-country');
      const teacherEl = document.getElementById('impact-teacher');
      if (visitsEl) visitsEl.textContent = (d.totalVisits || 0).toLocaleString('ar-EG');
      if (countryEl) countryEl.textContent = ((d.countries || []).length).toLocaleString('ar-EG');
      if (teacherEl) teacherEl.textContent = (d.teacherModeUses || 0).toLocaleString('ar-EG');
    }, (e) => console.warn('تعذّر متابعة إحصائيات المتحف:', e));
  }

  function initTeacherModeCounter() {
    document.getElementById('teacher-mode-trigger-btn')?.addEventListener('click', () => {
      if (!hasFirebase) return;
      if (sessionStorage.getItem('museum_teacher_counted_session')) return;
      sessionStorage.setItem('museum_teacher_counted_session', '1');
      db.collection(IMPACT_DOC).doc('global')
        .set({ teacherModeUses: firebase.firestore.FieldValue.increment(1) }, { merge: true })
        .catch((e) => console.warn('تعذّر تسجيل استخدام وضع المعلم:', e));
    });
  }

  ready(function () {
    updateImpactWingsUI();
    initCertificate();
    initWingPdfButton();
    initCommunityForm();
    loadStories();
    initTeacherModeCounter();
    registerVisitAndStats();
  });
})();
