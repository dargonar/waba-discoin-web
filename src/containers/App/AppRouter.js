import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import asyncComponent from '../../helpers/AsyncFunc';

class AppRouter extends React.Component {
  render() {
    const { url } = this.props;
    return (
      <Switch>
      </Switch>
    );
  }
}

export default AppRouter;
