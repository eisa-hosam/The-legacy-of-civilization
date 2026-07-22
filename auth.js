/* =====================================================================
   متحف إرث الحضارة - auth.js
   نظام تسجيل دخول حقيقي (Firebase Authentication) + صفحة الزائر الشخصية
   + اختبار الشخصية التاريخية + لوحة تحكم الأدمن
   الفهرس:
   1) إعداد Firebase
   2) أدوات مساعدة عامة
   3) التسجيل / الدخول / استرجاع كلمة السر (Firebase Auth)
   4) حالة الجلسة + رسائل الترحيب + بانر تفعيل البريد
   5) تسجيل الخروج
   6) تسجيل مشاهدة قطعة أثرية (سجل الزائر)
   7) اختبار الشخصية التاريخية
   8) نافذة "صفحتي" (بروفايل الزائر)
   9) لوحة تحكم الأدمن
   10) ربط الواجهة (أزرار الناف بار + النماذج)
   ===================================================================== */

/* ---------- 1) إعداد Firebase ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyAblWHGwOua31R_qP9dDOcD_dfCPjTzPBk",
  authDomain: "digital-heritage-museum.firebaseapp.com",
  projectId: "digital-heritage-museum",
  storageBucket: "digital-heritage-museum.firebasestorage.app",
  messagingSenderId: "719999877563",
  appId: "1:719999877563:web:b16f2982ea1d6c89d1449e",
  measurementId: "G-MF9EXVH8NP"
};

/* إيميل مدير المتحف - هو الوحيد اللي هتظهر له لوحة التحكم */
const ADMIN_EMAIL = "eh1329706@gmail.com";

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const USERS_COLLECTION = "museum_users";

/* الموقع لازم يتفتح من سيرفر (http/https) عشان Firebase Auth يقدر يخزن حالة الجلسة؛
   فتح الملف مباشرة (file://) بيمنع أي عملية تسجيل دخول أو تسجيل حساب */
const __isFileProtocol = location.protocol === "file:";

/* هل الموقع مفتوح كتطبيق مثبّت (PWA) في وضع standalone؟
   جوجل بيمنع تسجيل الدخول (OAuth) جوّه أي تطبيق/WebView مثبّت لأسباب أمان،
   وبيطلب من المستخدم يفتح الرابط في متصفح عادي - حتى لو التطبيق ده أصلاً شغال بمحرك كروم. */
function isStandalonePWA() {
  try {
    const mql = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;
    const iosStandalone = window.navigator && window.navigator.standalone === true; /* سفاري iOS */
    return !!(mql || iosStandalone);
  } catch (e) { return false; }
}

/* هل الموقع مفتوح جوّه متصفح داخلي (WebView) لتطبيق زي فيسبوك/انستجرام/واتساب/تيك توك؟
   المشكلة اللي بتحصل غالبًا هي دي بالظبط: المستخدم فاتح الموقع من "لينك" جواته تطبيق تاني
   (مش من الجهاز/الآيقونة المثبتة)، وجوجل بيرفض تسجيل الدخول جوّه المتصفحات دي تمامًا
   لأسباب أمان، حتى لو شكلها متصفح عادي. الحل الوحيد للزائر هو فتح الموقع بمتصفح حقيقي
   (كروم / سفاري) مش من جوّه التطبيق. */
function isInAppBrowserWebView() {
  try {
    const ua = navigator.userAgent || navigator.vendor || window.opera || "";
    return /FBAN|FBAV|FB_IAB|Instagram|Line\/|MicroMessenger|WhatsApp|TikTok|Twitter|Snapchat|GSA\/|wv\)/i.test(ua);
  } catch (e) { return false; }
}

/* نخلي الجلسة محفوظة في المتصفح عشان الزائر ميضطرش يسجل دخول كل مرة يفتح فيها الموقع */
if (!__isFileProtocol) {
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(e => {
    console.warn("تعذّر ضبط ثبات الجلسة:", e);
  });
}

/* ---------- 2) أدوات مساعدة عامة ---------- */
function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isAdminEmail(email) {
  return normalizeEmail(email) === normalizeEmail(ADMIN_EMAIL);
}
function formatDate(ts) {
  try {
    const d = ts && ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" });
  } catch (e) { return ""; }
}
function initialsOf(name) {
  const n = String(name || "").trim();
  if (!n) return "؟";
  return n.slice(0, 1).toUpperCase();
}
function escapeHTML(s) {
  return String(s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
/* ترجمة أخطاء Firebase الشائعة لرسائل عربية مفهومة */
function mapAuthError(err) {
  const code = err && err.code ? err.code : "";
  if (__isFileProtocol || code === "auth/operation-not-supported-in-this-environment") {
    return "نظام تسجيل الدخول محتاج الموقع يتفتح من سيرفر (http أو https)، مش كملف مفتوح مباشرة من جهازك. شغّل الموقع بسيرفر محلي أو ارفعه على استضافة وجرب تاني.";
  }
  const map = {
    "auth/email-already-in-use": "الإيميل ده مسجّل عندنا بالفعل، جرّب تسجّل الدخول بدل ما تعمل حساب جديد.",
    "auth/invalid-email": "من فضلك اكتب بريدًا إلكترونيًا صحيحًا.",
    "auth/weak-password": "كلمة السر لازم تكون 6 حروف على الأقل.",
    "auth/wrong-password": "كلمة السر مش صح، حاول تاني.",
    "auth/user-not-found": "مفيش حساب مسجّل بالإيميل ده، جرّب تعمل حساب جديد.",
    "auth/too-many-requests": "محاولات كتير خلال وقت قصير، استنى شوية وجرّب تاني.",
    "auth/invalid-credential": "بيانات الدخول مش صحيحة، تأكد من الإيميل وكلمة السر.",
    "auth/network-request-failed": "فيه مشكلة في الاتصال بالإنترنت، تأكد من اتصالك وحاول تاني."
  };
  return map[code] || err.message || "حصل خطأ، حاول تاني.";
}

const WING_META = {
  egypt:       { name: "مصر القديمة",          emoji: "𓂀" },
  paintings:   { name: "اللوحات والفنون",       emoji: "🎨" },
  roman:       { name: "الحضارة الرومانية",     emoji: "🏛️" },
  islamic:     { name: "الحضارة الإسلامية",     emoji: "🕌" },
  greek:       { name: "الحضارة اليونانية",     emoji: "🏺" },
  mesopotamia: { name: "حضارة بلاد الرافدين",   emoji: "𒀭" },
  world:       { name: "حضارات العالم",          emoji: "🌍" }
};

let currentUser = null; /* { uid, email, username, isAdmin, emailVerified, personality } */
let __authToastShown = false;
let __justRegisteredUID = null;

/* ---------- 3) التسجيل / الدخول / استرجاع كلمة السر ---------- */
async function registerUser(username, email, password) {
  const cleanUsername = String(username || "").trim();
  const cleanEmail = normalizeEmail(email);
  if (cleanUsername.length < 2) throw new Error("من فضلك اكتب اسمًا لا يقل عن حرفين");
  if (!isValidEmail(cleanEmail)) throw new Error("من فضلك اكتب بريدًا إلكترونيًا صحيحًا");
  if (String(password || "").length < 6) throw new Error("كلمة السر لازم تكون 6 حروف على الأقل");

  const cred = await auth.createUserWithEmailAndPassword(cleanEmail, password);
  __justRegisteredUID = cred.user.uid;
  try { await cred.user.updateProfile({ displayName: cleanUsername }); } catch (e) {}

  /* التسجيل بقى بالإيميل وكلمة السر بس، من غير إرسال أي إيميل تفعيل */
  await db.collection(USERS_COLLECTION).doc(cred.user.uid).set({
    username: cleanUsername,
    email: cleanEmail,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    lastVisit: firebase.firestore.FieldValue.serverTimestamp(),
    visitsCount: 1,
    viewedArtifacts: [],
    favoriteArtifacts: [],
    unlockedBadges: [],
    personality: null
  });

  return { user: cred.user };
}

async function loginUser(email, password) {
  const cleanEmail = normalizeEmail(email);
  if (!isValidEmail(cleanEmail)) throw new Error("من فضلك اكتب بريدًا إلكترونيًا صحيحًا");
  if (!password) throw new Error("من فضلك اكتب كلمة السر");
  await auth.signInWithEmailAndPassword(cleanEmail, password);
}

async function resetPassword(email) {
  const cleanEmail = normalizeEmail(email);
  if (!isValidEmail(cleanEmail)) throw new Error("اكتب بريدك الإلكتروني في الحقل فوق الأول عشان نبعتلك رابط الاستعادة");
  await auth.sendPasswordResetEmail(cleanEmail);
}

/* دخول سريع بحساب Google - مرة واحدة والزائر يفضل مسجل تلقائيًا بعد كده.
   بنستخدم signInWithRedirect بدل signInWithPopup: النوافذ المنبثقة (popup) بتفشل
   كتير في متصفحات الموبايل خصوصًا لما الموقع يكون اتفتح من لينك (مش من الجهاز)،
   بسبب حجب الكوكيز/التخزين بين النافذتين. الـ redirect بيشتغل بثبات أكتر
   في كل الحالات، والنتيجة بترجع من getRedirectResult تحت. */
async function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  await auth.signInWithRedirect(provider);
  /* الصفحة هتعمل reload بعد رجوع المستخدم من جوجل، والنتيجة هتتعالج
     في المستمع اللي تحت (auth.getRedirectResult) */
}

/* ننشئ مستند المستخدم في Firestore لو كان حساب جديد (يشتغل لكل من التسجيل بجوجل
   عن طريق popup القديم -لو استخدم حد الكود ده تاني- وredirect الجديد) */
async function ensureGoogleUserDoc(user, isNewUser) {
  if (!isNewUser) return;
  __justRegisteredUID = user.uid;
  await db.collection(USERS_COLLECTION).doc(user.uid).set({
    username: user.displayName || (user.email || "").split("@")[0],
    email: normalizeEmail(user.email),
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    lastVisit: firebase.firestore.FieldValue.serverTimestamp(),
    visitsCount: 1,
    viewedArtifacts: [],
    favoriteArtifacts: [],
    unlockedBadges: [],
    personality: null
  });
}

/* بنمسك نتيجة الرجوع من تسجيل الدخول بجوجل (بعد الـ redirect) لما الصفحة تحمّل تاني */
if (!__isFileProtocol) {
  auth.getRedirectResult().then(async (cred) => {
    if (!cred || !cred.user) return;
    const isNewUser = !!(cred.additionalUserInfo && cred.additionalUserInfo.isNewUser);
    await ensureGoogleUserDoc(cred.user, isNewUser);
  }).catch((err) => {
    let msg;
    if (err && err.code === "auth/unauthorized-domain") {
      msg = "الدخول بجوجل محتاج الموقع يكون شغال على دومين حقيقي أو localhost، مش ملف مفتوح مباشرة من الجهاز.";
    } else if (err && (err.code === "auth/operation-not-supported-in-this-environment" || (err.message && /disallowed_useragent/i.test(err.message)))) {
      msg = "المتصفح أو التطبيق ده مش مسموح له بتسجيل الدخول بجوجل لأسباب أمان من جوجل نفسها. افتح الموقع من كروم أو سفاري مباشرة، مش من جوّه تطبيق تاني.";
    } else if (err && err.code !== "auth/no-auth-event" ) {
      msg = mapAuthError(err);
    }
    if (msg) showToast(msg, true);
  });
}

/* ---------- 4) حالة الجلسة + الترحيب ---------- */
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    currentUser = null;
    updateAuthUI();
    return;
  }
  try {
    const ref = db.collection(USERS_COLLECTION).doc(user.uid);
    let snap = await ref.get();
    const isNew = user.uid === __justRegisteredUID;

    if (!snap.exists) {
      /* احتياطي: مستند مفقود لأي سبب (نادر) */
      await ref.set({
        username: user.displayName || (user.email || "").split("@")[0],
        email: normalizeEmail(user.email),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastVisit: firebase.firestore.FieldValue.serverTimestamp(),
        visitsCount: 1,
        viewedArtifacts: [],
        favoriteArtifacts: [],
    unlockedBadges: [],
        personality: null
      });
      snap = await ref.get();
    } else if (!isNew) {
      const data0 = snap.data();
      const last = data0.lastVisit && data0.lastVisit.toDate ? data0.lastVisit.toDate().getTime() : 0;
      if (Date.now() - last > 30 * 60 * 1000) {
        await ref.update({
          lastVisit: firebase.firestore.FieldValue.serverTimestamp(),
          visitsCount: firebase.firestore.FieldValue.increment(1)
        });
        snap = await ref.get();
      }
    }

    const data = snap.data();
    currentUser = {
      uid: user.uid,
      email: normalizeEmail(user.email),
      username: data.username,
      isAdmin: isAdminEmail(user.email),
      emailVerified: user.emailVerified,
      personality: data.personality || null,
      favorites: Array.isArray(data.favoriteArtifacts) ? data.favoriteArtifacts : [],
      unlockedBadges: Array.isArray(data.unlockedBadges) ? data.unlockedBadges : []
    };

    updateAuthUI();
    document.dispatchEvent(new CustomEvent("favorites-updated"));

    if (!__authToastShown) {
      __authToastShown = true;
      if (isNew) {
        showToast(`أهلًا بيك في متحف إرث الحضارة يا ${currentUser.username}! 🏛️`);
        openQuizModal();
      } else {
        showToast(`أهلًا بعودتك يا ${currentUser.username}! 👋`);
      }
    }
    __justRegisteredUID = null;
  } catch (e) {
    console.warn("خطأ في تحميل بيانات الحساب:", e);
  }
});

let __toastTimer = null;
function showToast(msg, isError) {
  const toast = document.getElementById("auth-toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.toggle("toast-error", !!isError);
  toast.classList.add("active");
  clearTimeout(__toastTimer);
  /* الرسايل الطويلة (زي تنبيه الـ PWA) محتاجة وقت أطول للقراءة */
  const duration = String(msg || "").length > 80 ? 8000 : 4200;
  __toastTimer = setTimeout(() => toast.classList.remove("active"), duration);
}

/* ---------- 5) تسجيل الخروج ---------- */
function logout() {
  auth.signOut();
  __authToastShown = false;
  currentUser = null;
  updateAuthUI();
  const profileModal = document.getElementById("profile-modal");
  const adminView = document.getElementById("admin-view");
  if (profileModal) profileModal.classList.remove("active");
  if (adminView) adminView.classList.remove("active");
  document.body.style.overflow = "";
}

/* ---------- 6) تسجيل مشاهدة قطعة أثرية ---------- */
let __lastLoggedKey = "";
let __lastLoggedAt = 0;
async function logArtifactView(item, wingKey) {
  if (!currentUser || !item) return;
  const title = item.t || "قطعة أثرية";
  const key = wingKey + "|" + title;
  const now = Date.now();
  if (key === __lastLoggedKey && now - __lastLoggedAt < 30000) return;
  __lastLoggedKey = key; __lastLoggedAt = now;

  const meta = WING_META[wingKey] || { name: wingKey, emoji: "⭐" };
  const entry = {
    wingKey, wingName: meta.name, emoji: meta.emoji,
    title, tag: item.d || "",
    viewedAt: new Date().toISOString()
  };

  try {
    const ref = db.collection(USERS_COLLECTION).doc(currentUser.uid);
    const snap = await ref.get();
    if (!snap.exists) return;
    const data = snap.data();
    const list = Array.isArray(data.viewedArtifacts) ? data.viewedArtifacts : [];
    list.unshift(entry);
    while (list.length > 150) list.pop();
    await ref.update({ viewedArtifacts: list });
    computeAndSyncBadges(currentUser.uid);
  } catch (e) {
    console.warn("تعذّر تسجيل مشاهدة القطعة:", e);
  }
}
/* ---------- 6ب) المفضلة (Favorites) ---------- */
function isFavorite(wingKey, title) {
  if (!currentUser || !Array.isArray(currentUser.favorites)) return false;
  return currentUser.favorites.some(f => f.wingKey === wingKey && f.title === title);
}
async function toggleFavorite(item, wingKey) {
  if (!currentUser) {
    const loginModal = document.getElementById("login-modal");
    if (loginModal) { loginModal.classList.add("active"); document.body.style.overflow = "hidden"; }
    showToast("سجّل دخولك الأول عشان تضيف القطعة للمفضلة ❤️", true);
    return { needsLogin: true };
  }
  const title = item.t || "قطعة أثرية";
  const meta = WING_META[wingKey] || { name: wingKey, emoji: "⭐" };
  const already = isFavorite(wingKey, title);
  const ref = db.collection(USERS_COLLECTION).doc(currentUser.uid);

  let next;
  if (already) {
    next = currentUser.favorites.filter(f => !(f.wingKey === wingKey && f.title === title));
  } else {
    next = [{ wingKey, wingName: meta.name, emoji: meta.emoji, title, tag: item.d || "", addedAt: new Date().toISOString() }, ...currentUser.favorites];
  }
  currentUser.favorites = next;
  document.dispatchEvent(new CustomEvent("favorites-updated"));
  try {
    await ref.update({ favoriteArtifacts: next });
    computeAndSyncBadges(currentUser.uid);
  } catch (e) {
    console.warn("تعذّر تحديث المفضلة:", e);
  }
  return { needsLogin: false, isFavorite: !already };
}
/* ---------- 6ج) تقييم القطع الأثرية (نجوم من 1 إلى 5) ---------- */
const RATINGS_COLLECTION = "artifact_ratings";
function artifactRatingId(wingKey, title) {
  return (wingKey + "__" + (title || "")).replace(/[\/#\[\]]/g, "_").slice(0, 400);
}
async function getArtifactRating(item, wingKey) {
  const title = item.t || "قطعة أثرية";
  const ref = db.collection(RATINGS_COLLECTION).doc(artifactRatingId(wingKey, title));
  let average = 0, count = 0, myRating = 0;
  try {
    const snap = await ref.get();
    if (snap.exists) {
      const data = snap.data();
      count = data.count || 0;
      const sum = data.sum || 0;
      average = count > 0 ? sum / count : 0;
    }
    if (currentUser) {
      const mySnap = await ref.collection("users").doc(currentUser.uid).get();
      if (mySnap.exists) myRating = mySnap.data().rating || 0;
    }
  } catch (e) {
    console.warn("تعذّر جلب تقييم القطعة:", e);
  }
  return { average, count, myRating };
}
async function rateArtifact(item, wingKey, value) {
  if (!currentUser) {
    const loginModal = document.getElementById("login-modal");
    if (loginModal) { loginModal.classList.add("active"); document.body.style.overflow = "hidden"; }
    showToast("سجّل دخولك الأول عشان تقيّم القطعة ⭐", true);
    return { needsLogin: true };
  }
  const title = item.t || "قطعة أثرية";
  const rating = Math.max(1, Math.min(5, Math.round(value)));
  const ref = db.collection(RATINGS_COLLECTION).doc(artifactRatingId(wingKey, title));
  const userRef = ref.collection("users").doc(currentUser.uid);
  try {
    const result = await db.runTransaction(async (tx) => {
      const ratingSnap = await tx.get(ref);
      const userSnap = await tx.get(userRef);
      const prevRating = userSnap.exists ? (userSnap.data().rating || 0) : 0;
      let sum = ratingSnap.exists ? (ratingSnap.data().sum || 0) : 0;
      let count = ratingSnap.exists ? (ratingSnap.data().count || 0) : 0;
      if (prevRating > 0) {
        sum = sum - prevRating + rating;
      } else {
        sum = sum + rating;
        count = count + 1;
      }
      tx.set(ref, { sum, count, wingKey, title }, { merge: true });
      tx.set(userRef, { rating, ratedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
      return { sum, count };
    });
    computeAndSyncBadges(currentUser.uid);
    return {
      needsLogin: false,
      average: result.count > 0 ? result.sum / result.count : 0,
      count: result.count,
      myRating: rating
    };
  } catch (e) {
    console.warn("تعذّر حفظ تقييم القطعة:", e);
    showToast("تعذّر حفظ تقييمك، حاول تاني.", true);
    return { needsLogin: false, error: true };
  }
}
window.MuseumAuth = {
  logArtifactView: (item, wingKey) => logArtifactView(item, wingKey),
  toggleFavorite: (item, wingKey) => toggleFavorite(item, wingKey),
  isFavorite: (wingKey, title) => isFavorite(wingKey, title),
  getArtifactRating: (item, wingKey) => getArtifactRating(item, wingKey),
  rateArtifact: (item, wingKey, value) => rateArtifact(item, wingKey, value),
  isLoggedIn: () => !!currentUser
};

/* ---------- 7) اختبار الشخصية التاريخية ---------- */
const TRAITS = ["leadership", "wisdom", "ambition", "justice", "creativity"];

const PERSONALITIES = [
  { id: "ramses", name: "رمسيس الثاني", era: "مصر القديمة", emoji: "𓂀",
    desc: "قائد عظيم بنى وشيّد ووسّع حدود مملكته، وحكم بثقة وطموح ما بيعرفش حدود.",
    vector: { leadership: 9, wisdom: 4, ambition: 9, justice: 5, creativity: 6 } },
  { id: "hatshepsut", name: "الملكة حتشبسوت", era: "مصر القديمة", emoji: "👑",
    desc: "حاكمة جريئة كسرت كل التوقعات، وجمعت بين الطموح والذوق الرفيع في كل قرار.",
    vector: { leadership: 8, wisdom: 6, ambition: 8, justice: 6, creativity: 8 } },
  { id: "hammurabi", name: "حمورابي", era: "حضارة بلاد الرافدين", emoji: "𒀭",
    desc: "صاحب أول شريعة مكتوبة في التاريخ، بيؤمن إن العدل هو أساس أي مجتمع قوي.",
    vector: { leadership: 6, wisdom: 7, ambition: 5, justice: 10, creativity: 4 } },
  { id: "alexander", name: "الإسكندر الأكبر", era: "الحضارة اليونانية", emoji: "🏺",
    desc: "طموحه محدوش حدود، وشغفه بالاستكشاف والانتصار خلاه يبني إمبراطورية عابرة للقارات.",
    vector: { leadership: 9, wisdom: 5, ambition: 10, justice: 4, creativity: 5 } },
  { id: "socrates", name: "سقراط", era: "الحضارة اليونانية", emoji: "🦉",
    desc: "فيلسوف بيسأل أكتر ما بيجاوب، بيؤمن إن الحكمة الحقيقية تبدأ من الاعتراف إنك لسه بتتعلم.",
    vector: { leadership: 3, wisdom: 10, ambition: 3, justice: 7, creativity: 6 } },
  { id: "marcus", name: "ماركوس أوريليوس", era: "الحضارة الرومانية", emoji: "🏛️",
    desc: "إمبراطور وفيلسوف في نفس الوقت، بيحكم بالمنطق والاتزان أكتر من ما بيحكم بالقوة.",
    vector: { leadership: 7, wisdom: 9, ambition: 4, justice: 9, creativity: 4 } },
  { id: "salahuddin", name: "صلاح الدين الأيوبي", era: "الحضارة الإسلامية", emoji: "🕌",
    desc: "قائد عادل معروف بالرحمة حتى مع خصومه، وبيجمع بين الحزم في القيادة والرقي في القيم.",
    vector: { leadership: 9, wisdom: 6, ambition: 6, justice: 9, creativity: 4 } },
  { id: "ibnkhaldun", name: "ابن خلدون", era: "الحضارة الإسلامية", emoji: "📜",
    desc: "مفكر ومؤرخ سبق عصره، بيشوف الأنماط اللي محدش لاحظها وبيبني أفكار جديدة كل مرة.",
    vector: { leadership: 4, wisdom: 9, ambition: 5, justice: 6, creativity: 9 } }
];

const QUIZ = [
  { q: "لو كنت مسؤولًا عن قيادة قومك في أزمة كبرى، إيه أول حاجة تعملها؟", options: [
    { t: "أجمع القادة وأتخذ القرار بسرعة وحزم", d: { leadership: 3, ambition: 1 } },
    { t: "أستشير الحكماء وأدرس كل الاحتمالات بهدوء", d: { wisdom: 3, justice: 1 } },
    { t: "أتأكد الأول إن كل الناس هتاخد حقها بالتساوي", d: { justice: 3, wisdom: 1 } },
    { t: "أفكر في حل غير تقليدي محدش جربه قبل كده", d: { creativity: 3, ambition: 1 } }
  ]},
  { q: "إيه أكتر حاجة بتحفزك في أي مشروع كبير؟", options: [
    { t: "إني أوصل لهدف محدش وصله قبلي", d: { ambition: 3, leadership: 1 } },
    { t: "إني أفهم الموضوع لحد ما أتقنه تمامًا", d: { wisdom: 3, creativity: 1 } },
    { t: "إني أساعد أكبر عدد ممكن من الناس", d: { justice: 3, leadership: 1 } },
    { t: "إني أبتكر حاجة جديدة بصمتي فيها واضحة", d: { creativity: 3, ambition: 1 } }
  ]},
  { q: "لما بتختلف مع حد في رأي، بتتصرف إزاي غالبًا؟", options: [
    { t: "بوضح وجهة نظري بثقة وباقنعه بيها", d: { leadership: 2, ambition: 2 } },
    { t: "بسمع رأيه كويس وبفكر فيه قبل ما أرد", d: { wisdom: 3 } },
    { t: "بدور على حل عادل يرضي الطرفين", d: { justice: 3 } },
    { t: "بجرب أشوف الموضوع من زاوية مختلفة تمامًا", d: { creativity: 3 } }
  ]},
  { q: "لو اتفتح قدامك باب لاستكشاف مكان مجهول تمامًا، تعمل إيه؟", options: [
    { t: "أدخل على طول، الفرصة دي محتفوتش", d: { ambition: 3, leadership: 1 } },
    { t: "أدرس المكان وأجهز خطة قبل ما أتحرك", d: { wisdom: 3 } },
    { t: "أتأكد إن اللي معايا كلهم آمنين قبل أي خطوة", d: { justice: 2, leadership: 2 } },
    { t: "أبص للمكان بعين فنان بادور على الجمال فيه", d: { creativity: 3 } }
  ]},
  { q: "إيه أكتر صفة حابب الناس توصفك بيها؟", options: [
    { t: "قائد ما بيترددش", d: { leadership: 3 } },
    { t: "حكيم وبيفكر كويس قبل ما يتصرف", d: { wisdom: 3 } },
    { t: "عادل ومنصف مع الكل", d: { justice: 3 } },
    { t: "مبدع وشايف حاجات محدش شايفها", d: { creativity: 3 } }
  ]},
  { q: "لو عندك ثروة كبيرة وقدرة، إيه أول حاجة تبنيها؟", options: [
    { t: "نصب تاريخي يفضل اسمي عليه للأبد", d: { ambition: 3, leadership: 1 } },
    { t: "مكتبة أو مركز علم يستفيد منه الكل", d: { wisdom: 3, justice: 1 } },
    { t: "نظام قوانين يحمي حقوق أضعف الناس", d: { justice: 3, leadership: 1 } },
    { t: "عمل فني أو معماري ماله مثيل", d: { creativity: 3, ambition: 1 } }
  ]},
  { q: "إزاي بتتعامل مع الفشل أو الهزيمة؟", options: [
    { t: "بارجع أقوى وبخطط لمحاولة تانية أكبر", d: { ambition: 3, leadership: 1 } },
    { t: "بحلل إيه اللي حصل وبتعلم من الدرس", d: { wisdom: 3 } },
    { t: "بسأل نفسي هل كنت عادل في قراراتي", d: { justice: 3 } },
    { t: "بلاقي طريقة جديدة تمامًا غير اللي جربتها", d: { creativity: 3 } }
  ]},
  { q: "لو اتخيرت تحكم مدينة، إيه أول قرار تاخده؟", options: [
    { t: "أوسّع حدودها وأزود قوتها ونفوذها", d: { ambition: 3, leadership: 2 } },
    { t: "أبني مدارس ودور علم للمواطنين", d: { wisdom: 3 } },
    { t: "أظبط قوانين تضمن حقوق كل الفئات", d: { justice: 3 } },
    { t: "أخلي المدينة مركز فنون وعمارة فريدة", d: { creativity: 3 } }
  ]},
  { q: "إيه اللي بيخليك فخور بنفسك أكتر؟", options: [
    { t: "قدرتي إني أقود وألهم اللي حواليّ", d: { leadership: 3 } },
    { t: "عمقي في الفهم والتفكير الهادئ", d: { wisdom: 3 } },
    { t: "التزامي بالإنصاف حتى لما يكون صعب", d: { justice: 3 } },
    { t: "خيالي وقدرتي إني أبتكر حاجة من الصفر", d: { creativity: 3 } }
  ]},
  { q: "بعد ما تسيب أثر في الدنيا، حابب الناس تفتكرك بإيه؟", options: [
    { t: "القائد اللي غيّر مصير أمة كاملة", d: { leadership: 3, ambition: 2 } },
    { t: "الحكيم اللي علّم أجيال بعده", d: { wisdom: 3 } },
    { t: "الشخص اللي جاب العدل لناس مظلومة", d: { justice: 3 } },
    { t: "المبدع اللي غيّر شكل الفن أو الفكر", d: { creativity: 3 } }
  ]}
];

let __quizIndex = 0;
let __quizVector = { leadership: 0, wisdom: 0, ambition: 0, justice: 0, creativity: 0 };

function openQuizModal() {
  const loginModal = document.getElementById("login-modal");
  if (loginModal) loginModal.classList.remove("active");
  __quizIndex = 0;
  TRAITS.forEach(t => __quizVector[t] = 0);
  const modal = document.getElementById("quiz-modal");
  if (!modal) return;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  renderQuizQuestion();
}
function closeQuizModal() {
  const modal = document.getElementById("quiz-modal");
  if (modal) modal.classList.remove("active");
  document.body.style.overflow = "";
}
function renderQuizQuestion() {
  const q = QUIZ[__quizIndex];
  document.getElementById("quiz-progress-fill").style.width = (__quizIndex / QUIZ.length * 100) + "%";
  document.getElementById("quiz-qnum").textContent = `سؤال ${__quizIndex + 1} من ${QUIZ.length}`;
  document.getElementById("quiz-question-text").textContent = q.q;
  const optsEl = document.getElementById("quiz-options");
  optsEl.innerHTML = q.options.map((opt, i) => `
    <button type="button" class="game-option quiz-option" data-i="${i}">
      <span class="opt-letter">${["أ", "ب", "ج", "د"][i]}</span>
      <span>${escapeHTML(opt.t)}</span>
    </button>
  `).join("");
  optsEl.querySelectorAll(".quiz-option").forEach(btn => {
    btn.addEventListener("click", () => selectQuizOption(Number(btn.dataset.i)));
  });
}
function selectQuizOption(i) {
  const q = QUIZ[__quizIndex];
  const opt = q.options[i];
  Object.keys(opt.d || {}).forEach(k => __quizVector[k] = (__quizVector[k] || 0) + opt.d[k]);
  __quizIndex++;
  if (__quizIndex >= QUIZ.length) {
    finishQuiz();
  } else {
    renderQuizQuestion();
  }
}
function matchPersonality(vector) {
  let best = null, bestScore = -Infinity;
  PERSONALITIES.forEach(p => {
    let score = 0;
    TRAITS.forEach(t => score += (vector[t] || 0) * (p.vector[t] || 0));
    if (score > bestScore) { bestScore = score; best = p; }
  });
  return best;
}
async function finishQuiz() {
  closeQuizModal();
  const result = matchPersonality(__quizVector);
  if (currentUser) {
    try {
      await db.collection(USERS_COLLECTION).doc(currentUser.uid).update({
        personality: { id: result.id, name: result.name, era: result.era, emoji: result.emoji, completedAt: new Date().toISOString() }
      });
      currentUser.personality = { id: result.id, name: result.name, era: result.era, emoji: result.emoji };
      computeAndSyncBadges(currentUser.uid);
    } catch (e) { console.warn("تعذّر حفظ نتيجة الاختبار:", e); }
  }
  openResultModal(result);
}
function openResultModal(p) {
  const modal = document.getElementById("quiz-result-modal");
  if (!modal) return;
  modal.querySelector("#quiz-result-emoji").textContent = p.emoji;
  modal.querySelector("#quiz-result-name").textContent = p.name;
  modal.querySelector("#quiz-result-era").textContent = p.era;
  modal.querySelector("#quiz-result-desc").textContent = p.desc;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  const badge = modal.querySelector("#quiz-result-emoji");
  if (window.burstConfetti && badge) setTimeout(() => window.burstConfetti(badge, 26), 200);
  window.__lastQuizResult = p;
}
document.addEventListener("click", async (e) => {
  if (!e.target.closest("#quiz-result-share-btn")) return;
  const p = window.__lastQuizResult;
  if (!p) return;
  const text = `عملت اختبار الشخصية التاريخية في متحف إرث الحضارة، وطلعت شبه ${p.name} ${p.emoji}! جرّب إنت كمان:`;
  if (navigator.share) {
    try { await navigator.share({ title: "شخصيتي التاريخية", text, url: location.href }); } catch (e) {}
  } else {
    try { await navigator.clipboard.writeText(text + " " + location.href); showToast("تم نسخ نتيجتك! شاركها مع أصحابك 📋"); } catch (e) {}
  }
});

/* ---------- 7ب) نظام الإنجازات (Badges) ---------- */
const BADGES = [
  { id: "first_step", emoji: "🐣", name: "أولى الخطوات", desc: "استكشفت أول قطعة أثرية" },
  { id: "explorer_10", emoji: "🔎", name: "مستكشف مبتدئ", desc: "شاهدت 10 قطع أثرية" },
  { id: "explorer_50", emoji: "🏺", name: "عالم آثار", desc: "شاهدت 50 قطعة أثرية" },
  { id: "explorer_100", emoji: "👑", name: "حارس التاريخ", desc: "شاهدت 100 قطعة أثرية" },
  { id: "collector_5", emoji: "❤️", name: "جامع الكنوز", desc: "أضفت 5 قطع للمفضلة" },
  { id: "quiz_done", emoji: "🎭", name: "اعرف نفسك", desc: "خلّصت اختبار الشخصية التاريخية" },
  { id: "multi_wing", emoji: "🌍", name: "رحّالة الحضارات", desc: "استكشفت قطعًا من 3 أجنحة مختلفة على الأقل" },
  { id: "all_wings", emoji: "🗺️", name: "سيّد الحضارات", desc: "استكشفت قطعًا من كل أجنحة المتحف" }
];
function checkBadge(id, data) {
  const viewed = Array.isArray(data.viewedArtifacts) ? data.viewedArtifacts : [];
  const favs = Array.isArray(data.favoriteArtifacts) ? data.favoriteArtifacts : [];
  const wingsSeen = new Set(viewed.map(v => v.wingKey)).size;
  switch (id) {
    case "first_step": return viewed.length >= 1;
    case "explorer_10": return viewed.length >= 10;
    case "explorer_50": return viewed.length >= 50;
    case "explorer_100": return viewed.length >= 100;
    case "collector_5": return favs.length >= 5;
    case "quiz_done": return !!(data.personality && data.personality.name);
    case "multi_wing": return wingsSeen >= 3;
    case "all_wings": return wingsSeen >= 6;
    default: return false;
  }
}
async function computeAndSyncBadges(uid) {
  if (!uid) return;
  try {
    const ref = db.collection(USERS_COLLECTION).doc(uid);
    const snap = await ref.get();
    if (!snap.exists) return;
    const data = snap.data();
    const unlocked = new Set(Array.isArray(data.unlockedBadges) ? data.unlockedBadges : []);
    const newlyUnlocked = [];
    BADGES.forEach(b => {
      if (!unlocked.has(b.id) && checkBadge(b.id, data)) {
        unlocked.add(b.id);
        newlyUnlocked.push(b);
      }
    });
    if (newlyUnlocked.length) {
      const list = Array.from(unlocked);
      await ref.update({ unlockedBadges: list });
      if (currentUser) currentUser.unlockedBadges = list;
      newlyUnlocked.forEach((b, i) => setTimeout(() => showBadgeToast(b), i * 1700));
    }
  } catch (e) {
    console.warn("تعذّر تحديث الإنجازات:", e);
  }
}
function showBadgeToast(b) {
  const toast = document.getElementById("auth-toast");
  if (!toast) return;
  toast.innerHTML = `<strong>${b.emoji} إنجاز جديد: ${escapeHTML(b.name)}!</strong>`;
  toast.classList.add("active");
  clearTimeout(__toastTimer);
  __toastTimer = setTimeout(() => toast.classList.remove("active"), 4500);
  if (window.burstConfetti) window.burstConfetti(toast, 22);
}

/* ---------- 8) نافذة "صفحتي" ---------- */
async function openProfileModal() {
  if (!currentUser) return;
  const modal = document.getElementById("profile-modal");
  if (!modal) return;

  modal.querySelector("#profile-avatar").textContent = initialsOf(currentUser.username);
  modal.querySelector("#profile-username").textContent = currentUser.username;
  modal.querySelector("#profile-email").textContent = currentUser.email;
  modal.querySelector("#profile-history-list").innerHTML =
    `<div class="profile-loading">جارٍ تحميل سجلّ زياراتك...</div>`;
  renderProfilePersonality();
  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  try {
    const ref = db.collection(USERS_COLLECTION).doc(currentUser.uid);
    const snap = await ref.get();
    if (!snap.exists) return;
    const data = snap.data();

    modal.querySelector("#profile-joined").textContent = "عضو منذ: " + formatDate(data.createdAt);
    modal.querySelector("#profile-visits").textContent = data.visitsCount || 1;

    const list = Array.isArray(data.viewedArtifacts) ? data.viewedArtifacts : [];
    const listEl = modal.querySelector("#profile-history-list");
    modal.querySelector("#profile-history-count").textContent = list.length;

    if (!list.length) {
      listEl.innerHTML = `<div class="profile-empty">لسّه ما استكشفتش أي قطعة أثرية. روح استكشف أحد الأجنحة! 🏺</div>`;
    } else {
      listEl.innerHTML = list.map(it => `
        <div class="profile-history-item">
          <span class="profile-history-emoji">${it.emoji || "⭐"}</span>
          <div class="profile-history-body">
            <strong>${escapeHTML(it.title)}</strong>
            <span>${escapeHTML(it.wingName)}${it.tag ? " · " + escapeHTML(it.tag) : ""}</span>
          </div>
          <span class="profile-history-time">${formatDate(it.viewedAt)}</span>
        </div>
      `).join("");
    }

    const favs = Array.isArray(data.favoriteArtifacts) ? data.favoriteArtifacts : [];
    currentUser.favorites = favs;
    const favEl = modal.querySelector("#profile-favorites-list");
    const favBadge = modal.querySelector("#profile-fav-count-badge");
    if (favBadge) favBadge.textContent = favs.length ? `(${favs.length})` : "";
    if (!favs.length) {
      favEl.innerHTML = `<div class="profile-empty">مفيش قطع في مفضلتك لسّه. اضغط ❤️ على أي قطعة عجباك! </div>`;
    } else {
      favEl.innerHTML = favs.map(it => `
        <div class="profile-history-item">
          <span class="profile-history-emoji">${it.emoji || "⭐"}</span>
          <div class="profile-history-body">
            <strong>${escapeHTML(it.title)}</strong>
            <span>${escapeHTML(it.wingName)}${it.tag ? " · " + escapeHTML(it.tag) : ""}</span>
          </div>
          <button type="button" class="profile-fav-remove" data-fav-wing="${escapeHTML(it.wingKey)}" data-fav-title="${escapeHTML(it.title)}" title="إزالة من المفضلة">✕</button>
        </div>
      `).join("");
    }

    const unlocked = new Set(Array.isArray(data.unlockedBadges) ? data.unlockedBadges : []);
    currentUser.unlockedBadges = Array.from(unlocked);
    const badgesGrid = modal.querySelector("#profile-badges-grid");
    const badgesCountEl = modal.querySelector("#profile-badges-count-badge");
    if (badgesCountEl) badgesCountEl.textContent = `(${unlocked.size}/${BADGES.length})`;
    if (badgesGrid) {
      badgesGrid.innerHTML = BADGES.map(b => `
        <div class="badge-card ${unlocked.has(b.id) ? "unlocked" : "locked"}">
          <span class="badge-emoji">${unlocked.has(b.id) ? b.emoji : "🔒"}</span>
          <strong>${escapeHTML(b.name)}</strong>
          <span>${escapeHTML(b.desc)}</span>
        </div>
      `).join("");
    }
  } catch (e) {
    modal.querySelector("#profile-history-list").innerHTML =
      `<div class="profile-empty">حصل خطأ في تحميل بياناتك، حاول تاني.</div>`;
  }
}

document.addEventListener("click", (e) => {
  const tabBtn = e.target.closest("[data-profile-tab]");
  if (tabBtn) {
    document.querySelectorAll(".profile-tab").forEach(t => t.classList.remove("active"));
    tabBtn.classList.add("active");
    const target = tabBtn.dataset.profileTab;
    document.querySelectorAll("[data-profile-panel]").forEach(p => {
      p.style.display = p.dataset.profilePanel === target ? "" : "none";
    });
    return;
  }
  const removeBtn = e.target.closest(".profile-fav-remove");
  if (removeBtn && currentUser) {
    toggleFavorite({ t: removeBtn.dataset.favTitle, d: "" }, removeBtn.dataset.favWing).then(() => openProfileModal());
  }
});
function renderProfilePersonality() {
  const card = document.getElementById("profile-personality");
  const empty = document.getElementById("profile-personality-empty");
  if (!card || !empty) return;
  const p = currentUser && currentUser.personality;
  if (p && p.name) {
    card.style.display = "block";
    empty.style.display = "none";
    document.getElementById("profile-personality-emoji").textContent = p.emoji || "🏺";
    document.getElementById("profile-personality-name").textContent = p.name;
    document.getElementById("profile-personality-era").textContent = p.era || "";
  } else {
    card.style.display = "none";
    empty.style.display = "flex";
  }
}

/* ---------- 9) لوحة تحكم الأدمن ---------- */
let __adminUnsub = null;
async function openAdminView() {
  if (!currentUser || !currentUser.isAdmin) return;
  const view = document.getElementById("admin-view");
  if (!view) return;
  view.classList.add("active");
  document.body.style.overflow = "hidden";
  renderAdminUsers([], true);

  if (__adminUnsub) __adminUnsub();
  __adminUnsub = db.collection(USERS_COLLECTION)
    .orderBy("lastVisit", "desc")
    .onSnapshot(
      qs => {
        const users = [];
        qs.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
        renderAdminUsers(users, false);
      },
      err => {
        document.getElementById("admin-users-list").innerHTML =
          `<div class="profile-empty">تعذّر تحميل بيانات الزوار: ${escapeHTML(err.message)}</div>`;
      }
    );
}
function closeAdminView() {
  const view = document.getElementById("admin-view");
  if (view) view.classList.remove("active");
  document.body.style.overflow = "";
  if (__adminUnsub) { __adminUnsub(); __adminUnsub = null; }
}
let __adminUsersCache = [];
function renderAdminUsers(users, loading) {
  __adminUsersCache = users;
  const totalEl = document.getElementById("admin-total-users");
  const listEl = document.getElementById("admin-users-list");
  if (loading) {
    listEl.innerHTML = `<div class="profile-loading">جارٍ تحميل قائمة الزوار...</div>`;
    return;
  }
  totalEl.textContent = users.length;

  let totalViews = 0, totalFavs = 0;
  const wingCounts = {};
  users.forEach(u => {
    const viewed = Array.isArray(u.viewedArtifacts) ? u.viewedArtifacts : [];
    const favs = Array.isArray(u.favoriteArtifacts) ? u.favoriteArtifacts : [];
    totalViews += viewed.length;
    totalFavs += favs.length;
    viewed.forEach(v => { wingCounts[v.wingName] = (wingCounts[v.wingName] || 0) + 1; });
  });
  const topWing = Object.entries(wingCounts).sort((a, b) => b[1] - a[1])[0];
  const viewsEl = document.getElementById("admin-stat-views");
  const favsEl = document.getElementById("admin-stat-favs");
  const topWingEl = document.getElementById("admin-stat-topwing");
  if (viewsEl) viewsEl.textContent = totalViews;
  if (favsEl) favsEl.textContent = totalFavs;
  if (topWingEl) topWingEl.textContent = topWing ? topWing[0] : "—";

  applyAdminFilter();
}
function applyAdminFilter() {
  const q = normalizeEmail(document.getElementById("admin-search")?.value || "");
  const listEl = document.getElementById("admin-users-list");
  const filtered = !q ? __adminUsersCache : __adminUsersCache.filter(u =>
    normalizeEmail(u.username).includes(q) || normalizeEmail(u.email).includes(q)
  );
  if (!filtered.length) {
    listEl.innerHTML = `<div class="profile-empty">مفيش زوّار مطابقين للبحث.</div>`;
    return;
  }
  listEl.innerHTML = filtered.map(u => {
    const viewed = Array.isArray(u.viewedArtifacts) ? u.viewedArtifacts : [];
    const lastThree = viewed.slice(0, 3);
    return `
      <div class="admin-user-card">
        <div class="admin-user-head">
          <span class="admin-user-avatar">${escapeHTML(initialsOf(u.username))}</span>
          <div class="admin-user-info">
            <strong>${escapeHTML(u.username || "بدون اسم")}${isAdminEmail(u.email) ? ' <span class="admin-badge">أدمن</span>' : ""}</strong>
            <span>${escapeHTML(u.email || "")}</span>
          </div>
          <div class="admin-user-stats">
            <span>زار الموقع <strong>${u.visitsCount || 1}</strong> مرة</span>
            <span>شاهد <strong>${viewed.length}</strong> قطعة</span>
          </div>
        </div>
        <div class="admin-user-meta">
          <span>أول زيارة: ${formatDate(u.createdAt)}</span>
          <span>آخر ظهور: ${formatDate(u.lastVisit)}</span>
          ${u.personality && u.personality.name ? `<span>شخصيته: ${u.personality.emoji || ""} ${escapeHTML(u.personality.name)}</span>` : ""}
        </div>
        ${lastThree.length ? `
          <div class="admin-user-recent">
            ${lastThree.map(it => `<span class="admin-recent-chip">${it.emoji || "⭐"} ${escapeHTML(it.title)}</span>`).join("")}
          </div>` : ""}
      </div>
    `;
  }).join("");
}

/* ---------- 10) ربط الواجهة ---------- */
function updateAuthUI() {
  const loginBtn = document.getElementById("nav-login-btn");
  const userChip = document.getElementById("nav-user-chip");
  const adminBtn = document.getElementById("nav-admin-btn");
  if (!loginBtn || !userChip || !adminBtn) return;

  if (currentUser) {
    loginBtn.style.display = "none";
    userChip.style.display = "flex";
    userChip.querySelector("#nav-user-avatar").textContent = initialsOf(currentUser.username);
    userChip.querySelector("#nav-user-name").textContent = currentUser.username;
    adminBtn.style.display = currentUser.isAdmin ? "inline-flex" : "none";
  } else {
    loginBtn.style.display = "inline-flex";
    userChip.style.display = "none";
    adminBtn.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("login-modal");
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");
  const registerError = document.getElementById("register-error");
  const loginError = document.getElementById("login-error");
  const registerSubmitBtn = document.getElementById("register-submit-btn");
  const loginSubmitBtn = document.getElementById("login-submit-btn");

  document.getElementById("nav-login-btn")?.addEventListener("click", () => {
    if (registerError) registerError.textContent = "";
    if (loginError) loginError.textContent = "";
    loginModal.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  /* التبديل بين تبويب "حساب جديد" و"عندي حساب" */
  document.querySelectorAll(".auth-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".auth-form").forEach(f => f.classList.remove("active"));
      tab.classList.add("active");
      document.querySelector(`.auth-form[data-auth-form="${tab.dataset.authTab}"]`)?.classList.add("active");
      if (registerError) registerError.textContent = "";
      if (loginError) loginError.textContent = "";
    });
  });

  registerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    registerError.textContent = "";
    registerSubmitBtn.classList.add("btn-loading");
    registerSubmitBtn.disabled = true;
    try {
      await registerUser(
        document.getElementById("register-username").value,
        document.getElementById("register-email").value,
        document.getElementById("register-password").value
      );
      loginModal.classList.remove("active");
      document.body.style.overflow = "";
      registerForm.reset();
      /* فتح اختبار الشخصية هيحصل تلقائيًا من onAuthStateChanged */
    } catch (err) {
      registerError.textContent = mapAuthError(err);
    } finally {
      registerSubmitBtn.classList.remove("btn-loading");
      registerSubmitBtn.disabled = false;
    }
  });

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.textContent = "";
    loginSubmitBtn.classList.add("btn-loading");
    loginSubmitBtn.disabled = true;
    try {
      await loginUser(
        document.getElementById("login-email").value,
        document.getElementById("login-password").value
      );
      loginModal.classList.remove("active");
      document.body.style.overflow = "";
      loginForm.reset();
    } catch (err) {
      loginError.textContent = mapAuthError(err);
    } finally {
      loginSubmitBtn.classList.remove("btn-loading");
      loginSubmitBtn.disabled = false;
    }
  });

  document.getElementById("forgot-password-btn")?.addEventListener("click", async () => {
    const emailInput = document.getElementById("login-email");
    try {
      await resetPassword(emailInput.value);
      showToast("بعتنالك رابط استعادة كلمة السر على بريدك 📩");
    } catch (err) {
      loginError.textContent = mapAuthError(err);
    }
  });

  document.getElementById("google-signin-btn")?.addEventListener("click", async (e) => {
    const btn = e.currentTarget;

    /* لو الموقع مفتوح كتطبيق مثبّت (PWA - وضع standalone)، جوجل هيرفض تسجيل الدخول
       ويطلب فتح الرابط في متصفح عادي - حتى لو كان أصلاً كروم من جوّه. بنستنى المستخدم
       نفسه ونوريه رسالة واضحة ونحاول ننسخله الرابط بدل ما يشوف رسالة جوجل الغامضة. */
    if (isStandalonePWA()) {
      let copied = false;
      try {
        await navigator.clipboard.writeText(location.href);
        copied = true;
      } catch (e2) {}
      showToast(
        copied
          ? "تسجيل الدخول بجوجل مش متاح جوّه التطبيق المثبّت. نسخنالك رابط الموقع، افتح كروم (أو أي متصفح) والصقه في الرابط، وسجّل دخولك من هناك."
          : "تسجيل الدخول بجوجل مش متاح جوّه التطبيق المثبّت. افتح الموقع من متصفح عادي (كروم مثلًا) مش من الأيقونة المثبّتة، وسجّل دخولك من هناك.",
        true
      );
      return;
    }

    /* نفس المشكلة بتحصل لما اللينك يتفتح جوّه متصفح تطبيق تاني (واتساب/فيسبوك/انستجرام..)
       حتى لو مش مثبّت كـ PWA - جوجل بيرفض تسجيل الدخول جوّه المتصفحات دي تمامًا. */
    if (isInAppBrowserWebView()) {
      let copied = false;
      try {
        await navigator.clipboard.writeText(location.href);
        copied = true;
      } catch (e2) {}
      showToast(
        copied
          ? "تسجيل الدخول بجوجل مش متاح جوّه متصفح التطبيق ده (واتساب/فيسبوك/انستجرام..). نسخنالك رابط الموقع، افتح كروم أو سفاري والصقه، وسجّل دخولك من هناك. تقدر برضه تسجّل بالإيميل وكلمة السر من نفس الشاشة دي."
          : "تسجيل الدخول بجوجل مش متاح جوّه متصفح التطبيق ده (واتساب/فيسبوك/انستجرام..). افتح الموقع من كروم أو سفاري مباشرة وسجّل دخولك من هناك، أو استخدم التسجيل بالإيميل وكلمة السر من نفس الشاشة دي.",
        true
      );
      return;
    }

    /* signInWithRedirect بيودّي المستخدم لصفحة جوجل ويرجعه تاني بعدها بريفريش،
       فمفيش داعي لـ try/catch هنا - أي خطأ هيتلقط في auth.getRedirectResult فوق. */
    btn.disabled = true;
    await signInWithGoogle();
  });

  document.getElementById("nav-user-chip")?.addEventListener("click", openProfileModal);
  document.getElementById("profile-logout-btn")?.addEventListener("click", logout);
  document.getElementById("nav-admin-btn")?.addEventListener("click", openAdminView);
  document.getElementById("admin-close-btn")?.addEventListener("click", closeAdminView);
  document.getElementById("admin-search")?.addEventListener("input", applyAdminFilter);

  document.getElementById("quiz-close-btn")?.addEventListener("click", closeQuizModal);
  document.getElementById("profile-start-quiz-btn")?.addEventListener("click", () => {
    document.getElementById("profile-modal")?.classList.remove("active");
    openQuizModal();
  });
  document.getElementById("profile-retake-quiz-btn")?.addEventListener("click", () => {
    document.getElementById("profile-modal")?.classList.remove("active");
    openQuizModal();
  });
  document.getElementById("quiz-result-retake-btn")?.addEventListener("click", () => {
    document.getElementById("quiz-result-modal")?.classList.remove("active");
    openQuizModal();
  });
  document.getElementById("quiz-result-close-btn")?.addEventListener("click", () => {
    document.getElementById("quiz-result-modal")?.classList.remove("active");
    document.body.style.overflow = "";
    renderProfilePersonality();
  });
});