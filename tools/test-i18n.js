const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const storage = new Map();
const dispatched = [];
const currentLanguage = { textContent: '简体中文' };
const attributes = {};
const documentElement = {
  lang: '',
  setAttribute(name, value) { attributes[name] = value; },
};
const localeButtons = ['zh-CN', 'zh-TW', 'en', 'ja', 'ko'].map((locale) => ({
  dataset: { locale },
  classList: { toggle() {} },
  setAttribute() {},
}));

const context = {
  console,
  navigator: { language: 'zh-CN' },
  localStorage: {
    getItem(key) { return storage.get(key) || null; },
    setItem(key, value) { storage.set(key, value); },
  },
  CustomEvent: class CustomEvent {
    constructor(type, init) { this.type = type; this.detail = init?.detail; }
  },
  document: {
    readyState: 'complete',
    cookie: '',
    documentElement,
    querySelectorAll(selector) { return selector === '[data-locale]' ? localeButtons : []; },
    getElementById(id) { return id === 'current-language' ? currentLanguage : null; },
    addEventListener() {},
  },
  window: {
    addEventListener() {},
    dispatchEvent(event) { dispatched.push(event); },
  },
};

vm.createContext(context);
vm.runInContext(fs.readFileSync('js/i18n.js', 'utf8'), context, { filename: 'js/i18n.js' });

assert.equal(context.window.I18nController.getLocale(), 'zh-CN');
assert.equal(documentElement.lang, 'zh-CN');
assert.equal(currentLanguage.textContent, '简体中文');

context.window.I18nController.setLocale('en');
assert.equal(context.window.I18nController.getLocale(), 'en');
assert.equal(storage.get('traceDevLocale'), 'en');
assert.match(context.document.cookie, /django_language=en/);
assert.equal(documentElement.lang, 'en');
assert.equal(currentLanguage.textContent, 'English');
assert.equal(context.window.I18nController.translate('nav.videos'), 'Tutorials');
assert.equal(context.window.I18nController.translate('dashboard.overview'), 'Resource overview');
assert.equal(dispatched.at(-1).type, 'tracedev:locale-changed');

const item = { title: '中文标题', translations: { en: { title: 'English title' } } };
assert.equal(context.window.I18nController.getLocalizedContent(item, 'title'), 'English title');
assert.equal(context.window.I18nController.getLocalizedContent(item, 'description'), '');

context.window.I18nController.setLocale('ja');
assert.equal(context.window.I18nController.getLocalizedContent(item, 'title'), '中文标题');
assert.match(context.document.cookie, /django_language=ja/);

const dataSource = `${fs.readFileSync('js/data.js', 'utf8')}\n;globalThis.__traceData = { VIDEOS, PRODUCTS, RESOURCES, FAQS, AUTHOR };`;
vm.runInContext(dataSource, context, { filename: 'js/data.js' });
const { VIDEOS, PRODUCTS, RESOURCES, FAQS, AUTHOR } = context.__traceData;
const requiredLocales = ['zh-TW', 'en', 'ja', 'ko'];
const localizedItems = [
  ...VIDEOS.filter((entry) => entry.published).map((entry) => [entry, ['title', 'description']]),
  ...PRODUCTS.filter((entry) => entry.published !== false).map((entry) => [entry, ['name', 'description']]),
  ...RESOURCES.filter((entry) => entry.published).map((entry) => [entry, ['name', 'description', 'category']]),
  ...FAQS.map((entry) => [entry, ['question', 'answer']]),
  [AUTHOR, ['tagline', 'bio']],
  ...AUTHOR.links.map((entry) => [entry, ['label']]),
  ...AUTHOR.skills.map((entry) => [entry, ['name']]),
];
localizedItems.forEach(([entry, fields]) => {
  requiredLocales.forEach((locale) => {
    fields.forEach((field) => assert.ok(entry.translations?.[locale]?.[field], `Missing ${locale}.${field} for ${entry.id || entry.name || 'author content'}`));
  });
});

const flattenKeys = (value, prefix = '') => Object.entries(value).flatMap(([key, child]) => {
  const path = prefix ? `${prefix}.${key}` : key;
  return child && typeof child === 'object' ? flattenKeys(child, path) : [path];
});
const baseKeys = flattenKeys(context.window.I18N['zh-CN']).sort();
['zh-TW', 'en', 'ja', 'ko'].forEach((locale) => {
  assert.deepEqual(flattenKeys(context.window.I18N[locale]).sort(), baseKeys, `${locale} static translation keys differ from zh-CN`);
});

const djangoLocales = { 'zh-CN': 'zh-hans', 'zh-TW': 'zh-hant', en: 'en', ja: 'ja', ko: 'ko' };
Object.entries(djangoLocales).forEach(([locale, djangoLocale]) => {
  context.window.I18nController.setLocale(locale);
  assert.equal(storage.get('traceDevLocale'), locale);
  assert.equal(documentElement.lang, locale);
  assert.match(context.document.cookie, new RegExp(`django_language=${djangoLocale}`));
});

console.log('i18n behavior verification passed.');
