import React, { Component } from "react";
import LayoutContentWrapper from "../../components/utility/layoutWrapper";
import PageHeader from "../../components/utility/pageHeader";
import IsoWidgetsWrapper from "../../components/utility/widgets-wrapper";
import PageLoading from "../../components/pageLoading";
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
  hasBalances,
  warnings,
  rating
} from "../../redux/api/selectors/business.selectors";

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.renderContent = this.renderContent.bind(this);
    this.onPercentageClick = this.onPercentageClick.bind(this);
  }

  onPercentageClick() {
    this.props.goTo("/dashboard/business/profile");
  }

  componentWillMount() {
    this.props.fetchProfile();
    this.props.fetchConfiguration();
  }

  renderContent() {
    const { rowStyle, colStyle } = basicStyle;
    return (
      <Row style={rowStyle} gutter={0} justify="start">
        <Col md={6} sm={12} xs={24} style={colStyle}>
          <IsoWidgetsWrapper>
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
          </IsoWidgetsWrapper>
        </Col>

        <Col md={6} sm={12} xs={24} style={colStyle}>
          <IsoWidgetsWrapper>
            <BalanceSticker
              amount={this.props.balances.initial_credit}
              text={<IntlMessage defaultMessage="Initial Credit" id="dashboard.initialCredit" />}
              coin={currency.symbol}
              fontColor="#1C222C"
              bgColor="#fff"
            />
          </IsoWidgetsWrapper>
        </Col>

        <Col md={6} sm={12} xs={24} style={colStyle}>
          <IsoWidgetsWrapper>
            <BalanceSticker
              amount={this.props.balances.ready_to_access}
              text={<IntlMessage defaultMessage="Endorsed" id="dashboard.endorsed" />}
              coin={currency.symbol}
              fontColor="#1C222C"
              bgColor="#fff"
            />
            <OverdraftStrip />
          </IsoWidgetsWrapper>
        </Col>

        <Col md={6} sm={12} xs={24} style={colStyle}>
          <IsoWidgetsWrapper>
            <BalanceSticker
              amount={this.props.balanceRatio}
              text={<IntlMessage defaultMessage="Accepted / Received ratio" id="dashboard.acceptedRatio" />}
              scale={this.props.warnings}
              percentage={true}
              fontColor="#1C222C"
              bgColor="#fff"
            />
          </IsoWidgetsWrapper>
        </Col>

        <Col md={6} sm={12} xs={24} style={colStyle} onClick={this.onPercentageClick}>
          <IsoWidgetsWrapper>
            <BalanceSticker
              amount={this.props.todayDiscount}
              percentage={true}
              text={<IntlMessage defaultMessage="Reward & Discount" id="dashboard.todayDiscount" />}
              fontColor="#1C222C"
              bgColor="#fff"
            />
          </IsoWidgetsWrapper>
        </Col>

        <Col md={6} sm={12} xs={24} style={colStyle} onClick={this.onPercentageClick}>
          <IsoWidgetsWrapper>
            <BalanceSticker
              amount={this.props.todayReward}
              percentage={true}
              text={<IntlMessage defaultMessage="Today reward %" id="dashboard.todayReward" />}
              fontColor="#1C222C"
              bgColor="#fff"
            />
          </IsoWidgetsWrapper>
        </Col>

        <Col md={6} sm={12} xs={24} style={colStyle}>
          <IsoWidgetsWrapper>
            <RatingSticker rating={this.props.rating} full={0} stars={0} text={0} icon="user" fontColor="#1C222C" bgColor="#fff" />
          </IsoWidgetsWrapper>
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <LayoutContentWrapper>
        <PageHeader>
          <IntlMessage id="dashboard.dashboard" defaultMessage="Dashboard" />
        </PageHeader>

        {!this.props.isReady ? <PageLoading /> : this.renderContent()}
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = state => ({
  balanceRatio: balanceRatio(state),
  isReady: isBusiness(state) && isConfiguration(state) && !state.Api.loading,
  todayDiscount: todayDiscount(state),
  todayReward: todayReward(state),
  balances: hasBalances(state) ? state.Api.business.balances : {},
  rating: rating(state),
  warnings: warnings(state)
});

const dispatchToProps = dispatch => ({
  fetchProfile: bindActionCreators(actions.fetchProfile, dispatch),
  fetchConfiguration: bindActionCreators(actions.fetchConfiguration, dispatch),
  getSchedule: bindActionCreators(actions.getSchedule, dispatch),
  cleanMsg: bindActionCreators(actions.cleanMsg, dispatch),
  goTo: url => dispatch(push(url))
});

export default connect(
  mapStateToProps,
  dispatchToProps
)(Dashboard);
