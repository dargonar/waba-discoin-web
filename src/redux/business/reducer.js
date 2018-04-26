import actions from './actions';
import fakeData from './fakeData';
const initState = {
    loading: false,
    actionLoading: false,
    error: false,
    msg: null,
    stores: null,
    categories: fakeData.categories
}

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_CONFIGURATION_BUSINESSES:
      return {
          ...state,
          loading: true
      }
    case actions.FETCH_CONFIGURATION_BUSINESSES_SUCCESS:
      return {
          ...state,
          stores: [].concat(action.payload),
          loading: false
      }
    case actions.BUSINESS_SET_OVERDRAFT:
      return {
        ...state,
        actionLoading: true
      }
    case actions.BUSINESS_SET_OVERDRAFT_SUCCESS:
      return {
        ...state,
        actionLoading: false,
        error: false,
        msg: 'Overdraft change successfully applied'
      }
    case actions.BUSINESS_SET_OVERDRAFT_FAILD:
      return {
        ...state,
        actionLoading: false,
        error: true,
        msg: 'Something didn\'t go right.'
      }
    case actions.BUSINESS_UPDATE_PROFILE:
      return {
        ...state,
        stores : (state.stores !== null)? state.stores.map(store => {
            if (store.account_id === action.payload.business.account_id)
              return action.payload.business
            else
              return store
          }): [ action.payload.business ]
      }
    case actions.REMOVE_MSG:
      return {
        ...state,
        actionLoading: false,
        error: false,
        msg: null
      }
    default:
      return state;
  }
}
