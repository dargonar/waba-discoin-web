import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import PageHeader from '../../components/utility/pageHeader';
import PageLoading from '../../components/pageLoading';
import { Row, Col } from 'antd';
import basicStyle from '../../config/basicStyle';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../redux/api/actions';
import MessageBox from '../../components/MessageBox';

class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    if (this.props.api.customers === null) {
      this.props.getCustomers();
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

    if (this.props.api.customers !== null) {
      return (
      <div>
        <Row style={rowStyle} gutter={16} justify="start">
        </Row>
      </div>
      );
    } else {
      return false;
    }
  }

  render() {
    return (
      <LayoutContentWrapper>
        <MessageBox
          clean={this.props.cleanMsg}
          msg={this.props.api.msg}
          error={this.props.api.error !== false} /> 
        <PageHeader>
          Customers
        </PageHeader>
        { (
            this.props.api.loading !== false &&
            this.props.api.customers === null
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
})

export default connect(mapStateToProps, mapDispatchToProps)(Customers);
