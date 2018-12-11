import React, { Component } from "react";
import IntlMessages from "../../../../components/utility/intlMessages";
import { currency } from "../../../../config";
import { ColorBox } from "./colorBox";
import { connect } from "react-redux";
import QrReward from "../../components/rewardQr";
import moment from "moment";
import { bindActionCreators } from "redux";
import actions from "../../../../redux/api/actions";

const filterTx = (memo, from) => (txs = []) => {
  // console.log({ memo, from, tx: txs[0] ? txs[0].memo.message : null });
  return txs.filter(tx => tx.memo.message === memo && moment(from).isBefore(moment(tx.date))).reduce((prev, act) => act, false);
};

// const filterTx = (memo, from) => txs => {
//   return txs.filter(tx => tx.memo.message === memo && moment(from).isBefore(moment(tx.date))).length > 0;
// };

class AcceptDiscountComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reward: 0,
      qr: false
    };
    this.updateReward = this.updateReward.bind(this);
    this.checkValue = this.checkValue.bind(this);
    this.showQr = this.showQr.bind(this);
    this._delayAction = this._delayAction.bind(this);
  }

  componentDidMount() {
    this.setState({ reward: this.props.percentage });
  }

  showQr(customer) {
    this.setState({
      qr: true,
      memo: "~di:" + this.props.amount + ":" + this.props.reference,
      from: moment()
    });
    //update tx every second in the next twenty secconds
    // this.props.setTimmer(1000, 20000);
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

  componentWillReceiveProps(newProps) {
    if (this.props.percentage !== newProps.percentage || this.state.reward < newProps.percentage) {
      this.updateReward(newProps.percentage);
    }
  }

  render() {
    const roundAmount = value => Math.round(value * 100) / 100;

    {
      /* <span>
                      ${" "}
                      {Number(
                        this.props.amount -
                          roundAmount(
                            (this.state.reward * (this.props.amount || 0)) / 100 || 0
                          )
                      ).toFixed(2)}
                      <br />+ <br />
                      {currency.symbol}{" "}
                      {roundAmount(
                        (this.state.reward * (this.props.amount || 0)) / 100 || 0
                      ).toFixed(2)}
                    </span> */
    }

    return (
      <div>
        <QrReward
          submit={() => {
            this.setState({ qr: false });
          }}
          autoClose={filterTx(this.state.memo, this.state.from)(this.props.transactions)}
          visible={this.state.qr}
          bill_amount={this.props.amount}
          bill_id={this.props.reference}
          discount_dsc={roundAmount((this.state.reward * (this.props.amount || 0)) / 100)}
          discount_ars={this.props.amount - roundAmount((this.state.reward * (this.props.amount || 0)) / 100)}
          account_id={this.props.account.account_id}
          account_name={this.props.account.account}
          reward={this.state.reward}
          id="INVOICE_DISCOUNT"
        />
        <ColorBox
          title={<IntlMessages id="mainBusiness.discount" defaultMessage="Discount" />}
          value={this.state.reward}
          valid={this.props.percentage <= this.state.reward && this.props.amount > 0}
          onChange={this.updateReward}
          onSubmit={this.showQr}
          buttonText={
            <IntlMessages
              id="mainBusiness.acceptPayment"
              values={{ currency: currency.plural }}
              defaultMessage="Accept Payment in {currency}"
            />
          }
          color="#3A99D9"
          arrow="arrow-down"
        >
          <div class="w-100 d-flex flex-row bill-amount">
            <div class="col flex-1 text-left">
              <span class="label">ARS</span>
              <span class="bill-amount-value">
                {" "}
                {Number(this.props.amount - roundAmount((this.state.reward * (this.props.amount || 0)) / 100)).toFixed(2)}
              </span>
            </div>
            <div class="col flex-1 text-right">
              <span class="label">{currency.symbol} </span>
              <span class="bill-amount-value">{roundAmount((this.state.reward * (this.props.amount || 0)) / 100).toFixed(2)}</span>
            </div>
          </div>
        </ColorBox>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => ({
  account: state.Auth,
  transactions: state.Api.transactions || []
});

export const AcceptDiscount = connect(
  mapStateToProps,
  mapDispatchToProps
)(AcceptDiscountComponent);
