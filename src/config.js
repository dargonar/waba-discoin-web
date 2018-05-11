const siteConfig = {
  siteName: 'DISCOIN',
  siteIcon: 'ion-flash',
  footerText: 'WABA.network ©2018',
};
const themeConfig = {
  topbar: 'themedefault',
  sidebar: 'themedefault',
  layout: 'themedefault',
  theme: 'themedefault',
};
const language = 'english';

const mapboxConfig = {
  tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  maxZoom: 22,
  defaultZoom: 16,
  center: [-34.603722,-58.381592] // Buenos Aires
};

const apiConfig = {
  base: 'http://35.163.59.126:8080/api/',
  version: 'v3',
  urls: [
    { action: 'URL/GET_PROFILE',       path: '/dashboard/business/profile/:id/load' },
    { action: 'URL/GET_CONFIGURATION', path: '/dashboard/configuration' },
    { action: 'URL/GET_CATEGORIES',    path: '/dashboard/categories' },
    { action: 'URL/UPDATE_SCHEDULE',   path: '/dashboard/business/schedule/:id/update' },
    { action: 'URL/PUSH_TX',           path: '/push_tx' },
    { action: 'URL/PUSH_SIGN_TX',      path: '/sign_and_push_tx' }

  ]
}

export {
  siteConfig,
  language,
  themeConfig,
  mapboxConfig,
  apiConfig
};
