import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import PageHeader from '../../components/utility/pageHeader';
import PageLoading from '../../components/pageLoading';
import { Row, Col, Input } from 'antd';
import basicStyle from '../../config/basicStyle';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../redux/api/actions';
import MessageBox from '../../components/MessageBox';

import CustomersBox from './components/customerBox';
import RefundBox from './components/refundBox';

import { rewardCustomer } from '../../httpService';
import { notification } from 'antd';

const InputSearch = Input.Search;

const { rowStyle, colStyle } = basicStyle;

const inputStyle = {
  fontSize:'24px'
}
const avgStyle = {
  display: 'block',
  paddingTop: '15px'
}

class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue:      null,
      refundBox:        false,
      selectedCustomer: null,
      msg:              '',
      error:            '',
      removeMsg:        false
    };
    this.renderContent = this.renderContent.bind(this);

    this.submitRefundBox = this.submitRefundBox.bind(this);
    this.removeRefundBox = this.removeRefundBox.bind(this);
    this.showRefundBox = this.showRefundBox.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
  }

  getDay(){
    const now = new Date();
    const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    return days[ now.getDay() ];
  }

  openNotificationWithIcon(type, title, msg){
    notification[type]({
      message: title,
      description: msg,
    });
  }

  handleOnRefund(account){
    this.showRefundBox(account);
  }
  handleOnIcon2(){}
  handleOnElement(account){
    this.showRefundBox(account);
  }

  componentWillMount() {
    if (this.props.api.schedule === null) {
      console.log(' -- Refund:componentWillMount() -- ');
      this.props.getSchedule();
    }
  }
  componentDidMount(){
    console.log(' --- Customers::componentDidMount PRE');
    this.props.searchAccount('');
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

     let searchValue = this.state.searchValue;
     console.log(' -- _handleKeyPress:', searchValue)
     if (e.key === 'Enter') {
       if(searchValue === 'undefined' || searchValue==null || searchValue.trim()=='')
       {
         this.openNotificationWithIcon('warning', 'Búsqueda', 'Ingrese al menos un caracter.');
         return;
       }

       if(this.props.isLoading)
       {
         this.openNotificationWithIcon('warning', 'Búsqueda', 'Búsqueda en progreso.');
         return;
       }
       this.props.searchAccount(searchValue);
     }

   }


  submitRefundBox(e) {

    // console.log(' --- refund', JSON.stringify(this.props.account));
    // return;
    // this.props.setOverdraft(this.state.selectedCustomer, value)
    console.log(' === submitRefundBox::', 'account:', JSON.stringify(this.state.selectedCustomer));
    console.log(e);

    let tx = {
      from_id:      this.props.account.account_id,
      to_id:        this.state.selectedCustomer.account_id,
      amount:       e.amount,
      bill_amount:  e.bill_amount,
      bill_id:      e.bill_id
    }

    // console.log(JSON.stringify(tx));
    // return;
    // this.setState({loading:true})

    this.removeRefundBox();
    rewardCustomer(this.props.account.keys.active.wif , tx).then( res => {
        console.log('rewardCustomer', '====OK===>', JSON.stringify(res));
        this.openNotificationWithIcon('success', 'Reintegro exitoso', 'El reintegro fue exitoso. Puede verlo en Transacciones.');
      }, err => {
        console.log('rewardCustomer','====ERR===>', JSON.stringify(err));
        this.openNotificationWithIcon('error', 'Ha ocurrido un error', err);
    });


  }

  removeRefundBox() {
    this.setState({
      refundBox: false,
      selectedCustomer: null
    })
  }

  getTodayRate(){
    const today = this.getDay();
    if (this.props.api.schedule === null) {
      console.log(' -- Refund:componentWillMount() -- ');
      this.props.getSchedule();
      return;
    }
    let discount = this.props.api.schedule.find(function(dis) {
      return dis.date == today;
    });
    return discount.discount;

  }

  renderContent() {
    return (
        <Row style={rowStyle} gutter={16} justify="start">
          { (this.props.customers.length === 0)? (
            <Col style={{textAlign: 'center', padding: '10px'}} xs={24}>
              No customers found.
            </Col>
          ): false }
          { this.props.customers.map(customer => (
          <Col xs={24} md={12} lg={8} style={{marginBottom: '15px'}} key={customer.name +'-'+customer.account_id}>
            <CustomersBox
              name={customer.name}
              account_id={customer.account_id}
              onElement={(e) => this.handleOnElement(e)}
              onIcon1={(e) => this.handleOnRefund(e)}
              onIcon2={(e) => this.handleOnIcon2(e)}
              icon1 = {'rollback'}
              icon2 = {'hidden'} />
          </Col>
          ))}
        </Row>
          );
  }

  /*
  <MessageBox
    clean={this.props.cleanMsg}
    msg={this.props.api.msg}
    error={this.props.api.error !== false} />
  */
  render() {
    return (
      <LayoutContentWrapper>
        <RefundBox
          visible={this.state.refundBox}
          customer={this.state.selectedCustomer}
          cancel = {this.removeRefundBox}
          submit = {this.submitRefundBox}
          percentage={this.getTodayRate()}
        />
        <PageHeader>
          Customers
        </PageHeader>
        <Row style={rowStyle} gutter={16} justify="start">
          <Col xs={24} style={{marginBottom: '15px'}}>
            <InputSearch placeholder={'Search customer'} onKeyPress={this._handleKeyPress} onSearch={()=>this.props.searchAccount(this.state.searchValue)} onChange={this._handleChange}  enterButton/>
          </Col>
        </Row>

        { (this.props.isLoading === true)? (<PageLoading/>): this.renderContent() }
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = (state) =>  ({
  api: state.Api,
  customers: state.Api.customers,
  account: state.Auth,
  isLoading: state.Api.actionLoading,
  error: state.Api.error,
  msg: state.Api.msg
})

const mapDispatchToProps = (dispatch) => ({
  searchAccount: bindActionCreators(actions.searchAccount, dispatch),
  cleanMsg: bindActionCreators(actions.cleanMsg, dispatch),
  getSchedule: bindActionCreators(actions.getSchedule, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Customers);
