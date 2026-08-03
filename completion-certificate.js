/* =====================================================================
   متحف إرث الحضارة - completion-certificate.js
   شهادة إتمام الزيارة: بتتفعّل لما الزائر يستكشف قطعة واحدة على الأقل
   من كل الأجنحة الستة الرئيسية (نفس شرط شارة "سيّد الحضارات" الموجودة
   بالفعل في auth.js)، وبتديله شهادة PNG قابلة للتحميل بنفس أسلوب شهادة
   بطل الأسبوع الموجودة في features.js.
   ===================================================================== */

(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  const CORE_WINGS = ['egypt', 'mesopotamia', 'greek', 'roman', 'islamic', 'world'];
  const CORE_WING_NAMES = {
    egypt: 'مصر القديمة', mesopotamia: 'بلاد الرافدين', greek: 'الحضارة اليونانية',
    roman: 'الحضارة الرومانية', islamic: 'الحضارة الإسلامية', world: 'حضارات العالم'
  };

  function safeAuthPieces() {
    /* db/auth/currentUser ممكن يكونوا في TDZ لو auth.js اتوقف بدري (مثلاً فشل تحميل
       Firebase)، فـ typeof بترمي خطأ بدل 'undefined' في الحالة دي - بنتعامل معاها بأمان. */
    try {
      return {
        db: typeof db !== 'undefined' ? db : null,
        auth: typeof auth !== 'undefined' ? auth : null,
        user: typeof currentUser !== 'undefined' ? currentUser : null
      };
    } catch (e) {
      return { db: null, auth: null, user: null };
    }
  }

  function drawCertificate(username, visitedNames) {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1131;
    const c = canvas.getContext('2d');

    const grad = c.createLinearGradient(0, 0, 1600, 1131);
    grad.addColorStop(0, '#041233');
    grad.addColorStop(0.55, '#0b3d91');
    grad.addColorStop(1, '#041233');
    c.fillStyle = grad;
    c.fillRect(0, 0, 1600, 1131);

    c.strokeStyle = '#d4af37';
    c.lineWidth = 6;
    c.strokeRect(40, 40, 1520, 1051);
    c.lineWidth = 2;
    c.strokeRect(64, 64, 1472, 1003);

    c.textAlign = 'center';
    c.direction = 'rtl';

    c.fillStyle = '#f3d97a';
    c.font = '600 30px Cairo, sans-serif';
    c.fillText('متحف إرث الحضارة', 800, 175);

    c.fillStyle = '#d4af37';
    c.font = '700 64px "Reem Kufi", Cairo, sans-serif';
    c.fillText('شهادة إتمام الرحلة', 800, 290);

    c.fillStyle = '#fbf4e2';
    c.font = '400 26px Cairo, sans-serif';
    c.fillText('تُمنح هذه الشهادة إلى', 800, 400);

    c.fillStyle = '#ffffff';
    c.font = '700 52px Cairo, sans-serif';
    c.fillText(username || 'زائر عزيز', 800, 475);

    c.fillStyle = 'rgba(251,244,226,.9)';
    c.font = '400 24px Cairo, sans-serif';
    c.fillText('لاستكشافه/ها قطعًا أثرية من جميع أجنحة المتحف الستة:', 800, 560);

    c.font = '600 22px Cairo, sans-serif';
    c.fillStyle = '#f3d97a';
    c.fillText(visitedNames.join('  ·  '), 800, 610);

    c.fillStyle = 'rgba(251,244,226,.75)';
    c.font = '400 20px Cairo, sans-serif';
    c.fillText(new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }), 800, 940);

    c.font = '700 22px Cairo, sans-serif';
    c.fillStyle = '#d4af37';
    c.fillText('🗺️ سيّد الحضارات', 800, 1000);

    return canvas;
  }

  function triggerDownload(canvas) {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'شهادة-إتمام-الرحلة.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    });
  }

  function render() {
    const mount = document.getElementById('completion-cert-content');
    if (!mount) return;
    const { db, user } = safeAuthPieces();

    if (!user) {
      mount.innerHTML = `<p class="cert-msg">سجّل دخولك الأول عشان نقدر نتابع رحلتك في المتحف. 🔑</p>
        <button type="button" class="btn btn-gold btn-sm" id="cert-login-btn">تسجيل الدخول</button>`;
      document.getElementById('cert-login-btn')?.addEventListener('click', () => {
        document.getElementById('completion-cert-modal')?.classList.remove('active');
        document.body.style.overflow = '';
        document.getElementById('nav-login-btn')?.click();
      });
      return;
    }

    if (!db) {
      mount.innerHTML = `<p class="cert-msg">مش قادرين نوصل لبياناتك دلوقتي، حاول تاني كمان شوية. ⏳</p>`;
      return;
    }

    mount.innerHTML = `<p class="cert-msg">بنجهّز رحلتك... ⏳</p>`;

    let usersCollectionName = 'museum_users';
    try { if (typeof USERS_COLLECTION !== 'undefined') usersCollectionName = USERS_COLLECTION; } catch (e) {}
    db.collection(usersCollectionName)
      .doc(user.uid)
      .get()
      .then((doc) => {
        const data = doc.exists ? doc.data() : {};
        const viewed = Array.isArray(data.viewedArtifacts) ? data.viewedArtifacts : [];
        const seenWings = new Set(viewed.map((v) => v.wingKey));
        const visitedCore = CORE_WINGS.filter((w) => seenWings.has(w));
        const remaining = CORE_WINGS.filter((w) => !seenWings.has(w));

        const progressHtml = CORE_WINGS.map(
          (w) => `<span class="cert-wing-chip ${seenWings.has(w) ? 'done' : ''}">${seenWings.has(w) ? '✅' : '⬜'} ${CORE_WING_NAMES[w]}</span>`
        ).join('');

        if (remaining.length === 0) {
          mount.innerHTML = `
            <p class="cert-msg cert-success">🎉 مبروك! زرت كل أجنحة المتحف الستة.</p>
            <div class="cert-wings-progress">${progressHtml}</div>
            <button type="button" class="btn btn-gold" id="cert-download-btn">🎓 حمّل شهادتك</button>`;
          document.getElementById('cert-download-btn')?.addEventListener('click', () => {
            const canvas = drawCertificate(data.username || user.username, visitedCore.map((w) => CORE_WING_NAMES[w]));
            triggerDownload(canvas);
          });
        } else {
          mount.innerHTML = `
            <p class="cert-msg">زرت ${visitedCore.length} من ${CORE_WINGS.length} أجنحة. كمّل الباقي عشان تفتح شهادتك 🏛️</p>
            <div class="cert-wings-progress">${progressHtml}</div>`;
        }
      })
      .catch(() => {
        mount.innerHTML = `<p class="cert-msg">حصل خطأ في تحميل بياناتك، حاول تاني.</p>`;
      });
  }

  ready(function () {
    document.getElementById('completion-cert-trigger-btn')?.addEventListener('click', render);
  });
})();
