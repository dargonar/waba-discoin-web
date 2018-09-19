import React, { Component } from "react";
import { Modal } from "antd";
import PropTypes from "prop-types"; // ES6
import IntlMessages from "../../../components/utility/intlMessages";
import { currency } from "../../../config";
import QrCode from "qrcode.react";

export class RewardQr extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onOk = this.onOk.bind(this);
  }

  onOk() {
    this.props.submit();
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
RewardQr.protoTypes = {
  bill_amount: PropTypes.number,
  bill_id: PropTypes.string,
  discount_dsc: PropTypes.number,
  discount_ars: PropTypes.number,
  account_id: PropTypes.string,
  account_name: PropTypes.string
};
export default RewardQr;
