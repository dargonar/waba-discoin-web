const versionConfig={
  // // TUTI TESTNET
  // base_url          : 'http://127.0.0.1:8088/',        
  // asset_precision   : 5,
  // chain_id          : "1d70881f06a5d2ece91313a00f7eda5e1c7a7183957f3a6539deb4aa95237fe5",
  // admin_pub_key     : 'BTS5KqreoEjBrfuPC8G5ntzv3p1ByHe2HCyUMyDnvex7B42MYzo4u',  
  // language          : 'spanish',
  
  // // MAIN NET
  // base_url          : 'https://api.discoin.com.ar/',   
  // asset_precision   : 5,
  // chain_id          : '4018d7844c78f6a6c41c6a552b898022310fc5dec06da467ee7905a8dad512c8',
  // admin_pub_key     : 'BTS5QnCpdUT696G8LA6xBonNsuD1PwP5Xgr5GvYXBrxGx6YnqMmdC',
  // language          : 'spanish',

  // DEV/PRIVATE TESTNET
  base_url          : 'https://devapi.discoin.com.ar/',
  asset_precision   : 2,
  chain_id          : 'bde617520673d18e67db5d7060ca2740f80e28093519c30176044c8d4a227e73',
  admin_pub_key     : 'BTS6bM4zBP7PKcSmXV7voEdauT6khCDGUqXyAsq5NCHcyYaNSMYBk',
  language          : 'english'
}

const siteConfig = {
  siteName: "Discoin",
  siteIcon: "ion-flash",
  footerText: "WABA.network ©2018 - v1.0.1",
  adminAccount: ["admin", "discoin-gov"] // (admin)-> PRIVATE TESNET || (discoin-dev) ->TUTI TESNET & MAIN NET
};

const base_url = versionConfig.base_url;


const themeConfig = {
  topbar: "themedefault",
  sidebar: "themedefault",
  layout: "themedefault",
  theme: "themedefault"
};
const language = versionConfig.language;

const currency = {
  name: "DISCOIN",
  symbol: "DSC",
  plural: "Discoins",
  fiat: {
    symbol: "$",
    plural: "Pesos"
  },
  asset_precision: versionConfig.asset_precision
};

const mapboxConfig = {
  tileLayer: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  maxZoom: 22,
  defaultZoom: 16,
  center: [-34.92145, -57.95453] // La plata
};

const apiConfig = {
  base: base_url+"api/",
  baseFiles: base_url+"files/",
  baseImages: base_url+"static/uploads/",
  
  interval_update_tx_ms: 30000,
  timeout_force_update_tx_ms: 15000,
  interval_status_check_ms: 60000,
  chain_id: versionConfig.chain_id,
  admin_pub_key : versionConfig.admin_pub_key,

  version: "v3",
  urls: [
    { action: "URL/UPDATE_BUSINESS", path: "/dashboard/business/profile/:account_id/update" },
    { action: "URL/GET_PROFILE", path: "/dashboard/business/profile/:id/load" },
    { action: "URL/GET_CONFIGURATION", path: "/dashboard/configuration" },
    { action: "URL/GET_CATEGORIES", path: "/dashboard/categories" },
    { action: "URL/GET_CATEGORIES_LIST", path: "/business/category/list" },
    { action: "URL/ADD_OR_UPDATE_CATEGORY", path: "/business/category/add_or_update" },
    { action: "URL/DELETE_CATEGORY", path: "/business/category/delete" },
    { action: "URL/UPDATE_SCHEDULE", path: "/dashboard/business/schedule/:id/update" },
    { action: "URL/SEARCH_CUSTOMERS", path: "/account/search?search=:name&search_filter=:filter" },
    { action: "URL/ALL_CUSTOMERS", path: "/account/search" },
    { action: "URL/ALL_TRANSACTIONS", path: "/business/:id/transactions/list" },
    { action: "URL/ACCOUNT_BY_NAME", path: "/account/by_name/:name" },
    { action: "URL/PUSH_TX", path: "/push_tx" },
    { action: "URL/PUSH_SIGN_TX", path: "/sign_and_push_tx" },
    { action: "URL/BIZ_LOGIN", path: "/business/login/:account_name" },
    { action: "URL/REFUND_CREATE", path: "/refund/create" },
    { action: "URL/REGISTER_BUSINESS", path: "/business/register" },
    { action: "URL/APPLY_ENDORSE", path: "/business/endorse/apply" },
    { action: "URL/GET_SUBACCOUNTS", path: "/business/:id/subaccount/list/:start" },
    { action: "URL/NEW_SUBACCOUNT", path: "/business/subaccount/add_or_update/create" },
    { action: "URL/GET_KPIS", path: "/dashboard/kpis" },
    { action: "URL/GET_PARAMETERS", path: "/dashboard/configuration" },
    { action: "URL/GET_CATEGORIES", path: "/dashboard/categories" },
    { action: "URL/GET_CATEGORIES_LIST", path: "/business/category/list" },
    { action: "URL/GET_BUSINESSES", path: "/dashboard/business/search" },
    { action: "URL/FILTRED_BUSINESSES", path: "/dashboard/business/filter/:skip/:count" },
    { action: "URL/GET_BUSINESS", path: "/dashboard/business/profile/:id/load" },
    { action: "URL/SET_OVERDRAFT", path: "/business/endorse/create" }
    // { action: "URL/REGISTER_BUSINESS", path: "/business/register" },
    // { action: "URL/UPDATE_BUSINESS", path: "/dashboard/business/profile/:account_id/update" },
    // { action: "URL/PUSH_TX", path: "/push_tx" },
    // { action: "URL/PUSH_SIGN_TX", path: "/sign_and_push_tx" },
    // { action: "URL/BIZ_LOGIN", path: "/business/login/:account_name" }
  ]
};

export { siteConfig, language, themeConfig, mapboxConfig, apiConfig, currency };
