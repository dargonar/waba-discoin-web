const siteConfig = {
  siteName: 'DISCOIN B',
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
  base: 'http://35.163.59.126:8089/api/',
  version: 'v3',
  urls: [
    { action: 'URL/GET_PROFILE',       path: '/dashboard/business/profile/:id/load' },
    { action: 'URL/GET_CONFIGURATION', path: '/dashboard/configuration' },
    { action: 'URL/GET_CATEGORIES',    path: '/dashboard/categories' },
    { action: 'URL/UPDATE_SCHEDULE',   path: '/dashboard/business/schedule/:id/update' },
    { action: 'URL/SEARCH_CUSTOMERS',  path: '/account/search?search=:name&seach_filter=:filter' },
    { action: 'URL/ALL_CUSTOMERS',     path: '/account/search' },
    { action: 'URL/ALL_TRANSACTIONS',  path: '/business/:id/transactions/list' },
    { action: 'URL/ACCOUNT_BY_NAME',   path: '/account/by_name/:name' },
    { action: 'URL/PUSH_TX',           path: '/push_tx' },
    { action: 'URL/PUSH_SIGN_TX',      path: '/sign_and_push_tx' },
    { action: 'URL/BIZ_LOGIN',         path: '/business/login/:account_name' },
    { action: 'URL/REFUND_CREATE',     path: '/refund/create' },
    { action: 'URL/REGISTER_BUSINESS', path: '/business/register' },
    { action: 'URL/APPLY_ENDORSE',     path: '/business/endorse/apply' }
  ]
}

export {
  siteConfig,
  language,
  themeConfig,
  mapboxConfig,
  apiConfig
};
