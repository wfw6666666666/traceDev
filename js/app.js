/**
 * ============================================================
 *  TraceDev · 应用交互逻辑
 *  —— 标签页导航 / 五面板渲染 / 主题切换 / 模态框 / FAQ
 *  DESIGN.md 驱动 · 极客克制
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================
  //  0. 主题切换
  // ==========================================================
  const htmlEl = document.documentElement;

  function getTheme() {
    return htmlEl.getAttribute('data-theme') || 'dark';
  }
  // 动态更新页脚年份
  const footerYear = document.getElementById('footer-year');
  if (footerYear) footerYear.textContent = String(new Date().getFullYear());

  function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = theme === 'dark' ? 'fa-sun' : 'fa-moon';
    document.querySelectorAll('.theme-toggle, #theme-toggle').forEach((btn) => {
      btn.innerHTML = `<i class="fa-regular ${icon}"></i>`;
      btn.setAttribute('aria-label', theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式');
    });
  }
  setTheme(getTheme());
  document.querySelectorAll('.theme-toggle, #theme-toggle').forEach((btn) => {
    btn.addEventListener('click', () => setTheme(getTheme() === 'dark' ? 'light' : 'dark'));
  });

  // ==========================================================
  //  1. 汉堡菜单
  // ==========================================================
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  let menuOpen = false;

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle('open', menuOpen);
      menuBtn.innerHTML = menuOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
      menuBtn.setAttribute('aria-expanded', String(menuOpen));
    });
  }

  // ==========================================================
  //  2. 标签页切换
  // ==========================================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = {
    videos: document.getElementById('panel-videos'),
    store: document.getElementById('panel-store'),
    downloads: document.getElementById('panel-downloads'),
    journal: document.getElementById('panel-journal'),
    faq: document.getElementById('panel-faq'),
    about: document.getElementById('panel-about'),
  };

  function syncActiveTabs(tab) {
    tabBtns.forEach((button) => {
      button.classList.toggle('active', button.dataset.tab === tab);
    });
  }

  function updateDashboardCounts() {
    const counts = {
      'video-count': typeof VIDEOS !== 'undefined' ? VIDEOS.filter((item) => item.published).length : 0,
      'resource-count': typeof RESOURCES !== 'undefined' ? RESOURCES.filter((item) => item.published).length : 0,
      'product-count': typeof PRODUCTS !== 'undefined' ? PRODUCTS.filter((item) => item.published !== false).length : 0,
    };

    Object.entries(counts).forEach(([id, count]) => {
      const target = document.getElementById(id);
      if (target) target.textContent = String(count).padStart(2, '0');
    });
  }

  updateDashboardCounts();

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      // 同步所有导航入口的选中状态
      syncActiveTabs(tab);

      // 切换面板
      Object.entries(panels).forEach(([key, panel]) => {
        if (panel) {
          panel.classList.toggle('active', key === tab);
        }
      });

      // 如果点击的是移动端 Tab，关闭汉堡菜单
      if (menuOpen && btn.closest('#mobile-menu')) {
        menuOpen = false;
        mobileMenu.classList.remove('open');
        if (menuBtn) menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }

      const activeSearch = document.getElementById('site-search');
      if (activeSearch) applyPanelSearch(activeSearch.value);

      // 触发技能条动画
      if (tab === 'about') {
        animateSkillBars();
      }
    });
  });

  // ==========================================================
  //  2.1 全站搜索 + 当前面板筛选
  // ==========================================================
  const siteSearch = document.getElementById('site-search');
  const searchResults = document.getElementById('search-results');
  const tabLabels = {
    videos: '教学视频',
    downloads: '资料下载',
    store: '咸鱼店铺',
    journal: '学习日志',
    faq: '疑难解答',
    about: '关于作者',
  };

  const normalizeSearchText = (value) => String(value || '').toLocaleLowerCase('zh-CN').trim();
  const escapeSearchHtml = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));

  const searchIndex = [];
  if (typeof VIDEOS !== 'undefined') {
    VIDEOS.filter((item) => item.published).forEach((item) => searchIndex.push({
      title: item.title, description: item.description, meta: item.date, tab: 'videos', icon: 'fa-film',
    }));
  }
  if (typeof RESOURCES !== 'undefined') {
    RESOURCES.filter((item) => item.published).forEach((item) => searchIndex.push({
      title: item.name, description: item.description, meta: item.category || '资源', tab: 'downloads', icon: 'fa-folder-open',
    }));
  }
  if (typeof PRODUCTS !== 'undefined') {
    PRODUCTS.filter((item) => item.published !== false).forEach((item) => searchIndex.push({
      title: item.name, description: item.description, meta: item.price || '商品', tab: 'store', icon: 'fa-bag-shopping',
    }));
  }
  if (typeof FAQS !== 'undefined') {
    FAQS.forEach((item) => searchIndex.push({
      title: item.question, description: item.answer, meta: 'FAQ', tab: 'faq', icon: 'fa-circle-question',
    }));
  }

  function applyPanelSearch(query) {
    const activePanel = Object.values(panels).find((panel) => panel?.classList.contains('active'));
    if (!activePanel) return;
    const normalizedQuery = normalizeSearchText(query);
    const searchableItems = activePanel.querySelectorAll(
      '.video-card, .product-card, .resource-row, .journal-card, .faq-item'
    );
    searchableItems.forEach((item) => {
      item.hidden = Boolean(normalizedQuery) && !normalizeSearchText(item.textContent).includes(normalizedQuery);
    });
  }

  function renderSearchResults(query) {
    if (!searchResults) return;
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) {
      searchResults.hidden = true;
      searchResults.innerHTML = '';
      return;
    }

    const matches = searchIndex.filter((item) => normalizeSearchText(`${item.title} ${item.description} ${item.meta}`).includes(normalizedQuery)).slice(0, 8);
    searchResults.innerHTML = matches.length
      ? matches.map((item, index) => `
        <button class="search-result" type="button" role="option" data-search-tab="${item.tab}" data-search-index="${index}">
          <span class="search-result-icon"><i class="fa-solid ${item.icon}" aria-hidden="true"></i></span>
          <span class="search-result-copy"><strong>${escapeSearchHtml(item.title)}</strong><small>${escapeSearchHtml(tabLabels[item.tab])} · ${escapeSearchHtml(item.meta)}</small></span>
          <i class="fa-solid fa-arrow-up-right-from-square search-result-arrow" aria-hidden="true"></i>
        </button>`).join('')
      : '<div class="search-empty"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><span>没有找到匹配内容</span></div>';
    searchResults.hidden = false;

    searchResults.querySelectorAll('[data-search-tab]').forEach((result) => {
      result.addEventListener('click', () => {
        const targetTab = result.dataset.searchTab;
        const targetButton = document.querySelector(`.tab-btn[data-tab="${targetTab}"]`);
        if (targetButton) targetButton.click();
        searchResults.hidden = true;
      });
    });
  }

  if (siteSearch) {
    siteSearch.addEventListener('input', () => {
      applyPanelSearch(siteSearch.value);
      renderSearchResults(siteSearch.value);
    });
    siteSearch.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && searchResults) {
        searchResults.hidden = true;
        siteSearch.blur();
      }
    });
    document.addEventListener('click', (event) => {
      if (searchResults && !event.target.closest('.search-wrap')) searchResults.hidden = true;
    });
  }


  // ==========================================================
  //  2. 渲染视频卡片
  // ==========================================================
  const videoGrid = document.getElementById('video-grid');
  if (videoGrid && typeof VIDEOS !== 'undefined') {
    const publishedVideos = VIDEOS.filter((v) => v.published);

    if (publishedVideos.length === 0) {
      videoGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon"><i class="fa-solid fa-video" aria-hidden="true"></i></div>
          <p class="empty-title">教程筹备中</p>
          <p class="empty-desc">正在录制第一批嵌入式教学视频，涵盖 STM32、PCB、电源设计等方向，敬请期待</p>
        </div>
      `;
    } else {
      publishedVideos.forEach((v, i) => {
        const card = document.createElement('article');
        card.className = 'video-card';
        card.innerHTML = `
          <div class="video-thumb">
            ${v.thumbnail ? `<img src="${v.thumbnail}" alt="" class="video-thumb-img" loading="lazy" />` : ''}
            <div class="play-icon"><i class="fa-solid fa-play" aria-hidden="true"></i></div>
            <span class="video-duration">${v.duration}</span>
          </div>
          <div class="video-info">
            <h3>${v.title}</h3>
            <p class="line-clamp-2 mb-3">${v.description || ''}</p>
            <p>${v.date}</p>
          </div>
        `;
        videoGrid.appendChild(card);
      });
    }
  }

  // ==========================================================
  //  3. 渲染商品卡片
  // ==========================================================
  const productGrid = document.getElementById('product-grid');
  if (productGrid && typeof PRODUCTS !== 'undefined') {
    const publishedProducts = PRODUCTS.filter((p) => p.published !== false);

    if (publishedProducts.length === 0) {
      productGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon"><i class="fa-solid fa-store" aria-hidden="true"></i></div>
          <p class="empty-title">商品上架中</p>
          <p class="empty-desc">更多开发板、模块和工具即将上架咸鱼，敬请关注</p>
        </div>
      `;
    } else {
      publishedProducts.forEach((p) => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.innerHTML = `
          <div class="product-image">
            ${p.image ? `<img src="${p.image}" alt="${p.name}" />` : '<i class="fa-solid fa-box-open" aria-hidden="true"></i>'}
          </div>
          <div class="product-body flex flex-col">
            <span class="section-number mb-3">Hardware / In stock</span>
            <h3>${p.name}</h3>
            <p class="mb-5 line-clamp-3">${p.description}</p>
            <div class="flex items-center justify-between gap-3 mt-auto pt-4 border-t border-[var(--border-subtle)]">
              <span class="product-price">${p.price}</span>
              <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="btn-primary">
                去闲鱼查看 <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        `;
        productGrid.appendChild(card);
      });
    }
  }

  // ==========================================================
  //  4. 渲染资源卡片 + 分类筛选
  // ==========================================================
  const resourceGrid = document.getElementById('resource-grid');
  let currentCategory = 'all';

  function renderResources(category) {
    if (!resourceGrid || typeof RESOURCES === 'undefined') return;
    resourceGrid.innerHTML = '';
    currentCategory = category;

    const available = RESOURCES.filter((r) => r.published);
    const filtered =
      category === 'all'
        ? available
        : available.filter((r) => r.category === category);

    const iconMap = [
      'fa-microchip', 'fa-code', 'fa-laptop-code',
      'fa-database', 'fa-book-open', 'fa-layer-group',
      'fa-android',
    ];

    filtered.forEach((res, i) => {
      const isApk = res.type === 'apk';
      const icon = isApk ? 'fa-android' : iconMap[i % iconMap.length];
      const card = document.createElement('article');
      card.className = 'card-glow resource-row';
      card.innerHTML = `
        <span class="card-icon ${isApk ? 'text-[var(--success)]' : ''}"><i class="fa-solid ${icon}" aria-hidden="true"></i></span>
        <div class="resource-copy">
          <h3>${res.name}</h3>
          <p class="line-clamp-2">${res.description}</p>
        </div>
        <span class="resource-meta">${res.category || '其他'}<br>${res.updatedAt}</span>
        <button class="download-btn" data-resource-id="${res.id}">
          ${isApk ? '下载 APK' : '获取下载'} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </button>
      `;
      resourceGrid.appendChild(card);
    });

    // 如果筛选结果为空
    if (filtered.length === 0) {
      resourceGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon"><i class="fa-solid fa-box-open" aria-hidden="true"></i></div>
          <p class="empty-title">暂无该类资源</p>
          <p class="empty-desc">该分类下还没有资源，请查看其他分类或稍后再来</p>
        </div>
      `;
    }
  }

  // 构建分类筛选 chips
  const categoryFilter = document.getElementById('category-filter');
  if (categoryFilter && typeof RESOURCES !== 'undefined') {
    const published = RESOURCES.filter((r) => r.published);
    const cats = ['all', ...new Set(published.map((r) => r.category).filter(Boolean))];
    const catLabels = {
      all: '全部',
      stm32: 'STM32',
      arduino: 'Arduino',
      pcb: 'PCB',
      '手机app': '手机APP',
    };
    cats.forEach((cat) => {
      const pool = RESOURCES.filter((r) => r.published);
      const count = cat === 'all' ? pool.length : pool.filter((r) => r.category === cat).length;
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'journal-tag-btn cat-chip' + (cat === 'all' ? ' active' : '');
      chip.dataset.cat = cat;
      chip.innerHTML = `${catLabels[cat] || cat}<span class="cat-count">${count}</span>`;
      chip.addEventListener('click', () => {
        categoryFilter.querySelectorAll('.cat-chip').forEach((b) => b.classList.remove('active'));
        chip.classList.add('active');
        renderResources(cat);
      });
      categoryFilter.appendChild(chip);
    });

    // 初始渲染
    renderResources('all');
  }

  // ==========================================================
  //  5. 渲染 FAQ
  // ==========================================================
  const faqContainer = document.getElementById('faq-container');
  if (faqContainer && typeof FAQS !== 'undefined') {
    FAQS.forEach((faq, i) => {
      const item = document.createElement('div');
      item.className = 'faq-item';
      item.innerHTML = `
        <button class="faq-question" data-faq-id="${faq.id}" aria-expanded="false">
          <span>${faq.question}</span>
          <span class="sr-only">展开答案</span>
        </button>
        <div class="faq-answer">${faq.answer}</div>
      `;
      faqContainer.appendChild(item);

      // FAQ toggle
      const qBtn = item.querySelector('.faq-question');
      qBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // 关闭其他
        faqContainer.querySelectorAll('.faq-item.open').forEach((el) => {
          if (el !== item) {
            el.classList.remove('open');
            el.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
          }
        });
        item.classList.toggle('open', !isOpen);
        qBtn.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  }

  // ==========================================================
  //  6. 渲染关于作者
  // ==========================================================
  const aboutContainer = document.getElementById('about-container');
  if (aboutContainer && typeof AUTHOR !== 'undefined') {
    const a = AUTHOR;
    aboutContainer.innerHTML = `
      <div class="about-layout">
        <aside class="about-profile">
          <div class="about-logo">
            <img src="assets/logo.png" alt="${a.name}" class="w-full h-full object-contain" />
          </div>
          <span class="section-number">Maintainer</span>
          <h2>${a.name}</h2>
          <p class="mt-2 text-sm">${a.tagline}</p>
        </aside>
        <div class="about-main">
          <p class="text-sm leading-relaxed max-w-2xl">${a.bio}</p>
          <div class="about-links mt-6">
            ${a.links.map((l) => `
              <a href="${l.url}" target="_blank" rel="noopener noreferrer">
                ${l.label} <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
              </a>
            `).join('')}
          </div>
          <div class="about-skills mt-9">
            <p class="section-number mb-3">Technical focus</p>
            <ul>
              ${a.skills.map((s) => `<li><span>${s.name}</span><small>${s.level >= 80 ? '常用' : s.level >= 60 ? '熟悉' : '正在学习'}</small></li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================
  //  7. 技能条动画
  // ==========================================================
  function animateSkillBars() {
    document.querySelectorAll('.skill-bar-fill').forEach((bar) => {
      const w = parseInt(bar.dataset.width, 10);
      // 短暂延迟后触发
      setTimeout(() => {
        bar.style.width = w + '%';
      }, 200);
    });
  }

  // ==========================================================
  //  8. 区块入场动画 (IntersectionObserver)
  // ==========================================================
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  document.querySelectorAll('.section-reveal').forEach((el) => revealObserver.observe(el));

  // ==========================================================
  //  9. 导航栏滚动效果
  // ==========================================================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('navbar-scrolled', window.scrollY > 40);
  }, { passive: true });

  // ==========================================================
  //  10. 回到顶部
  // ==========================================================
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================================
  //  11. 模态框
  // ==========================================================
  const modal = document.getElementById('download-modal');
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalLink = document.getElementById('modal-link');
  const modalCode = document.getElementById('modal-code');
  const modalPassword = document.getElementById('modal-password');

  function openModal(resId) {
    const res = RESOURCES.find((r) => r.id === resId);
    if (!res) return;

    // APK 直接下载
    if (res.type === 'apk') {
      const a = document.createElement('a');
      a.href = 'downloads/' + res.fileName;
      a.download = res.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    modalTitle.textContent = res.name;
    modalLink.value = res.link;
    modalCode.value = `提取码: ${res.extractCode}`;
    modalPassword.value = res.password ? `解压密码: ${res.password}` : '（无需解压密码）';
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    const mc = modal.querySelector('.relative');
    mc.classList.remove('modal-enter');
    void mc.offsetWidth;
    mc.classList.add('modal-enter');
  }

  function closeModalFn() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.download-btn');
    if (btn) openModal(btn.dataset.resourceId);
  });
  if (overlay) overlay.addEventListener('click', closeModalFn);
  if (closeBtn) closeBtn.addEventListener('click', closeModalFn);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModalFn();
  });

  // ==========================================================
  //  12. 一键复制
  // ==========================================================
  document.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('.copy-btn');
    if (!copyBtn) return;
    const input = document.getElementById(copyBtn.dataset.copyTarget);
    if (!input) return;
    input.select();
    input.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(input.value).then(() => {
      const orig = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
      copyBtn.classList.add('copied');
      copyBtn.classList.remove('text-neon-blue', 'border-neon-blue/30', 'bg-neon-blue/10');
      setTimeout(() => {
        copyBtn.innerHTML = orig;
        copyBtn.classList.remove('copied');
        copyBtn.classList.add('text-neon-blue', 'border-neon-blue/30', 'bg-neon-blue/10');
      }, 1200);
    }).catch(() => alert('复制失败，请手动复制'));
  });

  // ==========================================================
  //  13. 邮箱弹窗 — 点击邮箱弹出信息，不跳转
  // ==========================================================
  function showEmailToast(email) {
    // 移除已有 toast
    const old = document.getElementById('email-toast');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.id = 'email-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-sm text-[var(--text-secondary)]">📧</span>
        <span class="text-sm font-mono text-[var(--text-primary)]">${email}</span>
        <button class="copy-email-btn px-2.5 py-1 rounded-md bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-xs hover:bg-neon-blue/20 transition-colors" data-email="${email}">
          <i class="fa-regular fa-copy mr-1" aria-hidden="true"></i>复制
        </button>
      </div>
    `;
    toast.style.cssText = `
      position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
      z-index: 200;
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 12px;
      padding: 0.8rem 1.2rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      animation: modalPop 0.25s ease-out;
      backdrop-filter: blur(12px);
    `;
    document.body.appendChild(toast);

    // 点击复制
    toast.querySelector('.copy-email-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      navigator.clipboard.writeText(email).then(() => {
        const orig = this.innerHTML;
        this.innerHTML = '<i class="fa-solid fa-check mr-1"></i>已复制';
        this.classList.add('copied');
        this.classList.remove('text-neon-blue', 'border-neon-blue/30', 'bg-neon-blue/10');
        setTimeout(() => {
          this.innerHTML = orig;
          this.classList.remove('copied');
          this.classList.add('text-neon-blue', 'border-neon-blue/30', 'bg-neon-blue/10');
        }, 1500);
      });
    });

    // 点击其他区域关闭
    setTimeout(() => { toast.addEventListener('click', () => toast.remove()); }, 100);
    // 3秒后自动关闭
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3000);
  }

  // 拦截所有 mailto: 链接
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="mailto:"], .email-link');
    if (!link) return;
    e.preventDefault();
    const email = link.dataset.email || link.getAttribute('href').replace('mailto:', '');
    showEmailToast(email);
  });
});
