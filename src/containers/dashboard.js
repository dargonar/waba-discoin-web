import React, { Component } from 'react';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import LayoutContent from '../components/utility/layoutContent';
import PageHeader from '../components/utility/pageHeader'
import IsoWidgetsWrapper from '../components/utility/widgets-wrapper';
import PageLoading from '../components/pageLoading';
import { Row, Col } from 'antd';
import basicStyle from '../config/basicStyle';

import BalanceSticker from '../components/balance-sticker/balance-sticker'
import RatingSticker from '../components/rating-sticker/rating-sticker'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../redux/api/actions';

export class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.renderContent = this.renderContent.bind(this)
  }

  componentWillMount() {
    this.props.fetchProfile();
    this.props.fetchConfiguration();
  }

  renderContent() {
    const { rowStyle, colStyle } = basicStyle;
    
    const getBalanceWarnings = (warnings) => {
      return Object.keys(warnings).map(key => {
        return { value: warnings[key].amount, color: warnings[key].color }
      })
    }

    if (this.props.api.business !== null && this.props.api.configuration !== null) {
      return (
        <Row style={rowStyle} gutter={0} justify="start">
          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <BalanceSticker
                amount={this.props.api.business.balances.balance}
                text="Discoin Balance"
                coin="DSC"
                fontColor="#1C222C"
                bgColor="#fff"/>
            </IsoWidgetsWrapper>
          </Col>

          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <BalanceSticker
                amount={this.props.api.business.balances.initial_credit}
                text="Initial Credit"
                coin={'DSC'}
                fontColor="#1C222C"
                bgColor="#fff"/>
            </IsoWidgetsWrapper>
          </Col>

          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <BalanceSticker
                amount={this.props.api.business.balances.balance * 100 / this.props.api.business.balances.initial_credit}
                text="Accepted / Received ratio"
                scale={getBalanceWarnings(this.props.api.configuration.warnings)}
                percentage={true}
                fontColor="#1C222C"
                bgColor="#fff"/>
            </IsoWidgetsWrapper>
          </Col>

          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <BalanceSticker
                amount={this.props.api.business.discount}
                percentage={true}
                text="Reward & Refund"
                fontColor="#1C222C"
                bgColor="#fff"/>
            </IsoWidgetsWrapper>
          </Col>

          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <RatingSticker
                full={0}
                stars={0}
                text={0}
                icon="user"
                fontColor="#1C222C"
                bgColor="#fff"/>
            </IsoWidgetsWrapper>
          </Col>
        </Row>
      )
    } else {
      return false;
    }
  }

  render() {
    return (
      <LayoutContentWrapper>
        <PageHeader>
          Dashboard
        </PageHeader>
        { (
            this.props.api.loading !== false &&
            typeof this.props.api.configuration === 'null'
          )? (<PageLoading/>): this.renderContent() }     
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  api: state.Api
})

const dispatchToProps = (dispatch) => ({
  cleanMsg: bindActionCreators(actions.cleanMsg, dispatch),
  fetchProfile: bindActionCreators(actions.fetchProfile, dispatch),
  fetchConfiguration: bindActionCreators(actions.fetchConfiguration, dispatch),
})

export default connect(mapStateToProps, dispatchToProps)(Dashboard)