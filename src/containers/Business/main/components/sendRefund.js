import React, { Component } from "react";
import IntlMessages from "../../../../components/utility/intlMessages";
import { currency } from "../../../../config";
import { ColorBox } from "./colorBox";
import CustomerPicker from "./selectCustomer";
import { ConfirmBox } from "./confirmBox";

import { getKeys } from "../../../../redux/utils/getKeys";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../../redux/api/actions";
import appActions from "../../../../redux/app/actions";
import { rewardCustomer } from "../../../../httpService";
import { notification } from "antd";

const roundAmount = value => Math.round(value * 100) / 100;

class SendRefundComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      discount: 0,
      customer: {}
    };
    this.updateDiscount = this.updateDiscount.bind(this);
    this.userSelected = this.userSelected.bind(this);
    this.selectCustomer = this.selectCustomer.bind(this);
    this.submitRefundBox = this.submitRefundBox.bind(this);
    this.checkValue = this.checkValue.bind(this);
    this._delayAction = this._delayAction.bind(this);
  }

  openNotificationWithIcon(type, title, msg) {
    notification[type]({
      message: title,
      description: msg
    });
  }

  submitRefundBox(e) {
    let tx = {
      from_id: this.props.account.account_id,
      to_id: this.state.customer.account_id,
      amount: roundAmount(
        (this.state.discount * (this.props.amount || 0)) / 100
      ),
      bill_amount: Number(this.props.amount),
      bill_id: this.props.reference
    };

    this.setState({
      confirm: false,
      selectCustomer: false,
      customer: {}
    });

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

  updateDiscount(value) {
    if (isNaN(value)) return;
    this.setState({ discount: value });
    this._delayAction("", () => {
      this.setState({
        discount: this.checkValue(value)
      });
    });
  }

  _delayAction(value, cb) {
    clearTimeout(this.tid);
    this.tid = setTimeout(() => {
      cb(value);
    }, 1000);
  }

  checkValue(value) {
    if (value >= this.props.percentage) return value;
    return this.props.percentage;
  }

  selectCustomer() {
    this.setState({
      selectCustomer: true
    });
  }

  userSelected(customer) {
    this.setState({
      selectCustomer: false,
      confirm: true,
      customer // {name , }
    });
  }


  componentDidMount() {
    this.setState({      discount: this.getTodayReward() })
  }
  
  // HACK: robado de dashboard.js
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

  getTodayDiscount() {
    return this.getTodayRate("discount");
  }
  getTodayReward() {
    return this.getTodayRate("reward");
  }

  getTodayRate(discount_reward) {
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

    return discount_reward === "discount" ? discount.discount : discount.reward; //? discount : { discount: 0, reward: 0 };
  }


  render() {
    return (
      <div>
        <ConfirmBox
          visible={this.state.confirm}
          from={this.props.account.account}
          to={this.state.customer}
          reference={this.props.reference}
          validate={({ amount, percentage }) =>
            percentage >= this.props.percentage && amount > 0
          }
          discount={roundAmount(
            (this.state.discount * (this.props.amount || 0)) / 100
          ).toFixed(2)}
          amount={Number(this.props.amount || 0)}
          onOk={this.submitRefundBox}
          onCancel={() =>
            this.setState({
              confirm: false,
              selectCustomer: false,
              customer: {}
            })
          }
        />
        <CustomerPicker
          visible={this.state.selectCustomer}
          onSelect={this.userSelected}
          onCancel={() => this.setState({ selectCustomer: false })}
        />
        <ColorBox
          title={
            <IntlMessages id="mainBusiness.reward" defaultMessage="Reward" />
          }
          value={this.state.discount}
          valid={
            this.props.percentage <= this.state.discount &&
            this.props.amount > 0
          }
          onChange={this.updateDiscount}
          onSubmit={this.selectCustomer}
          buttonText={
            <IntlMessages
              id="mainBusiness.sendReward"
              defaultMessage="Send reward"
            />
          }
          color="#3A99D9"
        >


          <div class="w-100 d-flex flex-row bill-amount">
            <div class="col flex-1 text-left">
              <span class="label">
              ARS
              </span>
              <span class="bill-amount-value">
                $ {Number(this.props.amount || 0).toFixed(2)}
              </span>

            </div>
            <div class="col flex-1 text-right">
              <span class="label">
              {currency.symbol}{" "}
              </span>
              <span class="bill-amount-value">
                {roundAmount(
                  (this.state.discount * (this.props.amount || 0)) / 100
                ).toFixed(2)}
              </span>
            </div>
          </div>

        </ColorBox>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  api: state.Api,
  customers: state.Api.customers,
  account: state.Auth,
  isLoading: state.Api.actionLoading,
  error: state.Api.error,
  msg: state.Api.msg
});

const mapDispatchToProps = dispatch => ({
  searchAccount: bindActionCreators(actions.searchAccount, dispatch),
  cleanMsg: bindActionCreators(actions.cleanMsg, dispatch),
  getSchedule: bindActionCreators(actions.getSchedule, dispatch),
  showLoading: bindActionCreators(appActions.showLoading, dispatch),
  endLoading: bindActionCreators(appActions.endLoading, dispatch)
});

export const SendRefund = connect(
  mapStateToProps,
  mapDispatchToProps
)(SendRefundComponent);
