import React, { Component } from "react";
import { BasicPage } from "../../components/basicPage";
import PageHeader from "../../components/utility/pageHeader";
import IsoWidgetsWrapper from "../../components/utility/widgets-wrapper";
import { Col, Row } from "antd";
import basicStyle from "../../config/basicStyle";
import BalanceSticker from "../../components/balance-sticker/balance-sticker";
import RatingSticker from "../../components/rating-sticker/rating-sticker";
import IntlMessages from "../../components/utility/intlMessages";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../redux/api/actions";
import { push } from "react-router-redux";
import OverdraftStrip from "./components/overdraftStrip";

import { currency } from "../../config";
import {
  balanceRatio,
  todayDiscount,
  todayReward,
  getBalances,
  isBusiness,
  isConfiguration,
  warnings,
  rating
} from "../../redux/api/selectors/business.selectors";

import { txTodayTotals } from "../../redux/api/selectors/transactions.selectors";

let { rowStyle, colStyle } = basicStyle;

colStyle = { ...colStyle, marginBottom: "20px" };

const ColWidget = ({ children }) => (
  <Col md={6} sm={12} xs={24} style={colStyle}>
    <IsoWidgetsWrapper>{children}</IsoWidgetsWrapper>
  </Col>
);

const Box = props => (
  <Col md={12} sm={24} style={colStyle}>
    <IsoWidgetsWrapper>
      <BalanceSticker {...props} />
    </IsoWidgetsWrapper>
  </Col>
);

const TransactionsStickers = ({ txs }) => (
  <Col xs={24} md={24} style={colStyle}>
    <Col xs={24} md={12} style={colStyle}>
      <IsoWidgetsWrapper>
        <PageHeader>
          <IntlMessages defaultMessage="Discounts today" id="discounts.today" />
        </PageHeader>
      </IsoWidgetsWrapper>
      <Box
        amount={txs.discount.coin}
        text={<IntlMessages defaultMessage="Discounts" id="discounts" />}
        subtext={<IntlMessages defaultMessage="{currency} sent" id="discountsSent" values={{ currency: currency.plural }} />}
        bgColor="#fff"
        coin={currency.symbol}
      />

      <Box
        amount={txs.discount.fiat}
        text={<IntlMessages defaultMessage="Discounts" id="discounts" />}
        subtext={<IntlMessages defaultMessage="Total invoiced" id="discounts.totalInvoiced" />}
        bgColor="#fff"
        coin={currency.fiat.symbol}
      />
    </Col>
    <Col xs={24} md={12}>
      <IsoWidgetsWrapper>
        <PageHeader>
          <IntlMessages defaultMessage="Refounds today" id="refund.refound.today" />
        </PageHeader>
      </IsoWidgetsWrapper>

      <Box
        amount={txs.refund.coin}
        text={<IntlMessages defaultMessage="Refounds" id="refund.refound" />}
        subtext={
          <IntlMessages defaultMessage="Total accepted {currency}" id="refund.totalAccepted" values={{ currency: currency.plural }} />
        }
        bgColor="#fff"
        coin={currency.symbol}
      />

      <Box
        amount={txs.refund.fiat}
        text={<IntlMessages defaultMessage="Refounds" id="refund.refound" />}
        subtext={<IntlMessages defaultMessage="Total invoiced" id="discounts.totalInvoiced" />}
        bgColor="#fff"
        coin={currency.fiat.symbol}
      />
    </Col>
  </Col>
);
export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.renderContent = this.renderContent.bind(this);
    this.onPercentageClick = this.onPercentageClick.bind(this);
  }

  onPercentageClick() {
    this.props.goTo("/dashboard/business/discount-and-rewards");
  }

  componentWillMount() {
    this.props.fetchProfile();
    this.props.fetchConfiguration();
    this.props.fetchTx();
  }

  renderContent() {
    return (
      <Row style={rowStyle} gutter={0} justify="start">
        <ColWidget>
          <BalanceSticker
            amount={this.props.balances.balance}
            text={
              <IntlMessages
                id="dashboard.balance"
                values={{
                  currency: currency.symbol
                }}
                defaultMessage={"{currency} Balance"}
              />
            }
            coin={currency.symbol}
            fontColor="#1C222C"
            bgColor="#fff"
          />
        </ColWidget>

        <ColWidget>
          <BalanceSticker
            amount={this.props.balances.initial_credit}
            text={<IntlMessages defaultMessage="Initial Credit" id="dashboard.initialCredit" />}
            coin={currency.symbol}
            fontColor="#1C222C"
            bgColor="#fff"
          />
        </ColWidget>

        <ColWidget>
          <BalanceSticker
            amount={this.props.balances.ready_to_access}
            text={<IntlMessages defaultMessage="Endorsed" id="dashboard.endorsed" />}
            coin={currency.symbol}
            fontColor="#1C222C"
            bgColor="#fff"
          />
          <OverdraftStrip />
        </ColWidget>

        <ColWidget>
          <BalanceSticker
            amount={this.props.balanceRatio}
            text={<IntlMessages defaultMessage="Accepted / Received ratio" id="dashboard.acceptedRatio" />}
            scale={this.props.warnings}
            percentage={true}
            fontColor="#1C222C"
            bgColor="#fff"
          />
        </ColWidget>

        <ColWidget onClick={this.onPercentageClick}>
          <BalanceSticker
            amount={this.props.todayDiscount}
            percentage={true}
            text={<IntlMessages defaultMessage="Reward & Discount" id="dashboard.todayDiscount" />}
            fontColor="#1C222C"
            bgColor="#fff"
          />
        </ColWidget>

        <ColWidget onClick={this.onPercentageClick}>
          <BalanceSticker
            amount={this.props.todayReward}
            percentage={true}
            text={<IntlMessages defaultMessage="Today reward %" id="dashboard.todayReward" />}
            fontColor="#1C222C"
            bgColor="#fff"
          />
        </ColWidget>

        <ColWidget>
          <RatingSticker rating={this.props.rating} full={0} stars={0} text={0} icon="user" fontColor="#1C222C" bgColor="#fff" />
        </ColWidget>
        <TransactionsStickers txs={this.props.txs} />
      </Row>
    );
  }

  render() {
    return (
      <BasicPage title={<IntlMessages id="dashboard.dashboard" defaultMessage="Dashboard" />} loading={!this.props.isReady}>
        {this.props.isReady ? this.renderContent() : false}
      </BasicPage>
    );
  }
}

const mapStateToProps = state => ({
  isReady: isBusiness(state) && isConfiguration(state) && !state.Api.loading,
  todayDiscount: todayDiscount(state),
  todayReward: todayReward(state),
  balances: getBalances(state),
  balanceRatio: balanceRatio(state),
  rating: rating(state),
  warnings: warnings(state),
  txs: txTodayTotals(state.Api.transactions || [])
});

const dispatchToProps = dispatch => ({
  fetchProfile: bindActionCreators(actions.fetchProfile, dispatch),
  fetchConfiguration: bindActionCreators(actions.fetchConfiguration, dispatch),
  fetchTx: bindActionCreators(actions.searchTransactions, dispatch),
  goTo: url => dispatch(push(url))
});

export default connect(
  mapStateToProps,
  dispatchToProps
)(Dashboard);
