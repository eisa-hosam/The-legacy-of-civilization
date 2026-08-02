/* =====================================================================
   متحف إرث الحضارة - assistant.js
   المرشد الذكي: مساعد محادثة داخل المتحف (قائم على قواعد + بحث محلي في
   بيانات المتحف نفسها، من غير أي اتصال بسيرفر خارجي).
   المصدر الوحيد للمعرفة: WINGS_ARTIFACTS / WING_META / WORLD_HERITAGE_DATA
   الموجودين بالفعل في script.js و auth.js و world-heritage-data.js.
   ===================================================================== */

(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  /* ---------- أدوات نص عربي ---------- */
  function normalizeAr(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/[أإآا]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/[ًٌٍَُِّْ]/g, '')
      .trim();
  }

  /* ---------- أسماء بديلة للأجنحة (للمطابقة اللغوية) ---------- */
  const WING_ALIASES = {
    egypt: ['مصر', 'فراعنه', 'فرعوني', 'اهرام', 'مصريه القديمه'],
    roman: ['روما', 'روماني', 'الرومان'],
    islamic: ['اسلام', 'اسلامي', 'الاسلاميه'],
    greek: ['يونان', 'يوناني', 'اليونانيه', 'اغريق'],
    mesopotamia: ['رافدين', 'بابل', 'سومر', 'اشور', 'العراق القديم'],
    world: ['عالم', 'حضارات العالم', 'عالميه'],
    paintings: ['لوحات', 'فنون', 'رسم'],
    leaders: ['ملوك', 'حكام', 'قاده', 'اباطره']
  };
  const LEADERS_META = { name: 'الملوك والحكام', emoji: '👑' };
  const FALLBACK_WING_NAMES = {
    egypt: 'مصر القديمة',
    paintings: 'اللوحات والفنون',
    roman: 'الحضارة الرومانية',
    islamic: 'الحضارة الإسلامية',
    greek: 'الحضارة اليونانية',
    mesopotamia: 'حضارة بلاد الرافدين',
    world: 'حضارات العالم'
  };

  function getWingMeta(key) {
    try {
      if (typeof WING_META !== 'undefined' && WING_META && WING_META[key]) return WING_META[key];
    } catch (e) {
      /* WING_META قد تكون معلّقة (TDZ) لو auth.js اتوقف مبكرًا بسبب فشل تحميل Firebase؛
         typeof بيرمي خطأ في الحالة دي بدل ما يرجّع 'undefined'، فبنتعامل معاها بأمان هنا. */
    }
    if (key === 'leaders') return LEADERS_META;
    return FALLBACK_WING_NAMES[key] ? { name: FALLBACK_WING_NAMES[key], emoji: '⭐' } : { name: key, emoji: '⭐' };
  }

  function findWingKeyInText(normText) {
    const keys = Object.keys(WING_ALIASES);
    for (const key of keys) {
      const meta = getWingMeta(key);
      const names = [meta.name, ...WING_ALIASES[key]].map(normalizeAr);
      if (names.some((n) => n && normText.includes(n))) return key;
    }
    return null;
  }

  /* ---------- الأسئلة الشائعة (قاعدة معرفة ثابتة) ---------- */
  const FAQ = [
    {
      keys: ['ازاي العب', 'مهمه انقاذ', 'لعبه', 'game'],
      a: 'لعبة "مهمة إنقاذ الحضارة" 🕹️ موجودة جوّه قسم الأجنحة، دوسّ على زرار "جرّب مهمة إنقاذ الحضارة" وهتلاقي مراحل تفاعلية بتختبر معلوماتك عن كل حضارة.'
    },
    {
      keys: ['بازل', 'puzzle', 'تركيب الصوره'],
      a: 'لعبة تركيب الصور (Puzzle) بتلاقيها في نفس قسم الألعاب، بتركّب صورة قطعة أثرية قطعة قطعة وتتعلم قصتها في الآخر.'
    },
    {
      keys: ['تقييم', 'نجوم', 'ازاي اقيم'],
      a: 'تقدر تقيّم أي قطعة أثرية من 1 لـ5 نجوم من جوّه نافذة تفاصيلها، بس محتاج تكون مسجّل دخول الأول ⭐.'
    },
    {
      keys: ['شاره', 'badge', 'وسام', 'انجاز'],
      a: 'الشارات (Badges) بتتفتح تلقائيًا لما تتفاعل مع المتحف - زي إنك تقيّم قطع، تكسب في الكويز، أو تزور أجنحة كتير. تقدر تشوفها في صفحتك الشخصية.'
    },
    {
      keys: ['تحدي يومي', 'daily', 'بطل الاسبوع'],
      a: 'فيه "تحدي يومي" وسؤال جديد كل يوم، ولوحة صدارة بتجمع أفضل 10، وفي آخر الأسبوع بيتكرّم "بطل الأسبوع" 🏆 بشهادة تقدير رقمية.'
    },
    {
      keys: ['واقع معزز', 'ar', 'كاميرا'],
      a: 'ميزة الواقع المعزز (AR) بتخليك تشوف القطعة الأثرية "قدامك" على كاميرا موبايلك مباشرة - دوسّ على زرار الكاميرا اللي جوّه نافذة أي قطعة.'
    },
    {
      keys: ['كبسوله زمنيه', 'كبسوله', 'capsule'],
      a: 'الكبسولة الزمنية 📦 (في الزرار العائم) بتخليك تكتب رسالة لنفسك أو لحد تاني، وتحددلها تاريخ في المستقبل عشان تتفتح فيه.'
    },
    {
      keys: ['مقارنه', 'قارن', 'compare'],
      a: 'قسم "قارن بين الحضارات" بيدّيك جدول يقارن حضارتين اخترتهم من ناحية التاريخ، الإنجازات، والمعتقدات.'
    },
    {
      keys: ['خط زمني', 'تايم لاين', 'timeline'],
      a: 'الخط الزمني التفاعلي بيوريك أهم أحداث كل الحضارات مرتبة بالسنين، وتقدر تفلتر بحضارة معينة أو تسحب المؤشر لسنة معينة.'
    },
    {
      keys: ['تراث عالمي', 'يونسكو', 'unesco'],
      a: 'قسم مواقع التراث العالمي بيعرض مواقع اليونسكو حسب كل دولة. اسألني عن اسم دولة وهقولك عندها كام موقع مسجّل.'
    },
    {
      keys: ['تسجيل دخول', 'حساب', 'انشاء حساب', 'login'],
      a: 'تقدر تسجّل دخول أو تعمل حساب جديد من زرار "تسجيل الدخول" في الناف بار، وده بيفتحلك مميزات زي المفضلة والتقييم والشارات وصفحتك الشخصية.'
    },
    {
      keys: ['اقتراح', 'صندوق الاقتراحات', 'رأيك'],
      a: 'عندك اقتراح أو ملاحظة؟ فيه صندوق اقتراحات 💡 في الأزرار العائمة، اكتب فيه أي حاجة وإحنا هنقراها.'
    },
    {
      keys: ['اتاحه', 'a11y', 'قارئ الشاشه', 'تباين'],
      a: 'من زرار ♿ تقدر تفعّل تباين ألوان أعلى، خط أكبر، أو قراءة صوتية تلقائية لمحتوى أي نافذة بتفتحها.'
    },
    {
      keys: ['عن المتحف', 'ايه المتحف ده', 'مين عمل المتحف'],
      a: '"متحف إرث الحضارة" متحف رقمي تفاعلي مجاني بيجمع كنوز مصر القديمة وحضارات العالم في مكان واحد، بتصميم وألعاب وتجارب تفاعلية بدل الاعتماد بس على الصور والنصوص.'
    }
  ];

  function findFaqAnswer(normText) {
    for (const item of FAQ) {
      if (item.keys.some((k) => normText.includes(normalizeAr(k)))) return item.a;
    }
    return null;
  }

  /* ---------- بحث عن دولة في مواقع التراث العالمي ---------- */
  function findCountryAnswer(rawText, normText) {
    if (typeof window.WORLD_HERITAGE_DATA === 'undefined') return null;
    const data = window.WORLD_HERITAGE_DATA;
    const order = data.order || [];
    let hit = order.find((c) => normText.includes(normalizeAr(c)));
    if (!hit) return null;
    const sites = data[hit];
    const count = Array.isArray(sites) ? sites.length : (sites && sites.count) || 0;
    return `${hit} عندها ${count ? count + ' موقع' : 'مواقع'} مسجّلة على قائمة التراث العالمي لليونسكو 🌍. تقدر تشوفهم في قسم "التراث العالمي" في الصفحة.`;
  }

  /* ---------- بحث في القطع الأثرية ---------- */
  function searchArtifacts(normText) {
    if (typeof WINGS_ARTIFACTS === 'undefined') return [];
    const results = [];
    Object.keys(WINGS_ARTIFACTS).forEach((wingKey) => {
      WINGS_ARTIFACTS[wingKey].forEach((item) => {
        const hay = normalizeAr((item.t || '') + ' ' + (item.d || '') + ' ' + (item.i || ''));
        if (hay.includes(normText) || normText.split(' ').some((w) => w.length > 2 && hay.includes(w))) {
          results.push({ wingKey, item });
        }
      });
    });
    return results.slice(0, 4);
  }

  /* ---------- فتح قطعة أثرية بالاستفادة من محرك البحث الموجود بالفعل ---------- */
  function openArtifact(title, wingKey) {
    const navSearch = document.getElementById('nav-search');
    const navSearchInput = document.getElementById('nav-search-input');
    const navSearchResults = document.getElementById('nav-search-results');
    if (!navSearch || !navSearchInput) return;
    navSearch.classList.add('active');
    navSearchInput.value = title;
    navSearchInput.dispatchEvent(new Event('input', { bubbles: true }));
    closeAssistant();
    setTimeout(() => {
      const btn =
        navSearchResults?.querySelector(`.search-result-item[data-wing="${wingKey}"]`) ||
        navSearchResults?.querySelector('.search-result-item');
      if (btn) btn.click();
    }, 180);
  }

  function openWing(wingKey) {
    const card = document.querySelector(`.wing-card[data-wing="${wingKey}"]`);
    closeAssistant();
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => card.click(), 350);
    } else {
      document.getElementById('wings')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function closeAssistant() {
    const modal = document.getElementById('assistant-modal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ---------- منطق الرد ---------- */
  function buildReply(rawText) {
    const norm = normalizeAr(rawText);

    if (['اهلا', 'سلام', 'هاي', 'مرحبا'].some((g) => norm.includes(g))) {
      return { text: 'أهلًا بيك في متحف إرث الحضارة! 👋 اسألني عن أي حضارة، قطعة أثرية، أو ميزة في المتحف.' };
    }

    const faq = findFaqAnswer(norm);
    if (faq) return { text: faq };

    const wingKey = findWingKeyInText(norm);
    if (wingKey && typeof WINGS_ARTIFACTS !== 'undefined' && WINGS_ARTIFACTS[wingKey]) {
      const meta = getWingMeta(wingKey);
      const count = WINGS_ARTIFACTS[wingKey].length;
      return {
        text: `${meta.emoji} جناح "${meta.name}" فيه ${count} قطعة أثرية جاهزة تستكشفها.`,
        action: { label: `افتح جناح ${meta.name} ←`, run: () => openWing(wingKey) }
      };
    }

    const countryAns = findCountryAnswer(rawText, norm);
    if (countryAns) return { text: countryAns };

    const results = searchArtifacts(norm);
    if (results.length) {
      const list = results
        .map(
          (r, i) =>
            `<button type="button" class="assistant-result-btn" data-idx="${i}">${r.item.t}${
              r.item.d ? ' — ' + r.item.d : ''
            }</button>`
        )
        .join('');
      return { text: `لقيتلك ${results.length} نتيجة قريبة من سؤالك:<div class="assistant-results">${list}</div>`, results };
    }

    return {
      text: 'معنديش إجابة دقيقة لسؤالك ده دلوقتي 🤔، جرّب تسأل عن اسم حضارة (زي "مصر" أو "اليونان") أو ميزة في المتحف زي "الكويز" أو "البادچ".'
    };
  }

  /* ---------- واجهة الشات ---------- */
  ready(function () {
    const modal = document.getElementById('assistant-modal');
    const messagesEl = document.getElementById('assistant-messages');
    const form = document.getElementById('assistant-form');
    const input = document.getElementById('assistant-input');
    const chipsWrap = document.getElementById('assistant-chips');
    if (!modal || !messagesEl || !form || !input) return;

    let greeted = false;

    function addMsg(html, who) {
      const div = document.createElement('div');
      div.className = 'assistant-msg assistant-msg-' + who;
      div.innerHTML = html;
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return div;
    }

    function handleUserText(text) {
      if (!text.trim()) return;
      addMsg(text.replace(/</g, '&lt;'), 'user');
      const reply = buildReply(text);
      const botDiv = addMsg(reply.text, 'bot');
      if (reply.action) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'assistant-action-btn';
        btn.textContent = reply.action.label;
        btn.addEventListener('click', reply.action.run);
        botDiv.appendChild(btn);
      }
      if (reply.results) {
        botDiv.querySelectorAll('.assistant-result-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            const r = reply.results[Number(btn.dataset.idx)];
            if (r) openArtifact(r.item.t, r.wingKey);
          });
        });
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value;
      input.value = '';
      handleUserText(text);
    });

    chipsWrap?.querySelectorAll('.assistant-chip').forEach((chip) => {
      chip.addEventListener('click', () => handleUserText(chip.dataset.q || chip.textContent));
    });

    modal.addEventListener('click', (e) => {
      if (e.target.closest('.modal-close') || e.target === modal) {
        // العناصر دي بيتعامل معاها المنطق العام لكل النوافذ في script.js بالفعل
      }
    });

    document.getElementById('assistant-trigger-btn')?.addEventListener('click', () => {
      if (!greeted) {
        greeted = true;
        addMsg('أهلًا بيك 👋 أنا المرشد الذكي لمتحف إرث الحضارة. جرّب تسألني حاجة، أو دوسّ على أحد الاقتراحات تحت.', 'bot');
      }
      setTimeout(() => input.focus(), 200);
    });
  });
})();
