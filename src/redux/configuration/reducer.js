import actions from './actions'

const initState = {
    parameters: {}, 
    categories: {},
    loading: false
}
export default (state = initState, action = {}) => {
    switch (action.type) {
      case actions.FETCH_CONFIGURATION_CATEGORIES:
        return {
            ...state,
            loading: true
        };
      case actions.FETCH_CONFIGURATION_CATEGORIES_FAILD:
        return {
            ...state,
            loading: false
        };
      case actions.FETCH_CONFIGURATION_CATEGORIES_SUCCESS:
        return {
            ...state,
            loading: false,
            categories: action.payload
        };
      case actions.FETCH_CONFIGURATION_PARAMETERS:
        return {
            ...state,
            loading: true
        };
      case actions.FETCH_CONFIGURATION_PARAMETERS_FAILD:
        return {
            ...state,
            loading: false
        };
      case actions.FETCH_CONFIGURATION_PARAMETERS_SUCCESS:
        return {
            ...state,
            loading: false,
            parameters: action.payload.configuration
        };
      default:
        return state;
    }
  };