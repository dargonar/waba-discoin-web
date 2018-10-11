import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import asyncComponent from "../../helpers/AsyncFunc";

import { connect } from "react-redux";
import actions from "../../redux/app/actions";
import businessMenu from "./businessMenu";

class BusinessRouter extends React.Component {
  render() {
    this.props.loadMenu();
    const url = this.props.match.path;
    return (
      <Switch>
        <Route
          exact
          path={`${url}/home`}
          component={asyncComponent(() => import("./dashboard"))}
        />
        <Route
          exact
          path={`${url}/main`}
          component={asyncComponent(() => import("./main/main"))}
        />
        <Route
          exact
          path={`${url}/discount-and-rewards`}
          component={asyncComponent(() => import("./discountAndRewards"))}
        />
        <Route
          exact
          path={`${url}/refounds`}
          component={asyncComponent(() => import("./refunds"))}
        />
        <Route
          exact
          path={`${url}/sub_accounts`}
          component={asyncComponent(() => import("./subaccounts/sub_accounts"))}
        />
        <Route
          exact
          path={`${url}/sub_accounts/find_account`}
          component={asyncComponent(() => import("./subaccounts/find_account"))}
        />
        <Route
          exact
          path={`${url}/sub_accounts/:id`}
          component={asyncComponent(() =>
            import("./subaccounts/sub_account_details")
          )}
        />
        <Route
          exact
          path={`${url}/transactions`}
          component={asyncComponent(() =>
            import("./transactions/transactions")
          )}
        />
        <Route
          exact
          path={`${url}/profile`}
          component={asyncComponent(() =>
            import("./editBusiness/editBusiness")
          )}
        />
        <Redirect from={`${url}/`} to={`${url}/main`} />
      </Switch>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => ({
    loadMenu: () => {
      dispatch({
        type: actions.SET_MENU_ITEMS,
        payload: businessMenu
      });
    }
  })
)(BusinessRouter);
