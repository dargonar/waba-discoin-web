import React, { Component } from "react";
import IntlMessages from "../../../components/utility/intlMessages";
import PageLoading from "../../../components/pageLoading";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../redux/api/actions";

import {
  subAccount,
  isCurrentSubAccount,
  subAccountTxs
} from "../../../redux/api/selectors/subAccounts.selectors";

class SubAccountPage extends Component {
  constructor(props) {
    super(props);
    this.renderContent = this.renderContent.bind(this);
  }

  componentWillMount() {
    !this.props.isCurrentSubAccount(this.props.match.params.id)
      ? this.props.fetchSubaccount(this.props.match.params.id)
      : false;
  }

  componentWillReceiveProps(newProps) {}

  renderContent() {
    return (
      <div>
        <h2>Subaccount data</h2>
        <pre>{JSON.stringify(this.props.subaccount, null, "  ")}</pre>
        <h2>Subaccount transactions</h2>
        <pre>{JSON.stringify(this.props.transactions, null, "  ")}</pre>
      </div>
    );
  }

  render() {
    return (
      <LayoutContentWrapper>
        <PageHeader>
          <IntlMessages
            id="subaccountsDetails.title"
            defaultMessage="Subaccount"
          />
        </PageHeader>
        {!this.props.isCurrentSubAccount(this.props.match.params.id) ? (
          <PageLoading />
        ) : (
          this.renderContent()
        )}
      </LayoutContentWrapper>
    );
  }
}

export default connect(
  state => ({
    subaccount: subAccount(state),
    transactions: subAccountTxs(state),
    isCurrentSubAccount: isCurrentSubAccount(state)
  }),
  dispatch => ({
    fetchSubaccount: bindActionCreators(actions.fetchSubaccount, dispatch)
  })
)(SubAccountPage);
