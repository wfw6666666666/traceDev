/**
 * ============================================================
 *  TechHub · 技术资源库 — 占位数据文件
 *  所有内容均为占位符，方便后续替换为真实数据。
 * ============================================================
 */

const SITE_CONFIG = {
  title: 'TraceDev',
  slogan: '你的专属技术资源库',
  description: '嵌入式开发 / 单片机 / STM32 等技术教程与资源分享平台',
  copyright: '© 2026 TraceDev. All rights reserved.',
  备案号: '鄂ICP备2024XXXXXXXX号-X',
  email: '3318234704@qq.com',
};

/** ============================================================
 *  📺 教学视频 — video cards data
 * ============================================================ */
const VIDEOS = [
  {
    id: 'vid-001',
    title: 'STM32入门到实战：从点亮LED到WiFi通信',
    description: '零基础STM32教学，涵盖GPIO、定时器、串口通信、I2C/SPI协议以及WiFi模块实战。',
    thumbnail: 'assets/thumb-stm32.jpg',
    duration: '45:30',
    date: '2025-06',
    bvid: 'BV1xxxxxxxx',
    published: true,
  },
  {
    id: 'vid-002',
    title: 'MSPM0 电赛专题：TI板卡快速上手',
    description: '针对大学生电子设计竞赛，快速掌握 MSPM0 系列板卡的使用技巧和常见题型。',
    thumbnail: 'assets/thumb-mspm0.jpg',
    duration: '52:15',
    date: '2025-05',
    bvid: 'BV2xxxxxxxx',
    published: true,
  },
  {
    id: 'vid-003',
    title: '立创EDA PCB设计：从原理图到打样',
    description: '手把手教你用立创EDA画原理图、布局布线、导出Gerber文件并下单打样。',
    thumbnail: 'assets/thumb-pcb.jpg',
    duration: '38:00',
    date: '2025-07',
    bvid: 'BV3xxxxxxxx',
    published: true,
  },
  {
    id: 'vid-004',
    title: 'FreeRTOS 实时操作系统实战',
    description: '深入讲解 FreeRTOS 任务调度、消息队列、信号量和内存管理。',
    thumbnail: '',
    duration: '60:20',
    date: '即将上线',
    bvid: 'BV4xxxxxxxx',
    published: false,
  },
  {
    id: 'vid-005',
    title: 'ESP32 + MQTT 物联网入门',
    description: '使用 ESP32 连接 MQTT 服务器，实现远程数据采集和控制的完整项目。',
    thumbnail: '',
    duration: '41:10',
    date: '即将上线',
    bvid: 'BV5xxxxxxxx',
    published: false,
  },
  {
    id: 'vid-006',
    title: '平衡小车：从PID控制到姿态解算',
    description: '基于 STM32 的平衡小车项目，涵盖 MPU6050 姿态解算和 PID 控制算法。',
    thumbnail: '',
    duration: '55:45',
    date: '即将上线',
    bvid: 'BV6xxxxxxxx',
    published: false,
  },
];

const GOOFISH_URL = 'https://www.goofish.com/item?spm=a21ybx.search.searchFeedList.1.383d43886AAToC&id=955434282463&categoryId=126856501';

/** ============================================================
 *  🏪 咸鱼店铺 — product cards data
 * ============================================================ */
const PRODUCTS = [
  {
    id: 'prd-001',
    name: '[电赛专用] TI板卡MSPM0拓展板',
    description: '全新双面板，带12V/5V/3.3V电源，电机驱动、编码器、循迹模块、按键接口齐全。另有蓝牙、摄像头、串口屏、MPU6050角度传感器、OLED显示屏、维特陀螺仪、超声波模块等。单片机引出拓展排针。',
    price: '¥4 包邮',
    image: 'assets/product.jpg',
    link: 'https://www.goofish.com/item?spm=a21ybx.search.searchFeedList.1.383d43886AAToC&id=955434282463&categoryId=126856501',
  },
];

/** ============================================================
 *  📦 资料下载 — resource cards data
 * ============================================================ */
const RESOURCES = [
  {
    id: 'res-000',
    name: '📱 桂工课表 - 桂林理工大学课表APP',
    description:
      '一款专为桂林理工大学师生设计的课表管理手机应用，支持课程表查看、周次切换、自定义编辑等功能。直接下载APK安装包，无需提取码。',
    updatedAt: '2024-06-18',
    category: '手机app',
    type: 'apk',
    fileName: '桂工课表.apk',
    published: true,
  },
  {
    id: 'res-001',
    name: '大三上 WiFi互联 - STM32双机WiFi通信温湿度监测',
    description:
      '两个STM32单片机通过WiFi模块通信，传输温湿度数据并在LCD屏上显示。参考正点原子代码实现，包含完整工程文件与源码。',
    updatedAt: '2024-06-20',
    category: 'stm32',
    link: 'https://pan.baidu.com/s/1m7ZmIANnUGznzURUGeS_Fg',
    extractCode: '6666',
    password: '',
    published: true,
  },
  {
    id: 'res-002',
    name: '资源名称占位符 - STM32进阶',
    description:
      '这是一个STM32相关资源的占位符描述。涵盖了从入门到进阶的全系列资料。',
    updatedAt: '2024-01-20',
    category: 'stm32',
    link: 'https://pan.baidu.com/s/yyyyyyyyyyyyyyyyyyyy',
    extractCode: 'efgh',
    password: 'techhub2024',
    published: false,
  },
  {
    id: 'res-002b',
    name: '资源名称占位符 - STM32进阶',
    description:
      '这是一个STM32相关资源的占位符描述。涵盖了从入门到进阶的全系列资料。',
    updatedAt: '2024-01-20',
    category: 'stm32',
    link: 'https://pan.baidu.com/s/yyyyyyyyyyyyyyyyyyyy',
    extractCode: 'efgh',
    password: 'techhub2024',
    published: false,
  },
  {
    id: 'res-003',
    name: '资源名称占位符 - Arduino',
    description:
      '这是一个Arduino相关资源的占位符描述。内含大量实战项目源码与文档。',
    updatedAt: '2024-02-01',
    category: 'arduino',
    link: 'https://pan.baidu.com/s/zzzzzzzzzzzzzzzzzzzz',
    extractCode: 'ijkl',
    password: 'techhub2024',
    published: false,
  },
  {
    id: 'res-004',
    name: '资源名称占位符 - Arduino进阶',
    description:
      '这是一个Arduino相关资源的占位符描述。包含最新版开发工具与环境配置教程。',
    updatedAt: '2024-02-10',
    category: 'arduino',
    link: 'https://pan.baidu.com/s/aaaaaaaaaaaaaaaaaaaa',
    extractCode: 'mnop',
    password: 'techhub2024',
    published: false,
  },
  {
    id: 'res-005',
    name: 'ProPrj_M0平衡小车_2025-05-04.epro',
    description:
      'M0平衡小车工程文件，基于STM32的平衡小车项目。包含完整的工程文件、原理图和PCB设计。',
    updatedAt: '2025-05-04',
    category: 'pcb',
    link: 'https://pan.baidu.com/s/1QS_Yk-nBuz8pmpxU7YLsqQ',
    extractCode: '6666',
    password: '',
    published: true,
  },
  {
    id: 'res-006',
    name: '蛇年纪念PCB - Gerber_snake_2025-03-26.zip',
    description:
      '蛇年纪念PCB的Gerber生产文件，蛇形走线主题装饰板，可直接发板厂打样。',
    updatedAt: '2025-03-26',
    category: 'pcb',
    link: 'https://pan.baidu.com/s/1BEeQTnVwQnBew_Q-S_PnhQ',
    extractCode: '6666',
    password: '',
    published: true,
  },
  {
    id: 'res-007',
    name: 'ProPrj_M0平衡小车_2025-05-04.epro',
    description:
      'M0平衡小车工程文件（备选链接），基于STM32的平衡小车项目。包含完整的工程文件、原理图和PCB设计。',
    updatedAt: '2025-05-04',
    category: 'pcb',
    link: 'https://pan.baidu.com/s/1EkSv72xxlQ1RXe3nXvZygg',
    extractCode: '6666',
    password: '',
    published: true,
  },
  {
    id: 'res-008',
    name: 'Gerber_只能打_2025-01-21.zip',
    description:
      'PCB生产Gerber文件，已通过验证可直接发板厂打样生产。',
    updatedAt: '2025-01-21',
    category: 'pcb',
    link: 'https://pan.baidu.com/s/1IfxbwhgQ6Nh2C4DlvnkzYQ',
    extractCode: '6666',
    password: '',
    published: true,
  },
];

/** ============================================================
 *  ❓ 疑难解答 — FAQ data
 * ============================================================ */
const FAQS = [
  {
    id: 'faq-001',
    question: '百度网盘链接失效了怎么办？',
    answer:
      '百度网盘链接有时会被屏蔽。如果发现链接失效，请在 B 站私信或发送邮件到 3318234704@qq.com，说明具体哪个资源链接失效，我看到后会尽快补链。建议先尝试复制完整链接（含提取码）在百度网盘 App 内打开。',
  },
  {
    id: 'faq-002',
    question: 'STM32 开发环境怎么搭建？',
    answer:
      '推荐使用 STM32CubeIDE（免费）或 Keil MDK。本网站的教程视频中会包含完整的环境搭建步骤。如果你是初学者，可以先安装 STM32CubeIDE — 它集成了 CubeMX 配置工具和 GCC 编译器，一键安装即可开始开发。',
  },
  {
    id: 'faq-003',
    question: '下载的 ZIP 文件解压密码是多少？',
    answer:
      '大部分资源无需解压密码。如果某个资源需要密码，会在下载弹窗的"解压密码"栏中明确标注。如果没有显示解压密码，说明该资源没有加密，直接解压即可。',
  },
  {
    id: 'faq-004',
    question: '分享的开发板/模块在哪儿购买？',
    answer:
      '视频中使用的开发板和模块大多可以在"咸鱼店铺"标签页找到，价格比淘宝实惠。如果店铺里没有你需要的板子，可以在 B 站私信询问，部分板子没有上架但有库存。',
  },
  {
    id: 'faq-005',
    question: '教程视频什么时候更新？',
    answer:
      '教程视频正在陆续录制中，更新频率取决于内容难度和我的课余时间。建议关注 B 站「TraceDev」并开启更新提醒，新视频上线后会第一时间通知。特定主题的教程需求也可以在 B 站私信告诉我。',
  },
  {
    id: 'faq-006',
    question: '桂工课表 APP 如何安装？',
    answer:
      '在"资料下载"标签页找到"桂工课表"，点击"直接下载"即可获取 APK 安装包。下载后需要在手机设置中允许"安装未知来源应用"，然后点击 APK 文件安装。仅支持 Android 系统。',
  },
];

/** ============================================================
 *  👤 关于作者 — profile data
 * ============================================================ */
const AUTHOR = {
  name: 'TraceDev',
  tagline: '嵌入式工程师 / 全栈开发者 / 技术分享者',
  avatar: '',
  bio: '一名热爱技术与分享的嵌入式工程师。多年嵌入式开发经验，专注于STM32、RTOS、PCB设计等领域。希望通过清晰易懂的教程和高质量的资源，帮助更多技术爱好者少走弯路。',
  links: [
    { label: 'B站', icon: 'fa-brands fa-bilibili', url: 'https://space.bilibili.com/514682107' },
    { label: '抖音', icon: 'fa-brands fa-tiktok', url: 'https://www.douyin.com/user/self?from_tab_name=main' },
    { label: 'GitHub', icon: 'fa-brands fa-github', url: '#' },
    { label: '邮箱', icon: 'fa-solid fa-envelope', url: 'mailto:3318234704@qq.com' },
  ],
  skills: [
    { name: 'STM32 / 嵌入式', level: 90 },
    { name: 'RTOS / 驱动开发', level: 80 },
    { name: 'PCB 设计', level: 75 },
    { name: '全栈开发', level: 70 },
  ],
};

// Bundled content translations. Missing fields intentionally fall back to Simplified Chinese.
const CONTENT_TRANSLATIONS = {
  'vid-001': {
    'zh-TW': { title: 'STM32 入門到實戰：從點亮 LED 到 WiFi 通訊', description: '零基礎 STM32 教學，涵蓋 GPIO、計時器、序列通訊、I2C/SPI 協定與 WiFi 模組實作。' },
    en: { title: 'STM32 from Basics to Practice: LED to WiFi', description: 'A beginner STM32 course covering GPIO, timers, serial communication, I2C/SPI and a WiFi module project.' },
    ja: { title: 'STM32 入門から実践：LED 点灯から WiFi 通信まで', description: 'GPIO、タイマー、シリアル通信、I2C/SPI、WiFi モジュールを扱う初心者向け STM32 講座です。' },
    ko: { title: 'STM32 입문부터 실전까지: LED에서 WiFi 통신까지', description: 'GPIO, 타이머, 시리얼 통신, I2C/SPI와 WiFi 모듈 실습을 다루는 초급 STM32 강좌입니다.' },
  },
  'vid-002': {
    'zh-TW': { title: 'MSPM0 電賽專題：TI 板卡快速上手', description: '面向大學生電子設計競賽，快速掌握 MSPM0 系列板卡與常見題型。' },
    en: { title: 'MSPM0 Competition Guide: Get Started with TI Boards', description: 'A fast introduction to MSPM0 boards and common university electronics competition tasks.' },
    ja: { title: 'MSPM0 電子設計競技：TI ボード入門', description: '大学生電子設計競技向けに MSPM0 ボードの使い方と代表的な課題を解説します。' },
    ko: { title: 'MSPM0 전자설계대회: TI 보드 빠른 시작', description: '대학생 전자설계대회를 위한 MSPM0 보드 사용법과 대표 문제를 빠르게 익힙니다.' },
  },
  'vid-003': {
    'zh-TW': { title: '立創 EDA PCB 設計：從原理圖到打樣', description: '逐步完成原理圖、佈局佈線、Gerber 匯出與 PCB 打樣下單。' },
    en: { title: 'LCEDA PCB Design: Schematic to Fabrication', description: 'Create schematics, route a PCB, export Gerber files and place a fabrication order step by step.' },
    ja: { title: 'LCEDA PCB 設計：回路図から試作まで', description: '回路図、配置配線、Gerber 出力、基板発注までを順番に解説します。' },
    ko: { title: 'LCEDA PCB 설계: 회로도에서 제작까지', description: '회로도 작성, 배치와 배선, Gerber 출력, PCB 주문 과정을 단계별로 설명합니다.' },
  },
  'prd-001': {
    'zh-TW': { name: '[電賽專用] TI MSPM0 擴充板', description: '全新雙面板，整合 12V/5V/3.3V 電源、馬達驅動、編碼器、循跡與按鍵介面，並支援多種常用模組。' },
    en: { name: '[Competition] TI MSPM0 Expansion Board', description: 'A new two-layer board with 12V/5V/3.3V power, motor, encoder, tracking and button interfaces plus support for common modules.' },
    ja: { name: '［競技向け］TI MSPM0 拡張ボード', description: '12V/5V/3.3V 電源、モーター、エンコーダー、ライントレース、ボタン端子を備えた両面基板です。' },
    ko: { name: '[대회용] TI MSPM0 확장 보드', description: '12V/5V/3.3V 전원, 모터, 엔코더, 라인트레이싱, 버튼 인터페이스와 다양한 모듈을 지원하는 양면 보드입니다.' },
  },
  'res-000': {
    'zh-TW': { name: '📱 桂工課表 - 桂林理工大學課表 APP', description: '為桂林理工大學師生設計的課表管理應用，支援課表查看、週次切換與自訂編輯。可直接下載 APK。', category: '手機 APP' },
    en: { name: '📱 GLUT Timetable App', description: 'A timetable manager for Guilin University of Technology with weekly views, week switching and custom editing. APK download included.', category: 'Mobile app' },
    ja: { name: '📱 桂林理工大学 時間割アプリ', description: '時間割表示、週切替、カスタム編集に対応した桂林理工大学向けアプリです。APK を直接ダウンロードできます。', category: 'モバイルアプリ' },
    ko: { name: '📱 구이린공과대 시간표 앱', description: '시간표 보기, 주차 전환, 사용자 편집을 지원하는 구이린공과대 전용 앱입니다. APK를 바로 받을 수 있습니다.', category: '모바일 앱' },
  },
  'res-001': {
    'zh-TW': { name: '大三上 WiFi 互聯 - STM32 雙機溫濕度監測', description: '兩塊 STM32 透過 WiFi 傳輸溫濕度資料並在 LCD 顯示，含完整工程與原始碼。', category: 'STM32' },
    en: { name: 'STM32 Dual-Board WiFi Temperature & Humidity Monitor', description: 'Two STM32 boards exchange sensor data over WiFi and display it on an LCD. Full project files and source are included.', category: 'STM32' },
    ja: { name: 'STM32 2台 WiFi 温湿度モニター', description: '2台の STM32 が WiFi で温湿度データを交換し LCD に表示します。完全なプロジェクトとソース付きです。', category: 'STM32' },
    ko: { name: 'STM32 듀얼 보드 WiFi 온습도 모니터', description: '두 STM32가 WiFi로 온습도 데이터를 전송하고 LCD에 표시합니다. 전체 프로젝트와 소스가 포함됩니다.', category: 'STM32' },
  },
  'res-005': {
    'zh-TW': { name: 'ProPrj_M0 平衡小車_2025-05-04.epro', description: '基於 STM32 的 M0 平衡小車工程，含完整工程、原理圖與 PCB 設計。', category: 'PCB' },
    en: { name: 'ProPrj_M0 Balancing Car_2025-05-04.epro', description: 'An STM32 M0 balancing-car project with complete project files, schematics and PCB design.', category: 'PCB' },
    ja: { name: 'ProPrj_M0 倒立振子カー_2025-05-04.epro', description: 'STM32 ベースの M0 倒立振子カー。プロジェクト、回路図、PCB 設計を収録しています。', category: 'PCB' },
    ko: { name: 'ProPrj_M0 밸런싱 카_2025-05-04.epro', description: 'STM32 기반 M0 밸런싱 카 프로젝트로 전체 프로젝트, 회로도와 PCB 설계를 포함합니다.', category: 'PCB' },
  },
  'res-006': {
    'zh-TW': { name: '蛇年紀念 PCB - Gerber_snake_2025-03-26.zip', description: '蛇形走線主題裝飾板的 Gerber 生產檔，可直接送板廠打樣。', category: 'PCB' },
    en: { name: 'Year of the Snake PCB - Gerber Files', description: 'Fabrication-ready Gerber files for a decorative snake-trace PCB.', category: 'PCB' },
    ja: { name: '巳年記念 PCB - Gerber ファイル', description: '蛇形配線を使った装飾 PCB の製造用 Gerber ファイルです。', category: 'PCB' },
    ko: { name: '뱀의 해 기념 PCB - Gerber 파일', description: '뱀 모양 배선을 사용한 장식 PCB의 제작용 Gerber 파일입니다.', category: 'PCB' },
  },
  'res-007': {
    'zh-TW': { name: 'ProPrj_M0 平衡小車_2025-05-04.epro（備用）', description: 'M0 平衡小車工程備用連結，含完整工程、原理圖與 PCB 設計。', category: 'PCB' },
    en: { name: 'ProPrj_M0 Balancing Car (Mirror)', description: 'Mirror download for the STM32 M0 balancing-car project, including schematics and PCB design.', category: 'PCB' },
    ja: { name: 'ProPrj_M0 倒立振子カー（予備リンク）', description: '回路図と PCB 設計を含む M0 倒立振子カープロジェクトの予備リンクです。', category: 'PCB' },
    ko: { name: 'ProPrj_M0 밸런싱 카 (대체 링크)', description: '회로도와 PCB 설계를 포함한 M0 밸런싱 카 프로젝트의 대체 다운로드입니다.', category: 'PCB' },
  },
  'res-008': {
    'zh-TW': { name: 'Gerber_只能打_2025-01-21.zip', description: '已驗證可直接送板廠生產的 PCB Gerber 檔案。', category: 'PCB' },
    en: { name: 'Verified PCB Gerber_2025-01-21.zip', description: 'Verified PCB Gerber files ready for direct fabrication.', category: 'PCB' },
    ja: { name: '検証済み PCB Gerber_2025-01-21.zip', description: '基板工場へそのまま入稿できる検証済み Gerber ファイルです。', category: 'PCB' },
    ko: { name: '검증된 PCB Gerber_2025-01-21.zip', description: 'PCB 제작 업체에 바로 전달할 수 있는 검증된 Gerber 파일입니다.', category: 'PCB' },
  },
};

const FAQ_TRANSLATIONS = [
  {
    'zh-TW': ['百度網盤連結失效怎麼辦？', '若連結失效，請透過 B 站私訊或郵件告知具體資源，我會盡快補上新連結。也可先嘗試在百度網盤 App 中開啟完整連結。'],
    en: ['What if a Baidu Netdisk link expires?', 'Send the resource name by Bilibili message or email and I will replace the link. You can also try opening the full link in the Baidu Netdisk app.'],
    ja: ['Baidu Netdisk のリンクが切れた場合は？', '対象リソース名を Bilibili のメッセージまたはメールで知らせてください。確認後リンクを更新します。'],
    ko: ['Baidu Netdisk 링크가 만료되면 어떻게 하나요?', 'Bilibili 메시지나 이메일로 자료 이름을 알려주시면 링크를 갱신하겠습니다.'],
  },
  {
    'zh-TW': ['如何搭建 STM32 開發環境？', '推薦 STM32CubeIDE（免費）或 Keil MDK。初學者可先使用整合 CubeMX 與 GCC 的 STM32CubeIDE。'],
    en: ['How do I set up an STM32 development environment?', 'Use STM32CubeIDE (free) or Keil MDK. Beginners can start with STM32CubeIDE, which bundles CubeMX and GCC.'],
    ja: ['STM32 開発環境の構築方法は？', 'STM32CubeIDE（無料）または Keil MDK を推奨します。初心者には CubeMX と GCC を統合した STM32CubeIDE が便利です。'],
    ko: ['STM32 개발 환경은 어떻게 구성하나요?', 'STM32CubeIDE(무료) 또는 Keil MDK를 권장합니다. 초보자는 CubeMX와 GCC가 포함된 STM32CubeIDE로 시작하세요.'],
  },
  {
    'zh-TW': ['ZIP 檔案的解壓密碼是什麼？', '大部分資源不需要密碼。若有密碼，下載視窗會清楚顯示；未顯示即代表可直接解壓。'],
    en: ['What is the ZIP archive password?', 'Most files do not need one. If required, it is shown in the download dialog; otherwise extract the archive directly.'],
    ja: ['ZIP ファイルの解凍パスワードは？', '多くのリソースはパスワード不要です。必要な場合のみダウンロード画面に表示されます。'],
    ko: ['ZIP 압축 비밀번호는 무엇인가요?', '대부분 비밀번호가 필요 없습니다. 필요한 경우 다운로드 창에 표시됩니다.'],
  },
  {
    'zh-TW': ['分享的開發板或模組在哪裡購買？', '影片中的開發板與模組多數可在「閒魚店鋪」找到；未上架的商品可透過 B 站私訊詢問。'],
    en: ['Where can I buy the boards and modules?', 'Most items used in the videos are listed in the Shop tab. Message me on Bilibili about unlisted stock.'],
    ja: ['紹介した開発ボードやモジュールはどこで買えますか？', '動画で使用した多くの商品はショップに掲載しています。未掲載品は Bilibili でお問い合わせください。'],
    ko: ['소개한 개발 보드와 모듈은 어디서 구매하나요?', '영상에 사용된 대부분의 제품은 스토어 탭에 있습니다. 미등록 재고는 Bilibili로 문의하세요.'],
  },
  {
    'zh-TW': ['教學影片何時更新？', '影片會依內容難度與課餘時間陸續更新。建議關注 B 站 TraceDev 並開啟更新提醒。'],
    en: ['When are tutorials updated?', 'Videos are released as recording time allows. Follow TraceDev on Bilibili and enable notifications for new releases.'],
    ja: ['チュートリアル動画はいつ更新されますか？', '内容と制作時間に応じて順次公開します。Bilibili の TraceDev をフォローして通知を有効にしてください。'],
    ko: ['튜토리얼 영상은 언제 업데이트되나요?', '제작 일정에 따라 순차적으로 공개합니다. Bilibili의 TraceDev를 팔로우하고 알림을 켜 주세요.'],
  },
  {
    'zh-TW': ['桂工課表 APP 如何安裝？', '在「資料下載」中下載 APK，並在 Android 設定中允許安裝未知來源應用後開啟檔案。'],
    en: ['How do I install the GLUT Timetable app?', 'Download the APK from Downloads, allow installation from unknown sources in Android settings, then open the file.'],
    ja: ['桂林理工大学時間割アプリのインストール方法は？', 'ダウンロードから APK を取得し、Android 設定で提供元不明アプリを許可してファイルを開きます。'],
    ko: ['구이린공과대 시간표 앱은 어떻게 설치하나요?', '다운로드에서 APK를 받은 뒤 Android 설정에서 알 수 없는 출처 설치를 허용하고 파일을 여세요.'],
  },
];

[...VIDEOS, ...PRODUCTS, ...RESOURCES].forEach((item) => {
  if (CONTENT_TRANSLATIONS[item.id]) item.translations = CONTENT_TRANSLATIONS[item.id];
});
FAQS.forEach((faq, index) => {
  const entry = FAQ_TRANSLATIONS[index];
  faq.translations = Object.fromEntries(Object.entries(entry).map(([locale, values]) => [locale, { question: values[0], answer: values[1] }]));
});
AUTHOR.translations = {
  'zh-TW': { tagline: '嵌入式工程師 / 全端開發者 / 技術分享者', bio: '熱愛技術與分享的嵌入式工程師，專注 STM32、RTOS、PCB 設計，希望用清楚的教學與高品質資源幫助更多開發者。' },
  en: { tagline: 'Embedded Engineer / Full-stack Developer / Educator', bio: 'An embedded engineer focused on STM32, RTOS and PCB design, sharing clear tutorials and practical resources to help developers learn faster.' },
  ja: { tagline: '組み込みエンジニア / フルスタック開発者 / 技術発信者', bio: 'STM32、RTOS、PCB 設計を中心に、分かりやすい講座と実用的な資料を共有する組み込みエンジニアです。' },
  ko: { tagline: '임베디드 엔지니어 / 풀스택 개발자 / 기술 크리에이터', bio: 'STM32, RTOS, PCB 설계를 중심으로 명확한 강좌와 실용 자료를 공유하는 임베디드 엔지니어입니다.' },
};
const authorLabelTranslations = [
  { 'zh-TW': 'B站', en: 'Bilibili', ja: 'Bilibili', ko: 'Bilibili' },
  { 'zh-TW': '抖音', en: 'Douyin', ja: 'Douyin', ko: 'Douyin' },
  { 'zh-TW': 'GitHub', en: 'GitHub', ja: 'GitHub', ko: 'GitHub' },
  { 'zh-TW': '信箱', en: 'Email', ja: 'メール', ko: '이메일' },
];
AUTHOR.links.forEach((link, index) => { link.translations = Object.fromEntries(Object.entries(authorLabelTranslations[index]).map(([locale, label]) => [locale, { label }])); });
const skillTranslations = [
  { 'zh-TW': 'STM32 / 嵌入式', en: 'STM32 / Embedded', ja: 'STM32 / 組み込み', ko: 'STM32 / 임베디드' },
  { 'zh-TW': 'RTOS / 驅動開發', en: 'RTOS / Driver Development', ja: 'RTOS / ドライバー開発', ko: 'RTOS / 드라이버 개발' },
  { 'zh-TW': 'PCB 設計', en: 'PCB Design', ja: 'PCB 設計', ko: 'PCB 설계' },
  { 'zh-TW': '全端開發', en: 'Full-stack Development', ja: 'フルスタック開発', ko: '풀스택 개발' },
];
AUTHOR.skills.forEach((skill, index) => { skill.translations = Object.fromEntries(Object.entries(skillTranslations[index]).map(([locale, name]) => [locale, { name }])); });
