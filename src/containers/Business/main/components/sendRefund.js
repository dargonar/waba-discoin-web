import React, { Component } from "react";
import IntlMessages from "../../../../components/utility/intlMessages";
import { currency } from "../../../../config";
import { ColorBox } from "./colorBox";
import QrModal from "../../components/rewardBox";
import CustomerPicker from "./selectCustomer";

export class SendRefund extends Component {
  constructor(props) {
    super(props);
    this.state = {
      discount: 0
    };
    this.updateDiscount = this.updateDiscount.bind(this);
    this.userSelected = this.userSelected.bind(this);
    this.selectCustomer = this.selectCustomer.bind(this);
    this.checkValue = this.checkValue.bind(this);
    this._delayAction = this._delayAction.bind(this);
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
    if (value <= 100 && value >= this.props.percentage) return value;
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
      qrModal: true,
      customer // {name , }
    });
  }

  render() {
    const roundAmount = value => Math.round(value * 100) / 100;

    return (
      <div>
        <QrModal
          visible={this.state.qrModal}
          customer={this.state.customer}
          cancel={() =>
            this.setState({
              qrModal: false,
              selectCustomer: false,
              customer: undefined
            })
          }
        />
        <CustomerPicker
          visible={this.state.selectCustomer}
          onSelect={this.userSelected}
          onCancel={() => this.setState({ selectCustomer: false })}
        />
        <ColorBox
          title={<IntlMessages id="discount" defaultMessage="Discount" />}
          value={this.state.discount}
          onChange={this.updateDiscount}
          onSubmit={this.selectCustomer}
          buttonText={
            <IntlMessages
              id="mainBusiness.sendReward"
              defaultMessage="Send reward"
            />
          }
          color="#55a6e4"
        >
          <span>
            $ {Number(this.props.amount || 0).toFixed(2)}
            <br />+ <br />
            {currency.symbol}{" "}
            {roundAmount(
              (this.state.discount * (this.props.amount || 0)) / 100
            ).toFixed(2)}
          </span>
        </ColorBox>
      </div>
    );
  }
}
