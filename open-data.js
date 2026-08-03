/* =====================================================================
   متحف إرث الحضارة - open-data.js
   بيانات مفتوحة: زرار بسيط بيصدّر بيانات المتحف (القطع الأثرية + مواقع
   التراث العالمي) كملف JSON قابل للتحميل، عشان باحثين ومدرّسين يقدروا
   يستخدموها في مشاريعهم. تصدير من جانب المتصفح بالكامل، من غير سيرفر.
   ===================================================================== */

(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function buildExportPayload() {
    const payload = {
      museum: 'متحف إرث الحضارة (The Digital Heritage Museum)',
      exportedAt: new Date().toISOString(),
      license: 'هذه البيانات متاحة للاستخدام التعليمي والبحثي غير التجاري، مع ذكر المصدر.',
      wings: (typeof WINGS_ARTIFACTS !== 'undefined') ? WINGS_ARTIFACTS : null,
      worldHeritageSites: (typeof window.WORLD_HERITAGE_DATA !== 'undefined') ? window.WORLD_HERITAGE_DATA : null
    };
    return payload;
  }

  function downloadJson() {
    try {
      const payload = buildExportPayload();
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'heritage-museum-open-data.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (e) {
      alert('حصل خطأ أثناء تجهيز الملف، حاول تاني.');
    }
  }

  ready(function () {
    document.getElementById('open-data-download-btn')?.addEventListener('click', downloadJson);
  });
})();
