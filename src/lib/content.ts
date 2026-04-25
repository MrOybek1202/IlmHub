import { Lang } from "@/lib/i18n/dictionaries";

type L10nText = Record<Lang, string>;

export type SubjectId = "math" | "physics" | "chem" | "bio" | "geo" | "lang";

export interface SubjectResource {
  title: L10nText;
  description: L10nText;
  type: "video" | "lesson" | "worksheet" | "quiz";
  url: string;
}

export interface SubjectTopic {
  title: L10nText;
  summary: L10nText;
  duration: string;
  resources: SubjectResource[];
}

export interface SubjectData {
  id: SubjectId;
  color: "math" | "physics" | "chem" | "bio" | "cs" | "lang";
  gradeRange: string;
  progress: number;
  heroStat: number;
  name: L10nText;
  shortDescription: L10nText;
  longDescription: L10nText;
  skills: L10nText[];
  topics: SubjectTopic[];
}

export interface LabItem {
  id: string;
  subjectId: SubjectId;
  color: SubjectData["color"];
  level: "starter" | "intermediate" | "advanced";
  title: L10nText;
  description: L10nText;
  provider: string;
  url: string;
}

export interface BookChapter {
  title: L10nText;
  summary: L10nText;
  practiceUrl: string;
  videoUrl: string;
}

export interface InteractiveBook {
  id: string;
  subjectId: SubjectId;
  color: SubjectData["color"];
  title: L10nText;
  coverNote: L10nText;
  chapters: BookChapter[];
}

export interface GameItem {
  id: string;
  subjectId: SubjectId;
  color: SubjectData["color"];
  difficulty: "easy" | "medium" | "hard";
  title: L10nText;
  description: L10nText;
  provider: string;
  url: string;
}

export interface ActivityCell {
  date: string;
  level: 0 | 1 | 2 | 3 | 4;
}

export const localize = (value: L10nText, lang: Lang) => value[lang];

export const subjects: SubjectData[] = [
  {
    id: "physics",
    color: "physics",
    gradeRange: "7-11",
    progress: 35,
    heroStat: 62,
    name: { uz: "Fizika", ru: "Физика", en: "Physics" },
    shortDescription: {
      uz: "Harakat, kuch va energiyani tajribalar bilan o'rganing.",
      ru: "Изучайте движение, силу и энергию через практику.",
      en: "Explore motion, force, and energy through hands-on learning.",
    },
    longDescription: {
      uz: "Nazariyani video, virtual laboratoriya va interaktiv mashqlar bilan mustahkamlang.",
      ru: "Закрепляйте теорию с помощью видео, виртуальных лабораторий и интерактивных заданий.",
      en: "Reinforce theory with videos, virtual labs, and interactive practice.",
    },
    skills: [
      { uz: "Kinematika", ru: "Кинематика", en: "Kinematics" },
      { uz: "Elektr", ru: "Электричество", en: "Electricity" },
      { uz: "To'lqinlar", ru: "Волны", en: "Waves" },
    ],
    topics: [
      {
        title: { uz: "Kinematika asoslari", ru: "Основы кинематики", en: "Kinematics fundamentals" },
        summary: {
          uz: "Tezlik, masofa va vaqt orasidagi bog'lanishni animatsiyalar bilan o'rganing.",
          ru: "Изучите связь между скоростью, расстоянием и временем через анимации.",
          en: "Study the relationship between speed, distance, and time with animations.",
        },
        duration: "24 min",
        resources: [
          {
            title: { uz: "Video dars", ru: "Видео-урок", en: "Video lesson" },
            description: {
              uz: "Kinematika mavzusi bo'yicha YouTube dars.",
              ru: "YouTube-урок по кинематике.",
              en: "A YouTube lesson on kinematics.",
            },
            type: "video",
            url: "https://www.youtube.com/watch?v=Zm0f0sD2UqU",
          },
          {
            title: { uz: "Masala to'plami", ru: "Сборник задач", en: "Problem set" },
            description: {
              uz: "Boshlang'ich va o'rta daraja masalalari.",
              ru: "Задачи начального и среднего уровня.",
              en: "Starter and intermediate exercises.",
            },
            type: "worksheet",
            url: "https://phet.colorado.edu/en/simulations/filter?subjects=physics",
          },
        ],
      },
      {
        title: { uz: "Elektr zanjirlari", ru: "Электрические цепи", en: "Electric circuits" },
        summary: {
          uz: "Tok, kuchlanish va qarshilikni real misollar bilan ko'ring.",
          ru: "Поймите ток, напряжение и сопротивление на реальных примерах.",
          en: "Understand current, voltage, and resistance through practical examples.",
        },
        duration: "31 min",
        resources: [
          {
            title: { uz: "Interaktiv laboratoriya", ru: "Интерактивная лаборатория", en: "Interactive lab" },
            description: {
              uz: "PhET yordamida zanjir qurish.",
              ru: "Сборка цепи с помощью PhET.",
              en: "Build a circuit with PhET.",
            },
            type: "lesson",
            url: "https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc",
          },
        ],
      },
    ],
  },
  {
    id: "math",
    color: "math",
    gradeRange: "5-11",
    progress: 60,
    heroStat: 84,
    name: { uz: "Matematika", ru: "Математика", en: "Math" },
    shortDescription: {
      uz: "Masalalarni bosqichma-bosqich yeching va natijalarni diagrammada kuzating.",
      ru: "Решайте задачи шаг за шагом и отслеживайте результат на диаграммах.",
      en: "Solve problems step by step and track progress with charts.",
    },
    longDescription: {
      uz: "Algebra, geometriya va funksiyalar bo'yicha interaktiv mashg'ulotlar.",
      ru: "Интерактивные занятия по алгебре, геометрии и функциям.",
      en: "Interactive practice for algebra, geometry, and functions.",
    },
    skills: [
      { uz: "Algebra", ru: "Алгебра", en: "Algebra" },
      { uz: "Geometriya", ru: "Геометрия", en: "Geometry" },
      { uz: "Funksiyalar", ru: "Функции", en: "Functions" },
    ],
    topics: [
      {
        title: { uz: "Kvadrat tenglamalar", ru: "Квадратные уравнения", en: "Quadratic equations" },
        summary: {
          uz: "Grafik, formula va misollar orqali mavzuni mustahkamlang.",
          ru: "Закрепите тему через графики, формулы и примеры.",
          en: "Master the topic using graphs, formulas, and worked examples.",
        },
        duration: "28 min",
        resources: [
          {
            title: { uz: "YouTube dars", ru: "Урок на YouTube", en: "YouTube lesson" },
            description: {
              uz: "Kvadrat tenglamalarni sodda usulda tushuntirish.",
              ru: "Простое объяснение квадратных уравнений.",
              en: "A simple explanation of quadratic equations.",
            },
            type: "video",
            url: "https://www.youtube.com/watch?v=IlNAJl36-10",
          },
        ],
      },
    ],
  },
  {
    id: "chem",
    color: "chem",
    gradeRange: "7-11",
    progress: 18,
    heroStat: 48,
    name: { uz: "Kimyo", ru: "Химия", en: "Chemistry" },
    shortDescription: {
      uz: "Molekulalar, reaksiyalar va laboratoriya usullarini ko'rib chiqing.",
      ru: "Изучайте молекулы, реакции и лабораторные методы.",
      en: "Explore molecules, reactions, and lab methods.",
    },
    longDescription: {
      uz: "Virtual tajribalar va modellar orqali tushunchalarni jonlantiring.",
      ru: "Оживляйте понятия с помощью виртуальных опытов и моделей.",
      en: "Bring concepts to life with virtual experiments and models.",
    },
    skills: [
      { uz: "Atom tuzilishi", ru: "Строение атома", en: "Atomic structure" },
      { uz: "Reaksiyalar", ru: "Реакции", en: "Reactions" },
      { uz: "Stoichiometriya", ru: "Стехиометрия", en: "Stoichiometry" },
    ],
    topics: [
      {
        title: { uz: "Atom va molekula", ru: "Атом и молекула", en: "Atoms and molecules" },
        summary: {
          uz: "Vizual modellar bilan molekulalar qanday tuzilishini o'rganing.",
          ru: "Изучите устройство молекул с помощью визуальных моделей.",
          en: "Learn how molecules are built using visual models.",
        },
        duration: "21 min",
        resources: [
          {
            title: { uz: "Interaktiv model", ru: "Интерактивная модель", en: "Interactive model" },
            description: {
              uz: "PhET molekula konstruktori.",
              ru: "Конструктор молекул от PhET.",
              en: "A PhET molecule builder.",
            },
            type: "lesson",
            url: "https://phet.colorado.edu/en/simulations/build-a-molecule",
          },
        ],
      },
    ],
  },
  {
    id: "bio",
    color: "bio",
    gradeRange: "6-11",
    progress: 60,
    heroStat: 56,
    name: { uz: "Biologiya", ru: "Биология", en: "Biology" },
    shortDescription: {
      uz: "Hujayra, organizmlar va tirik tizimlarni interaktiv ko'rinishda o'rganing.",
      ru: "Изучайте клетку, организмы и живые системы в интерактивном формате.",
      en: "Study cells, organisms, and living systems interactively.",
    },
    longDescription: {
      uz: "Diagrammalar, videolar va viktorinalar orqali biologiyani oson tushuning.",
      ru: "Понимайте биологию через диаграммы, видео и викторины.",
      en: "Understand biology through diagrams, videos, and quizzes.",
    },
    skills: [
      { uz: "Hujayra", ru: "Клетка", en: "Cells" },
      { uz: "Ekotizim", ru: "Экосистема", en: "Ecosystems" },
      { uz: "Genetika", ru: "Генетика", en: "Genetics" },
    ],
    topics: [
      {
        title: { uz: "Hujayra tuzilishi", ru: "Строение клетки", en: "Cell structure" },
        summary: {
          uz: "Organellalarni qisqa bloklar va rasmlar bilan yod oling.",
          ru: "Запомните органоиды через короткие блоки и иллюстрации.",
          en: "Memorize organelles through short blocks and visuals.",
        },
        duration: "19 min",
        resources: [
          {
            title: { uz: "Video dars", ru: "Видео-урок", en: "Video lesson" },
            description: {
              uz: "Hujayra bo'yicha kirish darsi.",
              ru: "Вводный урок по клетке.",
              en: "An intro lesson on cells.",
            },
            type: "video",
            url: "https://www.youtube.com/watch?v=URUJD5NEXC8",
          },
        ],
      },
    ],
  },
  {
    id: "geo",
    color: "cs",
    gradeRange: "5-11",
    progress: 22,
    heroStat: 38,
    name: { uz: "Geografiya", ru: "География", en: "Geography" },
    shortDescription: {
      uz: "Xaritalar, iqlim va tabiiy jarayonlarni real misollar bilan o'rganing.",
      ru: "Изучайте карты, климат и природные процессы на реальных примерах.",
      en: "Learn maps, climate, and natural processes through real-world examples.",
    },
    longDescription: {
      uz: "Vizual materiallar va interaktiv xaritalar bilan boyitilgan kurs.",
      ru: "Курс с визуальными материалами и интерактивными картами.",
      en: "A course enriched with visuals and interactive maps.",
    },
    skills: [
      { uz: "Iqlim", ru: "Климат", en: "Climate" },
      { uz: "Xarita", ru: "Карта", en: "Maps" },
      { uz: "Tabiiy resurslar", ru: "Ресурсы", en: "Resources" },
    ],
    topics: [
      {
        title: { uz: "Iqlim zonalari", ru: "Климатические зоны", en: "Climate zones" },
        summary: {
          uz: "Iqlim zonalarini xaritalar va misollar bilan solishtiring.",
          ru: "Сравните климатические зоны по картам и примерам.",
          en: "Compare climate zones with maps and examples.",
        },
        duration: "17 min",
        resources: [
          {
            title: { uz: "National Geographic video", ru: "Видео National Geographic", en: "National Geographic video" },
            description: {
              uz: "Iqlim haqidagi qisqa video.",
              ru: "Короткое видео о климате.",
              en: "A short climate explainer.",
            },
            type: "video",
            url: "https://www.youtube.com/watch?v=5tC8-_Q6LZQ",
          },
        ],
      },
    ],
  },
  {
    id: "lang",
    color: "lang",
    gradeRange: "1-11",
    progress: 50,
    heroStat: 72,
    name: { uz: "Ingliz tili", ru: "Английский язык", en: "English" },
    shortDescription: {
      uz: "So'z boyligi, grammatika va tinglab tushunishni mashq qiling.",
      ru: "Практикуйте словарь, грамматику и аудирование.",
      en: "Practice vocabulary, grammar, and listening.",
    },
    longDescription: {
      uz: "Qisqa videolar, interaktiv mashqlar va mini-o'yinlar bilan til o'rganing.",
      ru: "Учите язык через короткие видео, интерактив и мини-игры.",
      en: "Learn language through short videos, interactive practice, and mini games.",
    },
    skills: [
      { uz: "Grammar", ru: "Грамматика", en: "Grammar" },
      { uz: "Reading", ru: "Чтение", en: "Reading" },
      { uz: "Listening", ru: "Аудирование", en: "Listening" },
    ],
    topics: [
      {
        title: { uz: "Present Simple", ru: "Present Simple", en: "Present Simple" },
        summary: {
          uz: "Har kuni ishlatiladigan gaplar orqali zamonni tushuning.",
          ru: "Поймите время через повседневные примеры.",
          en: "Understand the tense through everyday examples.",
        },
        duration: "16 min",
        resources: [
          {
            title: { uz: "Grammar video", ru: "Видео по грамматике", en: "Grammar video" },
            description: {
              uz: "Qisqa va sodda grammatik tushuntirish.",
              ru: "Короткое и понятное объяснение грамматики.",
              en: "A short and clear grammar explainer.",
            },
            type: "video",
            url: "https://www.youtube.com/watch?v=InM7o3ViJm8",
          },
        ],
      },
    ],
  },
];

export const labItems: LabItem[] = [
  {
    id: "forces-motion",
    subjectId: "physics",
    color: "physics",
    level: "starter",
    title: { uz: "Kuch va harakat", ru: "Силы и движение", en: "Forces and Motion" },
    description: {
      uz: "Kuchning tezlanishga ta'sirini tekshiring.",
      ru: "Проверьте влияние силы на ускорение.",
      en: "Test how force changes acceleration.",
    },
    provider: "PhET",
    url: "https://phet.colorado.edu/en/simulations/forces-and-motion-basics",
  },
  {
    id: "wave-string",
    subjectId: "physics",
    color: "physics",
    level: "intermediate",
    title: { uz: "Arqondagi to'lqin", ru: "Волна на струне", en: "Wave on a String" },
    description: {
      uz: "Amplituda va chastotani o'zgartirib natijani kuzating.",
      ru: "Меняйте амплитуду и частоту и наблюдайте результат.",
      en: "Adjust amplitude and frequency and observe the result.",
    },
    provider: "PhET",
    url: "https://phet.colorado.edu/en/simulations/wave-on-a-string",
  },
  {
    id: "circuit-kit",
    subjectId: "physics",
    color: "physics",
    level: "advanced",
    title: { uz: "Elektr zanjiri konstruktori", ru: "Конструктор электрических цепей", en: "Circuit Construction Kit" },
    description: {
      uz: "Zanjirni yig'ing va tok kuchini o'lchang.",
      ru: "Соберите цепь и измерьте силу тока.",
      en: "Build a circuit and measure current.",
    },
    provider: "PhET",
    url: "https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc",
  },
  {
    id: "molecule-builder",
    subjectId: "chem",
    color: "chem",
    level: "starter",
    title: { uz: "Molekula yasash", ru: "Собери молекулу", en: "Build a Molecule" },
    description: {
      uz: "Atomlarni birlashtirib kimyoviy formulalarni ko'ring.",
      ru: "Соединяйте атомы и смотрите химические формулы.",
      en: "Combine atoms and see chemical formulas appear.",
    },
    provider: "PhET",
    url: "https://phet.colorado.edu/en/simulations/build-a-molecule",
  },
  {
    id: "balancing-chem",
    subjectId: "chem",
    color: "chem",
    level: "intermediate",
    title: { uz: "Kimyoviy tenglamalarni tenglashtirish", ru: "Балансировка уравнений", en: "Balancing Chemical Equations" },
    description: {
      uz: "Reaksiyalarni interaktiv tarzda tenglashtiring.",
      ru: "Балансируйте реакции в интерактивном формате.",
      en: "Balance reactions interactively.",
    },
    provider: "PhET",
    url: "https://phet.colorado.edu/en/simulations/balancing-chemical-equations",
  },
  {
    id: "math-graph",
    subjectId: "math",
    color: "math",
    level: "starter",
    title: { uz: "Desmos grafik laboratoriyasi", ru: "Графическая лаборатория Desmos", en: "Desmos Graph Lab" },
    description: {
      uz: "Funksiyalar grafigini qurib, koeffitsientlarni sinab ko'ring.",
      ru: "Стройте графики функций и пробуйте коэффициенты.",
      en: "Plot functions and experiment with coefficients.",
    },
    provider: "Desmos",
    url: "https://www.desmos.com/calculator",
  },
];

export const interactiveBooks: InteractiveBook[] = [
  {
    id: "physics-kinematics-book",
    subjectId: "physics",
    color: "physics",
    title: { uz: "Fizika 9: Harakat va kuch", ru: "Физика 9: Движение и сила", en: "Physics 9: Motion and Force" },
    coverNote: {
      uz: "Har bobda konspekt, video va mashq havolasi bor.",
      ru: "В каждой главе есть конспект, видео и практика.",
      en: "Each chapter includes notes, video, and practice.",
    },
    chapters: [
      {
        title: { uz: "1-bob: Tezlik va masofa", ru: "Глава 1: Скорость и расстояние", en: "Chapter 1: Speed and Distance" },
        summary: {
          uz: "Asosiy formulalar, kundalik misollar va mini savollar.",
          ru: "Основные формулы, бытовые примеры и мини-вопросы.",
          en: "Core formulas, real-life examples, and mini questions.",
        },
        practiceUrl: "https://www.khanacademy.org/science/physics/one-dimensional-motion",
        videoUrl: "https://www.youtube.com/embed/ZM8ECpBuQYE",
      },
      {
        title: { uz: "2-bob: Nyuton qonunlari", ru: "Глава 2: Законы Ньютона", en: "Chapter 2: Newton's Laws" },
        summary: {
          uz: "Har bir qonun uchun vizual misollar va test.",
          ru: "Визуальные примеры и тест для каждого закона.",
          en: "Visual examples and a test for each law.",
        },
        practiceUrl: "https://www.khanacademy.org/science/physics/forces-newtons-laws",
        videoUrl: "https://www.youtube.com/embed/kKKM8Y-u7ds",
      },
    ],
  },
  {
    id: "math-algebra-book",
    subjectId: "math",
    color: "math",
    title: { uz: "Algebra: Tenglamalar va funksiyalar", ru: "Алгебра: Уравнения и функции", en: "Algebra: Equations and Functions" },
    coverNote: {
      uz: "Interaktiv boblar bilan algebra kursi.",
      ru: "Курс алгебры с интерактивными главами.",
      en: "An algebra course with interactive chapters.",
    },
    chapters: [
      {
        title: { uz: "1-bob: Chiziqli tenglamalar", ru: "Глава 1: Линейные уравнения", en: "Chapter 1: Linear Equations" },
        summary: {
          uz: "Masalalarni bosqichma-bosqich yechish.",
          ru: "Пошаговое решение задач.",
          en: "Step-by-step problem solving.",
        },
        practiceUrl: "https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:linear-equations",
        videoUrl: "https://www.youtube.com/embed/9Ek61w1LxSc",
      },
      {
        title: { uz: "2-bob: Funksiya grafiklari", ru: "Глава 2: Графики функций", en: "Chapter 2: Function Graphs" },
        summary: {
          uz: "Grafiklarni tahlil qilish va qurish.",
          ru: "Анализ и построение графиков.",
          en: "Analyze and draw graphs.",
        },
        practiceUrl: "https://www.desmos.com/calculator",
        videoUrl: "https://www.youtube.com/embed/2AQKmw14mHM",
      },
    ],
  },
  {
    id: "chem-basics-book",
    subjectId: "chem",
    color: "chem",
    title: { uz: "Kimyo: Atomdan reaksiyagacha", ru: "Химия: От атома к реакции", en: "Chemistry: From Atoms to Reactions" },
    coverNote: {
      uz: "Modellar va mashqlar bilan boyitilgan qo'llanma.",
      ru: "Пособие с моделями и упражнениями.",
      en: "A guide enriched with models and exercises.",
    },
    chapters: [
      {
        title: { uz: "1-bob: Atom tuzilishi", ru: "Глава 1: Строение атома", en: "Chapter 1: Atomic Structure" },
        summary: {
          uz: "Elektronlar, protonlar va neytronlar rolini o'rganing.",
          ru: "Изучите роль электронов, протонов и нейтронов.",
          en: "Learn the role of electrons, protons, and neutrons.",
        },
        practiceUrl: "https://www.khanacademy.org/science/chemistry/atomic-structure-and-properties",
        videoUrl: "https://www.youtube.com/embed/FSyAehMdpyI",
      },
    ],
  },
];

export const gameItems: GameItem[] = [
  {
    id: "quizizz-science",
    subjectId: "physics",
    color: "physics",
    difficulty: "medium",
    title: { uz: "Fizika Quiz Battle", ru: "Physics Quiz Battle", en: "Physics Quiz Battle" },
    description: {
      uz: "Quizizz orqali tezkor fizika viktorinalari.",
      ru: "Быстрые викторины по физике через Quizizz.",
      en: "Fast physics quizzes powered by Quizizz.",
    },
    provider: "Quizizz",
    url: "https://quizizz.com/admin/search/physics",
  },
  {
    id: "math-playground",
    subjectId: "math",
    color: "math",
    difficulty: "easy",
    title: { uz: "Math Race Arena", ru: "Math Race Arena", en: "Math Race Arena" },
    description: {
      uz: "Math Playground saytidan tezkor mantiq va matematika o'yinlari.",
      ru: "Быстрые игры на логику и математику с Math Playground.",
      en: "Quick math and logic games from Math Playground.",
    },
    provider: "Math Playground",
    url: "https://www.mathplayground.com/",
  },
  {
    id: "chem-quiz",
    subjectId: "chem",
    color: "chem",
    difficulty: "medium",
    title: { uz: "Chemistry Builder Challenge", ru: "Chemistry Builder Challenge", en: "Chemistry Builder Challenge" },
    description: {
      uz: "Molekula va elementlar bo'yicha quiz va challenge'lar.",
      ru: "Викторины и челленджи по молекулам и элементам.",
      en: "Quizzes and challenges about molecules and elements.",
    },
    provider: "PurposeGames",
    url: "https://www.purposegames.com/search?query=chemistry",
  },
  {
    id: "bio-memory",
    subjectId: "bio",
    color: "bio",
    difficulty: "easy",
    title: { uz: "Bio Memory Grid", ru: "Bio Memory Grid", en: "Bio Memory Grid" },
    description: {
      uz: "Biologiya terminlarini yodlash uchun kartochkalar.",
      ru: "Карточки для запоминания терминов по биологии.",
      en: "Flashcard-style biology memory games.",
    },
    provider: "Wordwall",
    url: "https://wordwall.net/en-us/community/biology",
  },
  {
    id: "geo-map",
    subjectId: "geo",
    color: "cs",
    difficulty: "medium",
    title: { uz: "Map Explorer", ru: "Map Explorer", en: "Map Explorer" },
    description: {
      uz: "Xaritalar va davlatlar bo'yicha interaktiv o'yinlar.",
      ru: "Интерактивные игры по картам и странам.",
      en: "Interactive map and country games.",
    },
    provider: "Seterra",
    url: "https://www.seterra.com/",
  },
  {
    id: "lang-vocab",
    subjectId: "lang",
    color: "lang",
    difficulty: "easy",
    title: { uz: "Vocabulary Sprint", ru: "Vocabulary Sprint", en: "Vocabulary Sprint" },
    description: {
      uz: "So'z boyligini kengaytiruvchi mini-o'yinlar.",
      ru: "Мини-игры для расширения словарного запаса.",
      en: "Mini games for building vocabulary.",
    },
    provider: "Baamboozle",
    url: "https://www.baamboozle.com/games?search=english",
  },
];

export const dashboardWeeklyProgress = [
  { name: "Mon", completed: 3, target: 4 },
  { name: "Tue", completed: 4, target: 4 },
  { name: "Wed", completed: 2, target: 4 },
  { name: "Thu", completed: 5, target: 4 },
  { name: "Fri", completed: 4, target: 4 },
  { name: "Sat", completed: 3, target: 3 },
  { name: "Sun", completed: 2, target: 2 },
];

export const dashboardSubjectProgress = subjects.map((subject) => ({
  id: subject.id,
  progress: subject.progress,
  lessons: subject.heroStat,
}));

export const activityData: ActivityCell[] = [
  0, 1, 3, 2, 0, 4, 1, 2, 0, 3, 2, 1, 4, 0, 2, 1, 3, 0, 2, 4, 1, 0, 3, 2, 4, 1, 0, 2,
  3, 1, 2, 0, 4, 1, 2, 3, 0, 1, 2, 4, 0, 3, 1, 2, 0, 4, 1, 3, 2, 1, 0, 2, 4, 1, 3, 2,
  0, 1, 4, 2, 3, 0, 1, 2, 4, 1, 3, 0, 2, 1, 4, 3, 2, 0, 1, 2, 4, 0, 3, 1,
].map((level, index) => ({
  date: new Date(2026, 0, index + 1).toISOString(),
  level: level as 0 | 1 | 2 | 3 | 4,
}));

export function getSubjectById(subjectId?: string) {
  return subjects.find((subject) => subject.id === subjectId);
}
