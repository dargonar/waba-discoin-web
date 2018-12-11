import {
  onlyAccountTx,
  txToday,
  txDiscounts,
  txRefunds,
  txBetween,
  txYesterday,
  txOnlyFrom,
  txOnlyTo
} from "../../../../redux/api/selectors/transactions.selectors";

const filters = {
  //arg = "today" (Default) || "yesterday"
  day: arg => txs => (arg === "yesterday" ? txYesterday(txs) : txToday(txs)),

  //arg = {from: Date, until: Date }
  between: arg => txs => txBetween({ from: arg.from, until: arg.until }, txs),

  //arg = "account_id"
  user: ({ account_id, direction }) => txs => {
    switch (direction) {
      case true:
        return txOnlyFrom(txs)(account_id);
      case false:
        return txOnlyTo(txs)(account_id);
      default:
        return txs.filter(onlyAccountTx(account_id));
    }
  },

  //arg = "discount" (Default) || "refund"
  byType: arg => txs => {
    if (!arg) return txs;
    return arg === "refund" ? txRefunds(txs) : txDiscounts(txs);
  }
};

export const applyFilters = (filterList = [], txs = []) =>
  filterList.length > 0
    ? filterList
        .map(item => filters[item.filter](item.arg)) // Init filters
        .reduce((prev, curr) => curr(prev), txs)
    : txs; // Apply filters

export const getFilter = (filterList = [], filterName) =>
  filterList.filter(x => x.filter === filterName).reduce((prev, act) => act, { notFound: true });
