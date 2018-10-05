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
import PageLoading from "../../../components/pageLoading";

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
    this.renderContent = this.renderContent.bind(this);
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
    this.props.loadSchedule();
    this.setTimmer(10000);
  }

  componentWillUnmount() {
    clearInterval(this.loop);
  }

  renderContent() {
    return (
      <div>
        <Row type="flex">
          <Col className="col">
            <span class="label">Monto de la factura</span>
          </Col>
        </Row>
        <Row
          justify="start"
          type="flex"
          flexDirection={Row}
          className="flexRow input-bill-container"
        >
          <Col md={12} className="col">
            <Row type="flex" flexDirection={Row} className="flexRow">
              <Col className="d-flex flex-column text-right bill-currency">
                <span>$</span>
                <p>ARS</p>
              </Col>
              <Col className="d-flex">
                <Input
                  className="input-bill"
                  type="number"
                  min="0"
                  size="large"
                  value={this.state.bill.amount}
                  placeholder={0}
                  onChange={e => this.changeBillAmount(e.target.value)}
                />
              </Col>
            </Row>
          </Col>

          <Col md={12} className="col">
            <Input
              className="input-bill-reference"
              size="large"
              placeholder={
                this.props.intl.messages["bussinesMain.billReference"] ||
                "Reference (ticket number, invoice, other)"
              }
              onChange={e => this.changeBillReference(e.target.value)}
            />
          </Col>
        </Row>
        <Row
          justify="start"
          type="flex"
          flexDirection={Row}
          className="flexRow w-100"
        >
          <Col md={12} className="col">
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

          <Col md={12} className="col">
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
        </Row>

        <Row style={{ width: "100%", paddingTop: "40px" }} gutter={16}>
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
      </div>
    );
  }

  render() {
    return (
      <LayoutContentWrapper className="reward_discount-view">
        {typeof this.props.discount.discount !== "undefined" &&
        typeof this.props.discount.reward !== "undefined" ? (
          this.renderContent()
        ) : (
          <PageLoading />
        )}
      </LayoutContentWrapper>
    );
  }
}

const getDiscount = discounts => {
  console.log("----------------------");
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
  loadSchedule: bindActionCreators(actions.getSchedule, dispatch),
  loadTx: bindActionCreators(actions.searchTransactions, dispatch)
});

export default connect(
  mapStateToProps,
  dispatchToProps
)(injectIntl(Dashboard));
