/* =====================================================================
   متحف إرث الحضارة - capsule.js
   الكبسولة الزمنية: الزائر يكتب رسالة أو توقّع للمستقبل، بتتقفل لحد
   تاريخ يحدده بنفسه، وبعد ما التاريخ ده يجي بتظهرله تاني قابلة للفتح.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('capsule-modal');
  const trigger = document.getElementById('capsule-trigger-btn');
  const form = document.getElementById('capsule-form');
  const messageInput = document.getElementById('capsule-message');
  const chips = document.querySelectorAll('.capsule-chip');
  const customDateInput = document.getElementById('capsule-custom-date');
  const listEl = document.getElementById('capsule-list');
  if (!modal || !form) return;

  let selectedMonths = 12;
  let useCustomDate = false;

  function todayISO(offsetDays){
    const d = new Date();
    d.setDate(d.getDate() + (offsetDays || 1));
    return d.toISOString().slice(0, 10);
  }
  if (customDateInput) customDateInput.min = todayISO(1);

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      if (chip.dataset.custom){
        useCustomDate = true;
        customDateInput.style.display = 'block';
      } else {
        useCustomDate = false;
        customDateInput.style.display = 'none';
        selectedMonths = Number(chip.dataset.months);
      }
    });
  });

  function computeUnlockDate(){
    if (useCustomDate && customDateInput.value){
      return new Date(customDateInput.value + 'T00:00:00');
    }
    const d = new Date();
    d.setMonth(d.getMonth() + selectedMonths);
    return d;
  }

  function fmtDate(date){
    if (!date) return '';
    return new Date(date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function escapeHTMLLocal(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  function timeLeftText(unlockAt){
    const diff = new Date(unlockAt).getTime() - Date.now();
    if (diff <= 0) return 'جاهزة للفتح 🎉';
    const days = Math.ceil(diff / 86400000);
    if (days < 30) return `هتتفتح بعد ${days} يوم`;
    const months = Math.round(days / 30);
    if (months < 12) return `هتتفتح بعد ${months} شهر تقريبًا`;
    const years = (days / 365).toFixed(1);
    return `هتتفتح بعد ${years} سنة تقريبًا`;
  }

  async function renderCapsules(){
    if (!listEl || !window.MuseumAuth || !window.MuseumAuth.isLoggedIn()) {
      if (listEl) listEl.innerHTML = `<div class="capsule-empty">سجّل دخولك عشان تكتب وتشوف كبسولاتك الزمنية 🔒</div>`;
      return;
    }
    listEl.innerHTML = `<div class="capsule-empty">جارٍ تحميل كبسولاتك...</div>`;
    const list = await window.MuseumAuth.getMyTimeCapsules();
    if (!list.length){
      listEl.innerHTML = `<div class="capsule-empty">لسّه مفيش كبسولات — اكتب أول رسالة للمستقبل فوق! 📨</div>`;
      return;
    }
    listEl.innerHTML = list.map((cap) => {
      const isUnlocked = cap.unlockAt && cap.unlockAt.getTime() <= Date.now();
      if (isUnlocked){
        return `
          <div class="capsule-card unlocked" data-capsule-id="${cap.id}">
            <div class="capsule-card-head">
              <span>📬 كتبتها في ${fmtDate(cap.createdAt)}</span>
              <span class="capsule-unlock-tag">اتفتحت في ${fmtDate(cap.unlockAt)}</span>
            </div>
            <p>${escapeHTMLLocal(cap.message)}</p>
          </div>
        `;
      }
      return `
        <div class="capsule-card locked" data-capsule-id="${cap.id}">
          <div class="capsule-card-head">
            <span>🔒 كتبتها في ${fmtDate(cap.createdAt)}</span>
          </div>
          <p class="capsule-locked-hint">${timeLeftText(cap.unlockAt)} — ${fmtDate(cap.unlockAt)}</p>
        </div>
      `;
    }).join('');

    // أي كبسولة اتفتحت لأول مرة (وسمها opened=false في القاعدة) بنعلّمها كمفتوحة
    list.forEach((cap) => {
      const unlocked = cap.unlockAt && cap.unlockAt.getTime() <= Date.now();
      if (unlocked && !cap.opened) window.MuseumAuth.markTimeCapsuleOpened(cap.id);
    });
  }

  trigger?.addEventListener('click', () => {
    if (window.MuseumAuth && !window.MuseumAuth.isLoggedIn()){
      const loginModal = document.getElementById('login-modal');
      if (loginModal){ loginModal.classList.add('active'); document.body.style.overflow = 'hidden'; }
      if (window.showToast) window.showToast('سجّل دخولك الأول عشان تفتح الكبسولة الزمنية 📦', true);
      return;
    }
    renderCapsules();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!window.MuseumAuth || !window.MuseumAuth.isLoggedIn()) return;
    const text = messageInput.value.trim();
    if (!text) return;
    const unlockAt = computeUnlockDate();
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    const res = await window.MuseumAuth.createTimeCapsule(text, unlockAt);
    if (submitBtn) submitBtn.disabled = false;
    if (res && res.ok){
      messageInput.value = '';
      if (window.showToast) window.showToast('اتقفلت الكبسولة! هتتفتح في ' + fmtDate(unlockAt) + ' 📦');
      if (window.burstConfetti) window.burstConfetti(form, 14);
      renderCapsules();
    } else {
      if (window.showToast) window.showToast('تعذّر حفظ الكبسولة، حاول تاني.', true);
    }
  });
});
