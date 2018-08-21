import React from "react";
import { Card, Col, Row, Avatar } from "antd";
import Review from "../../../../components/uielements/rate";
import { getBase64 } from "../../../../components/hashImage";
import moment from "moment";
import IntlMessages from "../../../../components/utility/intlMessages";

export default ({ transaction }) => (
  <Card style={{ marginBottom: "10px" }}>
    <Row gutter={16}>
      <Col
        md={6}
        xs={24}
        style={{ marginBottom: "15px", fontSize: "1.4em", fontWeight: 300 }}
      >
        <Avatar src={getBase64(transaction.from.name, 60)} /> <br />
        <IntlMessages id="transactions.from" defautlMessage="From" />:{" "}
        {transaction.from.name}
      </Col>
      <Col
        md={6}
        xs={24}
        style={{ marginBottom: "15px", fontSize: "1.4em", fontWeight: 300 }}
      >
        <Avatar src={getBase64(transaction.to.name, 60)} /> <br />
        <IntlMessages id="transactions.to" defautlMessage="To" />:{" "}
        {transaction.to.name}
      </Col>
      <Col md={6} xs={24}>
        <b>
          <IntlMessages id="transactions.refund" defautlMessage="Refund" />
        </b>
        : D$C
        {Number(transaction.amount).toLocaleString()}
        <br />
        <b>
          % <IntlMessages id="transactions.refund" defautlMessage="Refund" />
        </b>
        : %{transaction.discount}
        <br />
        <b>
          <IntlMessages
            id="transactions.amountInvoiced"
            defautlMessage="Amount invoiced"
          />
        </b>
        : ${transaction.bill_amount}
        <br />
        <b>
          <IntlMessages id="transactions.invoice" defautlMessage="Invoice" />
        </b>
        : {transaction.bill_id}
      </Col>
      <Col md={6} xs={24}>
        <b>
          <IntlMessages id="transactions.date" defautlMessage="Date" />
        </b>
        : {moment(transaction.date).format("LLLL")}
        <br />
        <b>
          <IntlMessages id="transactions.review" defautlMessage="Review" />
        </b>
        : <Review disabled defaultValue={transaction.review} />
      </Col>
    </Row>
  </Card>
);
