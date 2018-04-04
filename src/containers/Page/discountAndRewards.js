import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { Row, Col } from 'antd';
import basicStyle from '../../config/basicStyle';
import Box from '../../components/utility/box';
import ContentHolder from '../../components/utility/contentHolder';
import Input from '../../components/uielements/input';

import { compose, graphql } from 'react-apollo';
import getCurrentGame from '../../apollo/getCurrentGame';

class DiscountsAndRewards extends Component {
  render() {
    const { rowStyle, colStyle } = basicStyle;
    const discounts = [
      {
        label: 'Monday',
        value: 30,
        avg: 28.6
      },{
        label: 'Tuesday',
        value: 30,
        avg: 28.6
      },{
        label: 'Wednesday',
        value: 30,
        avg: 28.6
      },{
        label: 'Thursday',
        value: 30,
        avg: 28.6
      },{
        label: 'Friday',
        value: 30,
        avg: 28.6
      },{
        label: 'Saturday',
        value: 30,
        avg: 28.6
      },{
        label: 'Sunday',
        value: 30,
        avg: 28.6
      }
    ]
    
    const inputStyle = {
      fontSize:'24px'
    }
    const avgStyle = {
      display: 'block',
      paddingTop: '15px'
    }
    return (
      <LayoutContentWrapper>
        <Row style={rowStyle} gutter={16} justify="start">
          {discounts.map(data =>
            (<Col md={6} sm={12} xs={24} style={colStyle}>
              <Box title={data.label} >
              <ContentHolder>
                <Input value={data.value} style={inputStyle}/>
                <span style={avgStyle}>Avg. {Number(data.avg).toLocaleString()} %</span>
              </ContentHolder>
            </Box>
            </Col>)
          )}
        </Row>
      </LayoutContentWrapper>
    );
  }
}

export default compose(
  graphql(getCurrentGame, {
    props: ({data: { currentGame } }) => ({
      currentGame
    })
  })
)(DiscountsAndRewards)