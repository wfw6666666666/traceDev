# TraceDev 工程资料站视觉改版实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不破坏现有功能和数据逻辑的前提下，把 TraceDev 改造成克制、紧凑、像长期维护的嵌入式工程资料归档站。

**Architecture:** 保持现有单页标签面板和静态 JavaScript 数据流。通过重建 `style.css` 的视觉系统、调整 `index.html` 的静态结构，并同步动态模板的类名，让导航、列表、筛选、日志和弹窗共享一套按钮与容器语法；不引入构建工具或新依赖。

**Tech Stack:** HTML、CSS 变量、Tailwind CDN（保留现有依赖）、原生 JavaScript、Font Awesome、现有 Python 静态服务器。

**Spec:** `docs/superpowers/specs/2026-08-20-engineering-resource-site-redesign.md`

## Global Constraints

- 保留教学视频、咸鱼店铺、资料下载、学习日志、疑难解答、关于作者、主题切换和管理员操作。
- 不更换后端或数据格式，不重写 GitHub 日志保存、上传和鉴权逻辑。
- 页面最大宽度为 `1120px`，普通组件圆角为 `4px`，模态框圆角为 `8px`。
- 不使用大面积渐变、环境光晕、彩色发光、胶囊按钮或默认卡片阴影。
- 主按钮为实心砖橙，次按钮为细边框，轻操作为文字链接或图标按钮，危险操作为透明/白底红色边框。
- 需要检查 `1440px`、`1024px`、`768px` 和 `390px`，并验证浅色、深色主题。

---

### Task 1: 重建基础视觉系统与共享交互样式

**Files:**
- Modify: `css/style.css`

**Interfaces:**
- Consumes: 现有 HTML 类名、动态模板类名和 `data-theme` 属性。
- Produces: 统一的颜色变量、按钮等级、导航选中态、表单焦点态、容器边界、响应式基础和动效规则，供后续静态及动态结构直接使用。

- [ ] **Step 1: 记录当前工作区状态并确认只修改目标样式文件**

Run:

```powershell
git status --short
```

Expected: 看到工作区已有修改，但不还原任何用户文件。

- [ ] **Step 2: 替换主题变量与全局背景规则**

浅色主题使用 `#f3f0e9` / `#fbfaf7` / `#a44725`，深色主题使用 `#191816` / `#211f1c` / `#cf7149`。删除网格光晕、渐变背景和霓虹变量的视觉用途，保留变量名兼容现有 Tailwind 类引用。

- [ ] **Step 3: 实现按钮等级和键盘焦点规则**

为 `.btn-primary`、`.btn-secondary`、`.btn-quiet`、`.btn-danger` 以及现有按钮选择器提供统一样式：`4px` 圆角、最小高度 `40px`、无默认阴影、active 向下 `1px`。保留图标按钮的 `aria-label` 和 tooltip 行为。

- [ ] **Step 4: 重写导航、栏目标题、筛选项和表单基础样式**

导航激活态使用底部砖橙线；栏目标题左对齐并取消装饰短线；筛选项使用方角边框；输入框使用 `4px` 圆角和品牌色焦点环。

- [ ] **Step 5: 重写共享响应式和 reduced-motion 规则**

在 `768px` 下保证导航折叠、内容单列、按钮可点按、文本允许换行，禁止水平溢出；所有过渡遵守 `prefers-reduced-motion`。

- [ ] **Step 6: 做样式静态检查**

Run:

```powershell
rg -n "gradient|backdrop-filter|rounded-full|translateY\(-[2-9]|scale\(1\.0[3-9]|card-glow::after" css/style.css
```

Expected: 不存在大面积渐变、胶囊按钮和卡片悬浮装饰规则；允许保留必要的头像圆形和兼容旧类名规则。

### Task 2: 调整静态页面结构与弹窗控件

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: Task 1 的 CSS 变量和按钮等级。
- Produces: 导航、栏目标题、静态筛选容器、页脚和所有弹窗使用工程资料站结构，不改变现有 `id`，保证 `app.js` 和 `journal.js` 事件绑定不失效。

- [ ] **Step 1: 调整顶部导航文案与结构**

保留 `#navbar`、`data-tab`、`#theme-toggle`、`#admin-btn`、`#menu-btn`、`#mobile-menu` 等现有选择器；移除桌面导航中的装饰性 Font Awesome 图标，增加低调的站点定位文字。

- [ ] **Step 2: 为六个栏目标题加入编号和辅助信息容器**

保留所有 `panel-*` id，在 `section-header` 内增加编号标记，并改为左对齐。不要新增 Hero、统计大卡片或营销 CTA。

- [ ] **Step 3: 调整分类筛选和管理员工具栏的静态类名**

把 `rounded-full` 筛选按钮改为方角筛选项；管理员工具栏改成无大背景卡片的工具栏，同时保留所有管理员按钮 id。

- [ ] **Step 4: 收敛下载、登录、AI、编辑、详情模态框样式类**

保留所有模态框 id 和表单 id。将 `rounded-2xl` 改为 8px 容器圆角，将主要动作和次要动作分别映射到主按钮/次按钮样式，去掉重阴影和强模糊。

- [ ] **Step 5: 调整页脚为细线分隔的紧凑布局**

保留邮箱复制按钮、备案链接、访客和访问量节点，增加顶部边框和更合理的移动端换行。

- [ ] **Step 6: 静态结构检查**

Run:

```powershell
rg -n "id=\"(navbar|theme-toggle|admin-btn|menu-btn|mobile-menu|video-grid|product-grid|resource-grid|faq-container|about-container|download-modal|login-modal|editor-modal|post-detail-modal)\"" index.html
```

Expected: 所有现有关键节点仍存在且 id 不重复。

### Task 3: 调整动态内容为资料列表和目录风格

**Files:**
- Modify: `js/app.js`
- Modify: `js/journal.js`

**Interfaces:**
- Consumes: `data.js` 中现有视频、商品、资源、FAQ、关于作者和日志数据字段。
- Produces: 动态 HTML 使用新样式类名；事件监听、下载弹窗、复制、登录、主题、日志保存、上传和详情逻辑保持原有接口。

- [ ] **Step 1: 定位动态渲染函数和现有 HTML 模板**

Run:

```powershell
rg -n "innerHTML|video-card|product-card|card-glow|faq-item|about|journal-card|render" js/app.js js/journal.js
```

Expected: 列出视频、商品、资源、FAQ、关于作者、日志列表、日志详情的模板位置。

- [ ] **Step 2: 将视频模板改成媒体条目**

保留视频数据字段和打开链接的事件行为；缩略图只显示小方形播放标记，内容使用标题、描述、时长和底部分隔线。

- [ ] **Step 3: 将商品模板改成横向商品条目**

保留商品图片、价格和外链；桌面端使用图像/信息/操作三段布局，移动端使用单列。

- [ ] **Step 4: 将资源模板改成文件目录行**

保留资源分类筛选和下载弹窗；将资源名称、说明、分类、大小/版本/日期与操作放进稳定的列表网格，移动端允许元数据换行。

- [ ] **Step 5: 将 FAQ 和关于作者模板改成连续列表和文字分组**

FAQ 保留展开/收起事件和内容，右侧图标改为加减语义；关于作者保留联系方式和技能数据，但用文字分组替代视觉上夸张的进度条。

- [ ] **Step 6: 将日志列表与详情页模板改成期刊目录样式**

保留编辑按钮、文章详情、图片、附件、链接和 Markdown 渲染；列表使用固定日期栏和主内容栏，不再使用浮动卡片。

- [ ] **Step 7: 运行 JavaScript 语法检查**

Run:

```powershell
node --check js/app.js
node --check js/journal.js
node --check js/data.js
```

Expected: 三个命令均退出码 `0`。

### Task 4: 同步设计文档并建立本地验证入口

**Files:**
- Modify: `DESIGN.md`
- Modify: `index.html`（仅在需要时更新缓存版本号）

**Interfaces:**
- Consumes: Task 1–3 的实际类名、颜色和组件状态。
- Produces: 设计文档与实际代码一致，本地站点可用 HTTP 服务打开。

- [ ] **Step 1: 同步 DESIGN.md 中已过时的颜色、圆角和按钮规则**

保留定位、信息架构和功能约束；更新深浅主题颜色、圆角、按钮等级、无卡片化列表和动效规则。

- [ ] **Step 2: 更新 CSS/JS 缓存版本号**

仅更新已有 query string，避免浏览器继续使用旧 CSS 或旧脚本。

- [ ] **Step 3: 启动本地静态服务器**

Run:

```powershell
python server.py
```

Expected: 服务器在本地端口监听；如果默认端口被占用，使用下一个可用端口。

### Task 5: 浏览器验收与页面展示

**Files:**
- No source changes unless verification finds a concrete defect.

**Interfaces:**
- Consumes: 本地 HTTP 地址和 Task 1–4 的实现。
- Produces: 桌面端/移动端页面截图、交互检查结果和缺陷修复清单。

- [ ] **Step 1: 打开桌面端并检查首屏视觉**

检查导航层级、栏目标题、首批内容、按钮圆角、背景颜色、文字溢出和横向滚动。

- [ ] **Step 2: 检查六个标签页和主题切换**

依次切换视频、店铺、下载、日志、FAQ、关于作者，切换浅色/深色主题，确认内容容器和选中态正常。

- [ ] **Step 3: 检查关键交互**

打开下载、登录、AI 设置、日志详情等弹窗；测试 FAQ 展开、移动端菜单和返回顶部。任何需要外部账户或真实提交的管理员动作只检查界面，不提交数据。

- [ ] **Step 4: 检查移动端 390px 和平板 768px**

确认菜单、资源列表、商品条目、按钮和弹窗不重叠、不横向溢出，文字可以自然换行。

- [ ] **Step 5: 检查控制台和静态资源**

确认没有脚本异常、CSS/JS/图片 404 和严重可访问性问题。

- [ ] **Step 6: 展示完成页面**

保留本地服务运行，并向用户提供本地地址和最终页面截图/预览。
