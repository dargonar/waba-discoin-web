import { Map } from "immutable";
import { getDefaultPath } from "../../helpers/urlSync";
import actions, { getView } from "./actions";
import authActions from "../auth/actions";
import config, { getCurrentLanguage } from "../../containers/Core/LanguageSwitcher/config";

const preKeys = getDefaultPath();

const initState = new Map({
  collapsed: false, //window.innerWidth > 1220 ? false : true,
  view: getView(window.innerWidth),
  height: window.innerHeight,
  openDrawer: true,
  openKeys: preKeys,
  current: preKeys,
  loading: false,
  loadingMsg: null,
  msg: null,
  msgType: null,
  menuItems: [],
  language: getCurrentLanguage(config.defaultLanguage || "english"),
  passwordBox: false,
  connectionStatus: {
    status: true,
    tryNumber: 0
  }
});

export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.CHANGE_LANGUAGE:
      return state.set("language", action.language);
    case actions.ASK_PASSWORD:
      return state.set("passwordBox", !state.get("passwordBox"));
    case authActions.LOCAL_LOGIN_SUCCESS:
      return state.set("passwordBox", false);
    case authActions.LOGIN_ERROR:
      return state.set("passwordBox", false);
    case actions.COLLPSE_CHANGE:
      return state.set("collapsed", !state.get("collapsed"));
    case actions.COLLPSE_OPEN_DRAWER:
      return state.set("openDrawer", !state.get("openDrawer"));
    case actions.TOGGLE_ALL:
      if (state.get("view") !== action.view || action.height !== state.height) {
        const height = action.height ? action.height : state.height;
        return state
          .set("collapsed", action.collapsed)
          .set("view", action.view)
          .set("height", height);
      }
      break;
    case actions.CHANGE_OPEN_KEYS:
      return state.set("openKeys", action.openKeys);
    case actions.CHANGE_CURRENT:
      return state.set("current", action.current);
    case actions.GLOBAL_LOADING_START:
      return state.set("loading", true).set("loadingMsg", action.payload.msg || "");
    case actions.GLOBAL_LOADING_END:
      return state.set("loading", false).set("loadingMsg", null);
    case actions.GLOBAL_MSG:
      //HACK
      let body = "";
      console.log("---------------- app/reducer::actions.GLOBAL_MSG", JSON.stringify(action.payload));
      if (action.payload.data) {
        if (action.payload.data.error_list)
          body = action.payload.data.error_list.reduce(function(ret, item) {
            return ret + item.error + "\r\n";
          }, "");
      }
      if (action.payload.msg) {
        if (action.payload.msg.payload) body = action.payload.msg.payload;
      }
      return state.set("msg", action.payload.msg + "|" + body).set("msgType", action.payload.msgType);
    case actions.GLOBAL_MSG_CLEAR:
      return state.set("msg", null).set("msgType", null);
    case actions.SET_MENU_ITEMS:
      return state.set("menuItems", action.payload);
    case actions.CONNECTION_STATUS:
      return state.set("connectionStatus", {
        status: action.payload,
        tryNumber: action.payload === true ? 0 : state.get("connectionStatus").tryNumber
      });
    case actions.CONNECTION_STATUS_TRY:
      return state.set("connectionStatus", {
        status: typeof action.payload !== "undefined" ? action.payload : state.get("connectionStatus").status,
        tryNumber: state.get("connectionStatus").tryNumber + 1
      });
    case actions.CONNECTION_STATUS_RETRY:
      return state.set("connectionStatus", {
        status: true,
        tryNumber: 0
      });
    default:
      return state;
  }
  return state;
}
