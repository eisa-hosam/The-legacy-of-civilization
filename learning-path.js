/* =====================================================================
   متحف إرث الحضارة - learning-path.js
   "مش عارف تبدأ منين؟": مسارات زيارة مقترحة حسب نوع الزائر، بتستخدم
   نفس عناصر الصفحة الموجودة بالفعل (بطاقات الأجنحة، الأقسام، الألعاب)
   بدل ما تعمل محتوى جديد منفصل.
   ===================================================================== */

(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  const PATHS = {
    first: {
      label: 'زائر لأول مرة',
      steps: [
        { text: 'ابدأ بجناح مصر القديمة 𓂀', action: () => scrollToAndClick('.wing-card[data-wing="egypt"]') },
        { text: 'تفرّج على الخط الزمني عشان تاخد فكرة عامة عن ترتيب الحضارات', action: () => scrollToId('timeline') },
        { text: 'سجّل دخولك (اختياري) عشان تقدر تعمل اختبار "أي شخصية تاريخية تشبهك؟"', action: () => document.getElementById('nav-login-btn')?.click() }
      ]
    },
    student: {
      label: 'طالب أو باحث',
      steps: [
        { text: 'ابدأ بقسم "قارن بين الحضارات" لفهم الفروق الأساسية', action: () => scrollToId('compare') },
        { text: 'استخدم الخط الزمني لترتيب الأحداث تاريخيًا', action: () => scrollToId('timeline') },
        { text: 'استكشف جناح بلاد الرافدين ثم مصر للمقارنة بين أقدم حضارتين', action: () => scrollToAndClick('.wing-card[data-wing="mesopotamia"]') },
        { text: 'راجع مصادر المعلومات في قسم "المصادر" آخر الصفحة', action: () => scrollToId('sources') }
      ]
    },
    quick: {
      label: 'وقتي قصير (10 دقايق)',
      steps: [
        { text: 'دوسّ على زرار "فاجئني 🎲" وشوف قطعة عشوائية', action: () => document.getElementById('surprise-btn')?.click() },
        { text: 'جاوب سؤال "التحدي اليومي" - بياخد دقيقة بس', action: () => scrollToId('daily-challenge') },
        { text: 'استكشف جناح واحد يعجبك بسرعة', action: () => scrollToId('wings') }
      ]
    },
    games: {
      label: 'بحب الألعاب',
      steps: [
        { text: 'جرّب لعبة "مهمة إنقاذ الحضارة" التفاعلية', action: () => document.querySelector('[data-mission-trigger]')?.click() },
        { text: 'ركّب لعبة تركيب الصور (Puzzle)', action: () => scrollToId('wings') },
        { text: 'اختبر معلوماتك في اختبار الشخصية التاريخية (بعد تسجيل الدخول من صفحتك الشخصية)', action: () => document.getElementById('nav-login-btn')?.click() },
        { text: 'شوف ترتيبك في لوحة الصدارة اليومية', action: () => scrollToId('daily-challenge') }
      ]
    }
  };

  function scrollToId(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    closePathModal();
  }

  function scrollToAndClick(selector) {
    const el = document.querySelector(selector);
    closePathModal();
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => el.click(), 350);
    }
  }

  function closePathModal() {
    const modal = document.getElementById('learning-path-modal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  ready(function () {
    const chipsWrap = document.getElementById('path-chips');
    const stepsWrap = document.getElementById('path-steps');
    if (!chipsWrap || !stepsWrap) return;

    function renderPath(key) {
      const path = PATHS[key];
      if (!path) return;
      chipsWrap.querySelectorAll('.path-chip').forEach((c) => c.classList.toggle('active', c.dataset.path === key));
      stepsWrap.innerHTML = path.steps
        .map(
          (s, i) =>
            `<button type="button" class="path-step" data-step="${i}">
              <span class="path-step-num">${i + 1}</span>
              <span class="path-step-text">${s.text}</span>
            </button>`
        )
        .join('');
      stepsWrap.querySelectorAll('.path-step').forEach((btn) => {
        btn.addEventListener('click', () => path.steps[Number(btn.dataset.step)]?.action?.());
      });
    }

    chipsWrap.querySelectorAll('.path-chip').forEach((chip) => {
      chip.addEventListener('click', () => renderPath(chip.dataset.path));
    });

    renderPath('first');
  });
})();
