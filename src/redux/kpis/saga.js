import { takeLatest, put, call, all, fork  } from 'redux-saga/effects';

const getPath = 'http://35.163.59.126:8080/api/v3/dashboard/kpis';
const setPath = 'http://35.163.59.126:8080/api/v3/dashboard/kpis';

function fetchData(url) {    
    return () => {
        return fetch(url)
        .then(res => res.json() )
        .then(data => ({ data }) )
        .catch(ex => {
            return ({ ex });
        });
    };
}

function* getKpis(action) {
    yield takeLatest('KPIS/FETCH', function*() {
        const { data, ex } = yield call(fetchData(getPath));
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
  

