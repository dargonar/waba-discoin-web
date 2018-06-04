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
          path={`${url}/sub_accounts`}
          component={asyncComponent(() => import('../Page/subaccounts/sub_accounts'))}
        />
        <Route
          exact
          path={`${url}/find_account`}
          component={asyncComponent(() => import('../Page/subaccounts/find_account'))}
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
