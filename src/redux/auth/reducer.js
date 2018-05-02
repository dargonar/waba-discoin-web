import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({ 
  idToken: null,
  account: null
});

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      return state
        .set('idToken', action.token)
        .set('account', action.account);
    case actions.LOGOUT:
      return initState;
    default:
      return state;
  }
}
