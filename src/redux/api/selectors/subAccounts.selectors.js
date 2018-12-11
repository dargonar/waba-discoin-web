import get from "lodash.get";

// The selector pattern is an abstraction that standardizes an application’s
// store querying logic. It is simple: for any part of the store that an
// application needs access to, define a function that when given the full
// store, returns the desired part (or derivation) of the store.

//Check loading status (master and action)
export const isLoading = state => state.Api.loading || state.Api.actionLoading;

//Subaccount state
export const subAccount = state => get(state, "Api.subaccount.data", {});

//Subaccount id
export const subAccountId = state => subAccount(state).id;

//See if the subaccount in the store is the one we want.
//Returns a function in which we must enter the subaccount id
export const isCurrentSubAccount = state => subaccount_id => (subAccountId(state) === subaccount_id ? true : false);
