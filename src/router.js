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




class ReduxGlobalLoading extends Component {
  render() {
    return (this.props.loading)? (<GlobalLoading msg={this.props.loadingMsg}/>): false
  }
}

ReduxGlobalLoading = connect(state => ({
  loading: state.App.get('loading'),
  loadingMsg: state.App.get('loadingMsg')
}))(ReduxGlobalLoading);

class ReduxGlobalMessage extends Component {
  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.msg === 'string') {
      const msgType = (typeof message[nextProps.msgType] === 'function')? nextProps.msgType: 'info';
      message[msgType](nextProps.msg);
      this.props.clearMsg();
    }
  }
  render() {
    return false;
  }
}
ReduxGlobalMessage = connect(state => ({
  msg: state.App.get('msg'),
  msgType: state.App.get('msgType')
}), dispatch => ({
  clearMsg: () => dispatch({ type: 'GLOBAL_MSG_CLEAR' })
}))(ReduxGlobalMessage);


const PublicRoutes = ({ history, isLoggedIn }) => {
  return (
    <ConnectedRouter history={history}>
      <div>
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
        <ReduxGlobalLoading />
        <ReduxGlobalMessage />
      </div>
    </ConnectedRouter>
  );
};

export default connect(state => ({
  isLoggedIn: typeof state.Auth.account === 'string',
}), dispatch => ({
  clearMsg: () => dispatch({type: 'GLOBAL_MSG_CLEAR'})
}))(PublicRoutes);
