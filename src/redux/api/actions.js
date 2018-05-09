const actions = {
    GET_PROFILE: 'GET_PROFILE',
    GET_PROFILE_SUCCESS: 'GET_PROFILE_SUCCESS',
    GET_PROFILE_FAILD: 'GET_PROFILE_FAILD',
    CLEAR_MSG: 'CLEAR_MSG',

    fetchProfile: (account_id) => (dispatch) => 
        dispatch({
            type: actions.GET_PROFILE,
            payload: {
                account_id: account_id
            }
        }),

    cleanMsg: () => (dispatch) => 
        dispatch({
            type: actions.CLEAR_MSG
        })
};

export default actions;