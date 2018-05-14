import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import PageHeader from '../../components/utility/pageHeader';
import PageLoading from '../../components/pageLoading';
import { Row, Col } from 'antd';
import basicStyle from '../../config/basicStyle';
import { InputSearch } from '../../components/uielements/input';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../redux/api/actions';
import MessageBox from '../../components/MessageBox';

import CustomersBox from './components/customerBox';

class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderContent = this.renderContent.bind(this);
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
          <Col xs={24} style={{marginBottom: '15px'}}>
            <InputSearch placeholder={'Search customer'} onChange={e => this.props.searchCustomer(e.target.value)} />
          </Col>
          { this.props.customers.map(customer => (
          <Col xs={24} md={12} lg={8} style={{marginBottom: '15px'}} key={customer.name +'-'+customer.account_id}>
            <CustomersBox name={customer.name} account_id={customer.account_id} onProfile={console.log} onTransactions={console.log} />
          </Col>
          ))}
        </Row>
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
          Customers
        </PageHeader>
        {this.renderContent()}
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = (state) =>  ({
  api: state.Api,
  customers: state.Api.customers
})

const mapDispatchToProps = (dispatch) => ({
  searchCustomer: bindActionCreators(actions.searchCustomer, dispatch),
  cleanMsg: bindActionCreators(actions.cleanMsg, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Customers);
