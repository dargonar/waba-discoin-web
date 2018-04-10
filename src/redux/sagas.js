import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import getKpis from './kpis/saga';
import configurationsSagas from './configuration/saga';

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    getKpis(),
    configurationsSagas()
  ]);
}
