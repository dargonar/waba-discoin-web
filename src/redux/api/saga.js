import { all, fork } from "redux-saga/effects";

import { getProfile } from "./sagas/getProfile";
import { getConfiguration } from "./sagas/getConfiguration";
import { getCategories } from "./sagas/getCategories";
import { manageBusinessCategories } from "./sagas/manageBusinessCategories";
import { getSchedule } from "./sagas/getSchedule";
import { updateSchedule } from "./sagas/updateSchedule";
import { searchAccount } from "./sagas/searchCustomers";
import { searchAllTransactions } from "./sagas/searchTransactions";
import { applyOverdraft } from "./sagas/applyOverdraft";

export default function* rootSaga() {
  yield all([
    fork(getProfile),
    fork(getConfiguration),
    fork(getCategories),
    fork(manageBusinessCategories),
    fork(getSchedule),
    fork(updateSchedule),
    fork(searchAccount),
    fork(searchAllTransactions),
    fork(applyOverdraft)
  ]);
}
