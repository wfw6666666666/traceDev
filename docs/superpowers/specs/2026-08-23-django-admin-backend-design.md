# TraceDev Django 管理后台设计

## 目标

在不改变现有 TraceDev 前端视觉框架、页面结构和静态资源目录的前提下，为项目增加 Django 后端、资源管理应用和 SimpleUI 管理后台。后台支持简体中文、繁体中文、英语、日语、韩语，并与前端已选择的语言保持一致。

## 当前状态

- 项目根目录为静态网站，现有 `server.py` 使用 Flask 提供静态文件、学习日志 API 和上传 API。
- 前端入口为 `index.html`，样式和交互分别位于 `css/` 与 `js/`。
- 前端语言控制器使用 `localStorage` 的 `traceDevLocale` 保存 `zh-CN`、`zh-TW`、`en`、`ja`、`ko`。
- 系统 Python 3.12 可用；Django 和 SimpleUI 尚未安装。
- 全局 `pip` 指向异常的 Anaconda 环境，依赖安装必须使用当前 Python 解释器的 `python -m pip`。

## 架构选择

采用“Django 新后端作为主入口，现有前端原样托管”的方案：

1. 在仓库根目录创建 Django 项目 `tracedev_backend`。
2. 创建 Django 应用 `resources`，负责内容模型、管理后台和站点入口。
3. Django 根路由 `/` 返回现有 `index.html`，`/assets/`、`/css/`、`/js/`、`/data/`、`/downloads/`、`/uploads/` 保持现有 URL。
4. `/admin/` 使用 SimpleUI；Django 内置认证负责管理员登录。
5. SQLite 数据库保存在项目根目录的 `db.sqlite3`，并加入 `.gitignore`。
6. 暂不删除或改写 `server.py`，避免破坏现有 Flask 工作流；Django 默认在独立端口验证。

## 项目与文件结构

```text
download-site/
├── manage.py
├── requirements.txt
├── tracedev_backend/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── resources/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   ├── urls.py
│   ├── views.py
│   └── migrations/
├── templates/
│   └── site_index.html
└── locale/
```

`templates/site_index.html` 由现有 `index.html` 同步生成或直接复制，内容和前端样式保持不变。根目录 `index.html` 继续保留，以兼容 GitHub Pages。

## Django 配置

### 应用顺序

`INSTALLED_APPS` 中 `simpleui` 必须位于 `django.contrib.admin` 之前：

```python
INSTALLED_APPS = [
    "simpleui",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "resources",
]
```

### 国际化

支持语言：

```python
LANGUAGES = [
    ("zh-hans", "简体中文"),
    ("zh-hant", "繁體中文"),
    ("en", "English"),
    ("ja", "日本語"),
    ("ko", "한국어"),
]
```

启用 `LocaleMiddleware`，默认语言为 `zh-hans`，时区为 `Asia/Shanghai`。

### 前后端语言同步

浏览器无法让 Django 读取 `localStorage`，因此前端语言控制器在保存 `traceDevLocale` 的同时写入 Django 标准 cookie：

```text
django_language=zh-hans | zh-hant | en | ja | ko
```

映射：

| 前端 locale | Django locale |
|---|---|
| `zh-CN` | `zh-hans` |
| `zh-TW` | `zh-hant` |
| `en` | `en` |
| `ja` | `ja` |
| `ko` | `ko` |

切换语言时不刷新当前前端页面；下次打开或刷新 `/admin/` 时，`LocaleMiddleware` 按 cookie 显示相应语言。后台同时保留 Django 自带的语言选择能力。

## 数据模型

`resources` 应用提供以下模型，字段优先匹配现有前端数据结构：

### Video

- `slug`：唯一标识
- `title`、`description`
- `thumbnail`、`duration`、`published_at`
- `bvid`
- `is_published`
- `sort_order`

### Product

- `slug`
- `name`、`description`
- `price`
- `image`
- `external_url`
- `is_published`
- `sort_order`

### Resource

- `slug`
- `name`、`description`
- `category`
- `resource_type`
- `download_url`、`file_name`
- `extract_code`、`archive_password`
- `updated_at`
- `is_published`
- `sort_order`

### FAQ

- `question`、`answer`
- `is_published`
- `sort_order`

### JournalPost

- `slug`
- `title`、`content`
- `category`
- `tags`、`images`、`attachments`、`links` 使用 `JSONField`
- `is_pinned`、`is_published`
- `created_at`、`updated_at`

第一阶段只负责在后台管理这些数据，不强制把现有 `js/data.js` 和 `data/posts.json` 立即迁移到数据库，避免扩大改造范围。后续可增加 JSON API 和一次性导入命令。

## SimpleUI 后台

- 后台标题、页头和首页标题统一使用 `TraceDev 管理后台`。
- 左侧菜单按视频、商品、资源、FAQ、学习日志分组展示。
- 列表页显示发布状态、排序、更新时间等关键字段。
- 配置搜索、过滤、排序和批量发布/取消发布操作。
- 不修改 SimpleUI 前端主题源码，只通过 Django 设置和 ModelAdmin 配置。

## 超级管理员

数据库迁移完成后创建本地超级管理员：

- 用户名：`wfw`
- 密码：使用用户提供的密码
- 邮箱留空

创建过程使用非交互脚本或 Django shell；密码不写入源码、迁移、测试、日志或 Git 历史。验证时只检查用户存在、`is_staff=True`、`is_superuser=True` 和密码哈希可验证，不输出明文密码。

## 路由与静态文件

- `/`：返回保持原样的前端页面。
- `/admin/`：SimpleUI 管理后台。
- `/i18n/`：Django 标准语言切换路由。
- 开发环境通过 Django 静态文件配置提供现有 CSS、JS、图片、下载和上传目录。
- `DEBUG=True` 仅用于本地开发验证；密钥从环境变量读取，开发时允许安全的本地默认值。

## 测试策略

先写失败测试，再实现：

1. Django `check` 可通过。
2. `/` 返回 200，并包含 `language-switcher` 与现有 CSS/JS 版本引用。
3. `/admin/login/` 返回 200，并加载 SimpleUI 相关静态资源或应用配置。
4. 五种 `LANGUAGES` 配置存在，`LocaleMiddleware` 启用。
5. 前端 locale 到 Django locale 的映射和 cookie 写入逻辑存在。
6. 五类模型可迁移并在 admin 注册。
7. 超级管理员 `wfw` 存在且权限正确。
8. Django 开发服务器启动后，HTTP 请求 `/` 和 `/admin/login/` 均返回 200。

## 启动验证

验证使用 Django 默认开发服务器，例如：

```powershell
python manage.py runserver 127.0.0.1:8000 --noreload
```

进程启动后轮询：

```text
http://127.0.0.1:8000/
http://127.0.0.1:8000/admin/login/
```

确认两个地址均返回 200 后停止测试进程，避免遗留后台服务。若用户随后要求打开网站，再将验证通过的地址放到应用浏览器中。

## 安全与兼容性

- 不读取、打印、提交 `token.txt`。
- `.gitignore` 增加 `.venv/`、`db.sqlite3`、`.env` 和 Django 运行缓存。
- 不在源码中保存超级管理员密码或 Django 生产密钥。
- 现有 GitHub Pages 静态站继续使用根目录 `index.html`，不受 Django 文件影响。
- 现有 Flask 服务保留，Django 默认使用 8000 端口，避免与 5050 冲突。

## 完成标准

- Django 与 Django SimpleUI 安装成功，并记录在 `requirements.txt`。
- 项目和 `resources` 应用可导入、迁移和测试。
- SimpleUI 管理后台可访问。
- 五种后台语言配置完成，并能通过前端 cookie 与后台保持选择一致。
- 超级管理员 `wfw` 已在本地 SQLite 数据库创建。
- Django 开发服务器实际启动并通过首页、后台 HTTP 检查。
- 原前端样式、脚本和 GitHub Pages 入口保持不变。
