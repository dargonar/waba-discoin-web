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
        <Route
          exact
          path={`${url}/parameters`}
          component={asyncComponent(() => import('../Page/configuration/parameters'))}
        />
        <Route
          exact
          path={`${url}/categories`}
          component={asyncComponent(() => import('../Page/configuration/categories'))}
        />
        <Route
          exact
          path={`${url}/store/list`}
          component={asyncComponent(() => import('../Page/stores/list'))}
        />
        <Route
          exact
          path={`${url}/store/create`}
          component={asyncComponent(() => import('../Page/stores/create'))}
        />
        <Route
          exact
          path={`${url}/store/:id/edit`}
          component={asyncComponent(() => import('../Page/stores/create'))}
        />
        <Route
          exact
          path={`${url}/store/:id/accounts`}
          component={asyncComponent(() => import('../Page/stores/accounts'))}
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
