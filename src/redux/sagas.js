import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import apiSagas from './api/saga';
import getKpis from './kpis/saga';
import configurationsSagas from './configuration/saga';
import businessSagas from './business/saga';

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    getKpis(),
    configurationsSagas(),
    businessSagas(),
    apiSagas()
  ]);
}
