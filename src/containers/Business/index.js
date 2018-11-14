import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import asyncComponent from "../../helpers/AsyncFunc";

import { connect } from "react-redux";
import actions from "../../redux/app/actions";
import apiActions from "../../redux/api/actions";
import businessMenu from "./businessMenu";
import { bindActionCreators } from "redux";
import { GlobalLoading } from "../../components/uielements/globalLoading";
import { push } from "react-router-redux";

class LoadingCheckComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { first: true };
  }

  componentDidMount() {
    this.props.fetchProfile(this.props.accountId);
  }

  componentWillReceiveProps(newProps) {
    const hasOverdraft =
      newProps.business !== null && newProps.business.balances !== null && newProps.business.balances.ready_to_access > 0;
    const hasProfile = newProps.business !== null;

    // Si ya tiene todo cargado y ademas tiene overfraft que redirecciones a home
    if (hasProfile && hasOverdraft) {
      this.props.goTo("/dashboard/business/home");
    }
    // Si ya tiene todo cargado y no tiene overfraft que redirecciones a main (cobrar)
    else if (hasProfile && !hasOverdraft) {
      this.props.goTo("/dashboard/business/main");
    }
    //Si no tiene el profile cargado que continue esperadno hasta el proximo loop
    else {
      return;
    }
  }

  render() {
    return false;
  }
}

const LoadingCheck = connect(
  state => ({
    business: state.Api.business,
    accountId: state.Auth.account_id
  }),
  dispatch => ({
    fetchProfile: bindActionCreators(apiActions.fetchProfile, dispatch),
    goTo: url => dispatch(push(url))
  })
)(LoadingCheckComponent);

class BusinessRouter extends React.Component {
  render() {
    this.props.loadMenu();
    const url = this.props.match.path;
    return (
      <Switch>
        <Route exact path={`${url}/home`} component={asyncComponent(() => import("./dashboard"))} />
        <Route exact path={`${url}/main`} component={asyncComponent(() => import("./main/main"))} />
        <Route exact path={`${url}/discount-and-rewards`} component={asyncComponent(() => import("./discountAndRewards"))} />
        <Route exact path={`${url}/refounds`} component={asyncComponent(() => import("./refunds"))} />
        <Route exact path={`${url}/sub_accounts`} component={asyncComponent(() => import("./subaccounts/sub_accounts"))} />
        <Route exact path={`${url}/sub_accounts/find_account`} component={asyncComponent(() => import("./subaccounts/find_account"))} />
        <Route exact path={`${url}/sub_accounts/:id`} component={asyncComponent(() => import("./subaccounts/sub_account_details"))} />
        <Route exact path={`${url}/transactions`} component={asyncComponent(() => import("./transactions/transactions"))} />
        <Route exact path={`${url}/profile`} component={asyncComponent(() => import("./editBusiness/editBusiness"))} />
        <Route exact path={`${url}/`} component={LoadingCheck} />
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
        payload: businessMenu
      });
    }
  })
)(BusinessRouter);
