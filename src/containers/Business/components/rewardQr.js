import React, { Component } from "react";
import { Alert, Modal, Col, Row } from "antd";
import IntlMessages from "../../../components/utility/intlMessages";
import { currency } from "../../../config";
import QrCode from "qrcode.react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import appActions from "../../../redux/app/actions";
import { injectIntl, IntlProvider } from "react-intl";

const LineItem = ({ title, value, bold, even }) => (
  <Row
    type="flex"
    justify="space-around"
    align="middle"
    style={{ paddingRight: 5, backgroundColor: even == "odd" ? "#ddd" : "transparent" }}
  >
    <Col style={{ flex: 4 }}>
      <h4 style={{ color: "rgb(255, 158, 93)" }}>{title}</h4>
    </Col>
    <Col style={{ flex: 5, textAlign: "right", paddingRight: "20px" }}>
      {bold ? (
        <h3>
          <b>{value}</b>
        </h3>
      ) : (
        <h3>{value}</h3>
      )}
    </Col>
  </Row>
);

class RewardQrComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onOk = this.onOk.bind(this);
  }

  onOk() {
    this.props.submit();
  }

  componentWillReceiveProps(newProps) {
    const memo = "~di:" + this.props.bill_amount + ":" + this.props.bill_id;
    if (newProps.autoClose !== false && this.props.autoClose !== newProps.autoClose) {
      if (newProps.autoClose.amount < this.props.discount_dsc) {
        Modal.warning({
          title: (
            <IntlProvider {...this.props.intl}>
              <IntlMessages id="qr.lessAmountTitle" defaultMessage="Partially approved transaction" />
            </IntlProvider>
          ),
          content: (
            <IntlProvider {...this.props.intl}>
              <IntlMessages
                id="qr.lessAmountDescription"
                defaultMessage={`The user {user} sent {currency}{received} instead of the expected {currency}{expected}. Must complete the payment with {fiat}{extra}.`}
                values={{
                  user: `${newProps.autoClose.from_name} (${newProps.autoClose.from_id})`,
                  currency: currency.symbol,
                  fiat: currency.fiat.symbol,
                  received: newProps.autoClose.amount,
                  expected: this.props.discount_dsc,
                  extra: this.props.discount_dsc - newProps.autoClose.amount
                }}
              />
            </IntlProvider>
          ),
          onOk: () => this.props.submit()
        });
      } else {
        this.props.showMessage({
          msgType: "success",
          msg: "Transaction " + memo + " approved"
        });
        this.props.submit();
      }
    }
  }

  render() {
    const { bill_amount, bill_id, discount_dsc, discount_ars, account_id, account_name } = this.props;

    let qrString = JSON.stringify({
      ba: bill_amount,
      bi: bill_id,
      dd: discount_dsc,
      da: discount_ars,
      ai: account_id,
      an: account_name,
      t: "id"
    });

    return (
      <Modal
        centered={true}
        title={
          <IntlMessages
            id="refund.rewardFrom"
            values={{
              name: account_name,
              account_id: account_id,
              memo: "~di:" + bill_amount + ":" + bill_id
            }}
            defaultMessage={`{name} ({account_id})  - {memo}`}
          />
        }
        width={650}
        footer={null}
        visible={this.props.visible}
        onCancel={this.onOk}
      >
        <Row>
          <Col md={12}>
            <LineItem
              even="odd"
              bold="false"
              title={<IntlMessages id="qr.total" defaultMessage="Total to pay" />}
              value={"$ " + Number(bill_amount).toFixed(2)}
            />
            <LineItem
              even="even"
              bold="false"
              title={<IntlMessages id="qr.discount" defaultMessage="Discount" />}
              value={"% " + this.props.reward}
            />
            <LineItem
              even="odd"
              bold="false"
              title={<IntlMessages id="qr.totalCoins" defaultMessage="Total in {currency}" values={{ currency: currency.plural }} />}
              value={currency.symbol + " " + Number(discount_dsc).toFixed(2)}
            />
            <LineItem
              even="even"
              bold="true"
              title={<IntlMessages id="qr.totalCoins" defaultMessage="Total in {currency}" values={{ currency: currency.fiat.plural }} />}
              value={"$ " + Number(discount_ars).toFixed(2)}
            />
            <LineItem even="odd" bold="false" title={<IntlMessages id="qr.ticket" defaultMessage="Ticket/ID" />} value={bill_id} />
          </Col>
          <Col md={12}>
            <QrCode value={qrString} size={300} />
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => ({
    showMessage: bindActionCreators(appActions.showMessage, dispatch)
  })
)(injectIntl(RewardQrComponent));
