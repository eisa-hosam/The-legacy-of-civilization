/* متحف إرث الحضارة — وحدة العرض بالحجم الفعلي (Real-Size AR)
   الفكرة: بدل التكبير اليدوي التقريبي، يُستخدم جسم مرجعي معروف الأبعاد (بطاقة ID-1 وفق
   ISO/IEC 7810: 85.60 × 53.98 مم) موضوع على نفس سطح العرض لاستخراج معامل المعايرة
   (بكسل/مم) من الكاميرا نفسها، ثم يُحسب عرض صورة القطعة بالبكسل من عرضها الحقيقي المُسجَّل.
   لا تعتمد على أي مكتبة أو تطبيق خارجي. */
(function () {
  'use strict';

  // أبعاد البطاقة المرجعية (ISO/IEC 7810 ID-1) بالمليمتر
  var CARD_W_MM = 85.60, CARD_H_MM = 53.98;

  // الأبعاد الفعلية للقطع (سم) — تُملأ من مصدر موثّق فقط: { "اسم القطعة": عرض_بالسم }
  // أمثلة: window.MUSEUM_REAL_SIZES["اسم القطعة"] = 12.5;
  window.MUSEUM_REAL_SIZES = window.MUSEUM_REAL_SIZES || {};

  var ov = document.getElementById('ar-overlay');
  var obj = document.getElementById('ar-object');
  var title = document.getElementById('ar-title-label');
  var topbar = ov && ov.querySelector('.ar-topbar');
  if (!ov || !obj || !topbar) return;

  var css = document.createElement('style');
  css.textContent =
    '#ar-real-btn{font-size:1rem}' +
    '#ar-real-frame{position:absolute;z-index:3;border:2px dashed #d4af37;border-radius:6px;background:rgba(212,175,55,.12);' +
    'touch-action:none;cursor:move;display:none;color:#fff;font-size:.7rem;text-align:center;line-height:1.4}' +
    '#ar-real-frame.on{display:flex;align-items:center;justify-content:center}' +
    '#ar-real-panel{position:absolute;z-index:4;inset-inline:12px;bottom:12px;background:rgba(0,0,0,.75);color:#fff;' +
    'border:1px solid rgba(212,175,55,.45);border-radius:14px;padding:12px 14px;font-size:.82rem;line-height:1.8;display:none;' +
    'backdrop-filter:blur(4px)}' +
    '#ar-real-panel.on{display:block}' +
    '#ar-real-panel label{display:block;margin-top:6px}' +
    '#ar-real-panel input[type=range]{width:100%}' +
    '#ar-real-panel input[type=number]{width:90px;padding:4px 6px;border-radius:6px;border:1px solid #888;background:#111;color:#fff}' +
    '#ar-real-panel button{margin-top:8px;padding:8px 14px;border-radius:10px;border:0;background:#d4af37;color:#111;font-weight:700;cursor:pointer}' +
    '#ar-real-msg{margin-top:6px;color:#9fe3a1}#ar-real-msg.err{color:#ff9d9d}';
  document.head.appendChild(css);

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'ar-icon-btn';
  btn.id = 'ar-real-btn';
  btn.setAttribute('aria-label', 'عرض القطعة بحجمها الفعلي');
  btn.textContent = '📏';
  topbar.insertBefore(btn, topbar.lastElementChild);

  var frame = document.createElement('div');
  frame.id = 'ar-real-frame';
  frame.textContent = 'طابق الإطار مع بطاقتك';
  ov.appendChild(frame);

  var panel = document.createElement('div');
  panel.id = 'ar-real-panel';
  panel.innerHTML =
    '<div><strong>خطوة 1:</strong> ضع بطاقة (هوية أو ATM) على نفس السطح، ووجّه الكاميرا لتطل عليها من أعلى، ثم اضبط الإطار الذهبي ليطابق البطاقة تمامًا.</div>' +
    '<input type="range" id="ar-real-range" min="60" max="360" value="170" aria-label="عرض الإطار المرجعي">' +
    '<label><strong>خطوة 2:</strong> العرض الحقيقي للقطعة (سم): ' +
    '<input type="number" id="ar-real-cm" min="0.1" max="2000" step="0.1" inputmode="decimal"></label>' +
    '<button type="button" id="ar-real-apply">اعرض بالحجم الفعلي</button> ' +
    '<button type="button" id="ar-real-hide">إخفاء</button>' +
    '<div id="ar-real-msg" role="status"></div>';
  ov.appendChild(panel);

  var range = panel.querySelector('#ar-real-range');
  var cmInput = panel.querySelector('#ar-real-cm');
  var msg = panel.querySelector('#ar-real-msg');

  function say(t, err) { msg.textContent = t; msg.className = err ? 'err' : ''; }

  function sizeFrame() {
    var w = Number(range.value);
    frame.style.width = w + 'px';
    frame.style.height = (w * CARD_H_MM / CARD_W_MM) + 'px';
  }

  function placeFrame() {
    var r = ov.getBoundingClientRect();
    frame.style.left = Math.max(10, r.width / 2 - Number(range.value) / 2) + 'px';
    frame.style.top = Math.max(70, r.height * 0.25) + 'px';
  }

  function storedKey() { return 'museum_realsize:' + (title.textContent || ''); }

  function loadCm() {
    var name = title.textContent || '';
    var v = window.MUSEUM_REAL_SIZES[name];
    if (!v) { try { v = localStorage.getItem(storedKey()); } catch (e) {} }
    cmInput.value = v ? v : '';
  }

  // معامل المعايرة: بكسل لكل مليمتر على مستوى الجسم المرجعي
  function pixelsPerMm() { return Number(range.value) / CARD_W_MM; }

  // عرض الصورة المطلوب بالبكسل = العرض الحقيقي (مم) × معامل المعايرة
  function targetWidthPx(cm) { return cm * 10 * pixelsPerMm(); }

  function open() {
    loadCm(); sizeFrame(); placeFrame();
    frame.classList.add('on'); panel.classList.add('on');
    say('');
  }

  function cleanup() {
    frame.classList.remove('on'); panel.classList.remove('on');
    obj.style.removeProperty('width');
    say('');
  }

  btn.addEventListener('click', open);
  panel.querySelector('#ar-real-hide').addEventListener('click', function () {
    frame.classList.remove('on'); panel.classList.remove('on');
  });
  range.addEventListener('input', sizeFrame);

  panel.querySelector('#ar-real-apply').addEventListener('click', function () {
    var cm = parseFloat(cmInput.value);
    if (!(cm > 0 && cm <= 2000)) { say('اكتب عرضًا صحيحًا بالسنتيمتر.', true); return; }
    var px = targetWidthPx(cm);
    if (px < 8 || px > 6000) { say('الحجم الناتج خارج المدى المعقول، أعد ضبط الإطار.', true); return; }
    obj.style.setProperty('width', px.toFixed(1) + 'px', 'important');
    try { localStorage.setItem(storedKey(), String(cm)); } catch (e) {}
    say('تم العرض بحجم ' + cm + ' سم (معايرة: ' + pixelsPerMm().toFixed(2) + ' بكسل/مم). اسحب القطعة لتضعها بجانب البطاقة للمقارنة.');
  });

  // سحب الإطار المرجعي
  var drag = null;
  frame.addEventListener('pointerdown', function (e) {
    frame.setPointerCapture(e.pointerId);
    drag = { dx: e.clientX - frame.offsetLeft, dy: e.clientY - frame.offsetTop };
  });
  frame.addEventListener('pointermove', function (e) {
    if (!drag) return;
    frame.style.left = (e.clientX - drag.dx) + 'px';
    frame.style.top = (e.clientY - drag.dy) + 'px';
  });
  frame.addEventListener('pointerup', function () { drag = null; });
  frame.addEventListener('pointercancel', function () { drag = null; });

  // تنظيف تلقائي عند إغلاق طبقة الواقع المعزز
  new MutationObserver(function () {
    if (!ov.classList.contains('open')) cleanup();
  }).observe(ov, { attributes: true, attributeFilter: ['class'] });
})();
