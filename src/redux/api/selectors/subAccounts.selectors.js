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

//List of subaccount transactions that match to user id
// Unless all has value true (false ad default)
export const subAccountTxs = (state, all = false) =>
  get(state, "Api.subaccount.transactions", []).filter(!all ? onlyAccountTx(accountId(state)) : () => true);
