const actions = {
  CHECK_AUTHORIZATION: "[Auth] Check authorization",
  LOGIN_REQUEST: "[Auth] Login request",
  LOGOUT: "[Auth] Logout",
  LOGIN_SUCCESS: "[Auth] Login success",
  LOGIN_ERROR: "[Auth] Login error",
  LOCAL_LOGIN_SUCCESS: "[Auth] Local login success",
  LS_CHECK: "[Auth] Check Local storage",
  LS_CHECK_FULL: "[Auth] Local storage is full",
  LS_CHECK_EMPTY: "[Auth] Local storage is empty",
  LS_READ: "[Auth] Read local storage",
  LS_READ_SUCCESS: "[Auth] Local storage read success",
  LS_READ_FAILD: "[Auth] Local storage read faild",
  LS_WRITE: "[Auth] Write local storage",
  LS_WRITE_SUCCESS: "[Auth] Write local storage success",
  LS_WRITE_FAILD: "[Auth] Write local storage faild",
  LS_CLEAN: "[Auth] Clean local storage",
  LS_CLEAN_SUCCESS: "[Auth] Clean local storage success",
  CLEAR_MSG: "[Auth] Clear messages",
  REGISTER: "[Auth] Register account",
  REGISTER_SUCCESS: "[Auth] Register account success",
  REGISTER_FAILD: "[Auth] Register account faild",

  loadStorage: () => ({ type: actions.LS_CHECK }),
  cleanStorage: () => dispatch => dispatch({ type: actions.LS_CLEAN }),
  login: data => dispatch => {
    dispatch({
      type: actions.LOGIN_REQUEST,
      payload: data
    });
  },
  loginFromLocal: password => dispatch => {
    console.log(" --- actions:loginFromLocal()", password);
    dispatch({
      type: actions.LS_READ,
      payload: { password }
    });
  },
  logout: () => dispatch =>
    dispatch({
      type: actions.LOGOUT
    }),
  logoutOLD: () => ({
    type: actions.LOGOUT
  }),
  clearMsg: () => dispatch =>
    dispatch({
      type: actions.CLEAR_MSG
    }),
  register: data => dispatch =>
    dispatch({
      type: actions.REGISTER,
      payload: data
    })
};
export default actions;
