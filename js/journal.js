/**
 * ============================================================
 *  TraceDev · 学习日志系统
 *  GitHub API 驱动 — 直接在网站上增删改，自动提交到仓库
 *  Token 仅保存在浏览器 localStorage，不上传任何服务器
 * ============================================================
 */
(function () {
  'use strict';

  // ── GitHub 配置 ───────────────────────────────────
  const GITHUB_API = 'https://api.github.com';
  const POSTS_PATH = 'data/posts.json';
  const DEFAULT_REPO = 'wfw6666666666/traceDev';
  const DEFAULT_BRANCH = 'master';

  // ── 状态 ──────────────────────────────────────────
  let ghToken = null;        // GitHub Personal Access Token
  let ghRepo = null;         // "owner/repo"
  let ghBranch = DEFAULT_BRANCH;
  let postsSha = null;       // 文件 SHA（PUT 时必须）
  let isAdmin = false;
  let posts = [];
  let editingPostId = null;

  // ── DOM ───────────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);

  // ── Token & Auth ──────────────────────────────────
  function loadToken() {
    try {
      const saved = JSON.parse(localStorage.getItem('tracedev_gh_auth') || '{}');
      if (saved.token && saved.repo) {
        ghToken = saved.token;
        ghRepo = saved.repo;
        ghBranch = saved.branch || DEFAULT_BRANCH;
        isAdmin = true;
        return true;
      }
    } catch {}
    return false;
  }

  function saveToken() {
    localStorage.setItem('tracedev_gh_auth', JSON.stringify({
      token: ghToken,
      repo: ghRepo,
      branch: ghBranch,
    }));
  }

  function clearToken() {
    localStorage.removeItem('tracedev_gh_auth');
    ghToken = null;
    ghRepo = null;
    postsSha = null;
    isAdmin = false;
  }

  // ── GitHub API ────────────────────────────────────
  async function ghAPI(path, opts = {}) {
    const [owner, repo] = ghRepo.split('/');
    const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;
    const headers = {
      'Authorization': `Bearer ${ghToken}`,
      'Accept': 'application/vnd.github.v3+json',
      ...opts.headers,
    };

    const res = await fetch(url, { ...opts, headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err.message || `GitHub API: ${res.status}`;
      throw new Error(msg);
    }
    return res.json();
  }

  // 读取文件
  async function ghRead(path) {
    const data = await ghAPI(path + `?ref=${ghBranch}`);
    return {
      content: JSON.parse(decodeURIComponent(escape(atob(data.content)))),
      sha: data.sha,
    };
  }

  // 写入文件（需要 sha 防止冲突）
  async function ghWrite(path, content, sha, commitMsg) {
    const body = {
      message: commitMsg || '📝 更新学习日志',
      content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
      branch: ghBranch,
    };
    if (sha) body.sha = sha;

    const result = await ghAPI(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return { sha: result.content.sha };
  }

  // ── 上传图片/文件到 GitHub（base64）───────────────
  async function uploadToGitHub(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result.split(',')[1]; // 去掉 data:xxx;base64, 前缀
          const ext = file.name.split('.').pop().toLowerCase();
          const ts = Date.now();
          const safeName = file.name.replace(/[^a-zA-Z0-9._一-鿿-]/g, '_');
          const path = `uploads/${ts}_${safeName}`;

          // 上传到 GitHub（不需要 sha，新文件）
          const [owner, repo] = ghRepo.split('/');
          const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;
          const headers = {
            'Authorization': `Bearer ${ghToken}`,
            'Accept': 'application/vnd.github.v3+json',
          };

          // 检查是否已存在
          let sha = null;
          try {
            const checkRes = await fetch(url + `?ref=${ghBranch}`, { headers });
            if (checkRes.ok) {
              const existing = await checkRes.json();
              sha = existing.sha;
            }
          } catch {}

          const body = {
            message: `📎 上传: ${file.name}`,
            content: base64,
            branch: ghBranch,
          };
          if (sha) body.sha = sha;

          const res = await fetch(url, {
            method: 'PUT',
            headers,
            body: JSON.stringify(body),
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || '上传失败');
          }

          const result = await res.json();
          // 返回 raw URL
          const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${ghBranch}/${path}`;
          resolve({
            url: rawUrl,
            filename: `${ts}_${safeName}`,
            original_name: file.name,
          });
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = () => reject(new Error('读取文件失败'));
      reader.readAsDataURL(file);
    });
  }

  // ── 检测后端（优先 GitHub，然后 Flask 本地）─────
  async function detectBackend() {
    // 先尝试从 localStorage 加载
    if (loadToken()) {
      // 验证 Token 是否有效
      try {
        const [owner, repo] = ghRepo.split('/');
        const url = `${GITHUB_API}/repos/${owner}/${repo}`;
        const res = await fetch(url, {
          headers: { 'Authorization': `Bearer ${ghToken}`, 'Accept': 'application/vnd.github.v3+json' },
        });
        if (res.ok) return 'github';
      } catch {}
      // Token 无效
      clearToken();
      isAdmin = false;
    }

    // 尝试本地 Flask
    try {
      const res = await fetch('/api/check-auth');
      if (res.ok) return 'flask';
    } catch {}

    return 'readonly';
  }

  // ── 文章获取 ──────────────────────────────────────
  async function fetchPosts() {
    const mode = await detectBackend();

    try {
      if (mode === 'github') {
        const result = await ghRead(POSTS_PATH);
        posts = result.content;
        postsSha = result.sha;
        // 确保是数组
        if (!Array.isArray(posts)) posts = [];
      } else if (mode === 'flask') {
        const res = await fetch('/api/posts');
        posts = await res.json();
      } else {
        // 静态只读：从 JSON 文件读取
        const res = await fetch('/data/posts.json');
        if (res.ok) posts = await res.json();
        else posts = [];
      }
    } catch (e) {
      console.warn('获取文章失败:', e.message);
      posts = [];
    }

    // 按时间倒序
    posts.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    renderJournalList();
    buildTagFilters();
  }

  // ── 保存文章到 GitHub ────────────────────────────
  async function savePostsToGitHub(commitMsg) {
    // 按时间倒序排列后保存
    const sorted = [...posts].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    const result = await ghWrite(POSTS_PATH, sorted, postsSha, commitMsg);
    postsSha = result.sha;
  }

  // ── 认证 UI ──────────────────────────────────────
  function updateAdminUI() {
    const bar = $('#journal-admin-bar');
    const btn = $('#admin-btn');
    const lockIcon = btn?.querySelector('i');
    const repoName = $('#admin-repo-name');

    if (isAdmin) {
      if (bar) bar.classList.remove('hidden');
      if (repoName) repoName.textContent = ghRepo || '';
      if (btn) {
        btn.title = '已登录 - 管理员模式';
        btn.classList.add('text-neon-blue', 'border-neon-blue/30', 'bg-neon-blue/10');
        btn.classList.remove('text-[var(--text-dim)]', 'opacity-60', 'cursor-not-allowed');
        if (lockIcon) { lockIcon.classList.remove('fa-lock'); lockIcon.classList.add('fa-lock-open'); }
      }
    } else {
      if (bar) bar.classList.add('hidden');
      if (btn) {
        btn.title = '管理员登录（GitHub Token）';
        btn.classList.remove('text-neon-blue', 'border-neon-blue/30', 'bg-neon-blue/10');
        btn.classList.add('text-[var(--text-dim)]');
        if (lockIcon) { lockIcon.classList.remove('fa-lock-open'); lockIcon.classList.add('fa-lock'); }
      }
    }
    renderJournalList();
  }

  // ── 登录 ──────────────────────────────────────────
  function showLogin() {
    const modal = $('#login-modal');
    if (!modal) return;
    $('#login-repo').value = DEFAULT_REPO;
    $('#login-token').value = '';
    $('#login-error').classList.add('hidden');
    modal.classList.remove('hidden');
    setTimeout(() => $('#login-token').focus(), 150);
  }
  function hideLogin() { $('#login-modal').classList.add('hidden'); }

  async function doLogin() {
    const repo = ($('#login-repo').value || '').trim();
    const token = ($('#login-token').value || '').trim();
    const errEl = $('#login-error');

    if (!repo) { errEl.textContent = '请输入仓库名（如 wfw6666666666/traceDev）'; errEl.classList.remove('hidden'); return; }
    if (!token) { errEl.textContent = '请输入 GitHub Token'; errEl.classList.remove('hidden'); return; }

    // 验证
    const [owner, repoName] = repo.split('/');
    if (!owner || !repoName) {
      errEl.textContent = '仓库格式错误，应为 用户名/仓库名'; errEl.classList.remove('hidden'); return;
    }

    errEl.classList.add('hidden');
    const btn = $('#btn-login-submit');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i>验证中...';
    btn.disabled = true;

    try {
      const url = `${GITHUB_API}/repos/${owner}/${repoName}`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json' },
      });
      if (!res.ok) {
        const msg = res.status === 401 ? 'Token 无效或被吊销' :
                    res.status === 404 ? '仓库不存在或 Token 没有权限访问' :
                    `验证失败 (HTTP ${res.status})`;
        throw new Error(msg);
      }

      // 成功
      ghToken = token;
      ghRepo = repo;
      ghBranch = DEFAULT_BRANCH;
      saveToken();
      isAdmin = true;
      hideLogin();
      updateAdminUI();
      await fetchPosts();
    } catch (e) {
      errEl.textContent = e.message;
      errEl.classList.remove('hidden');
    } finally {
      btn.innerHTML = '<i class="fa-solid fa-right-to-bracket mr-1.5"></i>登录';
      btn.disabled = false;
    }
  }

  async function doLogout() {
    if (!confirm('确定退出？Token 将从浏览器中清除。')) return;
    clearToken();
    isAdmin = false;
    updateAdminUI();
    await fetchPosts();
  }

  // ── 标签筛选 ──────────────────────────────────────
  function buildTagFilters() {
    const container = $('#journal-tags-filter');
    if (!container) return;
    const cats = new Set(posts.map(p => p.category).filter(Boolean));
    const tagSet = new Set();
    posts.forEach(p => (p.tags || []).forEach(t => tagSet.add(t)));

    let html = '<button class="journal-tag-btn active px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer" data-tag="all">全部</button>';
    cats.forEach(cat => {
      html += `<button class="journal-tag-btn px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer" data-tag="cat:${escapeHtml(cat)}">${escapeHtml(cat)}</button>`;
    });
    if (cats.size > 0 && tagSet.size > 0) html += '<span class="text-[var(--text-dim)] mx-1">|</span>';
    tagSet.forEach(tag => {
      html += `<button class="journal-tag-btn px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`;
    });
    container.innerHTML = html;
    container.querySelectorAll('.journal-tag-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.journal-tag-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderJournalList(btn.dataset.tag);
      });
    });
  }

  function renderJournalList(filter = 'all') {
    const container = $('#journal-list');
    if (!container) return;
    let filtered = [...posts];
    if (filter !== 'all') {
      if (filter.startsWith('cat:')) {
        filtered = filtered.filter(p => p.category === filter.slice(4));
      } else {
        filtered = filtered.filter(p => (p.tags || []).includes(filter));
      }
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon"><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i></div>
          <p class="empty-title">${filter === 'all' ? '暂无学习日志' : '该分类下暂无文章'}</p>
          <p class="empty-desc">${isAdmin ? '点击上方「新建日志」开始记录' : '学习日志即将上线，敬请期待'}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(p => {
      const excerpt = stripMarkdown(p.content || '').slice(0, 200);
      const tagHtml = (p.tags || []).map(t => `<span class="journal-badge">${escapeHtml(t)}</span>`).join('');
      const imageHtml = (p.images || []).slice(0, 3).map(img => {
        const src = img.startsWith('http') || img.startsWith('data:') ? img : img.startsWith('/') ? img : '/' + img;
        return `<img src="${escapeHtml(src)}" alt="图片" loading="lazy" />`;
      }).join('');
      const adminBtns = isAdmin ? `
        <div class="flex items-center gap-1.5 shrink-0" onclick="event.stopPropagation()">
          <button class="edit-post-btn px-2.5 py-1 rounded-md bg-[var(--bg-input)] border border-[var(--border-input)] text-[var(--text-muted)] text-xs hover:text-neon-blue hover:border-neon-blue/50 transition-colors" data-post-id="${p.id}" title="编辑">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
        </div>
      ` : '';
      return `
        <article class="journal-card" data-post-id="${p.id}">
          <div class="journal-card-header">
            <h3 class="journal-card-title">${escapeHtml(p.title)}</h3>
            ${adminBtns}
          </div>
          <div class="journal-card-meta">
            <span><i class="fa-regular fa-calendar"></i> ${escapeHtml(p.createdAt)}</span>
            ${p.category ? `<span><i class="fa-regular fa-folder"></i> ${escapeHtml(p.category)}</span>` : ''}
            ${(p.files || []).length > 0 ? `<span><i class="fa-solid fa-paperclip"></i> ${p.files.length} 个附件</span>` : ''}
            ${(p.images || []).length > 0 ? `<span><i class="fa-solid fa-image"></i> ${p.images.length} 张图片</span>` : ''}
          </div>
          <div class="journal-card-excerpt">${escapeHtml(excerpt)}</div>
          ${tagHtml ? `<div class="flex flex-wrap gap-1.5 mt-3">${tagHtml}</div>` : ''}
          ${imageHtml ? `<div class="journal-card-images">${imageHtml}</div>` : ''}
        </article>
      `;
    }).join('');

    container.querySelectorAll('.journal-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.edit-post-btn')) return;
        showPostDetail(card.dataset.postId);
      });
    });
    container.querySelectorAll('.edit-post-btn').forEach(btn => {
      btn.addEventListener('click', () => openEditor(btn.dataset.postId));
    });
  }

  // ── 文章详情 ──────────────────────────────────────
  function showPostDetail(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const modal = $('#post-detail-modal');
    const content = $('#post-detail-content');
    if (!modal || !content) return;

    const tagHtml = (post.tags || []).map(t => `<span class="journal-badge">${escapeHtml(t)}</span>`).join('');
    const imageHtml = (post.images || []).length > 0 ? `
      <div class="post-detail-images">
        ${post.images.map(img => {
          const src = img.startsWith('http') || img.startsWith('data:') ? img : img.startsWith('/') ? img : '/' + img;
          return `<img src="${escapeHtml(src)}" alt="图片" loading="lazy" />`;
        }).join('')}
      </div>
    ` : '';
    const fileHtml = (post.files || []).length > 0 ? `
      <div class="post-detail-files">
        <p class="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1 font-medium">📎 附件下载</p>
        ${post.files.map(f => {
          const fUrl = (f.url || f.path || '');
          const fileUrl = fUrl.startsWith('http') || fUrl.startsWith('/') ? fUrl : '/' + fUrl;
          return `<a href="${escapeHtml(fileUrl)}" class="post-file-link" target="_blank" rel="noopener">
            <i class="fa-solid fa-download"></i> ${escapeHtml(f.original_name || f.name || f.filename || '')}
          </a>`;
        }).join('')}
      </div>
    ` : '';
    const linkHtml = (post.links || []).length > 0 ? `
      <div class="post-detail-links">
        <p class="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1 font-medium">🔗 参考链接</p>
        ${post.links.map(l => `<a href="${escapeHtml(l)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l)}</a>`).join('')}
      </div>
    ` : '';

    content.innerHTML = `
      <div class="post-detail-header">
        <h2>${escapeHtml(post.title)}</h2>
        <div class="post-detail-meta">
          <span><i class="fa-regular fa-calendar"></i> ${escapeHtml(post.createdAt)}</span>
          ${post.category ? `<span><i class="fa-regular fa-folder"></i> ${escapeHtml(post.category)}</span>` : ''}
          <span><i class="fa-regular fa-clock"></i> 更新于 ${escapeHtml(post.updatedAt)}</span>
        </div>
        ${tagHtml ? `<div class="flex flex-wrap gap-1.5 mt-3">${tagHtml}</div>` : ''}
      </div>
      ${imageHtml}${fileHtml}
      <div class="post-detail-body">${simpleMarkdown(post.content || '')}</div>
      ${linkHtml}
      ${isAdmin ? `
        <div class="mt-8 pt-4 border-t border-[var(--border-default)] flex gap-3">
          <button class="edit-post-from-detail px-4 py-2 rounded-lg bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-sm hover:bg-neon-blue/20 transition-colors" data-post-id="${post.id}">
            <i class="fa-solid fa-pen-to-square mr-1.5"></i>编辑
          </button>
        </div>
      ` : ''}
    `;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    const editBtn = content.querySelector('.edit-post-from-detail');
    if (editBtn) editBtn.addEventListener('click', () => { closePostDetail(); openEditor(postId); });
    content.querySelectorAll('.post-detail-images img').forEach(img => {
      img.addEventListener('click', () => window.open(img.src, '_blank'));
    });
  }

  function closePostDetail() {
    $('#post-detail-modal').classList.add('hidden');
    document.body.style.overflow = '';
  }

  // ── Markdown ───────────────────────────────────────
  function simpleMarkdown(text) {
    if (!text) return '';
    let html = escapeHtml(text);
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => `<pre><code>${code}</code></pre>`);
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;margin:0.5em 0;" />');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
    html = html.replace(/^---$/gm, '<hr>');
    html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    html = html.replace(/\n\n+/g, '</p><p>');
    html = '<p>' + html + '</p>';
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<p>(<(?:h[1-3]|ul|ol|pre|blockquote|hr|div)[\s\S]*?)<\/p>/g, '$1');
    return html;
  }

  function stripMarkdown(text) {
    if (!text) return '';
    return text.replace(/```[\s\S]*?```/g, '[代码]').replace(/`([^`]+)`/g, '$1')
      .replace(/[#*\_\[\]\(\)\!]/g, '').replace(/\n{2,}/g, '。').replace(/\n/g, ' ').trim();
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── 编辑器 ─────────────────────────────────────────
  function openEditor(postId) {
    if (!isAdmin) {
      alert('请先登录（点击右上角 🔒 图标）');
      showLogin();
      return;
    }
    editingPostId = postId || null;
    const modal = $('#editor-modal');
    const titleLabel = $('#editor-title-label');
    const deleteBtn = $('#btn-delete-post');
    if (!modal) return;

    // 清空上传预览
    window._journalPendingUploads = [];

    if (postId) {
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      titleLabel.textContent = '编辑学习日志';
      $('#edit-title').value = post.title || '';
      $('#edit-content').value = post.content || '';
      $('#edit-category').value = post.category || '';
      $('#edit-tags').value = (post.tags || []).join(', ');
      $('#edit-links').value = (post.links || []).join('\n');
      window._journalPendingUploads = {
        images: (post.images || []).map(url => ({ url, done: true })),
        files: (post.files || []).map(f => ({
          url: f.url || f.path || '',
          filename: f.filename || '',
          original_name: f.original_name || f.name || '',
          done: true,
        })),
      };
      deleteBtn.classList.remove('hidden');
      deleteBtn.onclick = () => deletePost(postId);
    } else {
      titleLabel.textContent = '新建学习日志';
      ['edit-title', 'edit-content', 'edit-category', 'edit-tags', 'edit-links'].forEach(id => { $('#' + id).value = ''; });
      window._journalPendingUploads = { images: [], files: [] };
      deleteBtn.classList.add('hidden');
    }

    renderUploadPreviews();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#edit-title').focus(), 150);
  }

  function closeEditor() {
    $('#editor-modal').classList.add('hidden');
    document.body.style.overflow = '';
    editingPostId = null;
    window._journalPendingUploads = { images: [], files: [] };
  }

  function renderUploadPreviews() {
    const pending = window._journalPendingUploads || { images: [], files: [] };

    // 图片预览
    const imgContainer = $('#edit-images-preview');
    if (imgContainer) {
      if (pending.images.length === 0) {
        imgContainer.innerHTML = '<p class="text-xs text-[var(--text-dim)] w-full">暂无图片 — 选择图片后自动上传到 GitHub</p>';
      } else {
        imgContainer.innerHTML = pending.images.map((item, i) => `
          <span class="image-preview-item">
            <img src="${item.url}" alt="预览" />
            <span class="remove-image" data-i="${i}" title="移除"><i class="fa-solid fa-xmark"></i></span>
          </span>
        `).join('');
        imgContainer.querySelectorAll('.remove-image').forEach(btn => {
          btn.addEventListener('click', () => {
            pending.images.splice(parseInt(btn.dataset.i), 1);
            renderUploadPreviews();
          });
        });
      }
    }

    // 附件预览
    const fileContainer = $('#edit-files-preview');
    if (fileContainer) {
      if (pending.files.length === 0) {
        fileContainer.innerHTML = '<p class="text-xs text-[var(--text-dim)]">暂无附件 — 选择文件后自动上传到 GitHub</p>';
      } else {
        fileContainer.innerHTML = pending.files.map((item, i) => `
          <div class="file-preview-item">
            <span class="flex items-center gap-2 text-[var(--text-secondary)] truncate">
              <i class="fa-solid fa-file-lines text-[var(--text-dim)]"></i>
              <span class="truncate">${escapeHtml(item.original_name || item.filename || '文件')}</span>
              ${item.done ? '<span class="text-xs text-green-400">✓</span>' : '<span class="text-xs text-[var(--text-dim)]">上传中...</span>'}
            </span>
            <span class="remove-file" data-i="${i}"><i class="fa-solid fa-xmark"></i></span>
          </div>
        `).join('');
        fileContainer.querySelectorAll('.remove-file').forEach(btn => {
          btn.addEventListener('click', () => {
            pending.files.splice(parseInt(btn.dataset.i), 1);
            renderUploadPreviews();
          });
        });
      }
    }
  }

  async function handleFileSelect(files, type) {
    if (!isAdmin) return;
    const pending = window._journalPendingUploads || { images: [], files: [] };

    for (const file of files) {
      // 跳过超大文件（GitHub API 限制 100MB，保守 10MB）
      if (file.size > 10 * 1024 * 1024) {
        alert(`文件 "${file.name}" 超过 10MB，请压缩后上传`);
        continue;
      }

      const entry = { file, done: false, url: '', filename: '', original_name: file.name };
      if (type === 'image') {
        pending.images.push(entry);
      } else {
        pending.files.push(entry);
      }
    }
    renderUploadPreviews();

    // 逐个上传
    for (const entry of (type === 'image' ? pending.images : pending.files)) {
      if (entry.done) continue;
      try {
        const result = await uploadToGitHub(entry.file);
        entry.url = result.url;
        entry.filename = result.filename;
        entry.original_name = result.original_name;
        entry.done = true;
        entry.file = null;
        renderUploadPreviews();
      } catch (e) {
        alert(`"${entry.original_name}" 上传失败: ${e.message}`);
        const arr = type === 'image' ? pending.images : pending.files;
        const idx = arr.indexOf(entry);
        if (idx >= 0) arr.splice(idx, 1);
        renderUploadPreviews();
      }
    }
  }

  async function savePost() {
    const title = $('#edit-title').value.trim();
    if (!title) { alert('请输入标题'); $('#edit-title').focus(); return; }

    // 检查上传状态
    const pending = window._journalPendingUploads || { images: [], files: [] };
    if (pending.images.some(i => !i.done) || pending.files.some(f => !f.done)) {
      alert('还有文件正在上传中，请稍候再保存'); return;
    }

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toISOString().slice(0, 16).replace('T', ' ');

    const newPost = {
      id: editingPostId || `post-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`,
      title,
      content: $('#edit-content').value,
      category: $('#edit-category').value.trim(),
      tags: $('#edit-tags').value.split(',').map(t => t.trim()).filter(Boolean),
      links: $('#edit-links').value.split('\n').map(l => l.trim()).filter(Boolean),
      images: pending.images.map(i => i.url).filter(Boolean),
      files: pending.files.map(f => ({
        name: f.original_name, path: f.url, url: f.url,
        filename: f.filename, original_name: f.original_name,
      })).filter(f => f.url),
      pinned: false,
    };

    if (editingPostId) {
      const idx = posts.findIndex(p => p.id === editingPostId);
      if (idx >= 0) {
        newPost.createdAt = posts[idx].createdAt;
        posts[idx] = newPost;
      }
    } else {
      newPost.createdAt = dateStr;
      posts.push(newPost);
    }
    newPost.updatedAt = timeStr;

    const saveBtn = $('#btn-save-post');
    const origText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i>保存中...';
    saveBtn.disabled = true;

    try {
      const mode = isAdmin ? 'github' : 'flask';
      if (mode === 'github') {
        await savePostsToGitHub(`📝 ${editingPostId ? '编辑' : '新建'}学习日志: ${title}`);
      } else {
        const method = editingPostId ? 'PUT' : 'POST';
        const url = editingPostId ? `/api/posts/${editingPostId}` : '/api/posts';
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPost),
        });
        if (!res.ok) throw new Error('保存失败');
      }
      closeEditor();
      await fetchPosts();
    } catch (e) {
      alert('保存失败: ' + e.message);
    } finally {
      saveBtn.innerHTML = origText;
      saveBtn.disabled = false;
    }
  }

  async function deletePost(postId) {
    if (!confirm('确定要删除这篇日志吗？删除后会提交到 GitHub，可从 git 历史恢复。')) return;
    try {
      const idx = posts.findIndex(p => p.id === postId);
      if (idx >= 0) {
        posts.splice(idx, 1);
        await savePostsToGitHub(`🗑️ 删除学习日志`);
      }
      closeEditor();
      await fetchPosts();
    } catch (e) {
      alert('删除失败: ' + e.message);
      await fetchPosts(); // 重新加载
    }
  }

  // ── 事件绑定 ──────────────────────────────────────
  function bindEvents() {
    $('#admin-btn')?.addEventListener('click', () => {
      if (isAdmin) { /* 已登录 */ } else { showLogin(); }
    });
    $('#btn-login-submit')?.addEventListener('click', doLogin);
    $('#login-token')?.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
    $('#login-overlay')?.addEventListener('click', hideLogin);
    $('#login-modal .close-login')?.addEventListener('click', hideLogin);
    $('#btn-logout')?.addEventListener('click', doLogout);
    $('#btn-new-post')?.addEventListener('click', () => openEditor(null));
    $('#editor-overlay')?.addEventListener('click', closeEditor);
    $('#editor-modal .close-editor')?.addEventListener('click', closeEditor);
    $('#btn-save-post')?.addEventListener('click', savePost);
    $('#edit-image-input')?.addEventListener('change', (e) => {
      if (e.target.files.length > 0) handleFileSelect(e.target.files, 'image');
      e.target.value = '';
    });
    $('#edit-file-input')?.addEventListener('change', (e) => {
      if (e.target.files.length > 0) handleFileSelect(e.target.files, 'file');
      e.target.value = '';
    });
    $('#post-detail-overlay')?.addEventListener('click', closePostDetail);
    $('#post-detail-modal .close-post-detail')?.addEventListener('click', closePostDetail);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!$('#editor-modal')?.classList.contains('hidden')) closeEditor();
        else if (!$('#post-detail-modal')?.classList.contains('hidden')) closePostDetail();
        else if (!$('#login-modal')?.classList.contains('hidden')) hideLogin();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        if (!$('#editor-modal')?.classList.contains('hidden')) { e.preventDefault(); savePost(); }
      }
    });
  }

  // ── 初始化 ────────────────────────────────────────
  async function init() {
    bindEvents();
    // 尝试自动登录
    if (loadToken()) {
      isAdmin = true;
      updateAdminUI();
    }
    await fetchPosts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
