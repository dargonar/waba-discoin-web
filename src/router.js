import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";
import { connect } from "react-redux";
import { message } from "antd";
import { notification } from "antd";

import App from "./containers/App/App";
import asyncComponent from "./helpers/AsyncFunc";
import actionsUI from "./redux/app/actions";
import { GlobalLoading } from "./components/uielements/globalLoading";

const RestrictedRoute = ({ component: Component, isLoggedIn, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isLoggedIn ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

class ReduxGlobalLoading extends Component {
  render() {
    return this.props.loading ? (
      <GlobalLoading msg={this.props.loadingMsg} />
    ) : (
      false
    );
  }
}

ReduxGlobalLoading = connect(state => ({
  loading: state.App.get("loading"),
  loadingMsg: state.App.get("loadingMsg")
}))(ReduxGlobalLoading);

class ReduxGlobalMessage extends Component {
  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.msg === "string") {
      const msgType =
        typeof message[nextProps.msgType] === "function"
          ? nextProps.msgType
          : "info";
      // message[msgType](nextProps.msg);
      notification[msgType]({
        message: nextProps.msg.split("|")[0],
        description: nextProps.msg.split("|")[1],
        duration: msgType !== "error" ? 3 : 0
      });
      this.props.clearMsg();
    }
  }
  render() {
    return false;
  }
}
ReduxGlobalMessage = connect(
  state => ({
    msg: state.App.get("msg"),
    msgType: state.App.get("msgType")
  }),
  dispatch => ({
    clearMsg: () => dispatch({ type: actionsUI.GLOBAL_MSG_CLEAR })
  })
)(ReduxGlobalMessage);

class PublicRoutes extends Component {
  render() {
    const { history, isLoggedIn } = this.props;
    return (
      <div>
        <ConnectedRouter history={history}>
          <div>
            <Route
              exact
              path={"/"}
              component={asyncComponent(() =>
                import("./containers/Core/Signin/signin")
              )}
            />
            <Route
              exact
              path={"/signin"}
              component={asyncComponent(() =>
                import("./containers/Core/Signin/signin")
              )}
            />
            <RestrictedRoute
              path={`/dashboard`}
              component={App}
              isLoggedIn={isLoggedIn}
            />
            <ReduxGlobalLoading />
            <ReduxGlobalMessage />
          </div>
        </ConnectedRouter>
      </div>
    );
  }
}

export default connect(
  state => ({
    isLoggedIn: typeof state.Auth.account === "string",
    userType: state.Auth.accountType
  }),
  dispatch => ({
    clearMsg: () => dispatch({ type: actionsUI.GLOBAL_MSG_CLEAR })
  })
)(PublicRoutes);
