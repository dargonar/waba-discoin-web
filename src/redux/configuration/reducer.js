import actions from './actions'

const initState = {
    parameters: null, 
    categories: null,
    loading: false,
    error: false,
    msg: null
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
            loading: false,
            error: true,
            msg: 'Error loading categoires, please try leater.'
        };
      case actions.FETCH_CONFIGURATION_CATEGORIES_SUCCESS:
        return {
            ...state,
            loading: false,
            categories: action.payload.categories
        };
      case actions.FETCH_CONFIGURATION_PARAMETERS:
        return {
            ...state,
            loading: true
        };
      case actions.FETCH_CONFIGURATION_PARAMETERS_FAILD:
        return {
            ...state,
            loading: false,
            error: true,
            msg: 'Error loading categories, please try leater.'
        };
      case actions.FETCH_CONFIGURATION_PARAMETERS_SUCCESS:
        return {
            ...state,
            loading: false,
            parameters: action.payload.configuration
        };
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
  };