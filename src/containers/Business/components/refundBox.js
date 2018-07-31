import React, { Component } from "react";
import { Modal, Row, Col } from "antd";
import Input from "../../../components/uielements/input";
import { notification } from "antd";
import PropTypes from "prop-types"; // ES6

export class RefundBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      percentage: this.props.percentage,
      bill_id: "",
      bill_amount: 0
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
  }

  onOk() {
    this.props.submit(this.state);
    // this.setState(this.default_state)
  }

  openNotificationWithIcon(type, title, msg) {
    notification[type]({
      message: title,
      description: msg
    });
  }

  updatePercentage(e) {
    let percentage = e.target.value;
    if (percentage < this.default_state.percentage) {
      this.openNotificationWithIcon(
        "error",
        "Descuento inválido",
        "El descuento debe ser de al menos " +
          this.default_state.percentage +
          "%"
      );
    }
    this.setState({
      percentage: percentage,
      amount: Math.round((percentage * this.state.bill_amount) / 100)
    });
  }

  updateBillAmount(e) {
    let bill_amount = e.target.value;
    this.setState({
      bill_amount: bill_amount,
      amount: Math.round((this.state.percentage * bill_amount) / 100)
    });
  }

  updateAmount(e) {
    let amount = e.target.value;
    this.setState({
      amount: amount,
      percentage: Math.round((amount * 100) / this.state.bill_amount)
    });
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
        title={"Recompensar a " + name}
        visible={this.props.visible}
        onCancel={this.props.cancel}
        onOk={this.onOk}
      >
        <Row gutter={16}>
          <Col style={colStyle} xs={24}>
            Amount
            <Input
              addonBefore={"$"}
              defaultValue={this.state.bill_amount}
              onChange={this.updateBillAmount}
            />
          </Col>
          <Col style={colStyle} xs={24} md={12}>
            DisCoins
            <Input
              addonBefore={"DSC"}
              value={this.state.amount}
              onChange={this.updateAmount}
            />
          </Col>
          <Col style={colStyle} xs={24} md={12}>
            Porcentaje
            <Input
              addonAfter={"%"}
              value={this.state.percentage}
              onChange={this.updatePercentage}
            />
          </Col>
          <Col style={colStyle} xs={24}>
            Factura
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
