const actions = {
    FETCH_KPIS: 'KPIS/FETCH',
    fetchKpis: ()=> (dispatch, getState) => {
        dispatch({ type: actions.FETCH_KPIS });
    }
}

export default actions;