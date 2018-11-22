import React, { Component } from "react";
import { BasicPage } from "../../components/basicPage";
import IsoWidgetsWrapper from "../../components/utility/widgets-wrapper";
import { Col, Row } from "antd";
import basicStyle from "../../config/basicStyle";
import BalanceSticker from "../../components/balance-sticker/balance-sticker";
import RatingSticker from "../../components/rating-sticker/rating-sticker";
import IntlMessage from "../../components/utility/intlMessages";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../redux/api/actions";
import { push } from "react-router-redux";
import OverdraftStrip from "./components/overdraftStrip";

import { currency } from "../../config";
import {
  balanceRatio,
  isBusiness,
  isConfiguration,
  todayDiscount,
  todayReward,
  warnings,
  rating,
  getBalances
} from "../../redux/api/selectors/business.selectors";

const { rowStyle, colStyle } = basicStyle;

const ColWidget = ({ children }) => (
  <Col md={6} sm={12} xs={24} style={colStyle}>
    <IsoWidgetsWrapper>{children}</IsoWidgetsWrapper>
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
  }

  renderContent() {
    return (
      <Row style={rowStyle} gutter={0} justify="start">
        <ColWidget>
          <BalanceSticker
            amount={this.props.balances.balance}
            text={
              <IntlMessage
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
            text={<IntlMessage defaultMessage="Initial Credit" id="dashboard.initialCredit" />}
            coin={currency.symbol}
            fontColor="#1C222C"
            bgColor="#fff"
          />
        </ColWidget>

        <ColWidget>
          <BalanceSticker
            amount={this.props.balances.ready_to_access}
            text={<IntlMessage defaultMessage="Endorsed" id="dashboard.endorsed" />}
            coin={currency.symbol}
            fontColor="#1C222C"
            bgColor="#fff"
          />
          <OverdraftStrip />
        </ColWidget>

        <ColWidget>
          <BalanceSticker
            amount={this.props.balanceRatio}
            text={<IntlMessage defaultMessage="Accepted / Received ratio" id="dashboard.acceptedRatio" />}
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
            text={<IntlMessage defaultMessage="Reward & Discount" id="dashboard.todayDiscount" />}
            fontColor="#1C222C"
            bgColor="#fff"
          />
        </ColWidget>

        <ColWidget onClick={this.onPercentageClick}>
          <BalanceSticker
            amount={this.props.todayReward}
            percentage={true}
            text={<IntlMessage defaultMessage="Today reward %" id="dashboard.todayReward" />}
            fontColor="#1C222C"
            bgColor="#fff"
          />
        </ColWidget>

        <ColWidget>
          <RatingSticker rating={this.props.rating} full={0} stars={0} text={0} icon="user" fontColor="#1C222C" bgColor="#fff" />
        </ColWidget>
      </Row>
    );
  }

  render() {
    return (
      <BasicPage title={<IntlMessage id="dashboard.dashboard" defaultMessage="Dashboard" />} loading={!this.props.isReady}>
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
  warnings: warnings(state)
});

const dispatchToProps = dispatch => ({
  fetchProfile: bindActionCreators(actions.fetchProfile, dispatch),
  fetchConfiguration: bindActionCreators(actions.fetchConfiguration, dispatch),
  goTo: url => dispatch(push(url))
});

export default connect(
  mapStateToProps,
  dispatchToProps
)(Dashboard);
