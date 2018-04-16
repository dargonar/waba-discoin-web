const actions = {
    
    FETCH_CONFIGURATION_BUSINESS: 'CONFIGURATION/BUSINESS/FETCH',
    FETCH_CONFIGURATION_BUSINESS_SUCCESS: 'CONFIGURATION/BUSINESS/FETCH_SUCCESS',
    FETCH_CONFIGURATION_BUSINESS_FAILD: 'CONFIGURATION/BUSINESS/FETCH_FAILD',

    FETCH_CONFIGURATION_BUSINESSES: 'CONFIGURATION/BUSINESSES/FETCH',
    FETCH_CONFIGURATION_BUSINESSES_SUCCESS: 'CONFIGURATION/BUSINESSES/FETCH_SUCCESS',
    FETCH_CONFIGURATION_BUSINESSES_FAILD: 'CONFIGURATION/BUSINESSES/FETCH_FAILD',
    
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
    }
    
  };
  export default actions;
  