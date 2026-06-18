/**
 * ============================================================
 *  TechHub · 技术资源库 — 占位数据文件
 *  所有内容均为占位符，方便后续替换为真实数据。
 * ============================================================
 */

const SITE_CONFIG = {
  title: 'TraceDev',
  slogan: '你的专属技术资源库',
  description: '嵌入式开发 / 单片机 / Linux 等技术教程与资源分享平台',
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
    title: '视频教程占位符 - 01',
    description: '这是一个视频教程的占位符描述，后续替换为真实视频标题和简介。',
    thumbnail: '',
    duration: '45:30',
    date: '2024-01',
    bvid: 'BV1xxxxxxxx',
    published: false,
  },
  {
    id: 'vid-002',
    title: '视频教程占位符 - 02',
    description: '这是一个视频教程的占位符描述，涵盖从入门到进阶的核心知识点。',
    thumbnail: '',
    duration: '52:15',
    date: '2024-02',
    bvid: 'BV2xxxxxxxx',
    published: false,
  },
  {
    id: 'vid-003',
    title: '视频教程占位符 - 03',
    description: '这是一个视频教程的占位符描述，包含大量实战案例演示。',
    thumbnail: '',
    duration: '38:00',
    date: '2024-03',
    bvid: 'BV3xxxxxxxx',
    published: false,
  },
  {
    id: 'vid-004',
    title: '视频教程占位符 - 04',
    description: '这是一个视频教程的占位符描述，深入讲解底层原理与实现。',
    thumbnail: '',
    duration: '60:20',
    date: '2024-03',
    bvid: 'BV4xxxxxxxx',
    published: false,
  },
  {
    id: 'vid-005',
    title: '视频教程占位符 - 05',
    description: '这是一个视频教程的占位符描述，配套资源与代码同步更新。',
    thumbnail: '',
    duration: '41:10',
    date: '2024-04',
    bvid: 'BV5xxxxxxxx',
    published: false,
  },
  {
    id: 'vid-006',
    title: '视频教程占位符 - 06',
    description: '这是一个视频教程的占位符描述，适合有一定基础的同学进阶学习。',
    thumbnail: '',
    duration: '55:45',
    date: '2024-04',
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
    name: '资源名称占位符 - STM32',
    description:
      '这是一个STM32相关资源的占位符描述。该资源包含了详细的技术教程与相关工具。',
    updatedAt: '2024-01-15',
    category: 'stm32',
    link: 'https://pan.baidu.com/s/xxxxxxxxxxxxxxxxxxxx',
    extractCode: 'abcd',
    password: 'techhub2024',
    published: false,
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
    question: '这是一个常见问题的占位符标题？',
    answer:
      '这是一个回答占位符。请替换为真实的问题解答内容。这里可以包含详细的文字说明、代码片段或注意事项。',
  },
  {
    id: 'faq-002',
    question: '这是一个常见问题的占位符标题 — 第二问？',
    answer:
      '这是一个回答占位符。替换为真实内容时，可以在这里添加多行文字描述，包括步骤说明、注意事项和相关链接。',
  },
  {
    id: 'faq-003',
    question: '下载的资源文件解压密码是多少？',
    answer:
      '这是一个占位符回答。请替换为真实的解压密码说明。通常解压密码会在资源描述中注明，如果没有请检查下载页面的说明。',
  },
  {
    id: 'faq-004',
    question: '视频教程中使用的开发板在哪里购买？',
    answer:
      '这是一个占位符回答。请替换为真实的购买渠道说明。可以在这里指向咸鱼店铺或淘宝店铺的商品链接。',
  },
  {
    id: 'faq-005',
    question: '遇到问题如何联系作者获得帮助？',
    answer:
      '这是一个占位符回答。请替换为真实的联系方式，如邮箱、B站私信、QQ群等，以及平均回复时间说明。',
  },
];

/** ============================================================
 *  👤 关于作者 — profile data
 * ============================================================ */
const AUTHOR = {
  name: 'TraceDev',
  tagline: '嵌入式工程师 / 全栈开发者 / 技术分享者',
  avatar: '',
  bio: '一名热爱技术与分享的嵌入式工程师。多年嵌入式开发经验，专注于STM32、Linux、RTOS等领域。希望通过清晰易懂的教程和高质量的资源，帮助更多技术爱好者少走弯路。',
  links: [
    { label: 'B站', icon: 'fa-brands fa-bilibili', url: 'https://space.bilibili.com/514682107' },
    { label: '抖音', icon: 'fa-brands fa-tiktok', url: 'https://www.douyin.com/user/self?from_tab_name=main' },
    { label: 'GitHub', icon: 'fa-brands fa-github', url: '#' },
    { label: '邮箱', icon: 'fa-solid fa-envelope', url: 'mailto:3318234704@qq.com' },
  ],
  skills: [
    { name: 'STM32 / 嵌入式', level: 90 },
    { name: 'Linux / RTOS', level: 85 },
    { name: 'PCB 设计', level: 75 },
    { name: '全栈开发', level: 70 },
  ],
};
