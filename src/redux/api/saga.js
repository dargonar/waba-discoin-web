import { all, fork } from 'redux-saga/effects';
import actions from './actions';
import { apiCall, getPath } from '../../httpService';

import { getProfile } from './sagas/getProfile'
import { getConfiguration } from './sagas/getConfiguration'
import { getCategories } from './sagas/getCategories'
import { updateSchedule } from './sagas/updateSchedule'

export default function* rootSaga() {
    yield all([
        fork(getProfile),
        fork(getConfiguration),
        fork(getCategories),
        fork(updateSchedule)
    ]);
  }
  