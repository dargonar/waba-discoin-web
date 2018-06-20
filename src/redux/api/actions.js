const actions = {
    GET_PROFILE: 'GET_PROFILE',
    GET_PROFILE_SUCCESS: 'GET_PROFILE_SUCCESS',
    GET_PROFILE_FAILD: 'GET_PROFILE_FAILD',

    GET_CONFIGURATION: 'GET_CONFIGURATION',
    GET_CONFIGURATION_SUCCESS: 'GET_CONFIGURATION_SUCCESS',
    GET_CONFIGURATION_FAILD: 'GET_CONFIGURATION_FAILD',

    GET_CATEGORIES: 'GET_CATEGORIES',
    GET_CATEGORIES_SUCCESS: 'GET_CATEGORIES_SUCCESS',
    GET_CATEGORIES_FAILD: 'GET_CATEGORIES_FAILD',
    
    GET_CATEGORIES_LIST: "GET_CATEGORIES_LIST",
    GET_CATEGORIES_LIST_SUCCESS: "GET_CATEGORIES_LIST_SUCCESS",
    GET_CATEGORIES_LIST_FAILD: "GET_CATEGORIES_LIST_FAILD",
    

    SEARCH_CUSTOMERS: 'SEARCH_CUSTOMERS',
    SEARCH_ALL_CUSTOMERS: 'SEARCH_ALL_CUSTOMERS',
    SEARCH_CUSTOMERS_SUCCESS: 'SEARCH_CUSTOMERS_SUCCESS',
    SEARCH_CUSTOMERS_FAILD: 'SEARCH_CUSTOMERS_FAILD',

    SEARCH_TRANSACTIONS: 'SEARCH_TRANSACTIONS',
    SEARCH_ALL_TRANSACTIONS: 'SEARCH_ALL_TRANSACTIONS',
    SEARCH_TRANSACTIONS_SUCCESS: 'SEARCH_TRANSACTIONS_SUCCESS',
    SEARCH_TRANSACTIONS_FAILD: 'SEARCH_TRANSACTIONS_FAILD',

    GET_SCHEDULE: 'GET_SCHEDULE',
    GET_SCHEDULE_SUCCESS: 'GET_SCHEDULE_SUCCESS',
    GET_SCHEDULE_FAILD: 'GET_SCHEDULE_FAILD',
    UPDATE_SCHEDULE: 'UPDATE_SCHEDULE',
    UPDATE_SCHEDULE_SUCCESS: 'UPDATE_SCHEDULE_SUCCESS',
    UPDATE_SCHEDULE_FAILD: 'UPDATE_SCHEDULE_FAILD',

    APPLY_OVERDRAFT: 'APPLY_OVERDRAFT',
    APPLY_OVERDRAFT_SUCCESS: 'APPLY_OVERDRAFT_SUCCESS',
    APPLY_OVERDRAFT_FAILD: 'APPLY_OVERDRAFT_FAILD',

    CLEAR_MSG: 'CLEAR_MSG',

    fetchProfile: (account_id) => (dispatch, getState) => {
        dispatch({
            type: actions.GET_PROFILE,
            payload: {
                account_id: account_id || getState().Auth.account_id
            }
        })
    },
    
    fetchConfiguration: () => (dispatch) => {
        dispatch({
            type: actions.GET_CONFIGURATION,
        })
    },

    getSchedule: () => (dispatch, getState) => {
        dispatch({
            type: actions.GET_SCHEDULE,
            payload: {
                account_id: getState().Auth.account_id
            }
        })
    },

    updateSchedule: (newSchedule) => (dispatch, getState) => {
        dispatch({
            type: actions.UPDATE_SCHEDULE,
            payload: { 
                schedule: newSchedule,
                pkey: getState().Auth.keys.privKey,
                account_id: getState().Auth.account_id
            }
        })
    },

    searchCustomer: (customer) => (dispatch) => {
        console.log(customer)
        if (typeof customer === 'undefined' || customer === '' || customer === null ) {
            dispatch({ type: actions.SEARCH_ALL_CUSTOMERS })
            return;
        }
        dispatch({
            type: actions.SEARCH_CUSTOMERS,
            payload: customer
        })
    },

    searchTransactions: (name) => (dispatch, getState) => {
        if (typeof name === 'undefined' || name === '' || name === null ) {
            dispatch({ 
                type: actions.SEARCH_ALL_TRANSACTIONS,
                payload: {
                    name,
                    account_id: getState().Auth.account_id
                }
            })
            return;
        }
        dispatch({
            type: actions.SEARCH_TRANSACTIONS,
            payload: {
                name,
                account_id: getState().Auth.account_id
            }
        })
    },

    getCategories: () => (dispatch) => {
        dispatch({
            type: actions.GET_CATEGORIES
        });
    },

    getCategoriesList: () => dispatch => {
        dispatch({
            type: actions.GET_CATEGORIES_LIST
        });
    },

    applyOverdraft: () => (dispatch, getState) => {
        dispatch({
            type: actions.APPLY_OVERDRAFT,
            payload: {
                signature: getState().Auth.keys.active.wif,
                bussines_name: getState().Auth.account,
                account_id: getState().Auth.account_id
            }
        })
    },

    cleanMsg: () => (dispatch) => 
        dispatch({
            type: actions.CLEAR_MSG
        })
};

export default actions;