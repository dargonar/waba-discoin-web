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
import RefundBox from './components/refundBox'

class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue:      null,
      refundBox:        false,
      selectedCustomer: null
    };
    this.renderContent = this.renderContent.bind(this);

    this.submitRefundBox = this.submitRefundBox.bind(this);
    this.removeRefundBox = this.removeRefundBox.bind(this);
    this.showRefundBox = this.showRefundBox.bind(this);
  }

  handleOnProfile(){}
  handleOnTransactions(){}
  handleOnElement(account){
    console.log(' --> handleOnElement.');
    console.log(account);
    this.showRefundBox(account);
  }

  componentDidMount(){
    console.log(' --- Customers::componentDidMount PRE');
    this.props.searchCustomer();
    console.log(' --- Customers::componentDidMount DONE');
  }

  showRefundBox(customer) {
    this.setState({
      selectedCustomer: customer,
      refundBox: true
    })
  }

  _handleChange(e) {
      this.setState({ searchValue: e.target.value });
   }

  _handleKeyPress(e) {
    
    if (e.key === 'Enter') {
      this.props.searchCustomer(this.state.searchValue);  
    }

    // onChange={e => this.props.searchCustomer(e.target.value)} 
  }

  submitRefundBox(value) {
    // this.props.setOverdraft(this.state.selectedCustomer, value)
    // this.removeRefundBox()

    console.log(' === submitRefundBox::', 'account:', JSON.stringify(this.state.selectedCustomer), value);
  }

  removeRefundBox() {
    this.setState({
      refundBox: false,
      selectedCustomer: null
    })
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
            <InputSearch placeholder={'Search customer'} onKeyPress={this._handleKeyPress} onChange={this._handleChange} />
          </Col>
          { this.props.customers.map(customer => (
          <Col xs={24} md={12} lg={8} style={{marginBottom: '15px'}} key={customer.name +'-'+customer.account_id}>
            <CustomersBox 
              name={customer.name} 
              account_id={customer.account_id} 
              onElement={(e) => this.handleOnElement(e)} 
              onProfile={(e) => this.handleOnProfile(e)} 
              onTransactions={(e) => this.handleOnTransactions(e)} />
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
        <RefundBox 
          visible={this.state.refundBox}
          customer={this.state.selectedCustomer}
          cancel = {this.removeRefundBox}
          submit = {this.submitRefundBox}
        />
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
