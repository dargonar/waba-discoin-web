import actions from './actions';

const initState = { 
  inLocal: null,
  loading: false
};

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case actions.LS_CHECK_FULL:
      return {
        ...state,
        inLocal: true
      }
    case actions.LS_CHECK_EMPTY:
      return {
        ...state,
        inLocal: false
      }
    case actions.LS_CLEAN_SUCCESS: {
      return {
        ...state,
        inLocal: false
      }
    }
    case actions.LOGIN_REQUEST:
      return {
        ...state,
        loading: true
      }
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        keys: action.payload.keys,
        account: action.payload.account,
        account_id: action.payload.account_id,
        secret: action.payload.secret,
        raw: action.payload.raw
      }
    case actions.LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case actions.LOGOUT:
      return initState;
    default:
      return state;
  }
}