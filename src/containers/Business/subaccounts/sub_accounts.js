import React, { Component } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../redux/owner/actions";
import appActions from "../../../redux/app/actions";
import { Col, Row } from "antd";
import { notification } from "antd";
import PageLoading from "../../../components/pageLoading";
import Alert from "../../../components/feedback/alert";
import Button from "../../../components/uielements/button";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";
import IntlMessages from "../../../components/utility/intlMessages";
import MessageBox from "../../../components/MessageBox";
import AccountBox from "./components/accountBox";
import AccountDailyBox from "./components/storeOvercraftBox";
import { push } from "react-router-redux";

import { subaccountAddOrUpdate } from "../../../httpService";

class SubAccounts extends Component {
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
    this.newSubAccount = this.newSubAccount.bind(this);
    this.updateSubaccount = this.updateSubaccount.bind(this);
  }

  newSubAccount() {
    this.props.goTo("/dashboard/business/sub_accounts/find_account");
  }

  showDaily(bussines) {
    this.setState({
      accountSelected: bussines,
      dailyBox: true
    });
  }

  submitDailyBox(value) {
    console.log("value", value);
    if (typeof value !== "undefined")
      this.updateSubaccount(this.state.accountSelected, value);
    else this.removeDailyBox();
  }

  updateSubaccount(account, value) {
    const accountData = {
      ...account,
      amount: value
    };
    console.log(" -- updateSubaccount() #1  --- ", JSON.stringify(accountData));
    this.props.showLoading("Actualizando subcuenta. Por favor aguarde.");
    console.log(" -- updateSubaccount() #2");
    this.removeDailyBox();
    console.log(" -- updateSubaccount() #3");

    let _from = new Date(accountData.since).getTime();
    let _to = new Date(accountData.expiration).getTime();
    let period = 86400;
    let periods = Math.floor((_to - _from) / 86400 / 1000);

    let tx = {
      business_id: this.props.account.account_id,
      subaccount_id: accountData.id,
      limit: accountData.amount,
      from: _from,
      period: period,
      periods: periods
    };
    console.log(" -- updateSubaccount() #4", JSON.stringify(tx));

    subaccountAddOrUpdate(this.props.account.keys.active.wif, tx).then(
      res => {
        console.log("subaccountAddOrUpdate", "====OK===>", JSON.stringify(res));
        this.props.endLoading();
        if ("error" in res) {
          this.openNotificationWithIcon(
            "error",
            "Ha ocurrido un error",
            res.error
          );
        } else {
          this.openNotificationWithIcon(
            "success",
            "Autorizar subcuenta",
            "El límite diario de subcuenta fue autorizado satisfactoriamente."
          );
          if (typeof this.props.match.params.id !== "undefined") {
            this.props.fetch(this.props.match.params.id);
            return;
          }
          this.props.fetch();
        }
      },
      err => {
        console.log(
          "subaccountAddOrUpdate",
          "====ERR===>",
          JSON.stringify(err)
        );
        this.openNotificationWithIcon("error", "Ha ocurrido un error", err);
        this.props.endLoading();
      }
    );
  }

  openNotificationWithIcon(type, title, msg) {
    notification[type]({
      message: title,
      description: msg
    });
  }

  removeDailyBox() {
    this.setState({
      dailyBox: false,
      accountSelected: null
    });
  }

  componentWillMount() {
    if (typeof this.props.match.params.id !== "undefined") {
      this.props.fetch(this.props.match.params.id);
      return;
    }
    this.props.fetch();
    // this.setState({ error: 'No account id'})
  }

  changePassword(account) {
    console.log("Change password", account);
  }

  changeAmount(account) {
    this.showDaily(account);
  }

  renderAccounts() {
    const { subaccounts } = this.props.subaccounts(
      this.props.account.account_id
    );
    return (
      <Row style={{ width: "100%" }}>
        {subaccounts.length === 0 ? (
          <Alert
            message="Ups!"
            type="warning"
            description={
              <IntlMessages
                defaultMessage="No subaccounts configured yet"
                id="subaccounts.empty"
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
                account={account}
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
    // const account = this.props.account(this.state.account_id)
    // const account = this.state.account_id
    const subaccounts = this.props.subaccounts(this.props.account.account_id);
    return (
      <LayoutContentWrapper>
        {this.state.dailyBox ? (
          <AccountDailyBox
            title={
              <span>
                <IntlMessages
                  id="subaccounts.dailyLimit"
                  defaultMessage="Daily limit"
                />
                {" - " + this.state.accountSelected.name}{" "}
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
          error={this.props.error}
          clean={this.props.removeMsg}
        />
        <PageHeader>
          <IntlMessages id="sidebar.subAccounts" />
        </PageHeader>
        {this.props.loading || subaccounts === null ? (
          <PageLoading />
        ) : (
          this.renderAccounts()
        )}
        <Button
          type="primary"
          style={{ margin: "20px 0" }}
          onClick={this.newSubAccount}
        >
          <IntlMessages
            id="subaccounts.addSubaccount"
            defaultMessage="New Subaccount"
          />
        </Button>
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
// const filterStores = (state) => (account_id) => {
//   return state.Owner.stores
//     .filter(x => x.account_id === account_id)
//     .reduce((pre,act)=> act, {
//       name: ''
//     })
// };

const mapStateToProps = state => ({
  subaccounts: filterSubaccounts(state),
  // account: filterStores(state),
  // loading : state.Owner.loading,
  // actionLoading : state.Owner.actionLoading,
  // error: state.Owner.error,
  // msg: state.Owner.msg
  account: state.Auth,
  isLoading: state.Api.actionLoading,
  error: state.Api.error,
  msg: state.Api.msg
});

const mapDispatchToProps = dispatch => ({
  fetch: bindActionCreators(actions.fetchSubaccounts, dispatch),
  updateSubaccount: bindActionCreators(actions.updateSubaccount, dispatch),
  removeMsg: bindActionCreators(actions.removeMsg, dispatch),
  goTo: url => dispatch(push(url)),
  showLoading: bindActionCreators(appActions.showLoading, dispatch),
  endLoading: bindActionCreators(appActions.endLoading, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubAccounts);
