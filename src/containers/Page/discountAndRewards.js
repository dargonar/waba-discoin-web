import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import PageHeader from '../../components/utility/pageHeader';
import PageLoading from '../../components/pageLoading';
import { Row, Col } from 'antd';
import basicStyle from '../../config/basicStyle';
import Box from '../../components/utility/box';
import ContentHolder from '../../components/utility/contentHolder';
import Input from '../../components/uielements/input';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../redux/api/actions';

class DiscountsAndRewards extends Component {
  constructor(props) {
    super(props)
    this.renderContent = this.renderContent.bind(this);
  }

  componentWillMount() {
    if (typeof this.props.api.business === 'null') {
      this.props.fetchProfile();
    }
  }

  renderContent() {
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
      <Row style={rowStyle} gutter={16} justify="start">
        {this.props.api.business.discount_schedule.map((data, key) =>
          (<Col md={6} sm={12} xs={24} style={colStyle} key={key}>
            <Box title={(
              <span style={{textTransform:'capitalize'}}>{data.date}</span>
            )}>
              <ContentHolder>
                <Input type='number' defaultValue={data.discount} style={inputStyle}/>
                {(data.avg)? (<span style={avgStyle}>Avg. {Number(data.avg).toLocaleString()} %</span>): false }
              </ContentHolder>
            </Box>
          </Col>)
        )}
      </Row>
    );
  }

  render() {
    return (
      <LayoutContentWrapper>
        <PageHeader>
          Discounts and Rewards
        </PageHeader>
        { (
            this.props.api.loading !== false &&
            typeof this.props.api.configuration === 'null'
          )? (<PageLoading/>): this.renderContent() }     
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = (state) =>  ({
  api: state.Api
})

const mapDispatchToProps = (dispatch) => ({
  cleanMsg: bindActionCreators(actions.cleanMsg, dispatch),
  fetchProfile: bindActionCreators(actions.fetchProfile, dispatch),
  fetchConfiguration: bindActionCreators(actions.fetchConfiguration, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(DiscountsAndRewards);
