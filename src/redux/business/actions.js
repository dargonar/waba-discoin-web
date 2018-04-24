const actions = {
    
    FETCH_CONFIGURATION_BUSINESS: 'CONFIGURATION/BUSINESS/FETCH',
    FETCH_CONFIGURATION_BUSINESS_SUCCESS: 'CONFIGURATION/BUSINESS/FETCH_SUCCESS',
    FETCH_CONFIGURATION_BUSINESS_FAILD: 'CONFIGURATION/BUSINESS/FETCH_FAILD',

    FETCH_CONFIGURATION_BUSINESSES: 'CONFIGURATION/BUSINESSES/FETCH',
    FETCH_CONFIGURATION_BUSINESSES_SUCCESS: 'CONFIGURATION/BUSINESSES/FETCH_SUCCESS',
    FETCH_CONFIGURATION_BUSINESSES_FAILD: 'CONFIGURATION/BUSINESSES/FETCH_FAILD',
    
    BUSINESS_SET_OVERDRAFT: 'CONFIGURATION/BUSINESSES/SET_OVERDRAFT',
    BUSINESS_SET_OVERDRAFT_SUCCESS: 'CONFIGURATION/BUSINESSES/SET_OVERDRAFT_SUCCESS',
    BUSINESS_SET_OVERDRAFT_FAILD: 'CONFIGURATION/BUSINESSES/SET_OVERDRAFT_FAILD',
    REMOVE_MSG: 'REMOVE_MSG',
    BUSINESS_UPDATE_PROFILE: 'CONFIGURATION/BUSINESSES/UPDATE_PROFILE',

    fetchBusinesses: (payload)=> (dispatch, getState) => {
        payload = (payload)? payload: {}
        dispatch({ 
            type: actions.FETCH_CONFIGURATION_BUSINESSES,
            payload: {
                balance: payload.balance || 0,
                from: payload.from || 0,
                limit: payload.limit || 50
            }
        });
    },

    overdraft: (business, overdraft) => (dispatch) =>{
        // This payload will be sent to the server
        dispatch({
            type: actions.BUSINESS_SET_OVERDRAFT,
            payload: {
                business_name: business.account,
                initial_credit: overdraft,
                account_id: business.account_id
            }
        });
    },
    
    removeMsg: () => (dispatch) => dispatch({ type: actions.REMOVE_MSG })
  };
  export default actions;
  