import React, { Component } from 'react';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import LayoutContent from '../components/utility/layoutContent';
import IsoWidgetsWrapper from '../components/utility/widgets-wrapper';
import { Row, Col } from 'antd';
import basicStyle from '../config/basicStyle';

import BalanceSticker from '../components/balance-sticker/balance-sticker'
import RatingSticker from '../components/rating-sticker/rating-sticker'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../redux/api/actions';

export class Dashboard extends Component {
  componentWillMount() {
    this.props.fetchProfile();
  }

  render() {
    const { rowStyle, colStyle } = basicStyle;
    const state = {
      balance: {
        coin: 'DSC',
        amount: 53155
      },
      initialCredit: {
        coin: 'DSC',
        amount: 90000
      },
      aceptedReceived: {
        amount: 59.5
      },
      refund: {
        amount: 30,
        category: 24
      },
      rating: {
        stars: 3,
        total: 5,
        users: 14
      }
    };

    return (
      <LayoutContentWrapper>
        <Row style={rowStyle} gutter={0} justify="start">
          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <BalanceSticker
                amount={state.balance.amount}
                text="Discoin Balance"
                coin={state.balance.coin}
                fontColor="#1C222C"
                bgColor="#fff"/>
            </IsoWidgetsWrapper>
          </Col>

          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <BalanceSticker
                amount={state.initialCredit.amount}
                text="Initial Credit"
                coin={state.initialCredit.coin}
                fontColor="#1C222C"
                bgColor="#fff"/>
            </IsoWidgetsWrapper>
          </Col>

          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <BalanceSticker
                amount={state.aceptedReceived.amount}
                text="Accepted / Received ratio"
                scale={[
                  {value:10, color:"red"},
                  {value:50, color:"yellow"},
                    {value:100, color:"green"}
                  ]}
                  percentage={true}
                  fontColor="#1C222C"
                  bgColor="#fff"/>
            </IsoWidgetsWrapper>
          </Col>

          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <BalanceSticker
                amount={state.refund.amount}
                percentage={true}
                text="Reward & Refund"
                subtext={state.refund.category + "% @ category"}
                fontColor="#1C222C"
                bgColor="#fff"/>
            </IsoWidgetsWrapper>
          </Col>

          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <RatingSticker
                full={state.rating.total}
                stars={state.rating.stars}
                text={state.rating.users}
                icon="user"
                fontColor="#1C222C"
                bgColor="#fff"/>
            </IsoWidgetsWrapper>
          </Col>
        </Row>
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.Api
})

const dispatchToProps = (dispatch) => ({
  cleanMsg: bindActionCreators(actions.cleanMsg, dispatch),
  fetchProfile: bindActionCreators(actions.fetchProfile, dispatch),
})

export default connect(mapStateToProps, dispatchToProps)(Dashboard)