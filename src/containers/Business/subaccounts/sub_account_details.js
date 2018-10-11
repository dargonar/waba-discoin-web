import React, { Component } from "react";
import IntlMessages from "../../../components/utility/intlMessages";
import PageLoading from "../../../components/pageLoading";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../redux/api/actions";

class SubAccountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    this.renderContent = this.renderContent.bind(this);
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      let subaccount_id = this.props.match.params.id;
      this.setState({ subaccount_id });
      this.props.fetchSubaccount(subaccount_id);
    }
  }

  componentWillReceiveProps(newProps) {
    // Check subacount data
    console.log(newProps);
    if (typeof newProps.subaccount !== "undefined") {
      this.setState({ loading: false });
    }
  }

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
        {this.state.loading === true || this.props.actionLoading === true ? (
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
    transactions: state.Api.subaccount.transactions || [],
    subaccount: state.Api.subaccount.data || undefined,
    loading: state.Api.actionLoading
  }),
  dispatch => ({
    fetchSubaccount: bindActionCreators(actions.fetchSubaccount, dispatch)
  })
)(SubAccountPage);
