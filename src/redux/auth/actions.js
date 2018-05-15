const actions = {
  CHECK_AUTHORIZATION: 'CHECK_AUTHORIZATION',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGOUT: 'LOGOUT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LS_CHECK: 'LS/CHECK',
  LS_CHECK_FULL: 'LS/CHECK_FULL',
  LS_CHECK_EMPTY: 'LS/CHECK_EMPTY',
  LS_READ: 'LS/READ',
  LS_READ_SUCCESS: 'LS/READ_SUCCESS',
  LS_READ_FAILD: 'LS/READ_FAILD',
  LS_WRITE: 'LS/WRITE',
  LS_WRITE_SUCCESS: 'LS/WRITE_SUCCESS',
  LS_WRITE_FAILD: 'LS/WRITE_FAILD',
  LS_CLEAN: 'LS/CLEAN',
  LS_CLEAN_SUCCESS: 'LS/CLEAN_SUCCESS',

  loadStorage: () => ({ type: actions.LS_CHECK }),
  login: ({account}) => ({
    type: actions.LOGIN_REQUEST,
    payload: { account }
  }),
  logout: () => ({
    type: actions.LOGOUT
  })
};
export default actions;
