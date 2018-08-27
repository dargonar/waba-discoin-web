import React, { Component } from "react";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper";
import LayoutContent from "../../../components/utility/layoutContent";
import PageHeader from "../../../components/utility/pageHeader";
import PageLoading from "../../../components/pageLoading";
import { Row, Col, Input, Modal } from "antd";
import basicStyle from "../../../config/basicStyle";
import IntlMessages from "../../../components/utility/intlMessages";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../redux/api/actions";
import appActions from "../../../redux/app/actions";
import MessageBox from "../../../components/MessageBox";

import CustomersBox from "../components/customerBox";
import SubAccountBox from "../components/subaccountBox";
import { subaccountAddOrUpdate } from "../../../httpService";

import { notification } from "antd";

import moment from "moment";

import { injectIntl } from "react-intl";
import { currency } from "../../../config";
const InputSearch = Input.Search;

const { rowStyle, colStyle } = basicStyle;

const inputStyle = {
  fontSize: "24px"
};
const avgStyle = {
  display: "block",
  paddingTop: "15px"
};

const minutesOffset = 2;

const checkActualDate = stringDate => {
  let date = moment(stringDate);
  // We need at least 1 minutes to get confirmation
  if (date.isBefore(moment().add(minutesOffset, "m"))) {
    // date.add(minutesOffset, "m");
    date = moment().add(minutesOffset, "m");
  }
  return date.utc().valueOf();
};

class FindAccounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: null,
      subaccountBox: false,
      selectedCustomer: null,
      msg: "",
      error: "",
      removeMsg: false,
      confirm_visible: false,
      subaccount_auth: null
    };
    this.renderContent = this.renderContent.bind(this);

    this.submitSubAccountBox = this.submitSubAccountBox.bind(this);
    this.removeSubAccountBox = this.removeSubAccountBox.bind(this);
    this.showSubAccountBox = this.showSubAccountBox.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);

    console.log(" --- FindAccounts - created()");
  }

  openNotificationWithIcon(type, title, msg) {
    notification[type]({
      message: title,
      description: msg
    });
  }

  showConfirmModal = () => {
    this.setState({
      confirm_visible: true
    });
  };

  confirm_handleOk = e => {
    this.addSubAccount();
  };
  confirm_handleCancel = e => {
    console.log(e);
    this.setState({
      confirm_visible: false
    });
  };

  handleOnIcon1(account) {
    console.log("---findAccount::handleOnProfile");
    console.log(JSON.stringify(account));
    this.showSubAccountBox(account);

    // this.showProfileBox(account);
  }
  handleOnIcon2() {
    console.log("---findAccount::handleOnTransactions");
  }

  handleOnElement(account) {
    console.log("---findAccount::handleOnElement");
  }

  componentDidMount() {
    console.log(" --- FindAccounts::componentDidMount PRE");
    this.props.searchAccount("");
    console.log(" --- FindAccounts::componentDidMount DONE");
  }

  showSubAccountBox(customer) {
    this.setState({
      selectedCustomer: customer,
      subaccountBox: true
    });
  }

  // showProfileBox(customer){
  //   this.setState({
  //     selectedCustomer: customer,
  //     customerBox: true,
  //     refundBox: false
  //   })
  // }

  _handleChange(e) {
    this.setState({ searchValue: e.target.value });
  }

  _handleKeyPress(e) {
    let searchValue = this.state.searchValue;
    console.log(" -- _handleKeyPress:", searchValue);
    if (e.key === "Enter") {
      if (
        searchValue === "undefined" ||
        searchValue == null ||
        searchValue.trim() == ""
      ) {
        this.openNotificationWithIcon(
          "warning",
          this.props.intl.messages["subaccounts.search"] || "Search",
          this.props.intl.messages["subaccounts.minumumChar"] ||
            "Enter at least one character."
        );
        return;
      }

      if (this.props.isLoading) {
        this.openNotificationWithIcon(
          "warning",
          this.props.intl.messages["subaccounts.search"] || "Search",
          this.props.intl.messages["subaccounts.searchInProgress"] ||
            "Search in Progress"
        );
        return;
      }
      this.props.searchAccount(searchValue);
    }
  }

  submitSubAccountBox(e) {
    let x = {
      subaccount_auth: {
        amount: e.amount,
        from: e.from,
        to: e.to,
        period: e.period,
        periods: e.periods,
        checked_now: e.checked_now
      }
    };
    console.log(" submitSubAccountBox(e)::", JSON.stringify(x));
    this.setState(x);
    this.showConfirmModal();
  }

  addSubAccount() {
    console.log(" -- addSubAccount() #1");
    this.props.showLoading("Autorizando subcuenta. Por favor aguarde.");
    console.log(" -- addSubAccount() #2");
    this.removeSubAccountBox();
    console.log(" -- addSubAccount() #3");
    this.setState({
      confirm_visible: false
    });

    let _now = Date.now();

    let _from = _now;
    if (!this.state.subaccount_auth.checked_now)
      _from = this.state.subaccount_auth.from.date_utc;

    _from = checkActualDate(_from);
    let _to = this.state.subaccount_auth.to.date_utc; //.date.utc().valueOf()

    let period = 86400;
    let periods = Math.floor((_to - _from) / 86400 / 1000);

    if (_from >= _now >= _to || periods < 1) {
      this.openNotificationWithIcon(
        "error",
        this.props.intl.messages["subaccounts.validationErrorTitle"] ||
          "Verify entered values",
        this.props.intl.messages["subaccounts.validationErrorContent"] ||
          "The amount must be greater than zero, the start date must be greater than today's date and greater than the closing date.",
        0
      );
      return;
    }

    // let _from = this.state.subaccount_auth.from.date_utc; //.date.utc().valueOf();
    // let _to = this.state.subaccount_auth.to.date_utc; //.date.utc().valueOf()
    // let period = 86400;
    // let periods = Math.floor((_to - _from) / 86400 / 1000);

    let tx = {
      business_id: this.props.account.account_id,
      subaccount_id: this.state.selectedCustomer.account_id,
      limit: this.state.subaccount_auth.amount,
      from: Math.floor(_from / 1000),
      period: period, // seconds
      periods: periods //
    };

    console.log(" -- addSubAccount() #4");
    console.log(JSON.stringify(tx));

    console.log(JSON.stringify(this.props.account));

    // return;
    subaccountAddOrUpdate(this.props.account.keys.active.wif, tx).then(
      res => {
        console.log(
          "find_account::subaccountAddOrUpdate",
          "====OK===>",
          JSON.stringify(res)
        );
        this.props.endLoading();
        if ("error" in res) {
          this.openNotificationWithIcon(
            "error",
            this.props.intl.messages["subaccounts.genericError"] ||
              "An error has occurred",
            res.error
          );
        } else {
          this.openNotificationWithIcon(
            "success",
            this.props.intl.messages[
              "subaccounts.authorizeSubaccountSuccess"
            ] || "Add subaccount",
            this.props.intl.messages["subaccounts.succesLimit"] ||
              "The daily sub-account limit was successfully authorized"
          );
          this.goBack();
        }
      },
      err => {
        console.log(
          "subaccountAddOrUpdate",
          "====ERR===>",
          JSON.stringify(err)
        );
        this.openNotificationWithIcon(
          "error",
          this.props.intl.messages["subaccounts.genericError"] ||
            "An error has occurred",
          err
        );
        this.props.endLoading();
      }
    );
  }

  goBack() {
    setTimeout(
      function() {
        this.props.history.goBack();
      }.bind(this),
      1500
    );
  }

  removeSubAccountBox() {
    this.setState({
      subaccountBox: false
    });
  }

  renderContent() {
    return (
      <Row style={rowStyle} gutter={16} justify="start">
        {this.props.customers.length === 0 ? (
          <Col style={{ textAlign: "center", padding: "10px" }} xs={24}>
            <IntlMessages
              id="subaccounts.emptySearch"
              defaultMessage="No users were found with your search."
            />
          </Col>
        ) : (
          false
        )}
        {this.props.customers.map(customer => (
          <Col
            xs={24}
            md={12}
            lg={8}
            style={{ marginBottom: "15px" }}
            key={customer.name + "-" + customer.account_id}
          >
            <CustomersBox
              name={customer.name}
              account_id={customer.account_id}
              onElement={e => this.handleOnElement(e)}
              onIcon1={e => this.handleOnIcon1(e)}
              onIcon2={e => this.handleOnIcon2(e)}
              icon1={"plus-circle-o"}
              title1={<IntlMessages id="add" defaultMessage="Add" />}
              icon2={"hidden"}
            />
          </Col>
        ))}
      </Row>
    );
  }

  /// onSearch={()=>this.props.searchAccount(this.state.searchValue)}
  render() {
    return (
      <LayoutContentWrapper>
        <SubAccountBox
          visible={this.state.subaccountBox}
          customer={this.state.selectedCustomer}
          cancel={this.removeSubAccountBox}
          submit={this.submitSubAccountBox}
        />

        {this.state.confirm_visible && this.state.subaccount_auth != null ? (
          <Modal
            title={
              <IntlMessages
                id="subaccounts.addConfirm"
                defaultMessage="Confirm subaccount authorization"
              />
            }
            visible={this.state.confirm_visible}
            onOk={this.confirm_handleOk}
            onCancel={this.confirm_handleCancel}
          >
            <p>
              <IntlMessages
                id="subaccounts.authResume"
                defaultMessage={
                  "You are going to authorize {name} to withdraw daily {symbol} {amount} from {since} to {until}."
                }
                values={{
                  symbol: currency.symbol,
                  name: this.state.selectedCustomer.name,
                  amount: this.state.subaccount_auth.amount.toLocaleString(),
                  since: this.state.subaccount_auth.checked_now
                    ? this.props.intl.messages["subaccounts.now"] || "now"
                    : this.state.subaccount_auth.from.dateString,
                  until: this.state.subaccount_auth.to.dateString
                }}
              />
              {/* Va a autorizar a {this.state.selectedCustomer.name} a retirar
              diariamente {this.state.subaccount_auth.amount} desde{" "}
              {this.state.subaccount_auth.checked_now
                ? "ahora"
                : this.state.subaccount_auth.from.dateString}{" "}
              hasta {this.state.subaccount_auth.to.dateString}*/}
            </p>
          </Modal>
        ) : (
          false
        )}
        <PageHeader>
          <IntlMessages
            id="subaccounts.addSubaccount"
            defaultMessage="Add subaccount"
          />
        </PageHeader>
        <Row style={rowStyle} gutter={16} justify="start">
          <Col xs={24} style={{ marginBottom: "15px" }}>
            <InputSearch
              placeholder={
                this.props.intl.messages["subaccounts.searchUser"] ||
                "Search users"
              }
              onChange={this._handleChange}
              onSearch={() => this.props.searchAccount(this.state.searchValue)}
              onKeyPress={this._handleKeyPress}
              enterButton
            />
          </Col>
        </Row>

        {this.props.isLoading === true ? <PageLoading /> : this.renderContent()}
      </LayoutContentWrapper>
    );
  }
}

// Filtering of already assigned sub-accounts
const filterCustomers = state => {
  const subaccounts =
    state.Owner.subaccounts && state.Owner.subaccounts[0].subaccounts
      ? state.Owner.subaccounts[0].subaccounts.permissions
      : [];
  const customers = state.Api.customers ? state.Api.customers : [];
  const subaccountsIds = subaccounts.map(
    subaccount => subaccount.authorized_account
  );
  return customers.filter(x => subaccountsIds.indexOf(x.account_id) === -1);
};

const mapStateToProps = state => ({
  api: state.Api,
  customers: filterCustomers(state),
  account: state.Auth,
  isLoading: state.Api.actionLoading,
  error: state.Api.error,
  msg: state.Api.msg
});

const mapDispatchToProps = dispatch => ({
  searchAccount: bindActionCreators(actions.searchAccount, dispatch),
  cleanMsg: bindActionCreators(actions.cleanMsg, dispatch),
  showLoading: bindActionCreators(appActions.showLoading, dispatch),
  endLoading: bindActionCreators(appActions.endLoading, dispatch)
});

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FindAccounts)
);
