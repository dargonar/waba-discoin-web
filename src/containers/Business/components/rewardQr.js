import React, { Component } from "react";
import { Modal } from "antd";
import PropTypes from "prop-types"; // ES6
import IntlMessages from "../../../components/utility/intlMessages";
import { currency } from "../../../config";
import QrCode from "qrcode.react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import appActions from "../../../redux/app/actions";

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
    if (
      newProps.autoClose === true &&
      this.props.autoClose !== newProps.autoClose
    ) {
      this.props.showMessage({
        msgType: "success",
        msg: "Transaction " + memo + " approved"
      });
      this.props.submit();
    }
  }

  render() {
    const {
      bill_amount,
      bill_id,
      discount_dsc,
      discount_ars,
      account_id,
      account_name
    } = this.props;

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
              currency: currency.symbol,
              amount: discount_dsc
            }}
            defaultMessage={`{name} ({account_id})  - {currency} {amount}`}
          />
        }
        width={350}
        footer={null}
        visible={this.props.visible}
        onCancel={this.onOk}
      >
        <QrCode value={qrString} size={300} />
        {/*<code>
            For debug:
            <pre>{JSON.stringify(JSON.parse(qrString), null, " ")}</pre>
          </code> */}
      </Modal>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => ({
    showMessage: bindActionCreators(appActions.showMessage, dispatch)
  })
)(RewardQrComponent);
