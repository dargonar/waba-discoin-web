import actions from './actions';
import fakeData from './fakeData';
const initState = {
    loading: false,
    actionLoading: false,
    error: false,
    msg: null,
    stores: [],
    subaccounts: [],
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
        stores : state.stores
          .filter(store => store.account_id !== action.payload.business.account_id)
          .concat(action.payload.business)
      }
    case actions.FETCH_CONFIGURATION_SUBACCOUNTS:
      return {
        ...state,
        loading: true
      }
    case actions.GET_SUBACCOUNTS_SUCCESS:
      return {
        ...state,
        loading: false,
        subaccounts: state.subaccounts
          .filter(x => x.account_id !== action.payload.account_id) //If exist -> remove
          .concat(action.payload) // add subaccuounts
      }
    case actions.GET_SUBACCOUNTS_FAIL:
      return {
        ...state,
        loading: false,
        error: true,
        msg: action.payload.ex
      }

    case actions.FETCH_CONFIGURATION_BUSINESSES_FAILD:
    return {
        ...state,
        loading: false,
        error: true,
        msg: 'Error loading businesses. Please try again leater.'
    }


    case actions.UPDATE_SUBACCOUNT:
      return {
        ...state,
        actionLoading: true
      }

    case actions.UPDATE_SUBACCOUNT_SUCCESS:
      return {
        ...state,
        actionLoading: false,
        subaccounts: state.subaccounts
          .filter(x => x.account_id !== action.payload.account_id) //If exist -> remove
          .concat(action.payload.data) // add subaccuounts
      }

    case actions.UPDATE_SUBACCOUNT_FAIL:
      return {
          ...state,
          actionLoading: false,
          error: true,
          msg: 'Error when updating subaccount.'
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
