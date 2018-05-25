import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({ 
  idToken: null,
  account: null,
  keys: null,
  accountId: '1.2.38',
  businessId: '1.2.38',
  account: 'discoin.tuti'
});

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      return state
        .set('idToken', action.token)
        .set('account', action.account)
        .set('keys', action.keys);
    case actions.LOGOUT:
      return initState;
    default:
      return state;
  }
}
