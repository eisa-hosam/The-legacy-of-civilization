/* =====================================================================
   متحف إرث الحضارة - i18n.js
   نظام ترجمة للعناصر الرئيسية في الموقع (نافيجيشن، البطل، عناوين الأقسام،
   الفوتر، الشات) بـ 5 لغات: عربي، إنجليزي، فرنساوي، إسباني، ألماني.
   ملاحظة: محتوى القطع الأثرية والمعارض والألعاب الديناميكي (اللي بييجي من
   script.js) خارج نطاق هذا الملف، لأنه بيانات ضخمة مكتوبة بالعربي فقط.
   ===================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'museum_lang';

  const DICT = {
    ar: {
      dir: 'rtl',
      'nav.wings': 'الأجنحة',
      'nav.timeline': 'الخط الزمني الحي',
      'nav.realmap': 'خريطة المواقع الحقيقية',
      'nav.compare': 'قارن بين حضارتين',
      'nav.daily': 'تحدي اليوم',
      'nav.stats': 'المتحف بالأرقام',
      'nav.about': 'عن المتحف',
      'nav.author': 'عن صاحب المتحف',
      'nav.suggest': 'اقترح حضارة',
      'nav.search': 'بحث',
      'nav.searchAria': 'بحث في المتحف',
      'nav.searchPlaceholder': 'دوّر على قطعة أثرية، حاكم، أو حضارة...',
      'nav.login': 'تسجيل الدخول',
      'hero.eyebrow': 'رحلة عبر آلاف السنين',
      'hero.title1': 'اكتشف',
      'hero.title2': 'كنوز الحضارات',
      'hero.title3': 'في متحف واحد',
      'hero.sub': 'من ضفاف النيل إلى بابل وأثينا وروما، جولة تفاعلية بين أعظم حضارات التاريخ الإنساني.',
      'hero.btn1': 'استكشف الأجنحة',
      'hero.btn2': 'تعلّم لغات الحضارات',
      'hero.scroll': 'مرّر للأسفل',
      'stats.wings': 'أجنحة حضارية',
      'stats.years': 'عام من التاريخ',
      'stats.symbols': 'رمزًا كتابيًا حقيقيًا من لغات الحضارات',
      'stats.items': 'قطعة وقصة تاريخية',
      'otd.eyebrow': 'لمحة يومية',
      'otd.title': 'في مثل هذا اليوم',
      'wings.eyebrow': 'أجنحة المتحف',
      'wings.title': 'ست حضارات.. قصة واحدة للإنسانية',
      'wings.sub': 'اختر جناحًا لتستكشف أبرز آثاره وقصصه وحقائقه المثيرة.',
      'wings.explore': 'استكشف الجناح ←',
      'paintings.eyebrow': 'ركن مستقل',
      'paintings.title': 'اللوحات والفنون القديمة',
      'paintings.sub': 'معرض خاص يحتفي بالفن التصويري عبر العصور، بعيدًا عن أجنحة الحضارات الرئيسية.',
      'timeline.eyebrow': 'التاريخ في حركة',
      'timeline.title': 'الخط الزمني الحي',
      'timeline.sub': 'اسحب المؤشر لأي سنة من 3500 ق.م وحتى اليوم، وشوف كل الحضارات النشطة وقتها على الخط والخريطة معًا.',
      'timeline.from': '3500 ق.م',
      'timeline.to': 'اليوم',
      'timeline.selectedYear': 'السنة المختارة:',
      'realmap.eyebrow': 'جغرافيا الحضارات',
      'realmap.title': 'خريطة المواقع الأثرية الحقيقية',
      'realmap.sub': 'إحداثيات فعلية تقريبية لأبرز المواقع الأثرية حول العالم — اضغط على أي نقطة للانتقال لجناحها.',
      'realmap.note': 'إسقاط جغرافي مبسّط (Equirectangular) بإحداثيات تقريبية وليست دقيقة بالكامل.',
      'compare.eyebrow': 'قارن وتعلّم',
      'compare.title': 'مقارن الحضارات',
      'compare.sub': 'اختر حضارتين وشوف الفرق بينهم في الكتابة والعمارة والعلم والمعتقدات، جنبًا إلى جنب.',
      'compare.first': 'الحضارة الأولى',
      'compare.second': 'الحضارة الثانية',
      'daily.eyebrow': 'تحدي يومي',
      'daily.title': 'سؤال اليوم',
      'daily.sub': 'سؤال جديد كل يوم — جاوب صح وادخل لوحة الصدارة اليومية!',
      'daily.push': 'فعّل إشعارات المتحف',
      'closing.eyebrow': 'شاركنا رأيك',
      'closing.title': 'تعرف على حضارة نسينا ذكرها؟',
      'closing.sub': 'اقترح حضارة جديدة لنضيف جناحها إلى المتحف.',
      'closing.btn': 'اقترح حضارة الآن',
      'footer.desc': 'متحف رقمي تفاعلي يحتفي بتراث الإنسانية، من مصر القديمة إلى أبعد حضارات العالم، بأسلوب حديث وتجربة غامرة.',
      'footer.quicklinks': 'روابط سريعة',
      'footer.contact': 'تواصل معنا',
      'footer.totop': 'العودة للأعلى',
      'footer.rights': 'جميع الحقوق محفوظة © متحف إرث الحضارة — تصميم وتطوير رقمي',
      'about.tag': 'من نحن',
      'about.title': 'عن متحف إرث الحضارة',
      'about.p1': 'متحف إرث الحضارة مساحة رقمية تفاعلية صُممت لتقريب تاريخ الإنسانية لكل زائر، عبر ثمانية أجنحة تغطي أبرز الحضارات القديمة، وتجربة تعليمية ممتعة لتعلم أساسيات الكتابة الهيروغليفية.',
      'about.p2': 'هدفنا أن يكون التاريخ تجربة حيّة وليس مجرد معلومات، فكل جناح يجمع بين القصة والصورة والتفاعل.',
      'about.fact': 'نرحب دائمًا باقتراحاتكم لإثراء محتوى المتحف وإضافة حضارات جديدة.',
      'common.loading': 'جارٍ التحميل...',
      'chat.title': 'مساعد المتحف الذكي',
      'chat.welcome': 'أهلاً بيك في متحف إرث الحضارة! 👋 اسألني عن أي حضارة، ملك، أو قطعة أثرية في المتحف.',
      'chat.placeholder': 'اكتب سؤالك هنا...',
      'wingpdf.btn': 'تحميل الجناح PDF',
      'wingpdf.btnTitle': 'نسخة PDF للجناح تصلح للطباعة أو الاستخدام بدون إنترنت',
      'signlang.wingNote': 'فيديوهات لغة الإشارة لأبرز قطع هذا الجناح قيد الإعداد بالتعاون مع مترجمين متخصصين.',
      'community.title': 'قصص من مجتمعات محلية',
      'community.sub': 'المتحف مش بس عرض من فوق لتحت — شاركنا قصة عن تراث عائلتك أو منطقتك، بالكلمة أو بصورة بسيطة، وخليها جزء من رحلة المتحف.',
      'community.addBtn': 'شارك قصتك',
      'community.localNote': 'القصص المنشورة هنا تظهر لكل زوار المتحف.',
      'community.formTag': 'شارك قصتك',
      'community.formTitle': 'قصة عن تراث عائلتك أو منطقتك',
      'community.nameLabel': 'اسمك',
      'community.regionLabel': 'منطقتك أو بلدك',
      'community.storyLabel': 'قصتك (فقرة قصيرة)',
      'community.imageLabel': 'صورة بسيطة (اختياري)',
      'community.submitBtn': 'نشر القصة',
      'opendata.title': 'بيانات المتحف المفتوحة',
      'opendata.sub': 'كل بيانات الأجنحة والقطع الأثرية (800 قطعة) متاحة كملف مفتوح لأي باحث أو معلم أو مطوّر، برخصة CC BY 4.0.',
      'opendata.jsonTitle': 'ملف JSON كامل',
      'opendata.jsonDesc': 'كل الأجنحة، مقارنة الحضارات، وكل القطع الأثرية بتفاصيلها.',
      'opendata.downloadJson': 'تحميل open-data.json',
      'opendata.csvTitle': 'ملف CSV مبسّط',
      'opendata.csvDesc': 'جدول بكل القطع الأثرية، يفتح مباشرة في إكسل أو Google Sheets.',
      'opendata.downloadCsv': 'تحميل open-data-artifacts.csv',
      'opendata.licenseTitle': 'الترخيص والاستخدام',
      'opendata.licenseDesc': 'رخصة CC BY 4.0 — استخدام حر مع ذكر متحف إرث الحضارة كمصدر. البيانات ثابتة (Static) وتُحدَّث مع كل نسخة من الموقع.',
      'impact.title': 'المتحف بالأرقام الحقيقية',
      'impact.sub': 'أرقام مجمّعة فعليًا من كل زوار المتحف (وليست تقديرية)، بالإضافة لرحلتك الشخصية.',
      'impact.visits': 'إجمالي زيارات المتحف',
      'impact.country': 'عدد الدول اللي دخلت المتحف',
      'impact.teacher': 'طلاب استخدموا وضع المعلم',
      'impact.wings': 'رحلتك الشخصية: أجنحة استكشفتها',
      'impact.certLocked': 'استكشف كل الأجنحة الستة الرئيسية عشان تفتح شهادة إتمام الرحلة.',
      'impact.certNamePlaceholder': 'اكتب اسمك للشهادة',
      'impact.certDownload': 'حمّل شهادتك'
    },
    en: {
      dir: 'ltr',
      'nav.wings': 'Wings',
      'nav.timeline': 'Living Timeline',
      'nav.realmap': 'Real Sites Map',
      'nav.compare': 'Compare Civilizations',
      'nav.daily': "Today's Challenge",
      'nav.stats': 'Museum in Numbers',
      'nav.about': 'About',
      'nav.author': 'About the Creator',
      'nav.suggest': 'Suggest a Civilization',
      'nav.search': 'Search',
      'nav.searchAria': 'Search the museum',
      'nav.searchPlaceholder': 'Search an artifact, ruler, or civilization...',
      'nav.login': 'Log In',
      'hero.eyebrow': 'A journey across thousands of years',
      'hero.title1': 'Discover',
      'hero.title2': 'the treasures of civilizations',
      'hero.title3': 'in one museum',
      'hero.sub': 'From the banks of the Nile to Babylon, Athens and Rome — an interactive tour through the greatest civilizations in human history.',
      'hero.btn1': 'Explore the Wings',
      'hero.btn2': 'Learn Ancient Languages',
      'hero.scroll': 'Scroll down',
      'stats.wings': 'Civilization wings',
      'stats.years': 'Years of history',
      'stats.symbols': 'Real written symbols from ancient languages',
      'stats.items': 'Artifacts and historical stories',
      'otd.eyebrow': 'Daily glimpse',
      'otd.title': 'On this day',
      'wings.eyebrow': 'Museum Wings',
      'wings.title': 'Six civilizations.. one story of humanity',
      'wings.sub': 'Pick a wing to explore its landmarks, stories, and fascinating facts.',
      'wings.explore': 'Explore the wing ←',
      'paintings.eyebrow': 'Standalone corner',
      'paintings.title': 'Ancient Paintings & Art',
      'paintings.sub': 'A dedicated gallery celebrating pictorial art through the ages, separate from the main civilization wings.',
      'timeline.eyebrow': 'History in motion',
      'timeline.title': 'The Living Timeline',
      'timeline.sub': 'Drag the slider to any year from 3500 BCE to today, and see every civilization active at that time on the line and the map together.',
      'timeline.from': '3500 BCE',
      'timeline.to': 'Today',
      'timeline.selectedYear': 'Selected year:',
      'realmap.eyebrow': 'Geography of civilizations',
      'realmap.title': 'Real Archaeological Sites Map',
      'realmap.sub': 'Approximate real coordinates of major archaeological sites worldwide — click any point to jump to its wing.',
      'realmap.note': 'A simplified (Equirectangular) geographic projection with approximate, not fully precise, coordinates.',
      'compare.eyebrow': 'Compare and learn',
      'compare.title': 'Civilization Comparator',
      'compare.sub': 'Pick two civilizations and see the difference in writing, architecture, science, and beliefs, side by side.',
      'compare.first': 'First civilization',
      'compare.second': 'Second civilization',
      'daily.eyebrow': 'Daily challenge',
      'daily.title': "Today's Question",
      'daily.sub': 'A new question every day — answer right and enter the daily leaderboard!',
      'daily.push': 'Enable museum notifications',
      'closing.eyebrow': 'Share your opinion',
      'closing.title': 'Know a civilization we forgot to mention?',
      'closing.sub': 'Suggest a new civilization for us to add its wing to the museum.',
      'closing.btn': 'Suggest a civilization now',
      'footer.desc': 'An interactive digital museum celebrating human heritage, from ancient Egypt to the farthest civilizations of the world, with a modern style and immersive experience.',
      'footer.quicklinks': 'Quick Links',
      'footer.contact': 'Contact Us',
      'footer.totop': 'Back to top',
      'footer.rights': 'All rights reserved © The Digital Heritage Museum — digital design and development',
      'about.tag': 'Who we are',
      'about.title': 'About The Digital Heritage Museum',
      'about.p1': 'The Digital Heritage Museum is an interactive digital space designed to bring human history closer to every visitor, through eight wings covering the most prominent ancient civilizations, and an enjoyable learning experience in the basics of hieroglyphic writing.',
      'about.p2': 'Our goal is for history to be a living experience, not just information — every wing combines story, image, and interaction.',
      'about.fact': 'We always welcome your suggestions to enrich the museum content and add new civilizations.',
      'common.loading': 'Loading...',
      'chat.title': 'Museum AI Assistant',
      'chat.welcome': 'Welcome to The Digital Heritage Museum! 👋 Ask me about any civilization, ruler, or artifact in the museum.',
      'chat.placeholder': 'Type your question here...',
      'wingpdf.btn': 'Download Wing PDF',
      'wingpdf.btnTitle': 'A printable PDF version of this wing, works offline too',
      'signlang.wingNote': 'Sign language videos for this wing\'s key pieces are being prepared with specialized interpreters.',
      'community.title': 'Stories from Local Communities',
      'community.sub': "This museum isn't just a top-down exhibit — share a story about your family's or region's heritage, in a few words or a simple photo, and make it part of the museum's journey.",
      'community.addBtn': 'Share Your Story',
      'community.localNote': 'Stories published here are visible to all museum visitors.',
      'community.formTag': 'Share Your Story',
      'community.formTitle': "A story about your family's or region's heritage",
      'community.nameLabel': 'Your name',
      'community.regionLabel': 'Your region or country',
      'community.storyLabel': 'Your story (a short paragraph)',
      'community.imageLabel': 'A simple photo (optional)',
      'community.submitBtn': 'Publish Story',
      'opendata.title': 'Museum Open Data',
      'opendata.sub': 'All wing and artifact data (800 pieces) is available as an open file for researchers, teachers, and developers, under a CC BY 4.0 license.',
      'opendata.jsonTitle': 'Full JSON file',
      'opendata.jsonDesc': 'All wings, civilization comparisons, and every artifact with its details.',
      'opendata.downloadJson': 'Download open-data.json',
      'opendata.csvTitle': 'Simplified CSV file',
      'opendata.csvDesc': 'A table of all artifacts, opens directly in Excel or Google Sheets.',
      'opendata.downloadCsv': 'Download open-data-artifacts.csv',
      'opendata.licenseTitle': 'License & Usage',
      'opendata.licenseDesc': 'CC BY 4.0 license — free to use with attribution to the Heritage Legacy Museum. The data is static and updated with each site release.',
      'impact.title': 'The Museum in Real Numbers',
      'impact.sub': 'Numbers actually aggregated from all museum visitors (not estimates), plus your own personal journey.',
      'impact.visits': 'Total museum visits',
      'impact.country': 'Countries that visited the museum',
      'impact.teacher': 'Students who used Teacher Mode',
      'impact.wings': 'Your journey: wings explored',
      'impact.certLocked': 'Explore all six main wings to unlock your journey completion certificate.',
      'impact.certNamePlaceholder': 'Enter your name for the certificate',
      'impact.certDownload': 'Download Your Certificate'
    },
    fr: {
      dir: 'ltr',
      'nav.wings': 'Ailes',
      'nav.timeline': 'Chronologie vivante',
      'nav.realmap': 'Carte des sites réels',
      'nav.compare': 'Comparer deux civilisations',
      'nav.daily': 'Défi du jour',
      'nav.stats': 'Le musée en chiffres',
      'nav.about': 'À propos',
      'nav.author': "À propos du créateur",
      'nav.suggest': 'Suggérer une civilisation',
      'nav.search': 'Recherche',
      'nav.searchAria': 'Rechercher dans le musée',
      'nav.searchPlaceholder': 'Cherchez un objet, un souverain ou une civilisation...',
      'nav.login': 'Connexion',
      'hero.eyebrow': "Un voyage à travers des millénaires",
      'hero.title1': 'Découvrez',
      'hero.title2': 'les trésors des civilisations',
      'hero.title3': "dans un seul musée",
      'hero.sub': "Des rives du Nil à Babylone, Athènes et Rome, une visite interactive à travers les plus grandes civilisations de l'histoire humaine.",
      'hero.btn1': 'Explorer les ailes',
      'hero.btn2': 'Apprendre les langues anciennes',
      'hero.scroll': 'Faites défiler',
      'stats.wings': 'Ailes de civilisation',
      'stats.years': "Années d'histoire",
      'stats.symbols': "Symboles écrits réels de langues anciennes",
      'stats.items': 'Objets et récits historiques',
      'otd.eyebrow': 'Aperçu quotidien',
      'otd.title': 'Ce jour-là dans l\'histoire',
      'wings.eyebrow': 'Ailes du musée',
      'wings.title': 'Six civilisations.. une seule histoire humaine',
      'wings.sub': 'Choisissez une aile pour explorer ses monuments, ses histoires et ses faits fascinants.',
      'wings.explore': "Explorer l'aile ←",
      'paintings.eyebrow': 'Coin indépendant',
      'paintings.title': 'Peintures et arts anciens',
      'paintings.sub': "Une galerie dédiée à l'art pictural à travers les âges, séparée des ailes principales.",
      'timeline.eyebrow': "L'histoire en mouvement",
      'timeline.title': 'La chronologie vivante',
      'timeline.sub': "Faites glisser le curseur vers n'importe quelle année de 3500 av. J.-C. à aujourd'hui, et voyez toutes les civilisations actives à cette époque sur la ligne et la carte.",
      'timeline.from': '3500 av. J.-C.',
      'timeline.to': "Aujourd'hui",
      'timeline.selectedYear': 'Année sélectionnée :',
      'realmap.eyebrow': 'Géographie des civilisations',
      'realmap.title': 'Carte des sites archéologiques réels',
      'realmap.sub': 'Coordonnées réelles approximatives des principaux sites archéologiques dans le monde — cliquez sur un point pour accéder à son aile.',
      'realmap.note': 'Une projection géographique simplifiée (équirectangulaire) avec des coordonnées approximatives, non entièrement précises.',
      'compare.eyebrow': 'Comparez et apprenez',
      'compare.title': 'Comparateur de civilisations',
      'compare.sub': "Choisissez deux civilisations et voyez la différence dans l'écriture, l'architecture, la science et les croyances, côte à côte.",
      'compare.first': 'Première civilisation',
      'compare.second': 'Deuxième civilisation',
      'daily.eyebrow': 'Défi quotidien',
      'daily.title': 'La question du jour',
      'daily.sub': 'Une nouvelle question chaque jour — répondez correctement et entrez dans le classement quotidien !',
      'daily.push': 'Activer les notifications du musée',
      'closing.eyebrow': 'Partagez votre avis',
      'closing.title': "Vous connaissez une civilisation que nous avons oubliée ?",
      'closing.sub': "Suggérez une nouvelle civilisation pour que nous ajoutions son aile au musée.",
      'closing.btn': 'Suggérer une civilisation',
      'footer.desc': "Un musée numérique interactif célébrant le patrimoine humain, de l'Égypte ancienne aux civilisations les plus lointaines du monde, avec un style moderne et une expérience immersive.",
      'footer.quicklinks': 'Liens rapides',
      'footer.contact': 'Contactez-nous',
      'footer.totop': 'Retour en haut',
      'footer.rights': 'Tous droits réservés © Le Musée du Patrimoine Numérique — conception et développement numérique',
      'about.tag': 'Qui sommes-nous',
      'about.title': 'À propos du Musée du Patrimoine Numérique',
      'about.p1': "Le Musée du Patrimoine Numérique est un espace numérique interactif conçu pour rapprocher l'histoire humaine de chaque visiteur, à travers huit ailes couvrant les civilisations anciennes les plus marquantes, et une expérience d'apprentissage ludique des bases de l'écriture hiéroglyphique.",
      'about.p2': "Notre objectif est que l'histoire soit une expérience vivante et non de simples informations — chaque aile associe récit, image et interaction.",
      'about.fact': 'Nous accueillons toujours vos suggestions pour enrichir le contenu du musée et ajouter de nouvelles civilisations.',
      'common.loading': 'Chargement...',
      'chat.title': 'Assistant IA du musée',
      'chat.welcome': "Bienvenue au Musée du Patrimoine Numérique ! 👋 Posez-moi vos questions sur une civilisation, un souverain ou un objet du musée.",
      'chat.placeholder': 'Écrivez votre question ici...',
      'wingpdf.btn': "Télécharger l'aile en PDF",
      'wingpdf.btnTitle': "Version PDF imprimable de cette aile, fonctionne aussi hors ligne",
      'signlang.wingNote': "Des vidéos en langue des signes pour les pièces majeures de cette aile sont en préparation avec des interprètes spécialisés.",
      'community.title': 'Récits des communautés locales',
      'community.sub': "Ce musée n'est pas qu'une exposition descendante — partagez un récit sur le patrimoine de votre famille ou de votre région, en quelques mots ou une simple photo, et faites-en partie du parcours du musée.",
      'community.addBtn': 'Partagez votre récit',
      'community.localNote': 'Les récits publiés ici sont visibles par tous les visiteurs du musée.',
      'community.formTag': 'Partagez votre récit',
      'community.formTitle': 'Un récit sur le patrimoine de votre famille ou de votre région',
      'community.nameLabel': 'Votre nom',
      'community.regionLabel': 'Votre région ou pays',
      'community.storyLabel': 'Votre récit (un court paragraphe)',
      'community.imageLabel': 'Une photo simple (facultatif)',
      'community.submitBtn': 'Publier le récit',
      'opendata.title': 'Données ouvertes du musée',
      'opendata.sub': "Toutes les données des ailes et des pièces (800 pièces) sont disponibles en fichier ouvert pour les chercheurs, enseignants et développeurs, sous licence CC BY 4.0.",
      'opendata.jsonTitle': 'Fichier JSON complet',
      'opendata.jsonDesc': 'Toutes les ailes, les comparaisons de civilisations et chaque pièce avec ses détails.',
      'opendata.downloadJson': 'Télécharger open-data.json',
      'opendata.csvTitle': 'Fichier CSV simplifié',
      'opendata.csvDesc': "Un tableau de toutes les pièces, s'ouvre directement dans Excel ou Google Sheets.",
      'opendata.downloadCsv': 'Télécharger open-data-artifacts.csv',
      'opendata.licenseTitle': 'Licence et utilisation',
      'opendata.licenseDesc': "Licence CC BY 4.0 — utilisation libre avec attribution au musée de l'Héritage de la Civilisation. Les données sont statiques et mises à jour à chaque version du site.",
      'impact.title': 'Le musée en chiffres réels',
      'impact.sub': "Chiffres réellement agrégés depuis tous les visiteurs du musée (pas des estimations), ainsi que votre propre parcours.",
      'impact.visits': 'Visites totales du musée',
      'impact.country': 'Pays ayant visité le musée',
      'impact.teacher': 'Élèves ayant utilisé le Mode Enseignant',
      'impact.wings': 'Votre parcours : ailes explorées',
      'impact.certLocked': 'Explorez les six ailes principales pour débloquer votre certificat de parcours.',
      'impact.certNamePlaceholder': 'Entrez votre nom pour le certificat',
      'impact.certDownload': 'Télécharger votre certificat'
    },
    es: {
      dir: 'ltr',
      'nav.wings': 'Alas',
      'nav.timeline': 'Línea de tiempo viva',
      'nav.realmap': 'Mapa de sitios reales',
      'nav.compare': 'Comparar civilizaciones',
      'nav.daily': 'Reto del día',
      'nav.stats': 'El museo en cifras',
      'nav.about': 'Acerca de',
      'nav.author': 'Sobre el creador',
      'nav.suggest': 'Sugerir una civilización',
      'nav.search': 'Buscar',
      'nav.searchAria': 'Buscar en el museo',
      'nav.searchPlaceholder': 'Busca una pieza, gobernante o civilización...',
      'nav.login': 'Iniciar sesión',
      'hero.eyebrow': 'Un viaje a través de miles de años',
      'hero.title1': 'Descubre',
      'hero.title2': 'los tesoros de las civilizaciones',
      'hero.title3': 'en un solo museo',
      'hero.sub': 'Desde las orillas del Nilo hasta Babilonia, Atenas y Roma, un recorrido interactivo por las mayores civilizaciones de la historia humana.',
      'hero.btn1': 'Explorar las alas',
      'hero.btn2': 'Aprender lenguas antiguas',
      'hero.scroll': 'Desliza hacia abajo',
      'stats.wings': 'Alas de civilización',
      'stats.years': 'Años de historia',
      'stats.symbols': 'Símbolos escritos reales de lenguas antiguas',
      'stats.items': 'Piezas e historias históricas',
      'otd.eyebrow': 'Vistazo diario',
      'otd.title': 'En este día',
      'wings.eyebrow': 'Alas del museo',
      'wings.title': 'Seis civilizaciones.. una sola historia humana',
      'wings.sub': 'Elige un ala para explorar sus monumentos, historias y datos fascinantes.',
      'wings.explore': 'Explorar el ala ←',
      'paintings.eyebrow': 'Rincón independiente',
      'paintings.title': 'Pinturas y arte antiguo',
      'paintings.sub': 'Una galería dedicada al arte pictórico a través de los tiempos, separada de las alas principales.',
      'timeline.eyebrow': 'La historia en movimiento',
      'timeline.title': 'La línea de tiempo viva',
      'timeline.sub': 'Arrastra el control a cualquier año desde el 3500 a.C. hasta hoy, y observa todas las civilizaciones activas en ese momento en la línea y el mapa.',
      'timeline.from': '3500 a.C.',
      'timeline.to': 'Hoy',
      'timeline.selectedYear': 'Año seleccionado:',
      'realmap.eyebrow': 'Geografía de las civilizaciones',
      'realmap.title': 'Mapa de sitios arqueológicos reales',
      'realmap.sub': 'Coordenadas reales aproximadas de los principales sitios arqueológicos del mundo — haz clic en un punto para ir a su ala.',
      'realmap.note': 'Una proyección geográfica simplificada (equirectangular) con coordenadas aproximadas, no totalmente precisas.',
      'compare.eyebrow': 'Compara y aprende',
      'compare.title': 'Comparador de civilizaciones',
      'compare.sub': 'Elige dos civilizaciones y observa la diferencia en escritura, arquitectura, ciencia y creencias, una junto a la otra.',
      'compare.first': 'Primera civilización',
      'compare.second': 'Segunda civilización',
      'daily.eyebrow': 'Reto diario',
      'daily.title': 'La pregunta de hoy',
      'daily.sub': '¡Una nueva pregunta cada día — responde bien y entra en la clasificación diaria!',
      'daily.push': 'Activar notificaciones del museo',
      'closing.eyebrow': 'Comparte tu opinión',
      'closing.title': '¿Conoces una civilización que olvidamos mencionar?',
      'closing.sub': 'Sugiere una nueva civilización para añadir su ala al museo.',
      'closing.btn': 'Sugerir una civilización ahora',
      'footer.desc': 'Un museo digital interactivo que celebra el patrimonio humano, desde el antiguo Egipto hasta las civilizaciones más lejanas del mundo, con un estilo moderno y una experiencia inmersiva.',
      'footer.quicklinks': 'Enlaces rápidos',
      'footer.contact': 'Contáctanos',
      'footer.totop': 'Volver arriba',
      'footer.rights': 'Todos los derechos reservados © El Museo del Patrimonio Digital — diseño y desarrollo digital',
      'about.tag': 'Quiénes somos',
      'about.title': 'Sobre el Museo del Patrimonio Digital',
      'about.p1': 'El Museo del Patrimonio Digital es un espacio digital interactivo diseñado para acercar la historia humana a cada visitante, a través de ocho alas que cubren las civilizaciones antiguas más destacadas, y una experiencia de aprendizaje divertida sobre los conceptos básicos de la escritura jeroglífica.',
      'about.p2': 'Nuestro objetivo es que la historia sea una experiencia viva y no solo información — cada ala combina relato, imagen e interacción.',
      'about.fact': 'Siempre damos la bienvenida a sus sugerencias para enriquecer el contenido del museo y añadir nuevas civilizaciones.',
      'common.loading': 'Cargando...',
      'chat.title': 'Asistente de IA del museo',
      'chat.welcome': '¡Bienvenido al Museo del Patrimonio Digital! 👋 Pregúntame sobre cualquier civilización, gobernante o pieza del museo.',
      'chat.placeholder': 'Escribe tu pregunta aquí...',
      'wingpdf.btn': 'Descargar ala en PDF',
      'wingpdf.btnTitle': 'Versión en PDF de esta ala, lista para imprimir o usar sin conexión',
      'signlang.wingNote': 'Los vídeos en lengua de signos de las piezas destacadas de esta ala se están preparando con intérpretes especializados.',
      'community.title': 'Historias de comunidades locales',
      'community.sub': 'Este museo no es solo una exhibición de arriba hacia abajo — comparte una historia sobre el patrimonio de tu familia o tu región, en unas palabras o una foto sencilla, y forma parte del recorrido del museo.',
      'community.addBtn': 'Comparte tu historia',
      'community.localNote': 'Las historias publicadas aquí son visibles para todos los visitantes del museo.',
      'community.formTag': 'Comparte tu historia',
      'community.formTitle': 'Una historia sobre el patrimonio de tu familia o tu región',
      'community.nameLabel': 'Tu nombre',
      'community.regionLabel': 'Tu región o país',
      'community.storyLabel': 'Tu historia (un párrafo corto)',
      'community.imageLabel': 'Una foto sencilla (opcional)',
      'community.submitBtn': 'Publicar historia',
      'opendata.title': 'Datos abiertos del museo',
      'opendata.sub': 'Todos los datos de las alas y piezas (800 piezas) están disponibles como archivo abierto para investigadores, docentes y desarrolladores, bajo licencia CC BY 4.0.',
      'opendata.jsonTitle': 'Archivo JSON completo',
      'opendata.jsonDesc': 'Todas las alas, comparaciones de civilizaciones y cada pieza con sus detalles.',
      'opendata.downloadJson': 'Descargar open-data.json',
      'opendata.csvTitle': 'Archivo CSV simplificado',
      'opendata.csvDesc': 'Una tabla con todas las piezas, se abre directamente en Excel o Google Sheets.',
      'opendata.downloadCsv': 'Descargar open-data-artifacts.csv',
      'opendata.licenseTitle': 'Licencia y uso',
      'opendata.licenseDesc': 'Licencia CC BY 4.0 — uso libre citando al Museo del Legado de la Civilización como fuente. Los datos son estáticos y se actualizan con cada versión del sitio.',
      'impact.title': 'El museo en cifras reales',
      'impact.sub': 'Cifras realmente agregadas de todos los visitantes del museo (no estimaciones), además de tu propio recorrido.',
      'impact.visits': 'Visitas totales al museo',
      'impact.country': 'Países que han visitado el museo',
      'impact.teacher': 'Estudiantes que usaron el Modo Docente',
      'impact.wings': 'Tu recorrido: alas exploradas',
      'impact.certLocked': 'Explora las seis alas principales para desbloquear tu certificado de recorrido.',
      'impact.certNamePlaceholder': 'Escribe tu nombre para el certificado',
      'impact.certDownload': 'Descarga tu certificado'
    },
    de: {
      dir: 'ltr',
      'nav.wings': 'Flügel',
      'nav.timeline': 'Lebendige Zeitleiste',
      'nav.realmap': 'Karte echter Stätten',
      'nav.compare': 'Zivilisationen vergleichen',
      'nav.daily': 'Tägliche Herausforderung',
      'nav.stats': 'Das Museum in Zahlen',
      'nav.about': 'Über uns',
      'nav.author': 'Über den Ersteller',
      'nav.suggest': 'Eine Zivilisation vorschlagen',
      'nav.search': 'Suche',
      'nav.searchAria': 'Im Museum suchen',
      'nav.searchPlaceholder': 'Suche nach einem Artefakt, Herrscher oder einer Zivilisation...',
      'nav.login': 'Anmelden',
      'hero.eyebrow': 'Eine Reise durch Jahrtausende',
      'hero.title1': 'Entdecke',
      'hero.title2': 'die Schätze der Zivilisationen',
      'hero.title3': 'in einem Museum',
      'hero.sub': 'Von den Ufern des Nils bis nach Babylon, Athen und Rom — eine interaktive Tour durch die größten Zivilisationen der Menschheitsgeschichte.',
      'hero.btn1': 'Flügel entdecken',
      'hero.btn2': 'Alte Sprachen lernen',
      'hero.scroll': 'Nach unten scrollen',
      'stats.wings': 'Zivilisationsflügel',
      'stats.years': 'Jahre Geschichte',
      'stats.symbols': 'Echte Schriftzeichen alter Sprachen',
      'stats.items': 'Artefakte und historische Geschichten',
      'otd.eyebrow': 'Täglicher Einblick',
      'otd.title': 'An diesem Tag',
      'wings.eyebrow': 'Museumsflügel',
      'wings.title': 'Sechs Zivilisationen.. eine Geschichte der Menschheit',
      'wings.sub': 'Wähle einen Flügel, um seine Sehenswürdigkeiten, Geschichten und faszinierenden Fakten zu entdecken.',
      'wings.explore': 'Flügel entdecken ←',
      'paintings.eyebrow': 'Eigenständige Ecke',
      'paintings.title': 'Antike Gemälde & Kunst',
      'paintings.sub': 'Eine eigene Galerie, die die Bildkunst durch die Zeitalter feiert, getrennt von den Hauptflügeln.',
      'timeline.eyebrow': 'Geschichte in Bewegung',
      'timeline.title': 'Die lebendige Zeitleiste',
      'timeline.sub': 'Ziehe den Regler zu einem beliebigen Jahr von 3500 v. Chr. bis heute und sieh alle zu dieser Zeit aktiven Zivilisationen auf der Linie und der Karte.',
      'timeline.from': '3500 v. Chr.',
      'timeline.to': 'Heute',
      'timeline.selectedYear': 'Ausgewähltes Jahr:',
      'realmap.eyebrow': 'Geografie der Zivilisationen',
      'realmap.title': 'Karte echter archäologischer Stätten',
      'realmap.sub': 'Ungefähre reale Koordinaten der wichtigsten archäologischen Stätten weltweit — klicke auf einen Punkt, um zu seinem Flügel zu springen.',
      'realmap.note': 'Eine vereinfachte (äquirechteckige) geografische Projektion mit ungefähren, nicht vollständig präzisen Koordinaten.',
      'compare.eyebrow': 'Vergleiche und lerne',
      'compare.title': 'Zivilisationsvergleich',
      'compare.sub': 'Wähle zwei Zivilisationen und sieh den Unterschied in Schrift, Architektur, Wissenschaft und Glauben, nebeneinander.',
      'compare.first': 'Erste Zivilisation',
      'compare.second': 'Zweite Zivilisation',
      'daily.eyebrow': 'Tägliche Herausforderung',
      'daily.title': 'Die Frage des Tages',
      'daily.sub': 'Jeden Tag eine neue Frage — antworte richtig und komm auf die tägliche Bestenliste!',
      'daily.push': 'Museumsbenachrichtigungen aktivieren',
      'closing.eyebrow': 'Teile deine Meinung',
      'closing.title': 'Kennst du eine Zivilisation, die wir vergessen haben?',
      'closing.sub': 'Schlage eine neue Zivilisation vor, damit wir ihren Flügel dem Museum hinzufügen.',
      'closing.btn': 'Jetzt eine Zivilisation vorschlagen',
      'footer.desc': 'Ein interaktives digitales Museum, das das menschliche Erbe feiert, vom alten Ägypten bis zu den entferntesten Zivilisationen der Welt, mit modernem Stil und immersivem Erlebnis.',
      'footer.quicklinks': 'Schnelllinks',
      'footer.contact': 'Kontaktiere uns',
      'footer.totop': 'Nach oben',
      'footer.rights': 'Alle Rechte vorbehalten © Das Digitale Erbemuseum — digitales Design und Entwicklung',
      'about.tag': 'Über uns',
      'about.title': 'Über das Digitale Erbemuseum',
      'about.p1': 'Das Digitale Erbemuseum ist ein interaktiver digitaler Raum, der entwickelt wurde, um jedem Besucher die Menschheitsgeschichte näherzubringen, durch acht Flügel, die die bedeutendsten antiken Zivilisationen abdecken, und ein unterhaltsames Lernerlebnis der Grundlagen der Hieroglyphenschrift.',
      'about.p2': 'Unser Ziel ist es, dass Geschichte eine lebendige Erfahrung ist und nicht nur Information — jeder Flügel verbindet Geschichte, Bild und Interaktion.',
      'about.fact': 'Wir freuen uns immer über Ihre Vorschläge, um den Museumsinhalt zu bereichern und neue Zivilisationen hinzuzufügen.',
      'common.loading': 'Wird geladen...',
      'chat.title': 'KI-Museumsassistent',
      'chat.welcome': 'Willkommen im Digitalen Erbemuseum! 👋 Frag mich zu jeder Zivilisation, jedem Herrscher oder Artefakt im Museum.',
      'chat.placeholder': 'Schreibe deine Frage hier...',
      'wingpdf.btn': 'Flügel als PDF herunterladen',
      'wingpdf.btnTitle': 'Druckbare PDF-Version dieses Flügels, funktioniert auch offline',
      'signlang.wingNote': 'Gebärdensprachvideos für die wichtigsten Stücke dieses Flügels werden mit spezialisierten Dolmetschern vorbereitet.',
      'community.title': 'Geschichten aus lokalen Gemeinschaften',
      'community.sub': 'Dieses Museum ist nicht nur eine Ausstellung von oben herab — teile eine Geschichte über das Erbe deiner Familie oder Region, in wenigen Worten oder einem einfachen Foto, und mach sie zu einem Teil der Reise durch das Museum.',
      'community.addBtn': 'Teile deine Geschichte',
      'community.localNote': 'Hier veröffentlichte Geschichten sind für alle Museumsbesucher sichtbar.',
      'community.formTag': 'Teile deine Geschichte',
      'community.formTitle': 'Eine Geschichte über das Erbe deiner Familie oder Region',
      'community.nameLabel': 'Dein Name',
      'community.regionLabel': 'Deine Region oder dein Land',
      'community.storyLabel': 'Deine Geschichte (ein kurzer Absatz)',
      'community.imageLabel': 'Ein einfaches Foto (optional)',
      'community.submitBtn': 'Geschichte veröffentlichen',
      'opendata.title': 'Offene Daten des Museums',
      'opendata.sub': 'Alle Daten zu Flügeln und Artefakten (800 Stücke) stehen als offene Datei für Forscher, Lehrer und Entwickler unter CC-BY-4.0-Lizenz zur Verfügung.',
      'opendata.jsonTitle': 'Vollständige JSON-Datei',
      'opendata.jsonDesc': 'Alle Flügel, Zivilisationsvergleiche und jedes Artefakt mit seinen Details.',
      'opendata.downloadJson': 'open-data.json herunterladen',
      'opendata.csvTitle': 'Vereinfachte CSV-Datei',
      'opendata.csvDesc': 'Eine Tabelle aller Artefakte, öffnet sich direkt in Excel oder Google Sheets.',
      'opendata.downloadCsv': 'open-data-artifacts.csv herunterladen',
      'opendata.licenseTitle': 'Lizenz und Nutzung',
      'opendata.licenseDesc': 'CC-BY-4.0-Lizenz — freie Nutzung mit Namensnennung des Museums für das Erbe der Zivilisation. Die Daten sind statisch und werden mit jeder Website-Version aktualisiert.',
      'impact.title': 'Das Museum in echten Zahlen',
      'impact.sub': 'Zahlen, die tatsächlich von allen Museumsbesuchern aggregiert wurden (keine Schätzungen), sowie deine persönliche Reise.',
      'impact.visits': 'Gesamtbesuche des Museums',
      'impact.country': 'Länder, die das Museum besucht haben',
      'impact.teacher': 'Schüler, die den Lehrer-Modus genutzt haben',
      'impact.wings': 'Deine Reise: erkundete Flügel',
      'impact.certLocked': 'Erkunde alle sechs Hauptflügel, um dein Abschlusszertifikat freizuschalten.',
      'impact.certNamePlaceholder': 'Gib deinen Namen für das Zertifikat ein',
      'impact.certDownload': 'Zertifikat herunterladen'
    }
  };

  const FLAGS = { ar: '🇪🇬', en: '🇬🇧', fr: '🇫🇷', es: '🇪🇸', de: '🇩🇪' };

  function getSavedLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'ar';
    } catch (e) {
      return 'ar';
    }
  }

  function saveLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function applyLang(lang) {
    const dict = DICT[lang] || DICT.ar;
    document.documentElement.setAttribute('lang', lang);
    /* ملحوظة مهمة: الشكل العام للموقع (الأزرار، القوائم، الكروت، النوافذ...إلخ)
       مصمم ومُختبَر لاتجاه RTL بس. تبديل الاتجاه فعليًا لـ LTR وقت اختيار
       لغة زي الإنجليزي كان بيكسر عناصر كتير (قائمة النافيجيشن، القوائم
       المنسدلة، النوافذ المنبثقة...) لأنها معملتلهاش أي تجهيز لاتجاه معاكس.
       عشان كده بنسيب اتجاه الصفحة RTL ثابت دايمًا مهما كانت اللغة المختارة
       أو لغة الجهاز/المتصفح، وبنكتفي بترجمة الكلام بس - الشكل نفسه ميتأثرش أبدًا. */
    document.documentElement.setAttribute('dir', 'rtl');

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key]) el.setAttribute('title', dict[key]);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      if (dict[key]) el.setAttribute('aria-label', dict[key]);
    });

    const flagEl = document.getElementById('nav-lang-flag');
    const codeEl = document.getElementById('nav-lang-code');
    if (flagEl) flagEl.textContent = FLAGS[lang] || '🌐';
    if (codeEl) codeEl.textContent = lang.toUpperCase();

    document.querySelectorAll('.nav-lang-opt').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    window.MUSEUM_LANG = lang;
    window.MUSEUM_DICT = dict;
    document.dispatchEvent(new CustomEvent('museum:langchange', { detail: { lang, dict } }));
  }

  function setLang(lang) {
    if (!DICT[lang]) return;
    saveLang(lang);
    applyLang(lang);
    const menu = document.getElementById('nav-lang-menu');
    if (menu) menu.classList.remove('open');
  }

  // واجهة عامة بسيطة تقدر تستخدمها أي سكريبت تاني في الموقع (زي ai-chat.js)
  window.museumI18n = {
    t(key) {
      const dict = DICT[window.MUSEUM_LANG || 'ar'] || DICT.ar;
      return dict[key] || key;
    },
    getLang() { return window.MUSEUM_LANG || 'ar'; },
    setLang
  };

  document.addEventListener('DOMContentLoaded', () => {
    applyLang(getSavedLang());

    const langBtn = document.getElementById('nav-lang-btn');
    const langMenu = document.getElementById('nav-lang-menu');
    if (langBtn && langMenu) {
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langMenu.classList.toggle('open');
      });
      document.addEventListener('click', () => langMenu.classList.remove('open'));
      langMenu.addEventListener('click', (e) => e.stopPropagation());
    }
    document.querySelectorAll('.nav-lang-opt').forEach((btn) => {
      btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
    });
  });
})();

/* =====================================================================
   ترجمة المحتوى الديناميكي (القطع/الأجنحة/الألعاب/الشات..إلخ)
   بما إن بيانات القطع الأثرية ضخمة ومكتوبة عربي بس في script.js، بدل ما
   نترجمها يدويًا سطر سطر، بنترجمها لحظيًا وقت التصفح عن طريق خدمة ترجمة
   مجانية (MyMemory)، مع تخزين مؤقت (cache) في localStorage عشان منبعتش
   نفس الجملة مرتين. النصوص اللي متحكومة بـ data-i18n بنتجاهلها هنا لأنها
   أصلاً مترجمة بالقاموس فوق.
   ===================================================================== */
(function () {
  'use strict';

  const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F]/;
  const SKIP_SELECTOR = '[data-i18n],[data-i18n-placeholder],[data-i18n-title],[data-i18n-aria],.no-translate,script,style,noscript';
  const CACHE_PREFIX = 'mt_cache_v1_';
  const trackedNodes = new Set();
  let debounceTimer = null;
  let translateGeneration = 0;

  function hashStr(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }

  function readCache(lang, text) {
    try { return localStorage.getItem(CACHE_PREFIX + lang + '_' + hashStr(text)); }
    catch (e) { return null; }
  }
  function writeCache(lang, text, translated) {
    try { localStorage.setItem(CACHE_PREFIX + lang + '_' + hashStr(text), translated); }
    catch (e) {}
  }

  function collectArabicTextNodes(root) {
    const found = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (trackedNodes.has(node)) return NodeFilter.FILTER_REJECT;
        const val = node.nodeValue;
        if (!val || !ARABIC_RE.test(val)) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent || parent.closest(SKIP_SELECTOR)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let n;
    while ((n = walker.nextNode())) found.push(n);
    return found;
  }

  /* MyMemory أحيانًا بترجع HTTP 200 لكن جوّه الرد رسالة تحذير نصية
     (زي "MYMEMORY WARNING: YOU USED ALL AVAILABLE FREE TRANSLATIONS...")
     بدل الترجمة الفعلية وقت ما تنفد الحصة اليومية المجانية. الكود القديم
     كان بيحطها في الصفحة كأنها ترجمة سليمة، فكانت بعض النصوص بعد فترة
     استخدام تتحول لرسالة إنجليزية غريبة بدل الترجمة أو تفضل عربي مقفولة.
     هنا بنكتشف الحالة دي ونرفضها عشان النص يفضل زي ما هو (عربي) لحد ما
     نعيد المحاولة تاني، بدل ما نلوّث الصفحة برسالة تحذير. */
  function isBadTranslation(data, translated) {
    if (!translated) return true;
    if (data && data.responseStatus && Number(data.responseStatus) !== 200) return true;
    if (/MYMEMORY WARNING|INVALID TARGET LANGUAGE|INVALID SOURCE LANGUAGE|LANGUAGE PAIR|QUERY LENGTH LIMIT/i.test(translated)) return true;
    const match = data && data.responseData && data.responseData.match;
    if (typeof match === 'number' && match < 0.3) return true;
    return false;
  }

  const __quotaCooldownUntil = { until: 0 };

  async function fetchTranslation(text, lang) {
    const cached = readCache(lang, text);
    if (cached) return cached;
    if (Date.now() < __quotaCooldownUntil.until) return null; // مستنيين تنعاد الحصة
    try {
      const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text.slice(0, 480)) + '&langpair=ar|' + lang;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      const translated = data && data.responseData && data.responseData.translatedText;
      if (isBadTranslation(data, translated)) {
        // الحصة المجانية اليومية غالبًا نفدت؛ نستنى 5 دقايق قبل ما نحاول تاني
        // بدل ما نضرب مئات الطلبات الفاشلة على السيرفر لحد ما نرجع نجرب.
        __quotaCooldownUntil.until = Date.now() + 5 * 60 * 1000;
        return null;
      }
      writeCache(lang, text, translated);
      return translated;
    } catch (e) { /* هنسيب النص العربي زي ما هو لو الترجمة فشلت */ }
    return null;
  }

  async function syncNode(node, lang, generation) {
    if (node.__mtOrig == null) node.__mtOrig = node.nodeValue;
    const original = node.__mtOrig;
    const text = original.trim();
    if (!text) { node.__mtLang = lang; return; }

    if (lang === 'ar') {
      node.nodeValue = original;
      node.__mtLang = 'ar';
      return;
    }
    const translated = await fetchTranslation(text, lang);
    if (generation !== translateGeneration) return; // المستخدم غيّر اللغة تاني قبل ما نخلص
    if (translated) node.nodeValue = original.replace(text, translated);
    node.__mtLang = lang;
  }

  async function runQueue(nodes, lang, generation) {
    const CONCURRENCY = 4;
    let idx = 0;
    async function worker() {
      while (idx < nodes.length) {
        const node = nodes[idx++];
        if (generation !== translateGeneration) return;
        await syncNode(node, lang, generation);
      }
    }
    const workers = [];
    for (let i = 0; i < Math.min(CONCURRENCY, nodes.length); i++) workers.push(worker());
    await Promise.all(workers);
  }

  function applyDynamicTranslation(lang) {
    translateGeneration++;
    const generation = translateGeneration;
    const fresh = collectArabicTextNodes(document.body);
    fresh.forEach((n) => trackedNodes.add(n));

    const toSync = [];
    trackedNodes.forEach((node) => {
      if (!node.isConnected) { trackedNodes.delete(node); return; }
      if (node.__mtLang !== lang) toSync.push(node);
    });
    if (toSync.length) runQueue(toSync, lang, generation);
  }

  /* ---- ترجمة الصفات (placeholder / title / aria-label / alt) ----
     القاموس الثابت فوق بيترجم بس العناصر اللي متعلّم عليها data-i18n-placeholder/
     title/aria (النافيجيشن غالبًا). باقي حقول الموقع (تسجيل الدخول، البحث جوّه
     الجناح، لوحة الأدمن، صندوق الاقتراحات...إلخ) صفاتها مكتوبة عربي مباشرة من
     غير أي هوك، فبتفضل عربي حتى لما تبدّل اللغة. هنا بنلقطها ونترجمها لحظيًا
     بنفس خدمة الترجمة والكاش اللي بيترجم بيهم النصوص فوق. */
  const ATTR_LIST = ['placeholder', 'title', 'aria-label', 'alt'];
  const trackedAttrEls = new Set();

  function isAttrDictHooked(el, attr) {
    if (attr === 'placeholder' && el.hasAttribute('data-i18n-placeholder')) return true;
    if (attr === 'title' && el.hasAttribute('data-i18n-title')) return true;
    if (attr === 'aria-label' && el.hasAttribute('data-i18n-aria')) return true;
    return false;
  }

  function collectArabicAttrEls(root) {
    const found = [];
    const els = root.querySelectorAll('[placeholder],[title],[aria-label],[alt]');
    els.forEach((el) => {
      if (trackedAttrEls.has(el)) return;
      if (el.closest('.no-translate,script,style,noscript')) return;
      let hasArabicAttr = false;
      ATTR_LIST.forEach((attr) => {
        if (isAttrDictHooked(el, attr)) return;
        const val = el.getAttribute(attr);
        if (val && ARABIC_RE.test(val)) hasArabicAttr = true;
      });
      if (hasArabicAttr) found.push(el);
    });
    return found;
  }

  async function syncAttrEl(el, lang, generation) {
    if (!el.__mtAttrOrig) {
      el.__mtAttrOrig = {};
      ATTR_LIST.forEach((attr) => {
        if (isAttrDictHooked(el, attr)) return;
        const val = el.getAttribute(attr);
        if (val && ARABIC_RE.test(val)) el.__mtAttrOrig[attr] = val;
      });
    }
    const attrs = Object.keys(el.__mtAttrOrig);
    if (!attrs.length) { el.__mtAttrLang = lang; return; }

    await Promise.all(attrs.map(async (attr) => {
      const original = el.__mtAttrOrig[attr];
      if (lang === 'ar') { el.setAttribute(attr, original); return; }
      const translated = await fetchTranslation(original, lang);
      if (generation !== translateGeneration) return;
      if (translated) el.setAttribute(attr, translated);
    }));
    el.__mtAttrLang = lang;
  }

  async function runAttrQueue(els, lang, generation) {
    const CONCURRENCY = 4;
    let idx = 0;
    async function worker() {
      while (idx < els.length) {
        const el = els[idx++];
        if (generation !== translateGeneration) return;
        await syncAttrEl(el, lang, generation);
      }
    }
    const workers = [];
    for (let i = 0; i < Math.min(CONCURRENCY, els.length); i++) workers.push(worker());
    await Promise.all(workers);
  }

  function applyDynamicAttrTranslation(lang, generation) {
    const fresh = collectArabicAttrEls(document.body);
    fresh.forEach((el) => trackedAttrEls.add(el));

    const toSync = [];
    trackedAttrEls.forEach((el) => {
      if (!el.isConnected) { trackedAttrEls.delete(el); return; }
      if (el.__mtAttrLang !== lang) toSync.push(el);
    });
    if (toSync.length) runAttrQueue(toSync, lang, generation);
  }

  function scheduleTranslatePass() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const lang = window.MUSEUM_LANG || 'ar';
      applyDynamicTranslation(lang); // بيزوّد translateGeneration جوّاها لوحدها
      applyDynamicAttrTranslation(lang, translateGeneration);
    }, 220);
  }

  document.addEventListener('museum:langchange', scheduleTranslatePass);

  document.addEventListener('DOMContentLoaded', () => {
    scheduleTranslatePass();
    const observer = new MutationObserver(scheduleTranslatePass);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    // إعادة محاولة دورية: أي نص فضل عربي بسبب فشل مؤقت في الترجمة (نفاد
    // الحصة، مشكلة شبكة...) بيتعاد استهدافه تلقائيًا كل دقيقة بدل ما يفضل
    // واقف عربي للأبد لحد ما المستخدم يغيّر اللغة يدويًا تاني.
    setInterval(() => {
      const lang = window.MUSEUM_LANG || 'ar';
      if (lang === 'ar') return;
      trackedNodes.forEach((n) => { if (n.__mtLang !== lang) n.__mtLang = undefined; });
      trackedAttrEls.forEach((el) => { if (el.__mtAttrLang !== lang) el.__mtAttrLang = undefined; });
      scheduleTranslatePass();
    }, 60 * 1000);
  });
})();
