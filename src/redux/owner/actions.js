const actions = {
  FETCH_CONFIGURATION_PARAMETERS: "[Owner] Fetch parameters",
  FETCH_CONFIGURATION_PARAMETERS_SUCCESS: "[Owner] Fetch parameters success",
  FETCH_CONFIGURATION_PARAMETERS_FAILD: "[Owner] Fetch parameters faild",
  FETCH_CONFIGURATION_CATEGORIES: "[Owner] Fetch categories configuration",
  FETCH_CONFIGURATION_CATEGORIES_SUCCESS:
    "[Owner] Fetch categories configuration success",
  FETCH_CONFIGURATION_CATEGORIES_FAILD:
    "[Owner] Fetch categories configuration faild",
  SEND_CONFIGURATION_PARAMETERS: "[Owner] Set configuration",
  SEND_CONFIGURATION_PARAMETERS_SUCCESS: "[Owner] Set configuration success",
  SEND_CONFIGURATION_PARAMETERS_FAILD: "[Owner] Set configuration faild",
  SEND_CONFIGURATION_CATEGORIES: "[Owner] Set categories configuration",

  FETCH_CONFIGURATION_BUSINESSES: "[Owner] Fetch bussines",
  FETCH_CONFIGURATION_BUSINESSES_SUCCESS: "[Owner] Fetch bussines success",
  FETCH_CONFIGURATION_BUSINESSES_FAILD: "[Owner] Fetch bussines faild",

  BUSINESS_SET_OVERDRAFT: "[Owner] Set overfraft",
  BUSINESS_SET_OVERDRAFT_SUCCESS: "[Owner] Set overdraft success",
  BUSINESS_SET_OVERDRAFT_FAILD: "[Owner] Set overfraft faild",
  REMOVE_MSG: "[Owner - UI] Remove messages",
  BUSINESS_UPDATE_PROFILE: "[Owner] Update profile",

  FETCH_CONFIGURATION_BUSINESS: "[Owner] Fetch configuration",

  SAVE_BUSINESS: "[Owner] Save bussines",
  SAVE_BUSINESS_SUCCESS: "[Owner] Save bussines success",
  SAVE_BUSINESS_FAIL: "[Owner] Save bussines faild",

  FETCH_CONFIGURATION_SUBACCOUNTS: "[Owner] Fetch subaccounts",
  GET_SUBACCOUNTS_SUCCESS: "[Owner] Fetch subaccounts success",
  GET_SUBACCOUNTS_FAIL: "[Owner] Fetch subaccounts faild",

  UPDATE_SUBACCOUNT: "[Owner] Update subaccount",
  UPDATE_SUBACCOUNT_FAIL: "[Owner] Update subaccount faild",
  UPDATE_SUBACCOUNT_SUCCESS: "[Owner] Update subaccount success",

  FETCH_KPIS: "[Owner] Ferch KPIS",
  FETCH_KPIS_FAIL: "[Owner] Fetch KPIS faild",
  FETCH_KPIS_SUCCESS: "[Owner] Fetch KPIS success",

  fetchKpis: () => (dispatch, getState) => {
    dispatch({ type: actions.FETCH_KPIS });
  },

  fetchSubaccounts: id => (dispatch, getState) => {
    dispatch({
      type: actions.FETCH_CONFIGURATION_SUBACCOUNTS,
      payload: {
        account: {
          account_id: id || getState().Auth.account_id
        }
      }
    });
  },

  fetchBusinesses: payload => (dispatch, getState) => {
    payload = payload ? payload : {};
    dispatch({
      type: actions.FETCH_CONFIGURATION_BUSINESSES,
      payload: {
        page: payload.page || 1,
        limit: payload.limit || 10,
        filters: payload.filters || [],
        order: payload.order || []
      }
    });
  },

  overdraft: (business, overdraft) => (dispatch, getState) => {
    // This payload will be sent to the server
    console.log("-- BIZ ACTIONS :: overdraft");
    dispatch({
      type: actions.BUSINESS_SET_OVERDRAFT,
      payload: {
        business_name: business.account,
        initial_credit: overdraft,
        account_id: business.account_id
      }
    });
  },

  fetchBusiness: id => dispatch => {
    dispatch({
      type: actions.FETCH_CONFIGURATION_BUSINESS,
      payload: { id }
    });
  },

  saveBusiness: data => dispatch => {
    dispatch({
      type: actions.SAVE_BUSINESS,
      payload: data
    });
  },

  updateSubaccount: (account, parameteres) => dispatch => {
    dispatch({
      type: actions.UPDATE_SUBACCOUNT,
      payload: { ...account, ...parameteres }
    });
  },

  fetchParameteres: () => (dispatch, getState) => {
    dispatch({ type: actions.FETCH_CONFIGURATION_PARAMETERS });
  },

  sendParameters: data => (dispatch, getState) => {
    dispatch({ type: actions.SEND_CONFIGURATION_PARAMETERS, payload: data });
  },

  fetchCategories: () => (dispatch, getState) => {
    dispatch({ type: actions.FETCH_CONFIGURATION_CATEGORIES });
  },

  sendCategories: data => (dispatch, getState) => {
    dispatch({ type: actions.SEND_CONFIGURATION_CATEGORIES, payload: data });
  },

  removeMsg: () => dispatch => dispatch({ type: actions.REMOVE_MSG })
};
export default actions;
