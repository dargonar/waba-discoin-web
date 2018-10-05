const siteConfig = {
  siteName: "Discoin",
  siteIcon: "ion-flash",
  footerText: "WABA.network ©2018",
  adminAccount: "admin"
};
const themeConfig = {
  topbar: "themedefault",
  sidebar: "themedefault",
  layout: "themedefault",
  theme: "themedefault"
};
const language = "spanish";

const currency = {
  name: "DISCOIN",
  symbol: "DSC",
  plural: "Discoins",
  fiat: {
    symbol: "$",
    plural: "Pesos"
  }
};

const mapboxConfig = {
  tileLayer: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  maxZoom: 22,
  defaultZoom: 16,
  center: [-34.92145, -57.95453] // La plata
};
const base_url = 'http://34.212.171.239:8088/';
const apiConfig = {
  base: base_url+"api/",
  baseFiles: base_url+"files/",
  baseImages: base_url+"static/uploads/",
  // base: "http://localhost:8088/api/",
  chain_id: "bde617520673d18e67db5d7060ca2740f80e28093519c30176044c8d4a227e73",
  version: "v3",
  urls: [
    {
      action: "URL/UPDATE_BUSINESS",
      path: "/dashboard/business/profile/:account_id/update"
    },

    { action: "URL/GET_PROFILE", path: "/dashboard/business/profile/:id/load" },
    { action: "URL/GET_CONFIGURATION", path: "/dashboard/configuration" },
    { action: "URL/GET_CATEGORIES", path: "/dashboard/categories" },
    { action: "URL/GET_CATEGORIES_LIST", path: "/business/category/list" },
    {
      action: "URL/ADD_OR_UPDATE_CATEGORY",
      path: "/business/category/add_or_update"
    },
    { action: "URL/DELETE_CATEGORY", path: "/business/category/delete" },
    {
      action: "URL/UPDATE_SCHEDULE",
      path: "/dashboard/business/schedule/:id/update"
    },
    {
      action: "URL/SEARCH_CUSTOMERS",
      path: "/account/search?search=:name&search_filter=:filter"
    },
    { action: "URL/ALL_CUSTOMERS", path: "/account/search" },
    { action: "URL/ALL_TRANSACTIONS", path: "/business/:id/transactions/list" },
    { action: "URL/ACCOUNT_BY_NAME", path: "/account/by_name/:name" },
    { action: "URL/PUSH_TX", path: "/push_tx" },
    { action: "URL/PUSH_SIGN_TX", path: "/sign_and_push_tx" },
    { action: "URL/BIZ_LOGIN", path: "/business/login/:account_name" },
    { action: "URL/REFUND_CREATE", path: "/refund/create" },
    { action: "URL/REGISTER_BUSINESS", path: "/business/register" },
    { action: "URL/APPLY_ENDORSE", path: "/business/endorse/apply" },
    {
      action: "URL/GET_SUBACCOUNTS",
      path: "/business/:id/subaccount/list/:start"
    },
    {
      action: "URL/NEW_SUBACCOUNT",
      path: "/business/subaccount/add_or_update/create"
    },
    { action: "URL/GET_KPIS", path: "/dashboard/kpis" },
    { action: "URL/GET_PARAMETERS", path: "/dashboard/configuration" },
    { action: "URL/GET_CATEGORIES", path: "/dashboard/categories" },
    { action: "URL/GET_CATEGORIES_LIST", path: "/business/category/list" },
    {
      action: "URL/GET_BUSINESSES",
      path: "/dashboard/business/search"
    },
    {
      action: "URL/FILTRED_BUSINESSES",
      path: "/dashboard/business/filter/:skip/:count"
    },
    {
      action: "URL/GET_BUSINESS",
      path: "/dashboard/business/profile/:id/load"
    },
    { action: "URL/SET_OVERDRAFT", path: "/business/endorse/create" },
    { action: "URL/REGISTER_BUSINESS", path: "/business/register" },
    {
      action: "URL/UPDATE_BUSINESS",
      path: "/dashboard/business/profile/:account_id/update"
    },
    { action: "URL/PUSH_TX", path: "/push_tx" },
    { action: "URL/PUSH_SIGN_TX", path: "/sign_and_push_tx" },
    { action: "URL/BIZ_LOGIN", path: "/business/login/:account_name" }
  ]
};

export { siteConfig, language, themeConfig, mapboxConfig, apiConfig, currency };
