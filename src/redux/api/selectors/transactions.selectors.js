import get from "lodash.get";
import moment from "moment";
import { accountId } from "./user.selectors";
import {} from "./subAccounts.selectors";

const Box = x => ({
  map: f => Box(f(x)),
  fold: f => f(x)
});

//Fists inject an accountId, and use the result in a filter function
export const onlyAccountTx = account_id => tx => tx.from.id === account_id || tx.to.id === account_id;

export const txOnlyFrom = (txs = []) => (id = "") => txs.filter(tx => tx.from.id === id);

export const txOnlyTo = (txs = []) => (id = "") => txs.filter(tx => tx.to.id === id);

export const getTranactions = state => get(state, "Api.subaccount.transactions", []);

//List of subaccount transactions that match to user id
// Unless all has value true (false ad default)
export const subAccountTxs = (state, all = false) => getTranactions(state).filter(!all ? onlyAccountTx(accountId(state)) : () => true);

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
  discount: Box(txs)
    .map(txDiscounts)
    .fold(txTotal),
  refund: Box(txs)
    .map(txRefunds)
    .fold(txTotal)
});

//Get today txs
export const txToday = (txs = []) => txs.filter(tx => moment().diff(tx.date, "days") === 0);

export const txYesterday = (txs = []) =>
  txs.filter(
    tx =>
      moment()
        .subtract(1, "days")
        .diff(tx.date, "days") === 0
  );

export const txBetween = ({ from, until }, txs = []) => txs.filter(tx => moment(tx.date).isBetween(from, until));

//Get today totals
export const txTodayTotals = (txs = []) =>
  Box(txs)
    .map(txToday)
    .fold(txTotals);

//Get all account in tx
export const txAccounts = (txs = []) =>
  [
    ...new Set(txs.reduce((prev, tx) => [...prev, tx.from, tx.to], []).map(o => JSON.stringify(o))) //all accounts in string
  ].map(s => JSON.parse(s)); // parse and remove duplicated

//Get weekly totals
const emptyWeek = [0, 1, 2, 3, 4, 5, 6].map(key => ({
  discount: { coin: 0, fiat: 0 },
  refund: { coin: 0, fiat: 0 },
  txs: 0,
  date: moment()
    .subtract(key, "day")
    .format("YYYY-MM-DD")
}));

const txInRangeTotals = (arrTxs = {}) => {
  const arrTxsTotals = Object.keys(arrTxs)
    .map(key => ({ [key]: { ...txTotals(arrTxs[key]), txs: arrTxs[key].length, date: key } }))
    .reduce((prev, act) => ({ ...prev, ...act }), {});
  return emptyWeek.map(day => ({
    ...day,
    ...(arrTxsTotals[day.date] ? arrTxsTotals[day.date] : {})
  }));
};
const formatDate = tx => moment(tx.date).format("YYYY-MM-DD");
const txOnlyThisWeek = (txs = []) => txs.filter(tx => moment(tx.date).isSameOrAfter(moment().subtract(6, "day"), "day"));
const txPerDay = (txs = []) =>
  txs.reduce(
    (prev, curr) => ({
      ...prev,
      ...{ [formatDate(curr)]: [...(prev[formatDate(curr)] || []), curr] }
    }),
    {}
  );

export const txWeekTotals = (txs = []) =>
  Box(txs)
    .map(txOnlyThisWeek)
    .map(txPerDay)
    .fold(txInRangeTotals);
