/**
 * ============================================================
 *  TraceDev · 学习日志系统
 *  密码登录 → 自动解密内嵌 GitHub Token → 在线编辑
 * ============================================================
 */
(function () {
  'use strict';

  const ENC_TOKEN = "XwoVZwACXml4ClIwFAEUUUc4aSowW3JhBWNfQwdUa15oVVRaXxpyBg==";
  const PASSWORD_HASH = '8be87c83329cc5b04a1cb883c346b897002661b61b0e87011cd92c979c08356d';
  const GITHUB_API = 'https://api.github.com';
  const POSTS_PATH = 'data/posts.json';
  const DEFAULT_REPO = 'wfw6666666666/traceDev';
  const DEFAULT_BRANCH = 'master';
  const ANTHROPIC_API = 'https://api.deepseek.com/v1/chat/completions';
  const AI_MODEL = 'deepseek-v4-pro';

  let ghToken = null;
  let ghRepo = DEFAULT_REPO;
  let ghBranch = DEFAULT_BRANCH;
  let postsSha = null;
  let isAdmin = false;
  let posts = [];
  let editingPostId = null;
  let aiKey = null;  // Anthropic API key

  const $ = (sel) => document.querySelector(sel);
  const b64e = (s) => btoa(unescape(encodeURIComponent(s)));
  const b64d = (s) => decodeURIComponent(escape(atob(s)));

  // ── 解密内嵌 Token（key = 密码哈希前32位）───────
  function decryptEmbeddedToken() {
    if (!ENC_TOKEN) return null;
    try {
      const dec = atob(ENC_TOKEN);
      const key = PASSWORD_HASH.slice(0, 32);
      const pad = key.repeat(Math.ceil(dec.length / key.length) + 1).slice(0, dec.length);
      return dec.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ pad.charCodeAt(i))).join('');
    } catch { return null; }
  }

  // ── AI Key 管理（加密存 localStorage）───────────
  function loadAiKey() {
    try {
      const raw = localStorage.getItem('tracedev_ai_key');
      if (!raw) return false;
      const dec = b64d(raw);
      const key = PASSWORD_HASH.slice(0, 32);
      const pad = key.repeat(Math.ceil(dec.length / key.length) + 1).slice(0, dec.length);
      aiKey = dec.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ pad.charCodeAt(i))).join('');
      return aiKey.startsWith('sk-');
    } catch { return false; }
  }

  function saveAiKey(k) {
    const key = PASSWORD_HASH.slice(0, 32);
    const pad = key.repeat(Math.ceil(k.length / key.length) + 1).slice(0, k.length);
    const enc = k.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ pad.charCodeAt(i))).join('');
    localStorage.setItem('tracedev_ai_key', b64e(enc));
    aiKey = k;
  }

  function clearAiKey() {
    localStorage.removeItem('tracedev_ai_key');
    aiKey = null;
  }

  // ── AI 整理：调用 DeepSeek API ─────────────────────
  async function aiOrganize() {
    if (!aiKey) {
      alert('请先在「AI 设置」中配置 DeepSeek API Key');
      showAiSettings();
      return false;
    }

    const title = $('#edit-title').value.trim();
    const content = $('#edit-content').value.trim();
    const category = $('#edit-category').value.trim();
    const tags = $('#edit-tags').value.trim();
    const links = $('#edit-links').value.trim();

    if (!content && !title) {
      alert('请先写一些内容或标题，AI 才能帮你整理');
      return false;
    }

    const btn = $('#btn-ai-organize');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i>AI 整理中...';
    btn.disabled = true;

    // 获取已上传的图片，fetch 后转 base64
    const p = window._journalPending || { images: [], files: [] };
    const doneImages = p.images.filter(i => i.done && i.url);

    // fetch each image and convert to base64 data URL
    const imageDataUrls = [];
    for (const img of doneImages) {
      try {
        const resp = await fetch(img.url);
        if (resp.ok) {
          const blob = await resp.blob();
          const dataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
          imageDataUrls.push(dataUrl);
        }
      } catch {}
    }

    // 构建 prompt 文本
    const promptText = `你是一名资深技术文档编辑，擅长将零散的工程笔记整理成结构化、专业的技术文章。

请根据以下用户提供的内容${imageDataUrls.length > 0 ? '和上传的截图/照片' : ''}，输出一篇完整的学习日志。要求：

1. **标题**：用户已有标题则保留优化，否则根据内容提炼一个精准标题
2. **结构**：使用 Markdown 格式，包含 ## 二级标题分章节
3. **排版**：
   - 规格参数用表格或列表
   - 代码/命令用 \`\`\` 代码块
   - 关键概念用 **粗体** 标注
   - 步骤用数字列表
${imageDataUrls.length > 0 ? '4. **图文结合**：仔细分析上传的图片，将图片里可见的关键信息（芯片型号、电路连接、参数标注、波形数据、PCB布局等）提取到正文中，图片链接用 Markdown 语法插入到对应章节' : '4. **知识拓展**：在相关章节末尾加 💡 提示'}
5. **保留所有原始信息**，不删减用户提供的任何数据

---
**用户原始信息：**

标题：${title || '（无）'}
分类：${category || '（无）'}
标签：${tags || '（无）'}

正文：
${content || '（请根据标题、分类和图片来生成内容）'}

${links ? '参考链接：\n' + links : ''}
${doneImages.length > 0 ? '\n已上传图片：\n' + doneImages.map((img, i) => `[图片${i+1}](${img.url})`).join('\n') : ''}

---
请输出完整的 Markdown 正文（不要用代码块包裹）。图片用 [图片N](URL) 形式插入正文，不要省略。`;

    // 构建消息：纯文本 + 图片 data URL
    // DeepSeek V4-Pro 支持 image_url（OpenAI 兼容格式）
    const hasImages = imageDataUrls.length > 0;
    let messages;
    if (hasImages) {
      const contentArr = [{ type: 'text', text: promptText }];
      for (const dataUrl of imageDataUrls) {
        contentArr.push({ type: 'image_url', image_url: { url: dataUrl } });
      }
      messages = [{ role: 'user', content: contentArr }];
    } else {
      messages = [{ role: 'user', content: promptText }];
    }

    let res, data;
    try {
      res = await fetch(ANTHROPIC_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiKey}`,
        },
        body: JSON.stringify({
          model: AI_MODEL,
          max_tokens: 8192,
          messages: messages,
        }),
      });

      // 如果图片格式被拒，自动降级为纯文本重试
      if (!res.ok && hasImages) {
        const err = await res.json().catch(() => ({}));
        if (err.error?.message?.includes('image_url') || err.error?.message?.includes('unknown variant')) {
          res = await fetch(ANTHROPIC_API, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${aiKey}`,
            },
            body: JSON.stringify({
              model: AI_MODEL,
              max_tokens: 8192,
              messages: [{ role: 'user', content: promptText }],
            }),
          });
        }
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 401) throw new Error('API Key 无效，请检查 DeepSeek API Key');
        throw new Error(err.error?.message || `API 错误 (${res.status})`);
      }

      const data = await res.json();
      let result = data.choices?.[0]?.message?.content || '';

      // 清理可能的代码块包裹
      result = result.replace(/^```markdown\s*\n?/i, '').replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '');

      // 尝试提取标题（第一行 # xxx）
      const titleMatch = result.match(/^# (.+)$/m);
      if (titleMatch && !$('#edit-title').value.trim()) {
        $('#edit-title').value = titleMatch[1].trim();
      }

      // 移除第一行标题后填充正文
      result = result.replace(/^# .+\n\n?/, '').trim();
      $('#edit-content').value = result;

      // 自动提取标签
      if (!$('#edit-tags').value.trim()) {
        const tagHints = result.match(/#(\S+)/g);
        if (tagHints) {
          const extracted = [...new Set(tagHints.map(t => t.replace('#', '')))].slice(0, 8);
          $('#edit-tags').value = extracted.join(', ');
        }
      }

      return true;
    } catch (e) {
      alert('AI 整理失败: ' + e.message);
      return false;
    } finally {
      btn.innerHTML = orig;
      btn.disabled = false;
    }
  }

  // ── AI 设置模态框 ───────────────────────────────
  function showAiSettings() {
    const modal = $('#ai-settings-modal');
    if (!modal) return;
    $('#ai-api-key').value = '';
    $('#ai-settings-msg').classList.add('hidden');
    modal.classList.remove('hidden');
    setTimeout(() => $('#ai-api-key').focus(), 150);
  }
  function hideAiSettings() { $('#ai-settings-modal').classList.add('hidden'); }

  function doSaveAiKey() {
    const k = $('#ai-api-key').value.trim();
    if (!k.startsWith('sk-')) {
      alert('API Key 应以 sk- 开头。请在 https://platform.deepseek.com/api_keys 获取。');
      return;
    }
    saveAiKey(k);
    $('#ai-settings-msg').textContent = 'API Key 已保存！';
    $('#ai-settings-msg').classList.remove('hidden');
    setTimeout(hideAiSettings, 800);
  }

  // ── SHA-256 ──────────────────────────────────────
  async function sha256(text) {
    const enc = new TextEncoder();
    const buf = await crypto.subtle.digest('SHA-256', enc.encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function clearAuth() {
    ghToken = null;
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
      throw new Error(err.message || `GitHub API ${res.status}`);
    }
    return res.json();
  }

  async function ghRead(path) {
    const data = await ghAPI(path + `?ref=${ghBranch}`);
    return {
      content: JSON.parse(decodeURIComponent(escape(atob(data.content)))),
      sha: data.sha,
    };
  }

  async function ghWrite(path, content, sha, commitMsg) {
    const body = {
      message: commitMsg || '📝 更新学习日志',
      content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
      branch: ghBranch,
    };
    if (sha) body.sha = sha;
    const result = await ghAPI(path, { method: 'PUT', body: JSON.stringify(body) });
    return { sha: result.content.sha };
  }

  // ── 上传文件到 GitHub ─────────────────────────────
  async function uploadToGitHub(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result.split(',')[1];
          const ts = Date.now();
          const safeName = file.name.replace(/[^a-zA-Z0-9._一-鿿-]/g, '_');
          const path = `uploads/${ts}_${safeName}`;
          const [owner, repo] = ghRepo.split('/');
          const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;
          const headers = {
            'Authorization': `Bearer ${ghToken}`,
            'Accept': 'application/vnd.github.v3+json',
          };
          let sha = null;
          try {
            const cr = await fetch(url + `?ref=${ghBranch}`, { headers });
            if (cr.ok) sha = (await cr.json()).sha;
          } catch {}
          const body = { message: `📎 上传: ${file.name}`, content: base64, branch: ghBranch };
          if (sha) body.sha = sha;
          const res = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(body) });
          if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || '上传失败');
          const result = await res.json();
          resolve({
            url: `https://raw.githubusercontent.com/${owner}/${repo}/${ghBranch}/${path}`,
            filename: `${ts}_${safeName}`,
            original_name: file.name,
          });
        } catch (e) { reject(e); }
      };
      reader.onerror = () => reject(new Error('读取文件失败'));
      reader.readAsDataURL(file);
    });
  }

  // ── 后端检测 ──────────────────────────────────────
  async function detectBackend() {
    if (isAdmin && ghToken) return 'github';
    try {
      const res = await fetch('/api/check-auth');
      // 必须是 JSON 响应才算 Flask 可用（排除 GitHub Pages 的 HTML 回退）
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) return 'flask';
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
        if (!Array.isArray(posts)) posts = [];
      } else if (mode === 'flask') {
        const res = await fetch('/api/posts');
        posts = await res.json();
      } else {
        // 普通用户从静态文件读取，加时间戳防缓存
        const res = await fetch('data/posts.json?t=' + Date.now());
        if (res.ok) posts = await res.json();
        else posts = [];
      }
    } catch (e) {
      console.warn('获取文章失败:', e.message);
      posts = [];
    }
    posts.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    renderJournalList();
    buildTagFilters();
    window.dispatchEvent(new CustomEvent('tracedev:journal-loaded', { detail: posts }));
  }

  async function savePostsToGitHub(commitMsg) {
    // 重要：先重新获取最新 SHA，避免冲突
    try {
      const latest = await ghRead(POSTS_PATH);
      // 合并文章：用本地版本替换/插入
      const remotePosts = Array.isArray(latest.content) ? latest.content : [];
      const merged = [...remotePosts];
      for (const p of posts) {
        const idx = merged.findIndex(r => r.id === p.id);
        if (idx >= 0) merged[idx] = p;
        else merged.push(p);
      }
      const sorted = merged.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      const result = await ghWrite(POSTS_PATH, sorted, latest.sha, commitMsg);
      postsSha = result.sha;
      posts = sorted; // 更新本地缓存
    } catch (e) {
      // 如果仍然失败（并发冲突），重试一次
      if (e.message.includes('does not match') || e.message.includes('409')) {
        const latest = await ghRead(POSTS_PATH);
        const remotePosts = Array.isArray(latest.content) ? latest.content : [];
        const merged = [...remotePosts];
        for (const p of posts) {
          const idx = merged.findIndex(r => r.id === p.id);
          if (idx >= 0) merged[idx] = p;
          else merged.push(p);
        }
        const sorted = merged.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        const result = await ghWrite(POSTS_PATH, sorted, latest.sha, commitMsg);
        postsSha = result.sha;
        posts = sorted;
      } else {
        throw e;
      }
    }
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
        btn.title = '管理员登录';
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
    $('#login-password').value = '';
    $('#login-error').classList.add('hidden');
    modal.classList.remove('hidden');
    setTimeout(() => $('#login-password').focus(), 150);
  }
  function hideLogin() { $('#login-modal').classList.add('hidden'); }

  async function doLogin() {
    const pw = $('#login-password').value;
    const errEl = $('#login-error');
    if (!pw) { errEl.textContent = '请输入密码'; errEl.classList.remove('hidden'); return; }

    errEl.classList.add('hidden');
    const btn = $('#btn-login-submit');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i>验证中...';
    btn.disabled = true;

    try {
      const hash = await sha256(pw);
      if (hash !== PASSWORD_HASH) throw new Error('密码错误');

      // 按优先级尝试获取 Token:
      // 1. 从代码内嵌的 ENC_TOKEN 解密
      // 2. 从 localStorage 解密
      let token = null;

      if (ENC_TOKEN) {
        token = decryptEmbeddedToken();
        if (!token || !token.startsWith('ghp_')) token = null;
      }

      if (!token) {
        try {
          const saved = JSON.parse(localStorage.getItem('tracedev_auth') || '{}');
          if (saved.enc_token) {
            const xored = decodeURIComponent(escape(atob(saved.enc_token)));
            const repeat = Math.ceil(xored.length / pw.length) + 1;
            const key = pw.repeat(repeat).slice(0, xored.length);
            token = xored.split('').map((c,i) => String.fromCharCode(c.charCodeAt(0)^key.charCodeAt(i))).join('');
          }
        } catch {}
      }

      if (!token) throw new Error('未找到 GitHub Token。请在本地运行 python3 _gen_token.py 生成内嵌 Token。');

      // 验证 Token
      ghToken = token;
      const [owner, repo] = ghRepo.split('/');
      const url = `${GITHUB_API}/repos/${owner}/${repo}`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${ghToken}`, 'Accept': 'application/vnd.github.v3+json' },
      });
      if (!res.ok) throw new Error('Token 已过期，请重新生成并运行 _gen_token.py');

      // 成功登录
      isAdmin = true;
      loadAiKey();
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
    if (!confirm('确定退出？')) return;
    clearAuth();
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

    let html = '<button class="journal-tag-btn active" data-tag="all">全部</button>';
    cats.forEach(cat => html += `<button class="journal-tag-btn" data-tag="cat:${escapeHtml(cat)}">${escapeHtml(cat)}</button>`);
    if (cats.size > 0 && tagSet.size > 0) html += '<span class="text-[var(--text-dim)] mx-1">|</span>';
    tagSet.forEach(tag => html += `<button class="journal-tag-btn" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`);
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
      container.innerHTML = `<div class="empty-state">
        <div class="empty-icon"><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i></div>
        <p class="empty-title">${filter === 'all' ? '暂无学习日志' : '该分类下暂无文章'}</p>
        <p class="empty-desc">${isAdmin ? '点击上方「新建日志」开始记录' : '学习日志即将上线，敬请期待'}</p>
      </div>`;
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
        <div class="journal-admin-actions" onclick="event.stopPropagation()">
          <button class="edit-post-btn btn-quiet" data-post-id="${p.id}" title="编辑">编辑</button>
        </div>` : '';
      return `<article class="journal-card" data-post-id="${p.id}">
        <div class="journal-card-header"><h3 class="journal-card-title">${escapeHtml(p.title)}</h3>${adminBtns}</div>
        <div class="journal-card-meta">
          <span>${escapeHtml(p.createdAt)}</span>
          ${p.category ? `<span>${escapeHtml(p.category)}</span>` : ''}
          ${(p.files || []).length > 0 ? `<span>${p.files.length} 个附件</span>` : ''}
          ${(p.images || []).length > 0 ? `<span>${p.images.length} 张图片</span>` : ''}
        </div>
        <div class="journal-card-excerpt">${escapeHtml(excerpt)}</div>
        ${tagHtml ? `<div class="journal-tags">${tagHtml}</div>` : ''}
        ${imageHtml ? `<div class="journal-card-images">${imageHtml}</div>` : ''}
      </article>`;
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
    const imageHtml = (post.images || []).length > 0 ? `<div class="post-detail-images">${post.images.map(img => {
      const src = img.startsWith('http') || img.startsWith('data:') ? img : img.startsWith('/') ? img : '/' + img;
      return `<img src="${escapeHtml(src)}" alt="图片" loading="lazy" />`;
    }).join('')}</div>` : '';
    const fileHtml = (post.files || []).length > 0 ? `<div class="post-detail-files">
      <p class="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1 font-medium">📎 附件下载</p>
      ${post.files.map(f => {
        const fUrl = (f.url || f.path || '');
        return `<a href="${escapeHtml(fUrl.startsWith('http') || fUrl.startsWith('/') ? fUrl : '/' + fUrl)}" class="post-file-link" target="_blank" rel="noopener">
          <i class="fa-solid fa-download"></i> ${escapeHtml(f.original_name || f.name || f.filename || '')}</a>`;
      }).join('')}
    </div>` : '';
    const linkHtml = (post.links || []).length > 0 ? `<div class="post-detail-links">
      <p class="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1 font-medium">🔗 参考链接</p>
      ${post.links.map(l => `<a href="${escapeHtml(l)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l)}</a>`).join('')}
    </div>` : '';

    content.innerHTML = `<div class="post-detail-header">
      <h2>${escapeHtml(post.title)}</h2>
      <div class="post-detail-meta">
        <span>${escapeHtml(post.createdAt)}</span>
        ${post.category ? `<span>${escapeHtml(post.category)}</span>` : ''}
        <span>更新于 ${escapeHtml(post.updatedAt)}</span>
      </div>${tagHtml ? `<div class="journal-tags mt-3">${tagHtml}</div>` : ''}
    </div>${imageHtml}${fileHtml}
    <div class="post-detail-body">${simpleMarkdown(post.content || '')}</div>${linkHtml}
    ${isAdmin ? `<div class="mt-8 pt-4 border-t border-[var(--border-default)] flex gap-3">
      <button class="edit-post-from-detail btn-secondary" data-post-id="${post.id}">编辑</button>
    </div>` : ''}`;
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
    if (!isAdmin) { alert('请先登录'); showLogin(); return; }
    editingPostId = postId || null;
    const modal = $('#editor-modal');
    const titleLabel = $('#editor-title-label');
    const deleteBtn = $('#btn-delete-post');
    if (!modal) return;

    window._journalPending = { images: [], files: [] };

    if (postId) {
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      titleLabel.textContent = '编辑学习日志';
      $('#edit-title').value = post.title || '';
      $('#edit-content').value = post.content || '';
      $('#edit-category').value = post.category || '';
      $('#edit-tags').value = (post.tags || []).join(', ');
      $('#edit-links').value = (post.links || []).join('\n');
      window._journalPending = {
        images: (post.images || []).map(url => ({ url, done: true })),
        files: (post.files || []).map(f => ({
          url: f.url || f.path || '', filename: f.filename || '',
          original_name: f.original_name || f.name || '', done: true,
        })),
      };
      deleteBtn.classList.remove('hidden');
      deleteBtn.onclick = () => deletePost(postId);
    } else {
      titleLabel.textContent = '新建学习日志';
      ['edit-title', 'edit-content', 'edit-category', 'edit-tags', 'edit-links'].forEach(id => { $('#' + id).value = ''; });
      window._journalPending = { images: [], files: [] };
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
    window._journalPending = { images: [], files: [] };
  }

  function renderUploadPreviews() {
    const p = window._journalPending || { images: [], files: [] };
    const imgC = $('#edit-images-preview');
    if (imgC) {
      if (p.images.length === 0) {
        imgC.innerHTML = '<p class="text-xs text-[var(--text-dim)] w-full">暂无图片 — 选择后自动上传到 GitHub</p>';
      } else {
        imgC.innerHTML = p.images.map((item, i) => `
          <span class="image-preview-item"><img src="${item.url}" alt="预览" /><span class="remove-image" data-i="${i}"><i class="fa-solid fa-xmark"></i></span></span>
        `).join('');
        imgC.querySelectorAll('.remove-image').forEach(btn => {
          btn.addEventListener('click', () => { p.images.splice(parseInt(btn.dataset.i), 1); renderUploadPreviews(); });
        });
      }
    }
    const fileC = $('#edit-files-preview');
    if (fileC) {
      if (p.files.length === 0) {
        fileC.innerHTML = '<p class="text-xs text-[var(--text-dim)]">暂无附件 — 选择后自动上传到 GitHub</p>';
      } else {
        fileC.innerHTML = p.files.map((item, i) => `
          <div class="file-preview-item">
            <span class="flex items-center gap-2 text-[var(--text-secondary)] truncate">
              <i class="fa-solid fa-file-lines text-[var(--text-dim)]"></i>
              <span class="truncate">${escapeHtml(item.original_name || item.filename || '文件')}</span>
              ${item.done ? '<span class="text-xs text-[var(--success)]">✓</span>' : '<span class="text-xs text-[var(--text-dim)]">上传中...</span>'}
            </span>
            <span class="remove-file" data-i="${i}"><i class="fa-solid fa-xmark"></i></span>
          </div>`).join('');
        fileC.querySelectorAll('.remove-file').forEach(btn => {
          btn.addEventListener('click', () => { p.files.splice(parseInt(btn.dataset.i), 1); renderUploadPreviews(); });
        });
      }
    }
  }

  async function handleFileSelect(files, type) {
    if (!isAdmin) return;
    const p = window._journalPending || { images: [], files: [] };
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) { alert(`"${file.name}" 超过10MB，请压缩`); continue; }
      (type === 'image' ? p.images : p.files).push({ file, done: false, url: '', filename: '', original_name: file.name });
    }
    renderUploadPreviews();
    for (const entry of (type === 'image' ? p.images : p.files)) {
      if (entry.done) continue;
      try {
        const result = await uploadToGitHub(entry.file);
        entry.url = result.url; entry.filename = result.filename;
        entry.original_name = result.original_name; entry.done = true; entry.file = null;
        renderUploadPreviews();
      } catch (e) {
        alert(`"${entry.original_name}" 上传失败: ${e.message}`);
        const arr = type === 'image' ? p.images : p.files;
        arr.splice(arr.indexOf(entry), 1);
        renderUploadPreviews();
      }
    }
  }

  async function savePost() {
    const title = $('#edit-title').value.trim();
    if (!title) { alert('请输入标题'); $('#edit-title').focus(); return; }
    const p = window._journalPending || { images: [], files: [] };
    if (p.images.some(i => !i.done) || p.files.some(f => !f.done)) {
      alert('还有文件正在上传中，请稍候'); return;
    }
    const now = new Date();
    const ts = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`;
    const newPost = {
      id: editingPostId || `post-${ts}`,
      title, content: $('#edit-content').value,
      category: $('#edit-category').value.trim(),
      tags: $('#edit-tags').value.split(',').map(t => t.trim()).filter(Boolean),
      links: $('#edit-links').value.split('\n').map(l => l.trim()).filter(Boolean),
      images: p.images.map(i => i.url).filter(Boolean),
      files: p.files.map(f => ({ name: f.original_name, path: f.url, url: f.url, filename: f.filename, original_name: f.original_name })).filter(f => f.url),
      pinned: false,
      createdAt: editingPostId ? (posts.find(p => p.id === editingPostId)?.createdAt || now.toISOString().slice(0,10)) : now.toISOString().slice(0,10),
      updatedAt: now.toISOString().slice(0, 16).replace('T', ' '),
    };
    if (editingPostId) {
      const idx = posts.findIndex(p => p.id === editingPostId);
      if (idx >= 0) posts[idx] = newPost;
    } else { posts.push(newPost); }

    const saveBtn = $('#btn-save-post');
    const orig = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i>保存中...';
    saveBtn.disabled = true;
    try {
      await savePostsToGitHub(`📝 ${editingPostId ? '编辑' : '新建'}学习日志: ${title}`);
      closeEditor();
      await fetchPosts();
    } catch (e) { alert('保存失败: ' + e.message); }
    finally { saveBtn.innerHTML = orig; saveBtn.disabled = false; }
  }

  async function deletePost(postId) {
    if (!confirm('确定删除？可从 git 历史恢复。')) return;
    try {
      posts = posts.filter(p => p.id !== postId);
      await savePostsToGitHub('🗑️ 删除学习日志');
      closeEditor();
      await fetchPosts();
    } catch (e) { alert('删除失败: ' + e.message); await fetchPosts(); }
  }

  // ── 事件 ──────────────────────────────────────────
  function bindEvents() {
    $('#admin-btn')?.addEventListener('click', () => { if (!isAdmin) showLogin(); });
    $('#btn-login-submit')?.addEventListener('click', doLogin);
    $('#login-password')?.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
    $('#login-overlay')?.addEventListener('click', hideLogin);
    $('#login-modal .close-login')?.addEventListener('click', hideLogin);
    $('#btn-logout')?.addEventListener('click', doLogout);
    $('#btn-ai-settings')?.addEventListener('click', showAiSettings);
    $('#btn-ai-save-key')?.addEventListener('click', doSaveAiKey);
    $('#ai-api-key')?.addEventListener('keydown', e => { if (e.key === 'Enter') doSaveAiKey(); });
    $('#ai-settings-overlay')?.addEventListener('click', hideAiSettings);
    $('#ai-settings-modal .close-ai-settings')?.addEventListener('click', hideAiSettings);
    $('#btn-new-post')?.addEventListener('click', () => openEditor(null));
    $('#btn-ai-organize')?.addEventListener('click', aiOrganize);
    $('#editor-overlay')?.addEventListener('click', closeEditor);
    $('#editor-modal .close-editor')?.addEventListener('click', closeEditor);
    $('#btn-save-post')?.addEventListener('click', savePost);
    $('#edit-image-input')?.addEventListener('change', (e) => {
      if (e.target.files.length > 0) handleFileSelect(e.target.files, 'image');
      e.target.value = '';
    });
    // 粘贴图片：在编辑器任意位置 Ctrl+V 图片自动上传
    $('#editor-modal')?.addEventListener('paste', (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const blob = item.getAsFile();
          if (blob) {
            const ext = item.type.split('/')[1] || 'png';
            const file = new File([blob], `paste_${Date.now()}.${ext}`, { type: item.type });
            handleFileSelect([file], 'image');
          }
          break;
        }
      }
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
    await fetchPosts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
