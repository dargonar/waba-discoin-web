import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import apiSagas from './api/saga';
import businessSagas from './business/saga'

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    apiSagas(),
    businessSagas(),
  ]);
}
