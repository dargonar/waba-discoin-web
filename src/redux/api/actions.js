const actions = {
  GET_PROFILE: "[Api] Get profile",
  GET_PROFILE_SUCCESS: "[Api] Get profile success",
  GET_PROFILE_FAILD: "[Api] Get profile faild",

  GET_CONFIGURATION: "[Api] Get configuration",
  GET_CONFIGURATION_SUCCESS: "[Api] Get configuration success",
  GET_CONFIGURATION_FAILD: "[Api] Get configuration faild",

  GET_CATEGORIES: "[Api] Get categories",
  GET_CATEGORIES_SUCCESS: "[Api] Get categories success",
  GET_CATEGORIES_FAILD: "[Api] Get categories faild",

  GET_CATEGORIES_LIST: "[Api] Get categories list",
  GET_CATEGORIES_LIST_SUCCESS: "[Api] Get categories list success",
  GET_CATEGORIES_LIST_FAILD: "[Api] Get categories list faild",

  ADD_OR_UPDATE_CATEGORY: "[Api] Add or update category",
  ADD_OR_UPDATE_CATEGORY_SUCCESS: "[Api] Add or update category success",
  ADD_OR_UPDATE_CATEGORY_FAILD: "[Api] Add or update category faild",

  DELETE_CATEGORY: "[Api] Delete category",
  DELETE_CATEGORY_SUCCESS: "[Api] Delete category success",
  DELETE_CATEGORY_FAILD: "[Api] Delete category faild",

  SEARCH_ACCOUNT: "[Api] Search account",
  SEARCH_ACCOUNT_SUCCESS: "[Api] Search account success",
  SEARCH_ACCOUNT_FAILD: "[Api] Search account faild",

  SEARCH_TRANSACTIONS: "[Api] Search transactions",
  SEARCH_ALL_TRANSACTIONS: "[Api] Search all transactions",
  SEARCH_TRANSACTIONS_SUCCESS: "[Api] Search transactions success",
  SEARCH_TRANSACTIONS_FAILD: "[Api] Search transactions faild",

  GET_SCHEDULE: "[Api] Get schedule",
  GET_SCHEDULE_SUCCESS: "[Api] Get schedule success",
  GET_SCHEDULE_FAILD: "[Api] Get schedule faild",

  UPDATE_SCHEDULE: "[Api] Update schedule",
  UPDATE_SCHEDULE_SUCCESS: "[Api] Update schedule success",
  UPDATE_SCHEDULE_FAILD: "[Api] Update schedule faild",

  APPLY_OVERDRAFT: "[Api] Apply Overdraft",
  APPLY_OVERDRAFT_SUCCESS: "[Api] Apply Overdraft success",
  APPLY_OVERDRAFT_FAILD: "[Api] Apply Overdraft faild",

  CLEAR_MSG: "[Api] Clear messages",

  fetchProfile: account_id => (dispatch, getState) => {
    dispatch({
      type: actions.GET_PROFILE,
      payload: {
        account_id: account_id || getState().Auth.account_id
      }
    });
  },

  fetchConfiguration: () => dispatch => {
    dispatch({
      type: actions.GET_CONFIGURATION
    });
  },

  getSchedule: () => (dispatch, getState) => {
    dispatch({
      type: actions.GET_SCHEDULE,
      payload: {
        account_id: getState().Auth.account_id
      }
    });
  },

  updateSchedule: newSchedule => (dispatch, getState) => {
    dispatch({
      type: actions.UPDATE_SCHEDULE,
      payload: {
        schedule: newSchedule,
        pkey: getState().Auth.keys.privKey,
        account_id: getState().Auth.account_id
      }
    });
  },

  // #   0 = ALL
  // #   1 = NO_CREDIT && NO_BLACK
  // #   2 = HAS_CREDIT
  searchAccount: account_name => dispatch => {
    console.log(" -- actions::searchAccount:" + account_name);
    dispatch({
      type: actions.SEARCH_ACCOUNT,
      payload: { account_name: account_name, filter: 1 }
    });
  },

  searchStore: account_name => dispatch => {
    console.log(" -- actions::searchStore:" + account_name);
    dispatch({
      type: actions.SEARCH_ACCOUNT,
      payload: { account_name: account_name, filter: 2 }
    });
  },

  searchAll: account_name => dispatch => {
    console.log(" -- actions::searchStore:" + account_name);
    dispatch({
      type: actions.SEARCH_ACCOUNT,
      payload: { account_name: account_name, filter: 0 }
    });
  },

  searchTransactions: name => (dispatch, getState) => {
    if (typeof name === "undefined" || name === "" || name === null) {
      dispatch({
        type: actions.SEARCH_ALL_TRANSACTIONS,
        payload: {
          name,
          account_id: getState().Auth.account_id
        }
      });
      return;
    }
    dispatch({
      type: actions.SEARCH_TRANSACTIONS,
      payload: {
        name,
        account_id: getState().Auth.account_id
      }
    });
  },

  getCategories: () => dispatch => {
    dispatch({
      type: actions.GET_CATEGORIES
    });
  },

  getCategoriesList: () => dispatch => {
    dispatch({
      type: actions.GET_CATEGORIES_LIST
    });
  },

  addOrUpdateCategory: data => dispatch => {
    dispatch({
      type: actions.ADD_OR_UPDATE_CATEGORY,
      payload: {
        category: data
      }
    });
  },

  deleteCategory: id => dispatch => {
    dispatch({
      type: actions.DELETE_CATEGORY,
      payload: { id }
    });
  },

  applyOverdraft: () => (dispatch, getState) => {
    dispatch({
      type: actions.APPLY_OVERDRAFT,
      payload: {
        signature: getState().Auth.keys.active.wif,
        business_name: getState().Auth.account,
        account_id: getState().Auth.account_id
      }
    });
  },

  cleanMsg: () => dispatch =>
    dispatch({
      type: actions.CLEAR_MSG
    })
};

export default actions;
