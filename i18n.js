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
      'chat.placeholder': 'اكتب سؤالك هنا...'
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
      'chat.placeholder': 'Type your question here...'
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
      'chat.placeholder': 'Écrivez votre question ici...'
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
      'chat.placeholder': 'Escribe tu pregunta aquí...'
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
      'chat.placeholder': 'Schreibe deine Frage hier...'
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
    document.documentElement.setAttribute('dir', dict.dir || 'ltr');

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
