import { Map } from 'immutable';
import actions from './actions';

const initState = { 
  inLocal: null,
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
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        keys: action.payload.keys,
        account: action.payload.account,
        secret: action.payload.secret
      }
    case actions.LOGOUT:
      return initState;
    default:
      return state;
  }
}
