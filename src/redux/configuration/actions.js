const actions = {
    
    FETCH_CONFIGURATION_PARAMETERS: 'PARAMETERS/FETCH',
    FETCH_CONFIGURATION_PARAMETERS_SUCCESS: 'PARAMETERS/FETCH_SUCCESS',
    FETCH_CONFIGURATION_PARAMETERS_FAILD: 'PARAMETERS/FETCH_FAILD',
    FETCH_CONFIGURATION_CATEGORIES: 'CATEGORIES/FETCH',
    FETCH_CONFIGURATION_CATEGORIES_SUCCESS: 'CATEGORIES/FETCH_SUCCESS',
    FETCH_CONFIGURATION_CATEGORIES_FAILD: 'CATEGORIES/FETCH_FAILD',
    SEND_CONFIGURATION_PARAMETERS: 'PARAMETERS/SEND',
    SEND_CONFIGURATION_CATEGORIES: 'CATEGORIES/SEND',
    REMOVE_MSG: 'REMOVE_MSG',

    fetchParameteres: ()=> (dispatch, getState) => {
        dispatch({ type: actions.FETCH_CONFIGURATION_PARAMETERS });
    },
    
    sendParameters: (data)=> (dispatch, getState) => {
        dispatch({ type: actions.SEND_CONFIGURATION_PARAMETERS, payload: data });
    },

    fetchCategories: ()=> (dispatch, getState) => {
        dispatch({ type: actions.FETCH_CONFIGURATION_CATEGORIES });
    },

    sendCategories: (data)=> (dispatch, getState) => {
        dispatch({ type: actions.SEND_CONFIGURATION_CATEGORIES, payload: data });
    },

    removeMsg: () => (dispatch) => dispatch({ type: actions.REMOVE_MSG })
}

export default actions;