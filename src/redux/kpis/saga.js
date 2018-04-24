import { takeLatest, put, call, all, fork  } from 'redux-saga/effects';
import { getPath, apiCall } from "../../httpService";

function* getKpis(action) {
    yield takeLatest('KPIS/FETCH', function*() {
        const url = getPath('URL/GET_KPIS');
        const fetchData = apiCall(url);
        const { data, ex } = yield call(fetchData);
        if (data)
            yield put({ type: 'KPIS/SET', payload: data });
        else
            yield put({ type: 'KPIS/FAILED', ex });
    })
}

export default function* rootSaga() {
    yield all([
      fork(getKpis)
    ]);
  }
  

