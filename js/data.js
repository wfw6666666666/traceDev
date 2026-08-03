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
  copyright: '© 2024 TraceDev. All rights reserved.',
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
    thumbnail: '',
    duration: '45:30',
    date: '2025-06',
    bvid: 'BV1xxxxxxxx',
    published: true,
  },
  {
    id: 'vid-002',
    title: 'MSPM0 电赛专题：TI板卡快速上手',
    description: '针对大学生电子设计竞赛，快速掌握 MSPM0 系列板卡的使用技巧和常见题型。',
    thumbnail: '',
    duration: '52:15',
    date: '2025-05',
    bvid: 'BV2xxxxxxxx',
    published: true,
  },
  {
    id: 'vid-003',
    title: '立创EDA PCB设计：从原理图到打样',
    description: '手把手教你用立创EDA画原理图、布局布线、导出Gerber文件并下单打样。',
    thumbnail: '',
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
