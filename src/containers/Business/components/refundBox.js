import React, { Component } from "react";
import { Modal, Row, Col } from "antd";
import Input from "../../../components/uielements/input";
import { notification } from "antd";
import PropTypes from "prop-types"; // ES6
import IntlMessage from "../../../components/utility/intlMessages";

export class RefundBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      percentage: this.props.percentage,
      bill_id: "",
      bill_amount: 0,
      invalid_form: true
    };
    this.default_state = {
      amount: 0,
      percentage: this.props.percentage,
      bill_id: "",
      bill_amount: 0
    };
    this.updateBillAmount = this.updateBillAmount.bind(this);
    this.updateAmount = this.updateAmount.bind(this);
    this.updatePercentage = this.updatePercentage.bind(this);
    this.updateBill = this.updateBill.bind(this);
    this.onOk = this.onOk.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this._delayAction = this._delayAction.bind(this);
  }

  onOk() {
    this.props.submit(this.state);
    this.setState(this.default_state);
  }
  onCancel() {
    this.setState(this.default_state);
    this.props.cancel();
  }

  openNotificationWithIcon(type, title, msg) {
    this._delayAction("", () => {
      if (this.state.invalid_form) {
        notification[type]({
          message: title,
          description: msg,
          duration: 2
        });
      }
    });
  }

  updatePercentage(percentage) {
    if (!Number(percentage)) {
      percentage = 0;
    }
    const invalid = percentage < this.props.scheduleReward;
    if (invalid) {
      this.openNotificationWithIcon(
        "error",
        "Descuento inválido",
        "El descuento debe ser de al menos " + this.props.scheduleReward + "%"
      );
    }
    this.setState({
      invalid_form: invalid,
      percentage: percentage,
      amount: Math.round((percentage * this.state.bill_amount) / 100)
    });
  }

  updateBillAmount(e) {
    let bill_amount = e.target.value;
    if (!Number(bill_amount)) {
      bill_amount = 0;
    }
    this.setState({
      bill_amount: bill_amount,
      amount: Math.round((this.state.percentage * bill_amount) / 100)
    });
    this.updatePercentage(this.state.percentage);
  }

  updateAmount(amount) {
    if (!Number(amount)) {
      amount = 0;
    }
    this.setState({
      amount: amount
    });
    this.updatePercentage(Math.round((amount * 100) / this.state.bill_amount));
  }

  _delayAction(value, cb) {
    clearTimeout(this.tid);
    this.tid = setTimeout(() => {
      cb(value);
    }, 1000);
  }

  updateBill(e) {
    let bill_id = e.target.value;
    this.setState({
      bill_id: bill_id
    });
  }

  render() {
    const colStyle = { marginBottom: "15px" };

    let name;
    try {
      name = this.props.customer.name;
    } catch (e) {
      name = "";
    }

    return (
      <Modal
        title={
          <IntlMessage
            id="refund.refoundTo"
            values={{ name }}
            defaultMessage={`Refound to {name}`}
          />
        }
        visible={this.props.visible}
        onCancel={this.onCancel}
        onOk={this.onOk}
        okButtonProps={{ disabled: this.state.invalid_form }}
      >
        <Row gutter={16}>
          <Col style={colStyle} xs={24}>
            <IntlMessage id={"refund.amount"} defaultMessage={"Amount"} />
            <Input
              addonBefore={"$"}
              value={this.state.bill_amount}
              onChange={this.updateBillAmount}
            />
          </Col>
          <Col style={colStyle} xs={24} md={12}>
            DisCoins
            <Input
              addonBefore={"DSC"}
              value={this.state.amount}
              onChange={e => this.updateAmount(e.target.value)}
            />
          </Col>
          <Col style={colStyle} xs={24} md={12}>
            <IntlMessage
              id={"refund.percentage"}
              defaultMessage={"Percentaje"}
            />
            <Input
              addonAfter={"%"}
              value={this.state.percentage}
              onChange={e => this.updatePercentage(e.target.value)}
            />
          </Col>
          <Col style={colStyle} xs={24}>
            <IntlMessage id={"refund.invoice"} defaultMessage={"Invoice"} />
            <Input onChange={this.updateBill} />
          </Col>
        </Row>
      </Modal>
    );
  }
}
RefundBox.protoTypes = {
  percentage: PropTypes.string,
  scheduleReward: PropTypes.string
};
export default RefundBox;
