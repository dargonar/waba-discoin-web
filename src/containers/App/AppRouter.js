import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import asyncComponent from '../../helpers/AsyncFunc';

class AppRouter extends React.Component {
  render() {
    const { url } = this.props;
    return (
      <Switch>
        <Route
          exact
          path={`${url}/kpis`}
          component={asyncComponent(() => import('../Page/kpis'))}
        />
        <Redirect
          from={`${url}/`}
          to={`${url}/kpis`}
        />
      </Switch>
    );
  }
}

export default AppRouter;
