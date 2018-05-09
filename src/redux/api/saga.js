import { all, fork } from 'redux-saga/effects';
import actions from './actions';
import { apiCall, getPath } from '../../httpService';

import { getProfile } from './sagas/getProfile'

export default function* rootSaga() {
    yield all([
        fork(getProfile)
    ]);
  }
  