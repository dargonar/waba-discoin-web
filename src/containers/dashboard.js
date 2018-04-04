import React, { Component } from 'react';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import LayoutContent from '../components/utility/layoutContent';
import IsoWidgetsWrapper from '../components/utility/widgets-wrapper';
import { Row, Col } from 'antd';
import basicStyle from '../config/basicStyle';

import BalanceSticker from '../components/balance-sticker/balance-sticker'
import RatingSticker from '../components/rating-sticker/rating-sticker'

export default class extends Component {
  render() {
    const { rowStyle, colStyle } = basicStyle;
    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <LayoutContent>
          <Row style={rowStyle} gutter={0} justify="start">
            <Col md={6} sm={12} xs={24} style={colStyle}>
              <IsoWidgetsWrapper>
                <BalanceSticker
                  number="53,155"
                  text="Discoin Balance"
                  coin="DSC"
                  fontColor="#1C222C"
                  bgColor="#f5f5f5"/>
              </IsoWidgetsWrapper>
            </Col>

            <Col md={6} sm={12} xs={24} style={colStyle}>
              <IsoWidgetsWrapper>
                <BalanceSticker
                  number="90,000"
                  text="Initial Credit"
                  coin="DSC"
                  fontColor="#1C222C"
                  bgColor="#f5f5f5"/>
              </IsoWidgetsWrapper>
            </Col>

            <Col md={6} sm={12} xs={24} style={colStyle}>
              <IsoWidgetsWrapper>
                <BalanceSticker
                  number={59.6}
                  text="Accepted / Received ratio"
                  scale={[
                    {value:10, color:"red"},
                    {value:50, color:"yellow"},
                      {value:100, color:"green"}
                    ]}
                    percentage={true}
                    fontColor="#1C222C"
                    bgColor="#f5f5f5"/>
              </IsoWidgetsWrapper>
            </Col>

            <Col md={6} sm={12} xs={24} style={colStyle}>
              <IsoWidgetsWrapper>
                <BalanceSticker
                  number={59.6}
                  percentage={true}
                  text="Reward & Refund"
                  subtext="24% @ category"
                  fontColor="#1C222C"
                    bgColor="#f5f5f5"/>
              </IsoWidgetsWrapper>
            </Col>

            <Col md={6} sm={12} xs={24} style={colStyle}>
              <IsoWidgetsWrapper>
                <RatingSticker
                  full={5}
                  stars={3}
                  text="14"
                  icon="user"
                  fontColor="#1C222C"
                  bgColor="#f5f5f5"/>
              </IsoWidgetsWrapper>
            </Col>

          </Row>
      </LayoutContent>
    </LayoutContentWrapper>
  );
}
}
