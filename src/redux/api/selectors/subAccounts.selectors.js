import get from "lodash.get";
import { accountId } from "./user.selectors";
import moment from "moment";

// The selector pattern is an abstraction that standardizes an application’s
// store querying logic. It is simple: for any part of the store that an
// application needs access to, define a function that when given the full
// store, returns the desired part (or derivation) of the store.

//Check loading status (master and action)
export const isLoading = state => state.Api.loading || state.Api.actionLoading;

//Fists inject an accountId, and use the result in a filter function
export const onlyAccountTx = account_id => tx =>
  tx.from.id === account_id || tx.to.id === account_id;

//Subaccount state
export const subAccount = state => get(state, "Api.subaccount.data", {});

//Subaccount id
export const subAccountId = state => subAccount(state).id;

//List of subaccount transactions that match to user id
// Unless all has value true (false ad default)
export const subAccountTxs = (state, all = false) =>
  get(state, "Api.subaccount.transactions", []).filter(
    !all ? onlyAccountTx(accountId(state)) : () => true
  );

//See if the subaccount in the store is the one we want.
//Returns a function in which we must enter the subaccount id
export const isCurrentSubAccount = state => subaccount_id =>
  subAccountId(state) === subaccount_id ? true : false;

//Get only refunds txs
export const txRefunds = txs => txs.filter(tx => tx.type === "refund");

//Get only disocunts txs
export const txDiscounts = txs => txs.filter(tx => tx.type === "discount");

//Get txs total
export const txTotal = txs =>
  txs.reduce(
    (prev, act) => ({
      coin: prev.coin + Number(act.amount),
      fiat: prev.fiat + act.bill_amount
    }),
    { coin: 0, fiat: 0 }
  );

//Get totals amounts in txs
export const txTotals = (txs = []) => ({
  discount: txTotal(txDiscounts(txs)),
  refund: txTotal(txRefunds(txs))
});

//Get today txs
export const txToday = (txs = []) =>
  txs.filter(tx => moment().diff(tx.date, "days") === 0);
