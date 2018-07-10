import React, { Component } from "react";
import { Modal, Row, Col } from "antd";
import Input from "../../../components/uielements/input";
import { DatePicker } from "antd";
import { notification } from "antd";
import moment from "moment";

const minutesOffset = 1;

const checkActualDate = stringDate => {
  let date = moment(stringDate);
  // We need at least 1 minutes to get confirmation
  if (date.isBefore(moment().add(minutesOffset, "m"))) {
    date.add(minutesOffset, "m");
  }
  return date.utc().valueOf();
};

export class SubAccountBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      from: "",
      to: ""
    };

    this.updateAmount = this.updateAmount.bind(this);
    this.updateFrom = this.updateFrom.bind(this);
    this.updateTo = this.updateTo.bind(this);
    this.onOk = this.onOk.bind(this);
  }

  openNotificationWithIcon(type, title, msg, duration) {
    let my_duration = 4.5;
    if (typeof duration !== "undefined") my_duration = duration;
    notification[type]({
      message: title,
      description: msg,
      duration: my_duration
    });
  }

  null_or_zero(value) {
    return value == null || parseInt(value) < 0;
  }
  null_or_empty(value) {
    return !value || value == null || value == "";
  }
  onOk() {
    // console.log(' normal: ', this.state.from.date.valueOf());
    // console.log(' utc: ', this.state.from.date.utc().valueOf());
    // validar fechas from > now > to
    let _now = Math.floor(Date.now() / 1000); //new Date().getTime();
    let _from = checkActualDate(this.state.from.date_utc); //.date.utc().valueOf();
    let _to = this.state.to.date_utc; //.date.utc().valueOf()

    let period = 86400;
    let periods = Math.floor((_to - _from) / 86400 / 1000);
    console.log("period:", period, "periods:", periods);

    console.log(" now:", _now);
    console.log(" from:", _from);
    console.log(" to:", _to);
    console.log(
      " -- this.null_or_zero(this.state.amount):",
      this.null_or_zero(this.state.amount)
    );
    console.log(
      " -- this.null_or_empty(this.state.from):",
      this.null_or_empty(_from)
    );
    console.log(
      " -- this.null_or_empty(this.state.to):",
      this.null_or_empty(_to)
    );
    console.log(" -- (_now>=_from>=_to)", _now >= _from >= _to);
    if (
      this.null_or_zero(this.state.amount) ||
      this.null_or_empty(_from) ||
      this.null_or_empty(_to) ||
      _from >= _now >= _to ||
      periods < 1
    ) {
      this.openNotificationWithIcon(
        "error",
        "Verifique valores ingresados",
        "El monto debe ser mayor a cero, la fecha de inicio debe ser mayor al dia de hoy y mayor a la fecha de cierre.",
        0
      );
      return;
    }

    this.props.submit(this.state);
    // this.setState(this.default_state)
  }

  updateAmount(e) {
    let my_amount = e.target.value;
    this.setState({
      amount: my_amount
    });
  }
  // limit           = request.json.get('limit')
  // _from           = request.json.get('from')
  // period          = request.json.get('period')
  // periods         = request.json.get('periods')

  updateFrom(date, dateString) {
    if (date === null) {
      this.setState({ from: "" });
      return;
    }

    console.log("updateFrom:: ", date, dateString, moment);

    //Check time offset
    date = moment(checkActualDate(date.utc().valueOf()));

    //Update state
    this.setState({
      from: {
        date_utc: date.utc().valueOf(),
        dateString: date.toString()
      }
    });
  }

  updateTo(date, dateString) {
    if (date === null) {
      this.setState({ to: "" });
      return;
    }

    console.log("updateTo:: ", date, dateString);
    this.setState({
      to: { date_utc: date.utc().valueOf(), dateString: dateString }
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
        title={"Autorizar subcuenta: " + name}
        visible={this.props.visible}
        onCancel={this.props.cancel}
        onOk={this.onOk}
      >
        <Row gutter={16}>
          <Col style={colStyle} xs={24}>
            Límite diario
            <Input
              addonBefore={"D$C"}
              defaultValue={this.state.amount}
              onChange={this.updateAmount}
            />
          </Col>
          <Col style={colStyle} xs={24} md={12}>
            Habilitado desde
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              onChange={this.updateFrom}
              size="large"
            />
          </Col>
          <Col style={colStyle} xs={24} md={12}>
            hasta
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              onChange={this.updateTo}
              size="large"
            />
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default SubAccountBox;
