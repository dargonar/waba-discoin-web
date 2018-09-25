import React, { Component } from "react";
import IntlMessages from "../../../../components/utility/intlMessages";
import { currency } from "../../../../config";
import { ColorBox } from "./colorBox";
import { connect } from "react-redux";
import CustomerPicker from "./selectCustomer";
import QrReward from "../../components/rewardQr";
import moment from "moment";

const filterTx = (memo, from) => txs => {
  return (
    txs.filter(
      tx => tx.memo.message === memo && moment(from).isBefore(moment(tx.date))
    ).length > 0
  );
};

class AcceptDiscountComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reward: 0,
      selectCustomer: false,
      userSelected: undefined
    };
    this.updateReward = this.updateReward.bind(this);
    this.checkValue = this.checkValue.bind(this);
    this.userSelected = this.userSelected.bind(this);
    this._delayAction = this._delayAction.bind(this);
  }

  userSelected(customer) {
    this.setState({
      selectCustomer: false,
      qr: true,
      memo: "~di:" + this.props.amount + ":" + this.props.reference,
      from: moment(),
      customer // {name , }
    });
    //update tx every second in the next twenty secconds
    this.props.setTimmer(1000, 20000);
  }

  updateReward(value) {
    if (isNaN(value)) return;
    this.setState({ reward: value });
    this._delayAction("", () => {
      this.setState({
        reward: this.checkValue(Number(value))
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
    if (value <= 100 && value >= this.props.percentage) return value;
    return this.props.percentage;
  }

  render() {
    const roundAmount = value => Math.round(value * 100) / 100;

    return (
      <div>
        <CustomerPicker
          visible={this.state.selectCustomer}
          onSelect={this.userSelected}
          onCancel={() => this.setState({ selectCustomer: false })}
        />
        <QrReward
          submit={() => {
            this.setState({ qr: false, userSelected: undefined });
          }}
          autoClose={filterTx(this.state.memo, this.state.from)(
            this.props.transactions
          )}
          visible={this.state.qr}
          bill_amount={this.props.amount}
          bill_id={this.props.reference}
          discount_dsc={roundAmount(
            (this.state.reward * (this.props.amount || 0)) / 100
          )}
          discount_ars={
            this.props.amount -
            roundAmount((this.state.reward * (this.props.amount || 0)) / 100)
          }
          account_id={this.props.account.account_id}
          account_name={this.props.account.account}
          id="INVOICE_DISCOUNT"
        />
        <ColorBox
          title={
            <IntlMessages
              id="mainBusiness.discount"
              defaultMessage="Discount"
            />
          }
          value={this.state.reward}
          valid={
            this.props.percentage <= this.state.reward && this.props.amount > 0
          }
          onChange={this.updateReward}
          onSubmit={() => {
            this.setState({
              selectCustomer: true
            });
          }}
          buttonText={
            <IntlMessages
              id="mainBusiness.acceptPayment"
              values={{ currency: currency.plural }}
              defaultMessage="Accept Payment in {currency}"
            />
          }
          color="#ff8f5d"
        >
          <span>
            ${" "}
            {Number(
              this.props.amount -
                roundAmount(
                  (this.state.reward * (this.props.amount || 0)) / 100
                )
            ).toFixed(2)}
            <br />+ <br />
            {currency.symbol}{" "}
            {roundAmount(
              (this.state.reward * (this.props.amount || 0)) / 100
            ).toFixed(2)}
          </span>
        </ColorBox>
      </div>
    );
  }
}

export const AcceptDiscount = connect(state => ({
  account: state.Auth,
  transactions: state.Api.transactions || []
}))(AcceptDiscountComponent);
