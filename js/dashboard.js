(function (root, factory) {
  const dashboard = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = dashboard;
  if (root) root.TraceDevDashboard = dashboard;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  function updateContentCounts(content, getElementById) {
    const resolveElement = getElementById || ((id) => document.getElementById(id));
    const counts = {
      videos: (content.videos || []).filter((item) => item.published).length,
      resources: (content.resources || []).filter((item) => item.published).length,
      products: (content.products || []).filter((item) => item.published !== false).length,
    };
    const targets = {
      'video-count': [counts.videos, true],
      'resource-count': [counts.resources, true],
      'product-count': [counts.products, true],
      'metric-video-count': [counts.videos, false],
      'metric-resource-count': [counts.resources, false],
      'metric-product-count': [counts.products, false],
    };

    Object.entries(targets).forEach(([id, [value, pad]]) => {
      const element = resolveElement(id);
      if (element) element.textContent = pad ? String(value).padStart(2, '0') : String(value);
    });
    return counts;
  }

  return { updateContentCounts };
});
