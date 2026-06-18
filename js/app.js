/**
 * ============================================================
 *  TechHub · 应用交互逻辑
 *  —— 标签页导航 / 五面板渲染 / 主题切换 / 模态框 / FAQ
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
    faq: document.getElementById('panel-faq'),
    about: document.getElementById('panel-about'),
  };

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      // 切换按钮状态
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

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

      // 触发技能条动画
      if (tab === 'about') {
        animateSkillBars();
      }
    });
  });

  // ==========================================================
  //  2. 渲染视频卡片
  // ==========================================================
  const videoGrid = document.getElementById('video-grid');
  if (videoGrid && typeof VIDEOS !== 'undefined') {
    const publishedVideos = VIDEOS.filter((v) => v.published);

    if (publishedVideos.length === 0) {
      videoGrid.innerHTML = `
        <div class="col-span-full text-center py-20">
          <div class="w-20 h-20 mx-auto mb-5 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] flex items-center justify-center text-3xl text-[var(--text-muted)]">
            <i class="fa-solid fa-video"></i>
          </div>
          <p class="text-lg font-medium text-[var(--text-secondary)]">📺 教学视频筹备中</p>
          <p class="text-sm text-[var(--text-muted)] mt-2">敬请期待，教程正在录制中...</p>
        </div>
      `;
    } else {
      publishedVideos.forEach((v, i) => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
          <div class="video-thumb">
            <div class="play-icon"><i class="fa-solid fa-play"></i></div>
            <span class="video-duration">${v.duration}</span>
          </div>
          <div class="video-info">
            <h3 class="text-sm font-semibold text-[var(--text-primary)] leading-snug mb-1 line-clamp-2">${v.title}</h3>
            <p class="text-xs text-[var(--text-muted)]">${v.date}</p>
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
        <div class="text-center py-20">
          <div class="w-20 h-20 mx-auto mb-5 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] flex items-center justify-center text-3xl text-[var(--text-muted)]">
            <i class="fa-solid fa-store"></i>
          </div>
          <p class="text-lg font-medium text-[var(--text-secondary)]">🏪 商品上架中</p>
          <p class="text-sm text-[var(--text-muted)] mt-2">敬请期待，更多好物即将上架...</p>
        </div>
      `;
    } else {
      publishedProducts.forEach((p) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <div class="product-image">
            ${p.image ? `<img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover" />` : '<i class="fa-solid fa-box-open"></i>'}
          </div>
          <div class="product-body">
            <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-1">${p.name}</h3>
            <p class="text-xs text-[var(--text-muted)] mb-3 line-clamp-2">${p.description}</p>
            <div class="flex items-center justify-between">
              <span class="product-price">${p.price}</span>
              <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-lg bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-xs font-medium hover:bg-neon-blue/20 transition-all duration-300">
                <i class="fa-solid fa-cart-shopping mr-1"></i>查看详情
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
      const card = document.createElement('div');
      card.className = 'card-glow p-5 flex flex-col justify-between';
      card.innerHTML = `
        <div>
          <div class="flex items-start gap-3 mb-3">
            <span class="card-icon ${isApk ? 'text-green-400 border-green-400/30 bg-green-400/10' : ''}"><i class="fa-solid ${icon}"></i></span>
            <h3 class="text-base font-semibold text-[var(--text-primary)] leading-snug pt-0.5">${res.name}</h3>
          </div>
          <p class="text-xs text-[var(--text-muted)] leading-relaxed mb-4 line-clamp-2">${res.description}</p>
        </div>
        <div class="flex items-center justify-between gap-2 pt-2 border-t border-[var(--border-subtle)]">
          <span class="text-xs text-[var(--text-dim)]"><i class="fa-regular fa-clock mr-1"></i>${res.updatedAt}</span>
          <button class="download-btn px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 active:scale-95 ${isApk ? 'bg-green-400/10 border border-green-400/30 text-green-400 hover:bg-green-400/20' : 'bg-neon-blue/10 border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/20'}" data-resource-id="${res.id}">
            <i class="fa-solid fa-download mr-1"></i>${isApk ? '直接下载' : '获取下载'}
          </button>
        </div>
      `;
      resourceGrid.appendChild(card);
    });

    // 如果筛选结果为空
    if (filtered.length === 0) {
      resourceGrid.innerHTML = `
        <div class="col-span-full text-center py-16 text-[var(--text-muted)]">
          <i class="fa-solid fa-box-open text-4xl mb-4 opacity-40"></i>
          <p class="text-sm">暂无该分类的资源</p>
        </div>
      `;
    }
  }

  // 构建分类下拉框
  const categorySelect = document.getElementById('category-select');
  if (categorySelect && typeof RESOURCES !== 'undefined') {
    const published = RESOURCES.filter((r) => r.published);
    const cats = ['all', ...new Set(published.map((r) => r.category).filter(Boolean))];
    const catLabels = {
      all: '全部',
      stm32: 'STM32',
      arduino: 'Arduino',
      pcb: 'PCB',
      '手机app': '手机APP',
    };
    const catIcons = {
      all: 'fa-th-large',
      stm32: 'fa-microchip',
      arduino: 'fa-code',
      pcb: 'fa-bolt',
      '手机app': 'fa-mobile-screen',
    };

    cats.forEach((cat) => {
      const pool = RESOURCES.filter((r) => r.published);
      const count = cat === 'all' ? pool.length : pool.filter((r) => r.category === cat).length;
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = `${catLabels[cat] || cat} (${count})`;
      categorySelect.appendChild(option);
    });

    categorySelect.addEventListener('change', () => {
      renderResources(categorySelect.value);
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
        <button class="faq-question" data-faq-id="${faq.id}">
          <span>${faq.question}</span>
          <i class="fa-solid fa-chevron-down text-xs"></i>
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
          if (el !== item) el.classList.remove('open');
        });
        item.classList.toggle('open', !isOpen);
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
      <div class="text-center max-w-xl mx-auto">
        <!-- 头像 Logo -->
        <div class="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg bg-[var(--bg-card)] border border-[var(--border-card)] flex items-center justify-center p-3">
          <img src="assets/logo.png" alt="${a.name}" class="w-full h-full object-contain" />
        </div>
        <h2 class="text-2xl font-bold text-[var(--text-primary)]">${a.name}</h2>
        <p class="text-sm text-[var(--text-muted)] mt-1">${a.tagline}</p>
        <p class="text-sm text-[var(--text-secondary)] leading-relaxed mt-5 max-w-md mx-auto">${a.bio}</p>

        <!-- 社交链接 -->
        <div class="flex items-center justify-center gap-3 mt-6">
          ${a.links.map((l) => `
            <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--bg-social)] border border-[var(--border-input)] text-[var(--text-secondary)] text-xs font-medium hover:bg-[var(--bg-social-hover)] hover:border-neon-blue hover:text-neon-blue transition-all duration-300">
              <i class="${l.icon}"></i>${l.label}
            </a>
          `).join('')}
        </div>

        <!-- 技能条 -->
        <div class="mt-8 text-left max-w-sm mx-auto space-y-4">
          ${a.skills.map((s) => `
            <div>
              <div class="flex justify-between text-xs mb-1.5">
                <span class="text-[var(--text-secondary)]">${s.name}</span>
                <span class="text-[var(--text-muted)] font-mono">${s.level}%</span>
              </div>
              <div class="skill-bar-bg">
                <div class="skill-bar-fill" data-width="${s.level}"></div>
              </div>
            </div>
          `).join('')}
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
      copyBtn.classList.add('text-green-400', 'border-green-400/50', 'bg-green-400/10');
      copyBtn.classList.remove('text-neon-blue', 'border-neon-blue/30', 'bg-neon-blue/10');
      setTimeout(() => {
        copyBtn.innerHTML = orig;
        copyBtn.classList.remove('text-green-400', 'border-green-400/50', 'bg-green-400/10');
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
    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-sm text-[var(--text-secondary)]">📧</span>
        <span class="text-sm font-mono text-[var(--text-primary)]">${email}</span>
        <button class="copy-email-btn px-2.5 py-1 rounded-md bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-xs hover:bg-neon-blue/20 transition-colors" data-email="${email}">
          <i class="fa-regular fa-copy mr-1"></i>复制
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
        this.classList.add('text-green-400', 'border-green-400/50', 'bg-green-400/10');
        this.classList.remove('text-neon-blue', 'border-neon-blue/30', 'bg-neon-blue/10');
        setTimeout(() => {
          this.innerHTML = orig;
          this.classList.remove('text-green-400', 'border-green-400/50', 'bg-green-400/10');
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
