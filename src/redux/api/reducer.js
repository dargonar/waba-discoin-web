import actions from "./actions";

const initState = {
  business: null,
  transactions: [],
  configuration: null,
  schedule: null,
  customers: [],
  loading: false,
  transactionsLoading: false,
  error: false,
  actionLoading: false,
  msg: null,
  categories: [],
  categoriesList: []
};

export default function apiReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_PROFILE:
      return {
        ...state,
        loading: true
      };
    case actions.GET_PROFILE_SUCCESS:
      return {
        ...state,
        business: action.payload.business,
        loading: false
      };
    case actions.GET_PROFILE_FAILD:
      return {
        ...state,
        loading: false,
        error: true,
        msg: action.payload.error
      };
    case actions.GET_CONFIGURATION_SUCCESS:
      return {
        ...state,
        configuration: action.payload.configuration
      };
    case actions.GET_CONFIGURATION_FAILD:
      return {
        ...state,
        loading: false,
        error: true,
        msg: action.payload
      };
    case actions.GET_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload.categories
      };
    case actions.GET_CATEGORIES_FAILD:
      return {
        ...state,
        loading: false,
        error: true,
        msg: action.payload
      };

    case actions.GET_CATEGORIES_LIST_SUCCESS:
      return {
        ...state,
        categoriesList: action.payload.categories
      };
    case actions.GET_CATEGORIES_LIST_FAILD:
      return {
        ...state,
        loading: false,
        error: true,
        msg: action.payload
      };

    // GET SCHEDULE REDUCERS
    case actions.GET_SCHEDULE:
      return {
        ...state,
        actionLoading: true
      };
    case actions.GET_SCHEDULE_SUCCESS:
      return {
        ...state,
        actionLoading: false,
        schedule: action.payload.discount_schedule
      };
    case actions.UPDATE_SCHEDULE_SUCCESS:
      return {
        ...state,
        actionLoading: false,
        schedule: action.payload.discount_schedule
      };
    case actions.GET_SCHEDULE_FAILD:
      return {
        ...state,
        actionLoading: false,
        error: action.payload.err,
        msg: "Error loading discount schedule"
      };

    // UPDATE SCHEDULE REDUCERS
    case actions.UPDATE_SCHEDULE:
      return {
        ...state,
        actionLoading: true
      };

    case actions.UPDATE_SCHEDULE_FAILD:
      return {
        ...state,
        error: action.payload,
        msg: "Error:" + action.payload,
        actionLoading: false
      };
    case actions.UPDATE_SCHEDULE_SUCCESS:
      return {
        ...state,
        actionLoading: false,
        business: {
          ...state.business,
          discount_schedule: action.payload.discount_schedule
        }
      };

    case actions.SEARCH_ACCOUNT:
      return {
        ...state,
        actionLoading: true
      };
    case actions.SEARCH_ACCOUNT_SUCCESS:
      return {
        ...state,
        actionLoading: false,
        customers: action.payload.res.map(customer => ({
          name: customer[0],
          account_id: customer[1]
        }))
      };
    case actions.SEARCH_ACCOUNT_FAILD:
      return {
        ...state,
        actionLoading: false,
        error: true,
        msg: action.payload.err || action.payload.error
      };

    // SEARCH TRANSACTIONS --> HACK
    case actions.SEARCH_ALL_TRANSACTIONS:
      return {
        ...state,
        transactionsLoading: true
      };
    case actions.SEARCH_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        transactions: action.payload.txs,
        transactionsLoading: false
      };
    case actions.CLEAR_MSG:
      return {
        ...state,
        error: false,
        msg: null
      };
    default:
      return state;
  }
}
