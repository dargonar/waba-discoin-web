import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import getKpis from './kpis/saga'
export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    getKpis()
  ]);
}
