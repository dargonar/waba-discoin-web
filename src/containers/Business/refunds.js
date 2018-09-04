import React, { Component } from "react";
import LayoutContentWrapper from "../../components/utility/layoutWrapper";
import PageHeader from "../../components/utility/pageHeader";
import PageLoading from "../../components/pageLoading";
import { Row, Col, Input } from "antd";
import basicStyle from "../../config/basicStyle";
import IntlMessage from "../../components/utility/intlMessages";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../redux/api/actions";
import appActions from "../../redux/app/actions";

import CustomersBox from "./components/customerBox";
import RefundBox from "./components/refundBox";
import RewardBox from "./components/rewardBox";
import RewardQr from "./components/rewardQr";
import moment from "moment";
import { injectIntl } from "react-intl";

import { rewardCustomer } from "../../httpService";
import { notification } from "antd";

import { getKeys } from "../../redux/utils/getKeys";

const InputSearch = Input.Search;

const { rowStyle } = basicStyle;

class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: null,
      refundBox: false,
      rewardBox: false,
      rewardQr: false,
      rewardData: {},
      selectedCustomer: null,
      msg: "",
      error: "",
      removeMsg: false
    };
    this.renderContent = this.renderContent.bind(this);

    this.submitRefundBox = this.submitRefundBox.bind(this);
    this.removeRefundBox = this.removeRefundBox.bind(this);

    this.submitRewardBox = this.submitRewardBox.bind(this);
    this.removeRewardBox = this.removeRewardBox.bind(this);

    this.showRefundBox = this.showRefundBox.bind(this);
    this.showRewardBox = this.showRewardBox.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
  }

  submitRewardBox(data) {
    this.setState({
      rewardBox: false,
      rewardQr: true,
      rewardData: {
        bill_amount: data.bill_amount,
        discount_dsc: (data.percentage * data.bill_amount) / 100,
        discount_ars:
          data.bill_amount - (data.percentage * data.bill_amount) / 100,
        account_id: this.props.account.account_id,
        account_name: this.props.account.account,
        id: "INVOICE_DISCOUNT"
      }
    });
  }

  removeRewardBox() {
    this.setState({
      rewardBox: false,
      rewardQr: false,
      rewardData: {}
    });
  }

  getDay() {
    const now = new Date();
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ];
    return days[now.getDay()];
  }

  openNotificationWithIcon(type, title, msg) {
    notification[type]({
      message: title,
      description: msg
    });
  }

  handleOnRefund(account) {
    console.log(
      " ============================= handleOnRefund:",
      JSON.stringify(account)
    );
    this.showRefundBox(account);
  }
  handleOnDiscount(account) {
    console.log(" ============================= handleOnDiscount:", account);
    this.showRewardBox(account);
  }

  componentWillMount() {
    if (this.props.api.schedule === null) {
      console.log(" -- Refund:componentWillMount() -- ");
      this.props.getSchedule();
    }
  }
  componentDidMount() {
    console.log(" --- Customers::componentDidMount PRE");
    this.props.searchAccount("");
    console.log(" --- Customers::componentDidMount DONE");
  }

  showRefundBox(customer) {
    this.setState({
      selectedCustomer: customer,
      refundBox: true
    });
  }

  showRewardBox(customer) {
    this.setState({
      selectedCustomer: customer,
      rewardBox: true
    });
  }

  _handleChange(e) {
    this.setState({ searchValue: e.target.value });
  }

  _handleKeyPress(e) {
    let searchValue = this.state.searchValue;
    console.log(" -- _handleKeyPress:", { value: searchValue });
    if (e.key === "Enter") {
      if (this.state.searchValue === null || this.state.searchValue === "") {
        this.openNotificationWithIcon(
          "warning",
          "Búsqueda",
          "Ingrese al menos un caracter."
        );
        return;
      }

      if (this.props.isLoading) {
        this.openNotificationWithIcon(
          "warning",
          "Búsqueda",
          "Búsqueda en progreso."
        );
        return;
      }
      this.props.searchAccount(searchValue);
    }
  }

  submitRefundBox(e) {
    // console.log(' --- refund', JSON.stringify(this.props.account));
    // return;
    // this.props.setOverdraft(this.state.selectedCustomer, value)
    // console.log(' === submitRefundBox::', 'account:', JSON.stringify(this.state.selectedCustomer));
    // console.log(e);

    let tx = {
      from_id: this.props.account.account_id,
      to_id: this.state.selectedCustomer.account_id,
      amount: e.amount,
      bill_amount: e.bill_amount,
      bill_id: e.bill_id
    };

    // console.log(JSON.stringify(tx));
    // return;
    // this.setState({loading:true})

    this.removeRefundBox();

    getKeys()
      .then(keys => {
        this.props.showLoading("Realizando reintegro. Por favor aguarde.");
        rewardCustomer(keys.active.wif, tx).then(
          res => {
            console.log("rewardCustomer", "====OK===>", JSON.stringify(res));

            this.props.endLoading();
            if (typeof res.error !== "undefined") {
              this.openNotificationWithIcon(
                "error",
                "Ha ocurrido un error",
                res.error
              );
            } else {
              this.openNotificationWithIcon(
                "success",
                "Reintegro exitoso",
                "El reintegro fue exitoso. Puede verlo en Transacciones."
              );
            }
          },
          err => {
            console.log("rewardCustomer", "====ERR===>", JSON.stringify(err));
            this.openNotificationWithIcon("error", "Ha ocurrido un error", err);
            this.props.endLoading();
          }
        );
      })
      .catch(e => this.openNotificationWithIcon("error", e));
  }

  removeRefundBox() {
    this.setState({
      refundBox: false,
      selectedCustomer: null
    });
  }

  getTodayRate() {
    const today = this.getDay();
    if (this.props.api.schedule === null) {
      console.log(" -- Refund:componentWillMount() -- ");
      this.props.getSchedule();
      return;
    }
    let discount = this.props.api.schedule.find(function(dis) {
      return dis.date === today;
    });
    //Check id discount is set
    return discount ? discount.discount : 0;
  }

  renderContent() {
    return (
      <div style={{ width: "100%" }}>
        <RefundBox
          visible={this.state.refundBox}
          customer={this.state.selectedCustomer}
          cancel={this.removeRefundBox}
          submit={this.submitRefundBox}
          percentage={this.getTodayRate()}
          scheduleReward={this.props.scheduleReward}
        />
        <RewardBox
          visible={this.state.rewardBox}
          customer={this.state.selectedCustomer}
          cancel={this.removeRewardBox}
          submit={this.submitRewardBox}
          percentage={this.getTodayRate()}
          scheduleReward={this.props.scheduleReward}
        />
        <RewardQr
          visible={this.state.rewardQr}
          submit={this.removeRewardBox}
          {...this.state.rewardData}
        />
        <Row style={rowStyle} gutter={16} justify="start">
          {this.props.customers.length === 0 ? (
            <Col style={{ textAlign: "center", padding: "10px" }} xs={24}>
              No customers found.
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
                onIcon1={e => this.handleOnRefund(e)}
                onIcon2={e => this.handleOnDiscount(e)}
                icon1={"rollback"}
                title1={
                  <IntlMessage
                    defaultMessage={"Refound"}
                    id={"refund.refound"}
                  />
                }
                icon2={"check"}
                title2={
                  <IntlMessage
                    defaultMessage={"Accept Discount"}
                    id={"refund.acceptDiscount"}
                  />
                }
              />
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  /*
  <MessageBox
    clean={this.props.cleanMsg}
    msg={this.props.api.msg}
    error={this.props.api.error !== false} />
  */
  render() {
    return (
      <LayoutContentWrapper>
        <PageHeader>
          <IntlMessage id="refund.customers" defaultMessage={"Customers"} />
        </PageHeader>
        <Row style={rowStyle} gutter={16} justify="start">
          <Col xs={24} style={{ marginBottom: "15px" }}>
            <InputSearch
              placeholder={
                this.props.intl.messages["refund.searchCustomer"] ||
                "Search Customer"
              }
              onKeyPress={this._handleKeyPress}
              onSearch={() => this.props.searchAccount(this.state.searchValue)}
              onChange={this._handleChange}
              enterButton={
                <IntlMessage
                  defaultMessage="Force Search"
                  id="refund.forceSearch"
                />
              }
            />
          </Col>
        </Row>

        {this.props.isLoading === true ? <PageLoading /> : this.renderContent()}
      </LayoutContentWrapper>
    );
  }
}

const getDiscount = discounts => {
  console.log(
    moment()
      .format("dddd")
      .toLowerCase(),
    discounts,
    getDiscount
  );
  return discounts
    .filter(
      discount =>
        discount.date ===
        moment()
          .format("dddd")
          .toLowerCase()
    )
    .reduce((prev, act) => Number(act.discount), 0);
};

const mapStateToProps = state => ({
  api: state.Api,
  customers: state.Api.customers,
  account: state.Auth,
  isLoading: state.Api.actionLoading,
  error: state.Api.error,
  msg: state.Api.msg,
  scheduleReward: getDiscount(
    state.Api.business ? state.Api.business.discount_schedule : []
  )
});

const mapDispatchToProps = dispatch => ({
  searchAccount: bindActionCreators(actions.searchAccount, dispatch),
  cleanMsg: bindActionCreators(actions.cleanMsg, dispatch),
  getSchedule: bindActionCreators(actions.getSchedule, dispatch),
  showLoading: bindActionCreators(appActions.showLoading, dispatch),
  endLoading: bindActionCreators(appActions.endLoading, dispatch)
});

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Customers)
);
