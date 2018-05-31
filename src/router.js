import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { connect } from 'react-redux';

import App from './containers/App/App';
import asyncComponent from './helpers/AsyncFunc';

import { GlobalLoading } from './components/uielements/globalLoading';

const RestrictedRoute = ({ component: Component, isLoggedIn, ...rest }) => (
  <Route
    {...rest}
    render={props => isLoggedIn
      ? <Component {...props} />
      : <Redirect
          to={{
            pathname: '/signin',
            state: { from: props.location },
          }}
        />}
  />
);
const PublicRoutes = ({ history, isLoggedIn, loading, msg }) => {
  return (
    <ConnectedRouter history={history}>
      <div>
        { (loading)? (<GlobalLoading msg={msg}/>): false }
        <Route
          exact
          path={'/'}
          component={asyncComponent(() => import('./containers/Page/signin/signin'))}
        />
        <Route
          exact
          path={'/signin'}
          component={asyncComponent(() => import('./containers/Page/signin/signin'))}
        />
        <RestrictedRoute
          path="/dashboard"
          component={App}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </ConnectedRouter>
  );
};

export default connect(state => ({
  isLoggedIn: typeof state.Auth.account === 'string',
  loading: state.App.get('loading'),
  msg: state.App.get('msg'),
}))(PublicRoutes);
