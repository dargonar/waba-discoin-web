const actions = {
    
    FETCH_CONFIGURATION_BUSINESSES: 'BUSINESSES/FETCH',
    FETCH_CONFIGURATION_BUSINESSES_SUCCESS: 'BUSINESSES/FETCH_SUCCESS',
    FETCH_CONFIGURATION_BUSINESSES_FAILD: 'BUSINESSES/FETCH_FAILD',
    
    BUSINESS_SET_OVERDRAFT: 'BUSINESSES/SET_OVERDRAFT',
    BUSINESS_SET_OVERDRAFT_SUCCESS: 'BUSINESSES/SET_OVERDRAFT_SUCCESS',
    BUSINESS_SET_OVERDRAFT_FAILD: 'BUSINESSES/SET_OVERDRAFT_FAILD',
    REMOVE_MSG: 'REMOVE_MSG',
    BUSINESS_UPDATE_PROFILE: 'BUSINESSES/UPDATE_PROFILE',
    
    FETCH_CONFIGURATION_BUSINESS: 'BUSINESS/FETCH',

    SAVE_BUSINESS: 'BUSINESS/SAVE',
    SAVE_BUSINESS_SUCCESS: 'BUSINESS/SAVE_SUCCESS',
    SAVE_BUSINESS_FAIL: 'BUSINESS/SAVE_FAILD',
    
    FETCH_CONFIGURATION_SUBACCOUNTS: 'BUSINESS/SUBACCOUNTS_FETCH',
    GET_SUBACCOUNTS_SUCCESS: 'BUSINESS/SUBACCOUNTS_FETCH_SUCCESS',
    GET_SUBACCOUNTS_FAIL: 'BUSINESS/SUBACCOUNTS_FETCH_FAIL',


    fetchSubaccounts: (payload) => (dispatch, getState) => {
        if (payload.id === null && payload.id === undefined) {
            return dispatch({
                type: actions.SAVE_BUSINESS_FAIL,
                payload: {
                    msg: 'No account id'
                }
            })
        }
        dispatch({
            type: actions.FETCH_CONFIGURATION_SUBACCOUNTS,
            payload
        })
    },

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
    
    fetchBusiness: (id) => (dispatch) => {
       dispatch({
            type: actions.FETCH_CONFIGURATION_BUSINESS,
            payload: { id }
       }) 
    },
    saveBusiness: (data) => (dispatch) => {
        dispatch({
            type: actions.SAVE_BUSINESS,
            payload: data
        })
    },

    removeMsg: () => (dispatch) => dispatch({ type: actions.REMOVE_MSG })
  };
  export default actions;
  