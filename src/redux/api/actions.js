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

    SEARCH_CUSTOMERS: 'SEARCH_CUSTOMERS',
    SEARCH_ALL_CUSTOMERS: 'SEARCH_ALL_CUSTOMERS',
    SEARCH_CUSTOMERS_SUCCESS: 'SEARCH_CUSTOMERS_SUCCESS',
    SEARCH_CUSTOMERS_FAILD: 'SEARCH_CUSTOMERS_FAILD',

    GET_SCHEDULE: 'GET_SCHEDULE',
    GET_SCHEDULE_SUCCESS: 'GET_SCHEDULE_SUCCESS',
    GET_SCHEDULE_FAILD: 'GET_SCHEDULE_FAILD',
    UPDATE_SCHEDULE: 'UPDATE_SCHEDULE',
    UPDATE_SCHEDULE_SUCCESS: 'UPDATE_SCHEDULE_SUCCESS',
    UPDATE_SCHEDULE_FAILD: 'UPDATE_SCHEDULE_FAILD',

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

    getCategories: () => (dispatch) => {
        dispatch({
            type: actions.GET_CATEGORIES
        });
    },

    cleanMsg: () => (dispatch) => 
        dispatch({
            type: actions.CLEAR_MSG
        })
};

export default actions;