import React, { Component } from 'react';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import LayoutContent from '../../../components/utility/layoutContent';
import PageHeader from '../../../components/utility/pageHeader';
import PageLoading from '../../../components/pageLoading';
import { Row, Col, Input, Modal } from 'antd';
import basicStyle from '../../../config/basicStyle';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../../redux/api/actions';
import MessageBox from '../../../components/MessageBox';

import CustomersBox from '../components/customerBox';
import SubAccountBox from '../components/subaccountBox';
import { subaccountAddOrUpdate } from '../../../httpService';

import {  notification } from 'antd';

import appActions from '../../../redux/app/actions';

const InputSearch = Input.Search;

const { rowStyle, colStyle } = basicStyle;

const inputStyle = {
  fontSize:'24px'
}
const avgStyle = {
  display: 'block',
  paddingTop: '15px'
}

class FindAccounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue:      null,
      subaccountBox:    false,
      selectedCustomer: null,
      msg:              '',
      error:            '',
      removeMsg:        false,
      confirm_visible:  false,
      subaccount_auth:  null

    };
    this.renderContent = this.renderContent.bind(this);

    this.submitSubAccountBox = this.submitSubAccountBox.bind(this);
    this.removeSubAccountBox = this.removeSubAccountBox.bind(this);
    this.showSubAccountBox = this.showSubAccountBox.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);

    console.log(' --- FindAccounts - created()');
  }

  openNotificationWithIcon(type, title, msg){
    notification[type]({
      message: title,
      description: msg,
    });
  }

 showConfirmModal = () => {
   this.setState({
     confirm_visible: true
   });
 }

  confirm_handleOk = (e) => {

    this.addSubAccount();

 }
 confirm_handleCancel = (e) => {
   console.log(e);
   this.setState({
     confirm_visible: false,
   });
 }

  handleOnIcon1(account){
    console.log('---findAccount::handleOnProfile')
    console.log(JSON.stringify(account));
    this.showSubAccountBox(account);

    // this.showProfileBox(account);
  }
  handleOnIcon2(){
    console.log('---findAccount::handleOnTransactions')
  }

  handleOnElement(account){
    console.log('---findAccount::handleOnElement')
  }

  componentDidMount(){
    console.log(' --- FindAccounts::componentDidMount PRE');
    this.props.searchAccount('');
    console.log(' --- FindAccounts::componentDidMount DONE');
  }

  showSubAccountBox(customer) {
    this.setState({
      selectedCustomer: customer,
      subaccountBox: true
    })
  }

  // showProfileBox(customer){
  //   this.setState({
  //     selectedCustomer: customer,
  //     customerBox: true,
  //     refundBox: false
  //   })
  // }

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

  submitSubAccountBox(e) {
    let x = {
      subaccount_auth: {
        amount:   e.amount,
        from:     e.from,
        to:       e.to
      }
    };
    console.log(' submitSubAccountBox(e)::', JSON.stringify(x));
    this.setState(x)
    this.showConfirmModal();
  }

  addSubAccount(){


    console.log(' -- addSubAccount() #1');
    this.props.showLoading('Autorizando subcuenta. Por favor aguarde.');
    console.log(' -- addSubAccount() #2');
    this.removeSubAccountBox();
    console.log(' -- addSubAccount() #3');
    this.setState({
      confirm_visible: false
    });


    // this.state.subaccount_auth
    // amount
    // from.date_utc
    // to.date_utc

    let _now    = Math.floor(Date.now() / 1000); //new Date().getTime();
    let _from   = this.state.subaccount_auth.from.date_utc; //.date.utc().valueOf();
    let _to     = this.state.subaccount_auth.to.date_utc; //.date.utc().valueOf()
    let period  = 86400;
    let periods = Math.floor((_to - _from)/86400/1000);

    let tx = {
      business_id     : this.props.account.account_id,
      subaccount_id   : this.state.selectedCustomer.account_id,
      limit           : this.state.subaccount_auth.amount,
      from            : _from,
      period          : period, // seconds
      periods         : periods  //
    }

    subaccountAddOrUpdate(this.props.account.keys.active.wif , tx).then( res => {
        console.log('subaccountAddOrUpdate', '====OK===>', JSON.stringify(res));
        this.props.endLoading();
        if(typeof res.error!== 'undefined')
        {
          this.openNotificationWithIcon('error', 'Ha ocurrido un error', res.error);
        }
        else{
          this.openNotificationWithIcon('success', 'Autorizar subcuenta', 'El límite diario de subcuenta fue autorizado satisfactoriamente.');
          this.goBack();
        }

      }, err => {
        console.log('subaccountAddOrUpdate','====ERR===>', JSON.stringify(err));
        this.openNotificationWithIcon('error', 'Ha ocurrido un error', err);
        this.props.endLoading();
    });
  }

  goBack(){
    setTimeout(function() { this.props.history.goBack(); }.bind(this), 1500);
  }

  removeSubAccountBox() {
    this.setState({
      subaccountBox: false
    })
  }

  renderContent() {
    return (
        <Row style={rowStyle} gutter={16} justify="start">
          { (this.props.customers.length === 0)? (
            <Col style={{textAlign: 'center', padding: '10px'}} xs={24}>
              No se encontraron usuarios con su búsqueda.
            </Col>
          ): false }
          { this.props.customers.map(customer => (
          <Col xs={24} md={12} lg={8} style={{marginBottom: '15px'}} key={customer.name +'-'+customer.account_id}>
            <CustomersBox
              name={customer.name}
              account_id={customer.account_id}
              onElement={(e) => this.handleOnElement(e)}
              onIcon1={(e) => this.handleOnIcon1(e)}
              onIcon2={(e) => this.handleOnIcon2(e)}
              icon1 = {'pay-circle-o'}
              icon2 = {'hidden'} />
          </Col>
          ))}
        </Row>
          );
  }

/// onSearch={()=>this.props.searchAccount(this.state.searchValue)}
  render() {
    return (
      <LayoutContentWrapper>
        <SubAccountBox
          visible={this.state.subaccountBox}
          customer={this.state.selectedCustomer}
          cancel = {this.removeSubAccountBox}
          submit = {this.submitSubAccountBox}
        />

        { (this.state.confirm_visible && this.state.subaccount_auth!=null)? (
        <Modal
          title="Confirmar autorización de subcuenta"
          visible={this.state.confirm_visible}
          onOk={this.confirm_handleOk}
          onCancel={this.confirm_handleCancel}
        >
         <p>Va a autorizar a {this.state.selectedCustomer.name} a retirar diariamente {this.state.subaccount_auth.amount} desde el {this.state.subaccount_auth.from.dateString} hasta {this.state.subaccount_auth.to.dateString}</p>
       </Modal> ) : false }
        <PageHeader>
          Agregar subcuenta
        </PageHeader>
        <Row style={rowStyle} gutter={16} justify="start">
          <Col xs={24} style={{marginBottom: '15px'}}>
            <InputSearch placeholder={'Buscar usuarios'} onChange={this._handleChange} onSearch={()=>this.props.searchAccount(this.state.searchValue)} onKeyPress={this._handleKeyPress}  enterButton/>
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
  showLoading: bindActionCreators(appActions.showLoading, dispatch),
  endLoading: bindActionCreators(appActions.endLoading, dispatch)

})

export default connect(mapStateToProps, mapDispatchToProps)(FindAccounts);
