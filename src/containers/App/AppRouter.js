import React from "react";
import { Switch, Route } from "react-router-dom";
import asyncComponent from "../../helpers/AsyncFunc";

class AppRouter extends React.Component {
  render() {
    const { url } = this.props;
    console.log(this.props);
    return (
      <Switch>
        <Route
          path={`${url}/owner`}
          component={asyncComponent(() => import("../Owner"))}
        />
        <Route
          path={`${url}/business`}
          component={asyncComponent(() => import("../Business"))}
        />
      </Switch>
    );
  }
}

export default AppRouter;
