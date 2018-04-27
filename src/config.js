const siteConfig = {
  siteName: 'DISCOIN',
  siteIcon: 'ion-flash',
  footerText: 'Waba ©2018',
  apiUrl: 'https://w5xlvm3vzz.lp.gql.zone/graphql',
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
    { action: 'URL/GET_KPIS',          path: '/dashboard/kpis' },
    { action: 'URL/GET_PARAMETERS',    path: '/dashboard/configuration' },
    { action: 'URL/GET_CATEGORIES',    path: '/dashboard/categories' },
    { action: 'URL/GET_BUSINESSES',    path: '/dashboard/business/list/:from/:limit' },
    { action: 'URL/GET_BUSINESS',      path: '/dashboard/business/profile/:id/load' },
    { action: 'URL/SET_OVERDRAFT',     path: '/business/endorse/create' },
    { action: 'URL/REGISTER_BUSINESS', path: 'business/register' },
    { action: 'URL/GET_SUBACCOUNTS',   path: '/business/:id/subaccount/:list/:start'},
  ]
}

export {
  siteConfig,
  language,
  themeConfig,
  mapboxConfig,
  apiConfig
};
