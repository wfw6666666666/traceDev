/**
 * TraceDev locale controller.
 * Static translations are bundled so GitHub Pages never needs a translation API.
 */
(function () {
  'use strict';

  const LOCALES = ['zh-CN', 'zh-TW', 'en', 'ja', 'ko'];
  const STORAGE_KEY = 'traceDevLocale';
  const DJANGO_LOCALES = { 'zh-CN': 'zh-hans', 'zh-TW': 'zh-hant', en: 'en', ja: 'ja', ko: 'ko' };
  const I18N = {
    'zh-CN': {
      language: { current: '简体中文', label: '语言', menu: '选择语言' },
      nav: { videos: '教学视频', downloads: '资料下载', store: '咸鱼店铺', journal: '学习日志', faq: '疑难解答', about: '关于作者' },
      shell: { shortcut: '快捷工具栏', categories: '资源分类导航', home: 'TraceDev 首页', workspace: '技术资源库', workspaceLabel: '我的工作区', menu: '菜单', search: '搜索资源、教程或关键词', searchResults: '搜索结果', online: '系统正常', synced: '内容已同步' },
      dashboard: { videosDescription: '嵌入式开发、单片机、STM32 等技术教程，从入门到进阶', viewResources: '查看全部资料', quickAccess: '快速入口', commonEntry: '常用入口', hardware: '开发板', recent: '最近更新', recentHint: '按最近发布的教程排序', videosCount: '个视频', activity: '最近动态', newVideo: '新增教学视频', libraryUpdated: '资料库已更新', productUpdated: '店铺商品上新', resourceStatus: '资源状态', organized: '已整理', storageHint: '视频、工程文件与学习笔记集中归档' },
      panel: { storeDescription: '开发板、模块、工具 — 物美价廉的学生福利', downloadsDescription: '源码工程、PCB 文件、学习资料 — 分类查找，快速下载', category: '分类筛选', journalDescription: '记录学习过程 · 分享技术心得 · 巩固知识体系', faqDescription: '资源下载、开发环境、课程学习 — 常见问题一站解答', aboutDescription: '一名热爱技术与分享的嵌入式工程师' },
      action: { skipContent: '跳到主要内容', backToTop: '回到顶部', downloadApk: '下载 APK', getDownload: '获取下载', copy: '复制', close: '关闭', cancel: '取消', delete: '删除', edit: '编辑', logout: '退出', login: '登录', save: '保存发布', newJournal: '新建日志', aiSettings: 'AI 设置', aiOrganize: 'AI 整理', all: '全部', expandAnswer: '展开答案', openExternal: '打开外部链接' },
      search: { empty: '没有找到匹配内容' },
      state: { preparingVideos: '教程筹备中', preparingVideosHint: '正在录制第一批嵌入式教学视频，涵盖 STM32、PCB、电源设计等方向，敬请期待', preparingProducts: '商品上架中', preparingProductsHint: '更多开发板、模块和工具即将上架咸鱼，敬请关注', noCategory: '暂无该类资源', noCategoryHint: '该分类下还没有资源，请查看其他分类或稍后再来', noJournal: '暂无学习日志', noJournalHint: '学习日志即将上线，记录嵌入式开发的学习历程' },
      modal: { resourceName: '资源名称', baiduLink: '百度网盘链接', extractCode: '提取码', unzipPassword: '解压密码', noPassword: '（无需解压密码）', adminLogin: '管理员登录', loginHint: '输入密码以管理学习日志', password: '密码', passwordPlaceholder: '请输入管理员密码', aiTitle: 'AI 设置', aiHint: '配置 DeepSeek API Key，AI 帮你整理排版学习笔记', editorNew: '新建学习日志', title: '标题 *', category: '分类', tags: '标签（逗号分隔）', content: '正文（支持 Markdown）', images: '图片', files: '附件', links: '参考链接（每行一个）', uploadImage: '支持 JPG/PNG/WebP', uploadFile: '支持 PDF/ZIP/DOC/XLS 等' },
      admin: { mode: '管理员模式 · 编辑后自动提交到 GitHub · ', aiKeyPlaceholder: 'sk-xxxxxxxxxxxxxxxxxxxx', titlePlaceholder: '例：反激变压器设计笔记', categoryPlaceholder: '例：电源设计', tagsPlaceholder: '例：变压器, 电源, 反激', contentPlaceholder: '在此撰写你的学习笔记...', linksPlaceholder: 'https://example.com/ref1' },
      footer: { filing: '备案号：', visitors: '访客', views: '访问量', rights: 'All rights reserved.' },
      status: { maintainer: '维护者', technicalFocus: '技术方向', common: '常用', familiar: '熟悉', learning: '正在学习', attachments: '个附件', images: '张图片', updated: '更新于', reference: '参考链接', attachmentsTitle: '附件下载' },
    },
    'zh-TW': {
      language: { current: '繁體中文', label: '語言', menu: '選擇語言' },
      nav: { videos: '教學影片', downloads: '資料下載', store: '閒魚店鋪', journal: '學習日誌', faq: '疑難解答', about: '關於作者' },
      shell: { shortcut: '快捷工具列', categories: '資源分類導覽', home: 'TraceDev 首頁', workspace: '技術資源庫', workspaceLabel: '我的工作區', menu: '選單', search: '搜尋資源、教學或關鍵字', searchResults: '搜尋結果', online: '系統正常', synced: '內容已同步' },
      dashboard: { videosDescription: '嵌入式開發、單片機、STM32 等技術教學，從入門到進階', viewResources: '查看全部資料', quickAccess: '快速入口', commonEntry: '常用入口', hardware: '開發板', recent: '最近更新', recentHint: '依最近發布的教學排序', videosCount: '個影片', activity: '最近動態', newVideo: '新增教學影片', libraryUpdated: '資料庫已更新', productUpdated: '店鋪商品上新', resourceStatus: '資源狀態', organized: '已整理', storageHint: '影片、工程檔案與學習筆記集中歸檔' },
      panel: { storeDescription: '開發板、模組、工具 — 物美價廉的學生福利', downloadsDescription: '原始碼工程、PCB 檔案、學習資料 — 分類查找，快速下載', category: '分類篩選', journalDescription: '記錄學習過程 · 分享技術心得 · 鞏固知識體系', faqDescription: '資源下載、開發環境、課程學習 — 常見問題一次解答', aboutDescription: '一名熱愛技術與分享的嵌入式工程師' },
      action: { skipContent: '跳到主要內容', backToTop: '回到頂部', downloadApk: '下載 APK', getDownload: '取得下載', copy: '複製', close: '關閉', cancel: '取消', delete: '刪除', edit: '編輯', logout: '退出', login: '登入', save: '儲存發布', newJournal: '新增日誌', aiSettings: 'AI 設定', aiOrganize: 'AI 整理', all: '全部', expandAnswer: '展開答案', openExternal: '開啟外部連結' },
      search: { empty: '找不到符合的內容' },
      state: { preparingVideos: '教學準備中', preparingVideosHint: '正在錄製第一批嵌入式教學影片，涵蓋 STM32、PCB、電源設計等方向，敬請期待', preparingProducts: '商品上架中', preparingProductsHint: '更多開發板、模組和工具即將上架閒魚，敬請關注', noCategory: '暫無此類資源', noCategoryHint: '此分類下還沒有資源，請查看其他分類或稍後再來', noJournal: '暫無學習日誌', noJournalHint: '學習日誌即將上線，記錄嵌入式開發的學習歷程' },
      modal: { resourceName: '資源名稱', baiduLink: '百度網盤連結', extractCode: '提取碼', unzipPassword: '解壓密碼', noPassword: '（無需解壓密碼）', adminLogin: '管理員登入', loginHint: '輸入密碼以管理學習日誌', password: '密碼', passwordPlaceholder: '請輸入管理員密碼', aiTitle: 'AI 設定', aiHint: '設定 DeepSeek API Key，AI 幫你整理學習筆記', editorNew: '新增學習日誌', title: '標題 *', category: '分類', tags: '標籤（逗號分隔）', content: '正文（支援 Markdown）', images: '圖片', files: '附件', links: '參考連結（每行一個）', uploadImage: '支援 JPG/PNG/WebP', uploadFile: '支援 PDF/ZIP/DOC/XLS 等' },
      admin: { mode: '管理員模式 · 編輯後自動提交到 GitHub · ', aiKeyPlaceholder: 'sk-xxxxxxxxxxxxxxxxxxxx', titlePlaceholder: '例：反激變壓器設計筆記', categoryPlaceholder: '例：電源設計', tagsPlaceholder: '例：變壓器, 電源, 反激', contentPlaceholder: '在此撰寫你的學習筆記...', linksPlaceholder: 'https://example.com/ref1' },
      footer: { filing: '備案號：', visitors: '訪客', views: '訪問量', rights: 'All rights reserved.' },
      status: { maintainer: '維護者', technicalFocus: '技術方向', common: '常用', familiar: '熟悉', learning: '正在學習', attachments: '個附件', images: '張圖片', updated: '更新於', reference: '參考連結', attachmentsTitle: '附件下載' },
    },
    en: {
      language: { current: 'English', label: 'Language', menu: 'Choose language' },
      nav: { videos: 'Tutorials', downloads: 'Downloads', store: 'Shop', journal: 'Journal', faq: 'FAQ', about: 'About' },
      shell: { shortcut: 'Quick tools', categories: 'Resource navigation', home: 'TraceDev home', workspace: 'Resource library', workspaceLabel: 'My workspace', menu: 'Menu', search: 'Search resources, tutorials or keywords', searchResults: 'Search results', online: 'System online', synced: 'Content synced' },
      dashboard: { videosDescription: 'Embedded development, microcontrollers and STM32 tutorials from basics to advanced topics', viewResources: 'View all resources', quickAccess: 'Quick access', commonEntry: 'Common entry', hardware: 'Hardware', recent: 'Recently updated', recentHint: 'Sorted by latest tutorials', videosCount: 'videos', activity: 'Recent activity', newVideo: 'New tutorial', libraryUpdated: 'Library updated', productUpdated: 'New shop item', resourceStatus: 'Resource status', organized: 'Organized', storageHint: 'Videos, project files and study notes in one place' },
      panel: { storeDescription: 'Development boards, modules and tools at student-friendly prices', downloadsDescription: 'Source projects, PCB files and study materials — browse and download quickly', category: 'Filter by category', journalDescription: 'Record progress · share engineering notes · strengthen your skills', faqDescription: 'Answers for downloads, environments and course questions', aboutDescription: 'An embedded engineer who enjoys building and sharing' },
      action: { skipContent: 'Skip to main content', backToTop: 'Back to top', downloadApk: 'Download APK', getDownload: 'Get download', copy: 'Copy', close: 'Close', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', logout: 'Log out', login: 'Log in', save: 'Publish', newJournal: 'New journal', aiSettings: 'AI settings', aiOrganize: 'AI organize', all: 'All', expandAnswer: 'Expand answer', openExternal: 'Open external link' },
      search: { empty: 'No matching content found' },
      state: { preparingVideos: 'Tutorials in progress', preparingVideosHint: 'The first embedded tutorials covering STM32, PCB and power design are being recorded', preparingProducts: 'Products coming soon', preparingProductsHint: 'More boards, modules and tools will be listed in the shop', noCategory: 'No resources in this category', noCategoryHint: 'Try another category or check back later', noJournal: 'No journal entries', noJournalHint: 'Study notes will be published here soon' },
      modal: { resourceName: 'Resource name', baiduLink: 'Baidu Netdisk link', extractCode: 'Access code', unzipPassword: 'Archive password', noPassword: '(No archive password)', adminLogin: 'Admin login', loginHint: 'Enter the password to manage the journal', password: 'Password', passwordPlaceholder: 'Enter admin password', aiTitle: 'AI settings', aiHint: 'Configure a DeepSeek API key to format study notes', editorNew: 'New journal entry', title: 'Title *', category: 'Category', tags: 'Tags (comma separated)', content: 'Content (Markdown supported)', images: 'Images', files: 'Attachments', links: 'Reference links (one per line)', uploadImage: 'JPG/PNG/WebP supported', uploadFile: 'PDF/ZIP/DOC/XLS and more' },
      admin: { mode: 'Admin mode · changes are committed to GitHub · ', aiKeyPlaceholder: 'sk-xxxxxxxxxxxxxxxxxxxx', titlePlaceholder: 'e.g. Flyback transformer design notes', categoryPlaceholder: 'e.g. Power design', tagsPlaceholder: 'e.g. transformer, power, flyback', contentPlaceholder: 'Write your study notes here...', linksPlaceholder: 'https://example.com/ref1' },
      footer: { filing: 'Filing: ', visitors: 'Visitors', views: 'Views', rights: 'All rights reserved.' },
      status: { maintainer: 'Maintainer', technicalFocus: 'Technical focus', common: 'Common', familiar: 'Familiar', learning: 'Learning', attachments: 'attachments', images: 'images', updated: 'Updated', reference: 'References', attachmentsTitle: 'Attachments' },
    },
    ja: {
      language: { current: '日本語', label: '言語', menu: '言語を選択' },
      nav: { videos: 'チュートリアル', downloads: '資料ダウンロード', store: 'ショップ', journal: '学習ログ', faq: 'よくある質問', about: '作者について' },
      shell: { shortcut: 'クイックツール', categories: 'リソースナビゲーション', home: 'TraceDev ホーム', workspace: '技術リソース', workspaceLabel: 'マイワークスペース', menu: 'メニュー', search: '資料、チュートリアル、キーワードを検索', searchResults: '検索結果', online: 'システム正常', synced: '同期済み' },
      dashboard: { videosDescription: '組み込み開発、マイコン、STM32 の入門から実践までのチュートリアル', viewResources: 'すべての資料を見る', quickAccess: 'クイックアクセス', commonEntry: 'よく使う入口', hardware: 'ハードウェア', recent: '最近の更新', recentHint: '新しいチュートリアル順', videosCount: '本', activity: '最近の動き', newVideo: '新しい動画', libraryUpdated: '資料を更新', productUpdated: '商品を追加', resourceStatus: 'リソース状態', organized: '整理済み', storageHint: '動画、プロジェクト、学習ノートをまとめて管理' },
      panel: { storeDescription: '開発ボード、モジュール、ツールを学生向け価格で提供', downloadsDescription: 'ソースプロジェクト、PCB ファイル、学習資料を分類してダウンロード', category: 'カテゴリで絞り込み', journalDescription: '学習を記録 · 技術知識を共有 · スキルを定着', faqDescription: 'ダウンロード、開発環境、学習に関するよくある質問', aboutDescription: '技術と共有を愛する組み込みエンジニア' },
      action: { skipContent: 'メインコンテンツへ移動', backToTop: 'トップへ戻る', downloadApk: 'APKをダウンロード', getDownload: 'ダウンロード', copy: 'コピー', close: '閉じる', cancel: 'キャンセル', delete: '削除', edit: '編集', logout: 'ログアウト', login: 'ログイン', save: '公開', newJournal: '新しいログ', aiSettings: 'AI設定', aiOrganize: 'AI整理', all: 'すべて', expandAnswer: '回答を開く', openExternal: '外部リンクを開く' },
      search: { empty: '一致する内容がありません' },
      state: { preparingVideos: 'チュートリアル準備中', preparingVideosHint: 'STM32、PCB、電源設計を扱う最初の動画を収録中です', preparingProducts: '商品準備中', preparingProductsHint: '開発ボード、モジュール、ツールを順次追加します', noCategory: 'このカテゴリに資料はありません', noCategoryHint: '別のカテゴリを選択してください', noJournal: '学習ログはありません', noJournalHint: '学習ログは近日公開されます' },
      modal: { resourceName: '資料名', baiduLink: 'Baidu Netdisk リンク', extractCode: '抽出コード', unzipPassword: '解凍パスワード', noPassword: '（パスワードなし）', adminLogin: '管理者ログイン', loginHint: '学習ログを管理するパスワードを入力', password: 'パスワード', passwordPlaceholder: '管理者パスワードを入力', aiTitle: 'AI設定', aiHint: 'DeepSeek APIキーで学習ノートを整理', editorNew: '新しい学習ログ', title: 'タイトル *', category: 'カテゴリ', tags: 'タグ（カンマ区切り）', content: '本文（Markdown対応）', images: '画像', files: '添付ファイル', links: '参考リンク（1行1件）', uploadImage: 'JPG/PNG/WebP対応', uploadFile: 'PDF/ZIP/DOC/XLSなどに対応' },
      admin: { mode: '管理者モード · 編集内容は GitHub に自動送信 · ', aiKeyPlaceholder: 'sk-xxxxxxxxxxxxxxxxxxxx', titlePlaceholder: '例：フライバックトランス設計ノート', categoryPlaceholder: '例：電源設計', tagsPlaceholder: '例：トランス, 電源, フライバック', contentPlaceholder: '学習ノートを入力してください...', linksPlaceholder: 'https://example.com/ref1' },
      footer: { filing: '登録番号：', visitors: '訪問者', views: '閲覧数', rights: 'All rights reserved.' },
      status: { maintainer: 'メンテナー', technicalFocus: '技術分野', common: 'よく使う', familiar: '習得済み', learning: '学習中', attachments: '件の添付', images: '枚の画像', updated: '更新', reference: '参考リンク', attachmentsTitle: '添付ファイル' },
    },
    ko: {
      language: { current: '한국어', label: '언어', menu: '언어 선택' },
      nav: { videos: '튜토리얼', downloads: '자료 다운로드', store: '스토어', journal: '학습 로그', faq: '자주 묻는 질문', about: '작성자 소개' },
      shell: { shortcut: '빠른 도구', categories: '자료 탐색', home: 'TraceDev 홈', workspace: '기술 자료실', workspaceLabel: '내 작업 공간', menu: '메뉴', search: '자료, 튜토리얼 또는 키워드 검색', searchResults: '검색 결과', online: '시스템 정상', synced: '동기화 완료' },
      dashboard: { videosDescription: '임베디드 개발, 마이크로컨트롤러, STM32 입문부터 실전까지의 튜토리얼', viewResources: '전체 자료 보기', quickAccess: '빠른 이동', commonEntry: '자주 사용하는 메뉴', hardware: '하드웨어', recent: '최근 업데이트', recentHint: '최신 튜토리얼 순서', videosCount: '개 영상', activity: '최근 활동', newVideo: '새 튜토리얼', libraryUpdated: '자료실 업데이트', productUpdated: '상품 등록', resourceStatus: '자료 상태', organized: '정리 완료', storageHint: '영상, 프로젝트 파일, 학습 노트를 한곳에서 관리' },
      panel: { storeDescription: '개발 보드, 모듈, 도구를 학생 친화적인 가격으로 제공합니다', downloadsDescription: '소스 프로젝트, PCB 파일, 학습 자료를 분류해 빠르게 다운로드하세요', category: '카테고리 필터', journalDescription: '학습 기록 · 기술 지식 공유 · 실력 향상', faqDescription: '다운로드, 개발 환경, 학습 관련 질문을 한곳에서 해결하세요', aboutDescription: '기술과 공유를 좋아하는 임베디드 엔지니어' },
      action: { skipContent: '본문으로 건너뛰기', backToTop: '맨 위로', downloadApk: 'APK 다운로드', getDownload: '다운로드 받기', copy: '복사', close: '닫기', cancel: '취소', delete: '삭제', edit: '편집', logout: '로그아웃', login: '로그인', save: '게시', newJournal: '새 로그', aiSettings: 'AI 설정', aiOrganize: 'AI 정리', all: '전체', expandAnswer: '답변 펼치기', openExternal: '외부 링크 열기' },
      search: { empty: '일치하는 내용을 찾지 못했습니다' },
      state: { preparingVideos: '튜토리얼 준비 중', preparingVideosHint: 'STM32, PCB, 전원 설계를 다루는 첫 임베디드 영상을 제작하고 있습니다', preparingProducts: '상품 준비 중', preparingProductsHint: '더 많은 보드, 모듈, 도구가 곧 등록됩니다', noCategory: '이 카테고리에는 자료가 없습니다', noCategoryHint: '다른 카테고리를 확인해 주세요', noJournal: '학습 로그가 없습니다', noJournalHint: '학습 로그가 곧 공개됩니다' },
      modal: { resourceName: '자료 이름', baiduLink: 'Baidu Netdisk 링크', extractCode: '추출 코드', unzipPassword: '압축 해제 비밀번호', noPassword: '（비밀번호 없음）', adminLogin: '관리자 로그인', loginHint: '학습 로그를 관리하려면 비밀번호를 입력하세요', password: '비밀번호', passwordPlaceholder: '관리자 비밀번호 입력', aiTitle: 'AI 설정', aiHint: 'DeepSeek API 키로 학습 노트를 정리하세요', editorNew: '새 학습 로그', title: '제목 *', category: '카테고리', tags: '태그（쉼표로 구분）', content: '본문（Markdown 지원）', images: '이미지', files: '첨부 파일', links: '참고 링크（한 줄에 하나）', uploadImage: 'JPG/PNG/WebP 지원', uploadFile: 'PDF/ZIP/DOC/XLS 등 지원' },
      admin: { mode: '관리자 모드 · 수정 내용은 GitHub에 자동 제출됩니다 · ', aiKeyPlaceholder: 'sk-xxxxxxxxxxxxxxxxxxxx', titlePlaceholder: '예: 플라이백 변압기 설계 노트', categoryPlaceholder: '예: 전원 설계', tagsPlaceholder: '예: 변압기, 전원, 플라이백', contentPlaceholder: '학습 노트를 작성하세요...', linksPlaceholder: 'https://example.com/ref1' },
      footer: { filing: '등록번호: ', visitors: '방문자', views: '조회수', rights: 'All rights reserved.' },
      status: { maintainer: '관리자', technicalFocus: '기술 분야', common: '자주 사용', familiar: '숙련', learning: '학습 중', attachments: '개 첨부', images: '개 이미지', updated: '업데이트', reference: '참고 링크', attachmentsTitle: '첨부 파일' },
    },
  };

  function readPath(object, path) {
    return path.split('.').reduce((value, key) => value && value[key], object);
  }

  function detectLocale() {
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (_) { /* Storage may be disabled. */ }
    if (LOCALES.includes(saved)) return saved;
    const language = String(navigator.language || '').toLowerCase();
    if (language.startsWith('zh-tw') || language.startsWith('zh-hk') || language.startsWith('zh-mo')) return 'zh-TW';
    if (language.startsWith('zh')) return 'zh-CN';
    if (language.startsWith('ja')) return 'ja';
    if (language.startsWith('ko')) return 'ko';
    if (language.startsWith('en')) return 'en';
    return 'en';
  }

  let currentLocale = detectLocale();

  function syncDjangoLocale() {
    try {
      document.cookie = `django_language=${DJANGO_LOCALES[currentLocale]}; path=/; SameSite=Lax`;
    } catch (_) { /* Cookie access may be disabled. */ }
  }

  function translate(key, fallback) {
    const value = readPath(I18N[currentLocale], key) || readPath(I18N['zh-CN'], key);
    return value || fallback || key;
  }

  function getLocalizedContent(item, field, locale = currentLocale) {
    if (!item) return '';
    return item.translations?.[locale]?.[field] || item[field] || '';
  }

  function updateStaticText() {
    document.documentElement.lang = currentLocale;
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = translate(element.dataset.i18n, element.textContent);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      element.setAttribute('placeholder', translate(element.dataset.i18nPlaceholder, element.getAttribute('placeholder')));
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      element.setAttribute('aria-label', translate(element.dataset.i18nAriaLabel, element.getAttribute('aria-label')));
    });
    document.querySelectorAll('[data-i18n-title]').forEach((element) => {
      element.setAttribute('title', translate(element.dataset.i18nTitle, element.getAttribute('title')));
    });
    const current = document.getElementById('current-language');
    if (current) current.textContent = translate('language.current', current.textContent);
    document.querySelectorAll('[data-locale]').forEach((button) => {
      const active = button.dataset.locale === currentLocale;
      button.classList.toggle('active', active);
      button.setAttribute('aria-checked', String(active));
    });
  }

  function setLocale(locale) {
    if (!LOCALES.includes(locale) || locale === currentLocale) {
      updateStaticText();
      return;
    }
    currentLocale = locale;
    try { localStorage.setItem(STORAGE_KEY, currentLocale); } catch (_) { /* Keep the current page usable. */ }
    syncDjangoLocale();
    updateStaticText();
    window.dispatchEvent(new CustomEvent('tracedev:locale-changed', { detail: { locale: currentLocale } }));
  }

  function closeMenu() {
    const menu = document.getElementById('language-menu');
    const trigger = document.getElementById('language-toggle');
    if (menu) menu.hidden = true;
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  function init() {
    syncDjangoLocale();
    updateStaticText();
    const trigger = document.getElementById('language-toggle');
    const menu = document.getElementById('language-menu');
    if (!trigger || !menu) return;
    trigger.addEventListener('click', () => {
      menu.hidden = !menu.hidden;
      trigger.setAttribute('aria-expanded', String(!menu.hidden));
    });
    menu.querySelectorAll('[data-locale]').forEach((button) => {
      button.addEventListener('click', () => {
        setLocale(button.dataset.locale);
        closeMenu();
        trigger.focus();
      });
    });
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.language-switcher')) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  window.I18N = I18N;
  window.I18nController = { LOCALES, getLocale: () => currentLocale, setLocale, translate, getLocalizedContent, updateStaticText };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
