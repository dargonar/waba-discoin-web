import React, { Component } from "react";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";
import IntlMessage from "../../../components/utility/intlMessages";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../redux/api/actions";
import { currency } from "../../../config";
import { Row, Col, Input } from "antd";
import { SendRefund } from "./components/sendRefund";
import { AcceptDiscount } from "./components/acceptDiscount";
import { TransactionList } from "./components/transactionList";
import { injectIntl } from "react-intl";
import moment from "moment";

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bill: {
        amount: null,
        reference: null
      }
    };
    this.clearState = this.clearState.bind(this);
    this.setTimmer = this.setTimmer.bind(this);
    this.changeBillAmount = this.changeBillAmount.bind(this);
    this.changeBillReference = this.changeBillReference.bind(this);
  }

  clearState() {
    this.setState({
      bill: {
        amount: null,
        reference: null
      }
    });
  }

  changeBillAmount(amount) {
    if (amount < 0) return;
    this.setState({
      bill: {
        ...this.state.bill,
        amount
      }
    });
  }

  changeBillReference(reference) {
    this.setState({
      bill: {
        ...this.state.bill,
        reference
      }
    });
  }

  setTimmer(time, duration) {
    try {
      clearInterval(this.loop);
    } catch (_) {}

    this.loop = setInterval(this.props.loadTx, time || 10000);

    if (typeof duration !== "undefined") {
      setTimeout(() => this.setTimmer(10000), duration);
    }
  }

  componentWillMount() {
    this.props.loadTx();
    this.setTimmer(10000);
  }

  componentWillUnmount() {
    clearInterval(this.loop);
  }

  render() {
    return (
      <LayoutContentWrapper>
        <PageHeader>
          <IntlMessage
            id="bussinesMain.rewardAndRefund"
            defaultMessage="Reward and accept {currency}"
            values={{ currency: currency.plural }}
          />
        </PageHeader>
        <Row style={{ width: "100%" }} gutter={16}>
          <Col md={12}>
            <Input
              type="number"
              min="0"
              size="large"
              value={this.state.bill.amount}
              placeholder={
                this.props.intl.messages["bussinesMain.billAmount"] ||
                "Bill amount"
              }
              onChange={e => this.changeBillAmount(e.target.value)}
            />
          </Col>

          <Col md={12}>
            <Input
              size="large"
              placeholder={
                this.props.intl.messages["bussinesMain.billReference"] ||
                "Reference (ticket number, invoice, other)"
              }
              onChange={e => this.changeBillReference(e.target.value)}
            />
          </Col>

          <Col md={12}>
            <SendRefund
              {...this.state.bill}
              account={this.props.account}
              percentage={this.props.discount.reward}
              onSubmit={data => {
                console.log("Submited", { data });
                this.setTimmer(1000, 20000);
              }}
            />
          </Col>

          <Col md={12}>
            <AcceptDiscount
              {...this.state.bill}
              percentage={this.props.discount.discount}
              onSubmit={data => {
                console.log("Submited", { data });
                //this.setTimmer(1000, 20000);
              }}
              setTimmer={this.setTimmer}
            />
          </Col>

          <Col md={24} style={{ paddingTop: "40px" }}>
            <PageHeader>
              <IntlMessage
                defaultMessage="Transactions"
                id="businessMain.transactions"
              />
            </PageHeader>
            <TransactionList txs={this.props.transactions} />
          </Col>
        </Row>
      </LayoutContentWrapper>
    );
  }
}

const getDiscount = discounts => {
  console.log(
    moment()
      .format("dddd")
      .toLowerCase(),
    discounts,
    getDiscount
  );
  return discounts
    .filter(
      discount =>
        discount.date ===
        moment()
          .format("dddd")
          .toLowerCase()
    )
    .reduce((prev, act) => act, {});
};

const mapStateToProps = state => ({
  transactions: state.Api.transactions || [],
  discount: getDiscount(
    state.Api.business ? state.Api.business.discount_schedule : []
  )
});

const dispatchToProps = dispatch => ({
  loadTx: bindActionCreators(actions.searchTransactions, dispatch)
});

export default connect(
  mapStateToProps,
  dispatchToProps
)(injectIntl(Dashboard));
