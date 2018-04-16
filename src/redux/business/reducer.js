import actions from './actions';

const initState = {
    loading: false,
    stores: null
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
    default:
      return state;
  }
}
