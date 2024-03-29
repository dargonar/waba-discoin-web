import React, { Component } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../redux/owner/actions";
import { Col, Row } from "antd";
import PageLoading from "../../../components/pageLoading";
import Alert from "../../../components/feedback/alert";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";
import IntlMessages from "../../../components/utility/intlMessages";
import MessageBox from "../../../components/MessageBox";
import AccountBox from "./components/accountBox";
import AccountDailyBox from "./components/storeOvercraftBox";

class AccountsStores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dailyBox: false,
      accountSelected: null
    };
    this.submitDailyBox = this.submitDailyBox.bind(this);
    this.removeDailyBox = this.removeDailyBox.bind(this);
    this.showDaily = this.showDaily.bind(this);
    this.changeAmount = this.changeAmount.bind(this);
  }

  showDaily(bussines) {
    this.setState({
      accountSelected: bussines,
      dailyBox: true
    });
  }

  submitDailyBox(value) {
    this.props.updateSubaccount(this.state.accountSelected, value);
    this.removeDailyBox();
  }

  removeDailyBox() {
    this.setState({
      dailyBox: false,
      accountSelected: null
    });
  }

  componentWillMount() {
    if (typeof this.props.match.params.id !== "undefined") {
      this.setState({
        account_id: this.props.match.params.id
      });
      this.props.fetch(this.props.match.params.id);
      return;
    }
    this.setState({
      error: { defaultMessage: "No account id", id: "subaccounts.noId" }
    });
  }

  changePassword(account) {
    console.log("Change password", account);
  }

  changeAmount(account) {
    this.showDaily(account);
  }

  renderAccounts() {
    const { subaccounts } = this.props.subaccounts(this.state.account_id);
    return (
      <Row style={{ width: "100%" }}>
        {subaccounts.length === 0 ? (
          <Alert
            message={
              <IntlMessages defaultMessage="Ups!" id="subaccounts.alertTitle" />
            }
            type="warning"
            description={
              <IntlMessages
                defaultMessage="This store does not have subaccounts"
                id="subaccounts.alertMessage"
              />
            }
            style={{ margin: "10px" }}
          />
        ) : (
          subaccounts.map(account => (
            <Col lg={8} md={12} sd={24} key={account.id + "-" + account.since}>
              <AccountBox
                name={account.name}
                dailyPermission={account.amount}
                changeAmount={() => this.changeAmount(account)}
                changePassword={() => this.changePassword(account)}
              />
            </Col>
          ))
        )}
      </Row>
    );
  }

  render() {
    const account = this.props.account(this.state.account_id);
    const subaccounts = this.props.subaccounts(this.state.account_id);
    return (
      <LayoutContentWrapper>
        {this.state.dailyBox ? (
          <AccountDailyBox
            title={
              <span>
                <IntlMessages
                  defaultMessage="Daily limit"
                  id="subaccounts.dailyLimit"
                />
                {" - " + this.state.accountSelected.name}
              </span>
            }
            visible={this.state.dailyBox}
            business={this.state.accountSelected}
            value={
              this.state.accountSelected ? this.state.accountSelected.amount : 0
            }
            cancel={this.removeDailyBox}
            submit={this.submitDailyBox}
          />
        ) : (
          false
        )}
        <MessageBox
          msg={this.props.msg}
          error={<IntlMessages {...this.props.error} />}
          clean={this.props.removeMsg}
        />
        <PageHeader>
          <IntlMessages id="sidebar.accounts" defaultMessage="Accounts" />:{" "}
          {account.name}
        </PageHeader>
        {this.props.loading || subaccounts === null ? (
          <PageLoading />
        ) : (
          this.renderAccounts()
        )}
      </LayoutContentWrapper>
    );
  }
}

const filterSubaccounts = state => account_id => {
  return state.Owner.subaccounts
    .filter(x => x.account_id === account_id)
    .reduce((pre, act) => act.subaccounts, {
      subaccounts: []
    });
};
const filterStores = state => account_id => {
  return state.Owner.stores
    .filter(x => x.account_id === account_id)
    .reduce((pre, act) => act, {
      name: ""
    });
};

const mapStateToProps = state => ({
  subaccounts: filterSubaccounts(state),
  account: filterStores(state),
  loading: state.Owner.loading,
  actionLoading: state.Owner.actionLoading,
  error: state.Owner.error,
  msg: state.Owner.msg
});

const mapDispatchToProps = (dispatch, state) => ({
  fetch: bindActionCreators(actions.fetchSubaccounts, dispatch, state),
  updateSubaccount: bindActionCreators(actions.updateSubaccount, dispatch),
  removeMsg: bindActionCreators(actions.removeMsg, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountsStores);
