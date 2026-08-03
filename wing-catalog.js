/* =====================================================================
   متحف إرث الحضارة - wing-catalog.js
   كتالوج قابل للتحميل: بيبني صفحة طباعة نضيفة لكل قطع جناح معيّن،
   ويفتح حوار الطباعة (اللي منه تقدر تحفظ كـ PDF) - بديل عملي لمكتبة
   PDF خارجية، وبيستخدم نفس بيانات WINGS_ARTIFACTS الموجودة بالفعل.
   ===================================================================== */

(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  const NAMES = {
    egypt: 'مصر القديمة', mesopotamia: 'بلاد الرافدين', greek: 'الحضارة اليونانية',
    roman: 'الحضارة الرومانية', islamic: 'الحضارة الإسلامية', world: 'حضارات العالم',
    paintings: 'اللوحات والفنون', leaders: 'الملوك والحكام'
  };

  function getWingName(key) {
    try {
      if (typeof WING_META !== 'undefined' && WING_META[key]) return WING_META[key].name;
    } catch (e) {}
    return NAMES[key] || key;
  }

  function buildCatalogHtml(wingKey) {
    const items = (typeof WINGS_ARTIFACTS !== 'undefined' && WINGS_ARTIFACTS[wingKey]) ? WINGS_ARTIFACTS[wingKey] : [];
    const name = getWingName(wingKey);
    const rows = items
      .map(
        (it, i) => `<div class="cat-item">
          <span class="cat-num">${i + 1}</span>
          <div class="cat-body"><strong>${it.t || ''}</strong>${it.d ? `<span class="cat-loc"> — ${it.d}</span>` : ''}</div>
        </div>`
      )
      .join('');
    return `
      <div class="cat-header">
        <h1>كتالوج جناح: ${name}</h1>
        <p>متحف إرث الحضارة · ${items.length} قطعة أثرية · ${new Date().toLocaleDateString('ar-EG')}</p>
      </div>
      <div class="cat-list">${rows}</div>`;
  }

  function openCatalogWindow(wingKey) {
    const html = buildCatalogHtml(wingKey);
    const w = window.open('', '_blank');
    if (!w) {
      alert('المتصفح منع فتح نافذة جديدة. اسمح بالنوافذ المنبثقة لهذا الموقع وحاول تاني.');
      return;
    }
    w.document.write(`<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8">
      <title>كتالوج جناح</title>
      <style>
        body{ font-family:'Cairo', Tahoma, sans-serif; padding:24px; color:#0d1626; }
        .cat-header{ border-bottom:3px solid #d4af37; padding-bottom:12px; margin-bottom:20px; }
        .cat-header h1{ color:#041233; font-size:22px; }
        .cat-header p{ color:#4a4330; font-size:13px; margin-top:4px; }
        .cat-item{ display:flex; gap:10px; padding:8px 0; border-bottom:1px solid #eee; font-size:13px; }
        .cat-num{ color:#d4af37; font-weight:700; flex-shrink:0; width:28px; }
        .cat-loc{ color:#666; }
        @media print{ body{ padding:8mm; } }
      </style></head><body>${html}
      <script>window.onload = () => setTimeout(() => window.print(), 300);<\/script>
      </body></html>`);
    w.document.close();
  }

  ready(function () {
    document.getElementById('wing-catalog-open-btn')?.addEventListener('click', () => {
      const select = document.getElementById('wing-catalog-select');
      const wingKey = select ? select.value : 'egypt';
      openCatalogWindow(wingKey);
    });
  });
})();
