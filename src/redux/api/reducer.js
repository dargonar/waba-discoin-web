import actions from "./actions";

const initState = {
    business: null,
    transactions: null,
    configuration: null,
    schedule: null,
    costumers: null,
    loading: false,
    error: false,
    actionLoading: false,
    msg: null,
}

export default function apiReducer(state = initState, action) {
    switch (action.type) {
        case actions.GET_PROFILE:
            return {
                ...state,
                loading: true
            }
        case actions.GET_PROFILE_SUCCESS:
            return {
                ...state,
                business: action.payload.business,
                loading: false
            }
        case actions.GET_PROFILE_FAILD:
            return {
                ...state,
                loading: false,
                error: true,
                msg: action.payload.error
            }
        case actions.GET_CONFIGURATION_SUCCESS:
            return {
                ...state,
                configuration: action.payload.configuration
            }
        case actions.GET_CONFIGURATION_FAILD:
            return {
                ...state,
                loading: false,
                error: true,
                msg: action.payload
            }
            case actions.GET_CATEGORIES_SUCCESS:
            return {
                ...state,
                categories: action.payload.categories
            }
        case actions.GET_CATEGORIES_FAILD:
            return {
                ...state,
                loading: false,
                error: true,
                msg: action.payload
            }

        // GET SCHEDULE REDUCERS
        case actions.GET_SCHEDULE:
            return {
                ...state,
                actionLoading: true
            }
        case actions.GET_SCHEDULE_SUCCESS:
            return {
                ...state,
                actionLoading: false,
                schedule: action.payload.discount_schedule
            }
        case actions.GET_SCHEDULE_FAILD:
            return {
                ...state,
                actionLoading: false,
                error: action.payload.err,
                msg: 'Error loading discount schedule'
            }

        // UPDATE SCHEDULE REDUCERS
        case actions.UPDATE_SCHEDULE:
            return {
                ...state,
                actionLoading: true
            }

        case actions.UPDATE_SCHEDULE_SUCCESS:
            return {
                ...state,
                actionLoading: false,
                business: {
                    ...state.business,
                    discount_schedule: action.payload.discount_schedule
                }
            }
        
        case actions.UPDATE_SCHEDULE_FAILD: 
            return {
                ...state,
                error: action.payload,
                msg: 'Error updating the schedule',
                actionLoading: false    
            }

        case actions.CLEAR_MSG:
            return {
                ...state,
                error: false,
                msg: null
            }
        default:
            return state;
    }
}