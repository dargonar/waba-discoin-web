import { getCurrentLanguage } from "../../containers/Core/LanguageSwitcher/config";

export function getView(width) {
  let newView = "MobileView";
  if (width > 1220) {
    newView = "DesktopView";
  } else if (width > 767) {
    newView = "TabView";
  }
  return newView;
}
const actions = {
  COLLPSE_CHANGE: "[UI] Collapse change",
  COLLPSE_OPEN_DRAWER: "[UI] Collapse open drawer",
  CHANGE_OPEN_KEYS: "[UI] Change open key",
  TOGGLE_ALL: "[UI] Toggle all",
  CHANGE_CURRENT: "[UI] Change current",
  GLOBAL_LOADING_START: "[UI] Global loading start",
  GLOBAL_LOADING_END: "[UI] Global loading end",
  GLOBAL_LOADING_CLEAR: "[UI] Gloabl loading clear",
  GLOBAL_MSG: "[UI] Global message",
  GLOBAL_MSG_CLEAR: "[UI] Global message clear",
  SET_MENU_ITEMS: "[UI] Set menu items",
  CHANGE_LANGUAGE: "CHANGE_LANGUAGE",
  ACTIVATE_LANG_MODAL: "ACTIVATE_LANG_MODAL",
  ASK_PASSWORD: "[UI] Ask for local storage password",

  changeLanguage: language => {
    return {
      type: actions.CHANGE_LANGUAGE,
      language: getCurrentLanguage(language)
    };
  },
  togglePasswordBox: () => ({
    type: actions.ASK_PASSWORD
  }),
  toggleCollapsed: () => ({
    type: actions.COLLPSE_CHANGE
  }),
  toggleAll: ({ width, height }) => {
    const view = getView(width);
    const collapsed = view !== "DesktopView";
    return {
      type: actions.TOGGLE_ALL,
      collapsed,
      view,
      height
    };
  },
  toggleOpenDrawer: () => ({
    type: actions.COLLPSE_OPEN_DRAWER
  }),
  changeOpenKeys: openKeys => ({
    type: actions.CHANGE_OPEN_KEYS,
    openKeys
  }),
  changeCurrent: current => ({
    type: actions.CHANGE_CURRENT,
    current
  }),
  showMessage: payload => ({
    type: actions.GLOBAL_MSG,
    payload: { msg: payload.msg, msgType: payload.msgType }
  }),
  showLoading: msg => ({
    type: actions.GLOBAL_LOADING_START,
    payload: { msg: msg }
  }),
  endLoading: () => ({
    type: actions.GLOBAL_LOADING_END
  })
};
export default actions;
