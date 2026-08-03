/* =====================================================================
   متحف إرث الحضارة - community-stories.js
   قصص من الزوار: مساحة يشارك فيها الزوار قصة قصيرة عن تراثهم الشخصي
   أو العائلي. القصص بتتخزن في Firestore بحالة "قيد المراجعة" ومتظهرش
   في الواجهة العامة إلا بعد ما مدير المتحف (ADMIN_EMAIL) يوافق عليها -
   عشان نمنع أي محتوى غير لائق من الظهور مباشرة من غير مراجعة.
   ===================================================================== */

(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  const COLLECTION = 'community_stories';
  const MAX_LEN = 500;

  function safePieces() {
    try {
      return {
        db: typeof db !== 'undefined' ? db : null,
        user: typeof currentUser !== 'undefined' ? currentUser : null,
        isAdmin: (typeof isAdminEmail === 'function' && typeof currentUser !== 'undefined' && currentUser)
          ? isAdminEmail(currentUser.email)
          : false
      };
    } catch (e) {
      return { db: null, user: null, isAdmin: false };
    }
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function renderFeed() {
    const feedEl = document.getElementById('stories-feed');
    if (!feedEl) return;
    const { db, isAdmin } = safePieces();
    if (!db) {
      feedEl.innerHTML = `<p class="stories-empty">مش قادرين نحمّل القصص دلوقتي، حاول تاني كمان شوية.</p>`;
      return;
    }
    feedEl.innerHTML = `<p class="stories-empty">بنحمّل القصص... ⏳</p>`;

    const query = isAdmin
      ? db.collection(COLLECTION).orderBy('createdAt', 'desc').limit(30)
      : db.collection(COLLECTION).where('approved', '==', true).orderBy('createdAt', 'desc').limit(30);

    query
      .get()
      .then((snap) => {
        if (snap.empty) {
          feedEl.innerHTML = `<p class="stories-empty">لسّه مفيش قصص منشورة. كن أول من يشارك قصته! ✍️</p>`;
          return;
        }
        feedEl.innerHTML = snap.docs
          .map((doc) => {
            const d = doc.data();
            const pendingTag = !d.approved ? `<span class="story-pending">قيد المراجعة</span>` : '';
            const approveBtn = isAdmin && !d.approved
              ? `<button type="button" class="btn btn-line btn-sm story-approve-btn" data-id="${doc.id}">✅ وافق على النشر</button>`
              : '';
            return `
              <div class="story-card">
                <div class="story-head">
                  <strong>${escapeHtml(d.name || 'زائر')}</strong>
                  ${d.city ? `<span class="story-city">📍 ${escapeHtml(d.city)}</span>` : ''}
                  ${pendingTag}
                </div>
                <p class="story-text">${escapeHtml(d.text)}</p>
                ${approveBtn}
              </div>`;
          })
          .join('');

        feedEl.querySelectorAll('.story-approve-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            btn.disabled = true;
            btn.textContent = 'جاري النشر...';
            db.collection(COLLECTION)
              .doc(btn.dataset.id)
              .update({ approved: true })
              .then(renderFeed)
              .catch(() => {
                btn.disabled = false;
                btn.textContent = '✅ وافق على النشر';
              });
          });
        });
      })
      .catch(() => {
        feedEl.innerHTML = `<p class="stories-empty">حصل خطأ في تحميل القصص، حاول تاني.</p>`;
      });
  }

  ready(function () {
    const form = document.getElementById('story-form');
    const nameInput = document.getElementById('story-name');
    const cityInput = document.getElementById('story-city');
    const textInput = document.getElementById('story-text');
    const counterEl = document.getElementById('story-counter');
    const statusEl = document.getElementById('story-form-status');

    textInput?.addEventListener('input', () => {
      if (counterEl) counterEl.textContent = `${textInput.value.length}/${MAX_LEN}`;
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const { db, user } = safePieces();
      if (!db) {
        if (statusEl) statusEl.textContent = 'مش قادرين نحفظ القصة دلوقتي، حاول تاني كمان شوية.';
        return;
      }
      const text = (textInput?.value || '').trim();
      if (text.length < 10) {
        if (statusEl) statusEl.textContent = 'اكتب قصة أطول شوية (10 حروف على الأقل).';
        return;
      }
      if (text.length > MAX_LEN) {
        if (statusEl) statusEl.textContent = `القصة طويلة أكتر من ${MAX_LEN} حرف.`;
        return;
      }
      const submitBtn = form.querySelector('button[type=submit]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'جاري الإرسال...'; }

      db.collection(COLLECTION)
        .add({
          name: (nameInput?.value || '').trim().slice(0, 60) || 'زائر',
          city: (cityInput?.value || '').trim().slice(0, 60),
          text,
          approved: false,
          uid: user ? user.uid : null,
          createdAt: (typeof firebase !== 'undefined') ? firebase.firestore.FieldValue.serverTimestamp() : new Date()
        })
        .then(() => {
          if (statusEl) statusEl.textContent = 'تم إرسال قصتك! هتظهر للجميع بعد مراجعة سريعة من فريق المتحف 🙏';
          form.reset();
          if (counterEl) counterEl.textContent = `0/${MAX_LEN}`;
          renderFeed();
        })
        .catch(() => {
          if (statusEl) statusEl.textContent = 'حصل خطأ أثناء الإرسال، حاول تاني.';
        })
        .finally(() => {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'شارك قصتك'; }
        });
    });

    document.getElementById('stories-trigger-btn')?.addEventListener('click', renderFeed);
  });
})();
