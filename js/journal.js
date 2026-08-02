/**
 * ============================================================
 *  TraceDev · 学习日志系统
 *  双模式：本地 Flask API（可读写）/ GitHub Pages 静态模式（只读）
 * ============================================================
 */
(function () {
  'use strict';

  // ── 状态 ──────────────────────────────────────────
  let hasBackend = false;        // true = Flask API 可用, false = 静态托管
  let isAdmin = false;
  let posts = [];
  let editingPostId = null;
  let pendingImages = [];
  let pendingFiles = [];

  // ── DOM 引用 ──────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);

  // ── API 封装 ──────────────────────────────────────
  async function api(url, opts = {}) {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      ...opts,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(err.error || `请求失败 (${res.status})`);
    }
    return res.json();
  }

  async function uploadFile(file, type) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', type);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: '上传失败' }));
      throw new Error(err.error);
    }
    return res.json();
  }

  // ── 检测后端 ──────────────────────────────────────
  async function detectBackend() {
    try {
      const r = await fetch('/api/check-auth');
      if (r.ok) {
        hasBackend = true;
      }
    } catch {
      hasBackend = false;
    }
    return hasBackend;
  }

  // ── 认证 ──────────────────────────────────────────
  async function checkAuth() {
    if (!hasBackend) { isAdmin = false; updateAdminUI(); return; }
    try {
      const r = await api('/api/check-auth');
      isAdmin = r.logged_in;
      updateAdminUI();
    } catch { isAdmin = false; updateAdminUI(); }
  }

  function updateAdminUI() {
    const bar = $('#journal-admin-bar');
    const btn = $('#admin-btn');
    const lockIcon = btn?.querySelector('i');

    if (!hasBackend) {
      // 静态托管模式：隐藏管理员入口
      if (bar) bar.classList.add('hidden');
      if (btn) {
        btn.title = '静态托管模式 — 本地启动 Flask 以管理日志';
        btn.classList.remove('text-neon-blue', 'border-neon-blue/30', 'bg-neon-blue/10');
        btn.classList.add('text-[var(--text-dim)]', 'opacity-60', 'cursor-not-allowed');
        if (lockIcon) {
          lockIcon.classList.remove('fa-lock-open');
          lockIcon.classList.add('fa-lock');
        }
      }
      return;
    }

    if (btn) {
      btn.classList.remove('opacity-60', 'cursor-not-allowed');
    }

    if (isAdmin) {
      if (bar) bar.classList.remove('hidden');
      if (btn) {
        btn.title = '已登录 - 管理员模式';
        btn.classList.add('text-neon-blue', 'border-neon-blue/30', 'bg-neon-blue/10');
        btn.classList.remove('text-[var(--text-dim)]');
        if (lockIcon) {
          lockIcon.classList.remove('fa-lock');
          lockIcon.classList.add('fa-lock-open');
        }
      }
    } else {
      if (bar) bar.classList.add('hidden');
      if (btn) {
        btn.title = '管理员登录';
        btn.classList.remove('text-neon-blue', 'border-neon-blue/30', 'bg-neon-blue/10');
        btn.classList.add('text-[var(--text-dim)]');
        if (lockIcon) {
          lockIcon.classList.remove('fa-lock-open');
          lockIcon.classList.add('fa-lock');
        }
      }
    }
    renderJournalList();
  }

  // ── 登录模态框 ──────────────────────────────────
  function showLogin() {
    if (!hasBackend) {
      alert('当前为静态托管模式（GitHub Pages），无法登录。\n\n请在本地运行 python3 server.py 来管理学习日志。');
      return;
    }
    const modal = $('#login-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    $('#login-password').value = '';
    $('#login-error').classList.add('hidden');
    setTimeout(() => $('#login-password').focus(), 150);
  }
  function hideLogin() {
    $('#login-modal').classList.add('hidden');
  }

  async function doLogin() {
    if (!hasBackend) return;
    const pw = $('#login-password').value;
    const errEl = $('#login-error');
    if (!pw) { errEl.textContent = '请输入密码'; errEl.classList.remove('hidden'); return; }
    try {
      await api('/api/login', { method: 'POST', body: JSON.stringify({ password: pw }) });
      isAdmin = true;
      hideLogin();
      updateAdminUI();
    } catch (e) {
      errEl.textContent = e.message;
      errEl.classList.remove('hidden');
    }
  }

  async function doLogout() {
    if (!hasBackend) return;
    try { await api('/api/logout', { method: 'POST' }); } catch {}
    isAdmin = false;
    updateAdminUI();
  }

  // ── 改密码 ──────────────────────────────────────
  function showChangePw() {
    if (!hasBackend) return;
    const modal = $('#change-pw-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    $('#changepw-old').value = '';
    $('#changepw-new').value = '';
    $('#changepw-error').classList.add('hidden');
    $('#changepw-success').classList.add('hidden');
  }
  function hideChangePw() {
    $('#change-pw-modal').classList.add('hidden');
  }

  async function doChangePw() {
    if (!hasBackend) return;
    const oldPw = $('#changepw-old').value;
    const newPw = $('#changepw-new').value;
    const errEl = $('#changepw-error');
    const okEl = $('#changepw-success');
    errEl.classList.add('hidden');
    okEl.classList.add('hidden');
    if (newPw.length < 6) { errEl.textContent = '新密码至少6位'; errEl.classList.remove('hidden'); return; }
    try {
      await api('/api/change-password', {
        method: 'POST',
        body: JSON.stringify({ old_password: oldPw, new_password: newPw }),
      });
      okEl.textContent = '密码修改成功！';
      okEl.classList.remove('hidden');
      setTimeout(hideChangePw, 1500);
    } catch (e) {
      errEl.textContent = e.message;
      errEl.classList.remove('hidden');
    }
  }

  // ── 文章获取（双模式）─────────────────────────
  async function fetchPosts() {
    if (hasBackend) {
      try {
        posts = await api('/api/posts');
      } catch {
        posts = [];
      }
    } else {
      // 静态模式：直接从 JSON 文件读取
      try {
        const res = await fetch('/data/posts.json');
        if (res.ok) {
          posts = await res.json();
        } else {
          posts = [];
        }
      } catch {
        posts = [];
      }
      // 按时间倒序
      posts.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    }
    renderJournalList();
    buildTagFilters();
  }

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
        const cat = filter.slice(4);
        filtered = filtered.filter(p => p.category === cat);
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
        // 处理相对/绝对路径
        const src = img.startsWith('http') ? img : img.startsWith('/') ? img : '/' + img;
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
          const src = img.startsWith('http') ? img : img.startsWith('/') ? img : '/' + img;
          return `<img src="${escapeHtml(src)}" alt="图片" loading="lazy" />`;
        }).join('')}
      </div>
    ` : '';
    const fileHtml = (post.files || []).length > 0 ? `
      <div class="post-detail-files">
        <p class="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1 font-medium">📎 附件下载</p>
        ${post.files.map(f => {
          const fileUrl = (f.url || f.path || '').startsWith('http') ? (f.url || f.path) : (f.url || f.path || '').startsWith('/') ? (f.url || f.path) : '/' + (f.url || f.path);
          return `<a href="${escapeHtml(fileUrl)}" class="post-file-link" download>
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
      ${imageHtml}
      ${fileHtml}
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
    if (editBtn) {
      editBtn.addEventListener('click', () => { closePostDetail(); openEditor(postId); });
    }
    content.querySelectorAll('.post-detail-images img').forEach(img => {
      img.addEventListener('click', () => window.open(img.src, '_blank'));
    });
  }

  function closePostDetail() {
    $('#post-detail-modal').classList.add('hidden');
    document.body.style.overflow = '';
  }

  // ── Markdown 渲染 ──────────────────────────────────
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

  // ── 文章编辑器（仅 Flask 模式）────────────────────
  function openEditor(postId) {
    if (!hasBackend) {
      alert('静态托管模式下无法编辑。请在本地运行 python3 server.py 来管理学习日志。');
      return;
    }
    editingPostId = postId || null;
    pendingImages = [];
    pendingFiles = [];

    const modal = $('#editor-modal');
    const titleLabel = $('#editor-title-label');
    const deleteBtn = $('#btn-delete-post');
    if (!modal) return;

    if (postId) {
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      titleLabel.textContent = '编辑学习日志';
      $('#edit-title').value = post.title || '';
      $('#edit-content').value = post.content || '';
      $('#edit-category').value = post.category || '';
      $('#edit-tags').value = (post.tags || []).join(', ');
      $('#edit-links').value = (post.links || []).join('\n');
      pendingImages = (post.images || []).map(url => ({ uploaded: { url, filename: url.split('/').pop() } }));
      pendingFiles = (post.files || []).map(f => ({
        uploaded: { filename: f.path?.split('/').pop() || f.filename, url: f.url || f.path, original_name: f.original_name || f.name }
      }));
      deleteBtn.classList.remove('hidden');
      deleteBtn.onclick = () => deletePost(postId);
    } else {
      titleLabel.textContent = '新建学习日志';
      ['edit-title', 'edit-content', 'edit-category', 'edit-tags', 'edit-links'].forEach(id => { $('#' + id).value = ''; });
      deleteBtn.classList.add('hidden');
    }

    renderImagePreviews();
    renderFilePreviews();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#edit-title').focus(), 150);
  }

  function closeEditor() {
    $('#editor-modal').classList.add('hidden');
    document.body.style.overflow = '';
    editingPostId = null;
    pendingImages = [];
    pendingFiles = [];
  }

  function renderImagePreviews() {
    const container = $('#edit-images-preview');
    if (!container) return;
    if (pendingImages.length === 0) {
      container.innerHTML = '<p class="text-xs text-[var(--text-dim)] w-full">暂无图片</p>';
      return;
    }
    container.innerHTML = pendingImages.map((item, i) => {
      const src = item.uploaded ? item.uploaded.url : URL.createObjectURL(item.file);
      return `<span class="image-preview-item"><img src="${src}" alt="预览" /><span class="remove-image" data-index="${i}" title="移除"><i class="fa-solid fa-xmark"></i></span></span>`;
    }).join('');
    container.querySelectorAll('.remove-image').forEach(btn => {
      btn.addEventListener('click', () => { pendingImages.splice(parseInt(btn.dataset.index), 1); renderImagePreviews(); });
    });
  }

  async function handleImageUpload(files) {
    for (const file of files) pendingImages.push({ file, uploaded: null });
    renderImagePreviews();
    for (const item of pendingImages) {
      if (item.uploaded) continue;
      try {
        const result = await uploadFile(item.file, 'image');
        item.uploaded = { url: result.url, filename: result.filename };
        item.file = null;
        renderImagePreviews();
      } catch (e) {
        alert(`图片上传失败: ${e.message}`);
        const idx = pendingImages.indexOf(item);
        if (idx >= 0) pendingImages.splice(idx, 1);
        renderImagePreviews();
      }
    }
  }

  function renderFilePreviews() {
    const container = $('#edit-files-preview');
    if (!container) return;
    if (pendingFiles.length === 0) {
      container.innerHTML = '<p class="text-xs text-[var(--text-dim)]">暂无附件</p>';
      return;
    }
    container.innerHTML = pendingFiles.map((item, i) => {
      const name = item.uploaded ? item.uploaded.original_name || item.file?.name : item.file?.name || '未知文件';
      return `<div class="file-preview-item">
        <span class="flex items-center gap-2 text-[var(--text-secondary)] truncate">
          <i class="fa-solid fa-file-lines text-[var(--text-dim)]"></i>
          <span class="truncate">${escapeHtml(name)}</span>
          ${!item.uploaded ? '<span class="text-xs text-[var(--text-dim)]">上传中...</span>' : '<span class="text-xs text-green-400">✓</span>'}
        </span>
        <span class="remove-file" data-index="${i}"><i class="fa-solid fa-xmark"></i></span>
      </div>`;
    }).join('');
    container.querySelectorAll('.remove-file').forEach(btn => {
      btn.addEventListener('click', () => { pendingFiles.splice(parseInt(btn.dataset.index), 1); renderFilePreviews(); });
    });
  }

  async function handleFileUpload(files) {
    for (const file of files) pendingFiles.push({ file, uploaded: null });
    renderFilePreviews();
    for (const item of pendingFiles) {
      if (item.uploaded) continue;
      try {
        const result = await uploadFile(item.file, 'file');
        item.uploaded = { url: result.url, filename: result.filename, original_name: result.original_name || item.file.name };
        item.file = null;
        renderFilePreviews();
      } catch (e) {
        alert(`文件上传失败: ${e.message}`);
        const idx = pendingFiles.indexOf(item);
        if (idx >= 0) pendingFiles.splice(idx, 1);
        renderFilePreviews();
      }
    }
  }

  async function savePost() {
    const title = $('#edit-title').value.trim();
    if (!title) { alert('请输入标题'); $('#edit-title').focus(); return; }

    const uploadingFiles = pendingFiles.filter(f => !f.uploaded);
    const uploadingImages = pendingImages.filter(i => !i.uploaded);
    if (uploadingFiles.length > 0 || uploadingImages.length > 0) {
      alert('还有文件正在上传中，请稍候再保存'); return;
    }

    const body = {
      title,
      content: $('#edit-content').value,
      category: $('#edit-category').value.trim(),
      tags: $('#edit-tags').value.split(',').map(t => t.trim()).filter(Boolean),
      links: $('#edit-links').value.split('\n').map(l => l.trim()).filter(Boolean),
      images: pendingImages.map(i => i.uploaded?.url).filter(Boolean),
      files: pendingFiles.map(f => f.uploaded ? {
        name: f.uploaded.original_name, path: f.uploaded.url, url: f.uploaded.url,
        filename: f.uploaded.filename, original_name: f.uploaded.original_name,
      } : null).filter(Boolean),
    };

    const saveBtn = $('#btn-save-post');
    const origText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i>保存中...';
    saveBtn.disabled = true;

    try {
      if (editingPostId) {
        await api(`/api/posts/${editingPostId}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        await api('/api/posts', { method: 'POST', body: JSON.stringify(body) });
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
    if (!confirm('确定要删除这篇日志吗？此操作不可撤销。')) return;
    try {
      await api(`/api/posts/${postId}`, { method: 'DELETE' });
      closeEditor();
      await fetchPosts();
    } catch (e) { alert('删除失败: ' + e.message); }
  }

  // ── 事件绑定 ──────────────────────────────────────

  function bindEvents() {
    // 管理员按钮 — 静态模式下点击提示说明
    $('#admin-btn')?.addEventListener('click', () => {
      if (!hasBackend) {
        alert('🔒 当前为静态托管模式（GitHub Pages 只读）\n\n💡 要管理学习日志，请在本地运行：\n\n    cd download-site\n    python3 server.py\n\n    然后访问 http://localhost:5050\n\n📖 线上用户仍然可以看到你推送的学习日志内容。');
      } else if (isAdmin) {
        // 已登录可退出
      } else {
        showLogin();
      }
    });

    $('#btn-login-submit')?.addEventListener('click', doLogin);
    $('#login-password')?.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
    $('#login-overlay')?.addEventListener('click', hideLogin);
    $('#login-modal .close-login')?.addEventListener('click', hideLogin);
    $('#btn-logout')?.addEventListener('click', doLogout);
    $('#btn-change-pw')?.addEventListener('click', showChangePw);
    $('#btn-changepw-submit')?.addEventListener('click', doChangePw);
    $('#change-pw-overlay')?.addEventListener('click', hideChangePw);
    $('#change-pw-modal .close-changepw')?.addEventListener('click', hideChangePw);
    $('#btn-new-post')?.addEventListener('click', () => openEditor(null));
    $('#editor-overlay')?.addEventListener('click', closeEditor);
    $('#editor-modal .close-editor')?.addEventListener('click', closeEditor);
    $('#btn-save-post')?.addEventListener('click', savePost);
    $('#edit-image-input')?.addEventListener('change', (e) => {
      if (e.target.files.length > 0) handleImageUpload(e.target.files);
      e.target.value = '';
    });
    $('#edit-file-input')?.addEventListener('change', (e) => {
      if (e.target.files.length > 0) handleFileUpload(e.target.files);
      e.target.value = '';
    });
    $('#post-detail-overlay')?.addEventListener('click', closePostDetail);
    $('#post-detail-modal .close-post-detail')?.addEventListener('click', closePostDetail);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!$('#editor-modal')?.classList.contains('hidden')) closeEditor();
        else if (!$('#post-detail-modal')?.classList.contains('hidden')) closePostDetail();
        else if (!$('#login-modal')?.classList.contains('hidden')) hideLogin();
        else if (!$('#change-pw-modal')?.classList.contains('hidden')) hideChangePw();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        if (!$('#editor-modal')?.classList.contains('hidden')) { e.preventDefault(); savePost(); }
      }
    });
  }

  // ── 初始化 ────────────────────────────────────────
  async function init() {
    bindEvents();
    await detectBackend();
    if (hasBackend) await checkAuth();
    else updateAdminUI();
    await fetchPosts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
