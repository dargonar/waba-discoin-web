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

    CLEAR_MSG: 'CLEAR_MSG',

    fetchProfile: (account_id) => (dispatch, getState) => {
        dispatch({
            type: actions.GET_PROFILE,
            payload: {
                account_id: account_id || getState().Auth.get('businessId')
            }
        })
    },
    
    fetchConfiguration: () => (dispatch) => {
        dispatch({
            type: actions.GET_CONFIGURATION,
        })
    },

    cleanMsg: () => (dispatch) => 
        dispatch({
            type: actions.CLEAR_MSG
        })
};

export default actions;