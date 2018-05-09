import actions from "./actions";

const initState = {
    bussines: null,
    transactions: null,
    costumers: null,
    loading: false,
    error: false,
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
                bussines: action.payload.bussines,
                loading: false
            }
        case actions.GET_PROFILE_FAILD:
            return {
                ...state,
                loading: false,
                error: true,
                msg: action.payload.error
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