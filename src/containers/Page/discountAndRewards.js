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
import Button from '../../components/uielements/button';
import AlertBox from '../../components/MessageBox';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../redux/api/actions';
import MessageBox from '../../components/MessageBox';

class DiscountsAndRewards extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderContent = this.renderContent.bind(this);
    this.updateRefounds = this.updateRefounds.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    if (typeof this.props.api.business === 'null') {
      this.props.fetchProfile();
    }
  }

  updateRefounds(e, key) {
    const value = e.target.value
    let discounts = this.state.discounts || this.props.api.business.discount_schedule;
    if (discounts[key]) { discounts[key] = { ...discounts[key], discount: value } }
    this.setState({ discounts: discounts });
  }

  submit() {
    if (typeof this.state.discounts !== 'undefined') {
      this.props.updateSchedule(this.state.discounts)  
    }
  }

  renderContent() {
    const { rowStyle, colStyle } = basicStyle;
    
    const inputStyle = {
      fontSize:'24px'
    }
    const avgStyle = {
      display: 'block',
      paddingTop: '15px'
    }

    return (
    <div>
      <Row style={rowStyle} gutter={16} justify="start">
        {this.props.api.business.discount_schedule.map((data, key) =>
          (<Col md={6} sm={12} xs={24} style={colStyle} key={key}>
            <Box title={(
              <span style={{textTransform:'capitalize'}}>{data.date}</span>
            )}>
              <ContentHolder>
                <Input type='number' defaultValue={data.discount} style={inputStyle} onChange={(e) => this.updateRefounds(e, key)} />
                {(data.avg)? (<span style={avgStyle}>Avg. {Number(data.avg).toLocaleString()} %</span>): false }
              </ContentHolder>
            </Box>
          </Col>)
        )}
      </Row>
      <Button 
        type="primary"
        style={{marginLeft: 'auto', marginRight: '16px'}}
        onClick={this.submit}
        loading={this.props.api.actionLoading}>
          Apply changes
      </Button>
    </div>
    );
  }

  render() {
    return (
      <LayoutContentWrapper>
        <MessageBox
          clean={this.props.cleanMsg}
          msg={this.props.api.msg}
          error={this.props.api.error !== false} /> 
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
  updateSchedule: bindActionCreators(actions.updateSchedule, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(DiscountsAndRewards);
