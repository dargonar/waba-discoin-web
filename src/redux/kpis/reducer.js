export default (state = {data: {}, loading: true}, action = {}) => {
    switch (action.type) {
      case 'KPIS/FETCH':
      case 'KPIS/FAILED':
        return {
            ...state,
            loading: true,
            data: {}
        };
      case 'KPIS/SET':
        return {
            ...state,
            loading: false,
            data: action.payload
        };
      default:
        return state;
    }
  };