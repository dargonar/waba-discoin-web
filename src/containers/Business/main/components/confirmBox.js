import React, { Component } from "react";
import { Modal, Row, Col, Icon } from "antd";
import HashImg from "../../../../components/hashImage";
import { currency } from "../../../../config";
import IntlMessages from "../../../../components/utility/intlMessages";

const UserBox = ({ name, type }) => (
  <Col lg={11}>
    <h3
      style={{ textAlign: "center", color: "#ccc", textTransform: "uppercase" }}
    >
      {type}
    </h3>
    <div
      style={{
        width: "142px",
        margin: "0 auto",
        textAlign: "center",
        padding: "30px 10px 15px",
        boxShadow: "rgb(245, 245, 245) 2px 3px 5px 1px",
        border: "1px solid rgb(245, 245, 245)",
        borderRadius: "15px"
      }}
    >
      <HashImg text={name} size={50} style={{ borderRadius: "5px" }} />
      <h3 style={{ color: "rgb(175, 175, 175)", margin: "10px 0 0 0" }}>
        {name}
      </h3>
    </div>
  </Col>
);

const ResumeItem = ({ title, text }) =>
  text ? (
    <span>
      <p
        style={{
          marginBottom: "5px",
          margin: "0px",
          fontWeight: "bold",
          color: "rgb(159, 159, 159)"
        }}
      >
        {title}:
      </p>
      <p
        style={{
          color: "rgb(159, 159, 159)",
          margin: "0px 0 5px",
          fontSize: "14px"
        }}
      >
        {text}
      </p>
    </span>
  ) : (
    false
  );

const Resume = ({ amount, date, bill, memo }) => (
  <div
    style={{
      background: "#f1f1f1",
      padding: "25px 30px 15px",
      margin: "23px 0 20px",
      borderRadius: "6px",
      width: "100%"
    }}
  >
    <Row
      type="flex"
      justify="center"
      align="middle"
      style={{ borderBottom: "1px solid #ccc", marginBottom: "10px" }}
    >
      <Col sm={12} style={{ fontSize: "20px", textTransform: "uppercase" }}>
        <h3 style={{ margin: "0px 0 -10px", padding: "0px" }}>
          <IntlMessages id="bussinesMain.total" defaultMessage={"Total"} />
        </h3>
        <small>
          <IntlMessages
            id="bussinesMain.invoiced"
            defaultMessage={"Invoiced"}
          />
        </small>
      </Col>
      <Col sm={12} style={{ textAlign: "right" }}>
        <h3 style={{ fontSize: "20px" }}>
          $ {Number(amount || 0).toLocaleString()}
        </h3>
      </Col>
    </Row>
    <ResumeItem
      title={<IntlMessages id="date" defaultMessage="Date" />}
      text={date}
    />
    <ResumeItem
      title={
        <IntlMessages
          id="bussinesMain.billReference"
          defaultMessage={"Reference (ticket number, invoice, other)"}
        />
      }
      text={bill}
    />
    <ResumeItem
      title={<IntlMessages id="bussinesMain.memo" defaultMessage={"Memo"} />}
      text={memo}
    />
  </div>
);

const TotalBox = ({ discount }) => (
  <div style={{ textAlign: "center", fontSize: "50px" }}>
    <span
      style={{
        borderBottom: "1px solid rgb(237, 204, 184)",
        padding: "0 10px"
      }}
    >
      <small style={{ verticalAlign: "middle", fontSize: "20px" }}>
        {currency.symbol}
      </small>{" "}
      {Number(discount || 0).toLocaleString()}
    </span>
  </div>
);

export class ConfirmBox extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        size={"small"}
        onCancel={this.props.onCancel}
        onOk={this.props.onOk}
      >
        <TotalBox discount={this.props.discount} />
        <Row type="flex" justify="space-around" align="middle">
          <UserBox
            type={<IntlMessages id="confirmRefund.from" defaultMessage="De" />}
            name={this.props.from}
          />
          <Col
            lg={2}
            style={{
              marginTop: "30px",
              textAlign: "center",
              color: "rgb(215, 215, 215)",
              fontSize: "30px"
            }}
          >
            <Icon type="arrow-right" theme="outlined" />
          </Col>
          <UserBox
            type={<IntlMessages id="confirmRefund.to" defaultMessage="A" />}
            name={this.props.to.name}
          />
        </Row>
        <Resume
          amount={this.props.amount}
          date={new Date().toLocaleDateString()}
          bill={this.props.reference}
          memo={"~re:" + this.props.amount + ":" + this.props.reference}
        />
      </Modal>
    );
  }
}
