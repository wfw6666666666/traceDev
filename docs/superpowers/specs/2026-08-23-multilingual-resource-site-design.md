# TraceDev 多语言支持设计规格

## 目标

为 TraceDev 静态技术资源站增加简体中文、繁体中文、英语、日语和韩语五种语言切换。界面文案、视频、下载资源、商品、FAQ、作者信息、搜索联想和学习日志都参与语言切换；翻译缺失时统一回退到简体中文。

## 范围

### 包含

- 顶部语言选择器，支持五种语言并显示当前语言。
- 首次访问根据浏览器语言自动选择；用户主动选择后写入 `localStorage`。
- 页面切换语言时不刷新页面，并同步设置 `document.documentElement.lang`。
- 导航、面板标题、描述、按钮、空状态、弹窗、管理员区域和动态提示的固定文案翻译。
- `VIDEOS`、`RESOURCES`、`PRODUCTS`、`FAQS`、`AUTHOR` 的固定内容翻译。
- 搜索索引按当前语言重建，联想词、搜索结果和当前面板过滤使用当前语言。
- 学习日志兼容现有中文数据；日志对象可增加 `translations`，缺少翻译时显示原有中文字段。
- GitHub Pages 静态部署兼容，不增加后端和在线翻译 API。

### 不包含

- 自动调用 Google、DeepL、OpenAI 或其他在线翻译服务。
- 修改管理员认证、GitHub 写入权限和日志发布流程的安全模型。
- 翻译图片中的文字、外部百度网盘页面和外部商品页面内容。
- 将用户提交的 Markdown 内容自动机器翻译。

## 语言标识

使用稳定的 BCP 47 标识：

| 标识 | 显示名 | 页面语言属性 |
| --- | --- | --- |
| `zh-CN` | 简体中文 | `zh-CN` |
| `zh-TW` | 繁體中文 | `zh-TW` |
| `en` | English | `en` |
| `ja` | 日本語 | `ja` |
| `ko` | 한국어 | `ko` |

语言顺序固定为 `zh-CN`、`zh-TW`、`en`、`ja`、`ko`，避免不同浏览器中菜单顺序变化。

## 文件与职责

| 文件 | 职责 |
| --- | --- |
| `index.html` | 语言选择器、可翻译元素的 `data-i18n` 标记、语言菜单无障碍属性和资源版本号。 |
| `js/i18n.js` | 固定界面语言包、语言检测、持久化、文本解析和翻译回退 API。 |
| `js/data.js` | 为固定内容增加 `translations` 字段，并保留现有中文字段作为回退源。 |
| `js/app.js` | 初始化语言、切换语言、动态面板渲染、搜索索引和搜索联想的多语言接入。 |
| `js/journal.js` | 学习日志标题、摘要、分类、标签和详情内容的翻译字段读取；缺失时回退原始数据。 |
| `css/style.css` | 语言菜单、当前语言状态、长文案换行、五种语言下的布局稳定性。 |
| `tools/verify-redesign.ps1` | 检查语言包、语言选择器、回退函数、脚本语法和静态资源版本。 |

## 固定界面语言包

`js/i18n.js` 导出到页面作用域的结构为：

```js
const I18N = {
  'zh-CN': { nav: {}, panel: {}, action: {}, search: {}, state: {}, modal: {}, admin: {}, footer: {} },
  'zh-TW': { nav: {}, panel: {}, action: {}, search: {}, state: {}, modal: {}, admin: {}, footer: {} },
  en: { nav: {}, panel: {}, action: {}, search: {}, state: {}, modal: {}, admin: {}, footer: {} },
  ja: { nav: {}, panel: {}, action: {}, search: {}, state: {}, modal: {}, admin: {}, footer: {} },
  ko: { nav: {}, panel: {}, action: {}, search: {}, state: {}, modal: {}, admin: {}, footer: {} },
};
```

实际键名必须覆盖现有页面的以下文案类别：导航六项、工作区标题、Quick access、最近更新、最近动态、资源状态、搜索占位符、搜索无结果、资料下载按钮、商品按钮、FAQ 展开提示、关于作者、页脚统计、下载弹窗、登录弹窗、AI 设置、编辑器、确认/错误/成功提示和空状态。

`translate(key, fallback)` 的行为：

1. 读取当前语言的键值。
2. 当前语言不存在时读取 `zh-CN` 同键。
3. 两者都不存在时返回调用处传入的 `fallback`，并在开发模式控制台提示缺失键。

## 内容翻译数据模型

现有中文顶层字段继续保留，新增语言字段使用以下结构：

```js
{
  title: 'STM32入门到实战：从点亮LED到WiFi通信',
  description: '零基础STM32教学...',
  translations: {
    'zh-TW': { title: '...', description: '...' },
    en: { title: '...', description: '...' },
    ja: { title: '...', description: '...' },
    ko: { title: '...', description: '...' },
  },
}
```

规则：

- `zh-CN` 使用现有顶层字段，不重复存储。
- 每种语言只存与中文字段同名的可翻译字段。
- 视频额外翻译 `dateLabel` 时优先使用翻译值，否则使用原始 `date`。
- 资源翻译 `name`、`description`、`category`；下载链接、文件名、日期和密码不翻译。
- 商品翻译 `name`、`description`、`priceLabel`；价格数字与外链保持原值。
- FAQ 翻译 `question`、`answer`。
- 作者翻译 `tagline`、`bio`、技能 `name` 和链接 `label`。
- 日志翻译 `title`、`category`、`tags`、`content`；图片、附件、链接和日期保持原值。

统一提供 `getLocalizedContent(item, field, locale)`，按当前语言、简体中文顶层字段顺序返回字段值。渲染器不得直接读取需要翻译的字段，以避免不同面板出现不一致。

## 语言状态与切换流程

1. 页面初始化前读取 `localStorage` 的 `traceDevLocale`。
2. 没有保存值时，将浏览器语言映射到五种语言；`zh-*` 以外的中文区域使用 `zh-CN`，其他未知语言使用 `en`。
3. 初始化 `I18nController`，更新所有 `[data-i18n]`、`[data-i18n-placeholder]`、`[data-i18n-aria-label]` 元素。
4. 设置 `document.documentElement.lang`，更新语言菜单当前项和 `aria-checked`。
5. 调用 `renderAllLocalizedContent()`：重新渲染视频、商品、资源、FAQ、作者、搜索索引和搜索联想；学习日志调用已有刷新入口。
6. 保留当前面板、分类筛选和搜索输入；搜索输入非空时重新应用当前语言过滤。
7. 保存新语言到 `localStorage`，不触发整页刷新。

语言菜单必须支持鼠标、键盘焦点、Escape 关闭和触发按钮的 `aria-expanded` 状态。移动端使用同一组件，不能额外维护一套语言状态。

## 搜索行为

- 搜索索引使用当前语言的标题、描述、分类、FAQ 问题和作者文本。
- 语言切换后立即重建索引，不使用上一语言的联想词。
- 联想词显示当前语言的完整标题或固定术语；匹配部分使用现有粉红高亮样式。
- `ArrowUp`、`ArrowDown`、`Enter`、`Escape` 行为在五种语言下保持一致。
- 选中联想词后填入当前语言标题，切换到对应面板，并用对应数据字段过滤。
- 无结果提示来自语言包，不写死中文。

## 学习日志兼容

现有 `data/posts.json` 不需要一次性重写。日志读取函数通过 `getLocalizedContent(post, field, locale)` 获取显示值：

- 有当前语言翻译时显示翻译。
- 没有当前语言翻译时显示 `post.title`、`post.content` 等现有中文字段。
- 管理员编辑器保留中文输入作为默认源，并允许后续手动补充语言翻译字段。
- 日志标签筛选使用当前语言显示文本，但筛选值仍使用稳定的原始 tag/category，避免切换语言后筛选失效。

## 错误处理与回退

- 缺少语言包键：回退简体中文，再回退调用处默认值。
- 缺少内容翻译：回退同一条内容的简体中文字段。
- 无效 `localStorage` 语言值：回退浏览器语言检测结果。
- 动态渲染过程中某条翻译字段为空：只回退该字段，不丢弃整条卡片。
- 语言切换失败不阻断下载、登录、FAQ 和日志等原有交互。

## 测试与验收

自动验证必须覆盖：

- 五种语言标识和语言包均存在。
- 语言选择器和 `document.documentElement.lang` 更新标记存在。
- `translate`、`getLocalizedContent`、语言持久化和回退函数存在。
- 视频、资源、商品、FAQ、作者和日志渲染调用本地化读取函数。
- 搜索索引在切换语言后重建，联想词组件和当前面板过滤仍可用。
- 所有 JavaScript 文件通过 `node --check`。
- 静态服务返回 HTTP `200`，资源版本号已更新，无重复 DOM id。

手动验收矩阵：

| 场景 | 预期 |
| --- | --- |
| 首次访问中文浏览器 | 默认简体中文 |
| 首次访问英文浏览器 | 默认 English |
| 选择繁體中文并刷新 | 页面和动态内容保持繁體中文 |
| 选择日本語后搜索 `STM32` | 联想、卡片和 FAQ 使用日文字段或中文回退 |
| 选择 한국어 后打开下载弹窗 | 弹窗固定文案为韩文，链接和密码值不变 |
| 无翻译日志切换语言 | 日志仍显示中文，不出现空白 |
| 移动端打开语言菜单 | 菜单不溢出，能用键盘或触摸完成切换 |

## 性能与部署约束

- 不增加第三方运行时依赖。
- 翻译数据随静态 JS 加载，语言切换不产生网络请求。
- 缓存版本统一递增，确保 GitHub Pages 不使用旧的 `i18n.js`、`app.js` 和 CSS。
- 不把 token、API Key 或管理员凭据放入语言包和页面源码。
