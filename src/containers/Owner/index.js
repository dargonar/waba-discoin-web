import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import asyncComponent from "../../helpers/AsyncFunc";

import { connect } from "react-redux";
import actions from "../../redux/app/actions";
import ownerMenu from "./ownerMenu";

class OwnerRouter extends React.Component {
  render() {
    this.props.loadMenu();
    const url = this.props.match.path;
    return (
      <Switch>
        <Route
          exact
          path={`${url}/kpis`}
          component={asyncComponent(() => import("./kpis"))}
        />
        <Route
          exact
          path={`${url}/parameters`}
          component={asyncComponent(() => import("./configuration/parameters"))}
        />
        <Route
          exact
          path={`${url}/categories`}
          component={asyncComponent(() => import("./configuration/categories"))}
        />
        <Route
          exact
          path={`${url}/business-categories`}
          component={asyncComponent(() =>
            import("./businessCategories/businessCategories")
          )}
        />
        <Route
          exact
          path={`${url}/store/list`}
          component={asyncComponent(() => import("./stores/list"))}
        />
        <Route
          exact
          path={`${url}/store/create`}
          component={asyncComponent(() =>
            import("../Business/editBusiness/editBusiness")
          )}
        />
        <Route
          exact
          path={`${url}/store/:id/edit`}
          component={asyncComponent(() =>
            import("../Business/editBusiness/editBusiness")
          )}
        />
        <Route
          exact
          path={`${url}/store/:id/accounts`}
          component={asyncComponent(() => import("./stores/accounts"))}
        />
        <Redirect from={`${url}/`} to={`${url}/kpis`} />
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
        payload: ownerMenu
      });
    }
  })
)(OwnerRouter);
