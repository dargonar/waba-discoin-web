import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { connect } from 'react-redux';
import { message } from 'antd';

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
class PublicRoutes extends Component {

  componentWillReceiveProps(nextProps) {
    if(nextProps.loading === false) {
      if (typeof nextProps.msg === 'string') {
        const type = nextProps.msgType || 'info';
        if(typeof message[type] === 'function') {
          message[type](nextProps.msg)
        }
      }
    }
    this.props.clearLoading();
  }

  render() {
    const { history, isLoggedIn, loading, msg } = this.props
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
  }
};

export default connect(state => ({
  isLoggedIn: typeof state.Auth.account === 'string',
  loading: state.App.get('loading'),
  msg: state.App.get('msg'),
  msgType: state.App.get('msgType'),
}), dispatch => ({
  clearLoading: () => dispatch({type: 'GLOBAL_LOADING_CLEAR'})
}))(PublicRoutes);
