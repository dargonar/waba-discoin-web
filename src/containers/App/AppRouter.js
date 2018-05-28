import React from 'react';
import { Switch, Route } from 'react-router-dom';
import asyncComponent from '../../helpers/AsyncFunc';

class AppRouter extends React.Component {
  render() {
    const { url } = this.props;
    return (
      <Switch>
        <Route
          exact
          path={`${url}/`}
          component={asyncComponent(() => import('../dashboard'))}
        />
        <Route
          exact
          path={`${url}/discount-and-rewards`}
          component={asyncComponent(() => import('../Page/discountAndRewards'))}
        />
        <Route
          exact
          path={`${url}/refunds`}
          component={asyncComponent(() => import('../Page/refunds'))}
        />
        <Route
          exact
          path={`${url}/transactions`}
          component={asyncComponent(() => import('../Page/transactions/transactions'))}
        />
      </Switch>
    );
  }
}

export default AppRouter;
