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

export {
  siteConfig,
  language,
  themeConfig,
  mapboxConfig
};
