import React, { Component } from 'react';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import PageHeader from '../../../components/utility/pageHeader';
import IntlMessages from '../../../components/utility/intlMessages';
import { Col, Row, Modal } from 'antd';
import BalanceSticker from '../../../components/balance-sticker/balance-sticker';
import Button from '../../../components/uielements/button';
import Input from '../../../components/uielements/input';

import PageLoading from '../../../components/pageLoading'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../../redux/business/actions';
import StoreCardWrapper from './store.style'


class StoreCardMessageBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rendered: false
    }
    this.close = this.close.bind(this)
  }
  close() {
    this.props.clean();
    this.setState({ rendered: false })
  }
  render() {
    console.log(this.props.error)
    if (typeof this.props.msg === 'string' && this.state.rendered === false) {
      this.setState({rendered: true})
      Modal[(this.props.error === true)? 'error': 'info']({
        title: this.props.msg,
        onOk: this.close,
      })
    }
    return (<div></div>);
  }
}

class StoreCard extends Component {

  shortNumber(number) {
    number = number.toString();
    switch(number.length) {
      case 6: 
        return number.slice(0,3)+'K'
      case 7: 
        return number.slice(0,3)+'M'
      default:
        return number
    }
    
  }

  render() {

    const rowActions = {
      borderTop: '1px solid rgb(201, 205, 212)',
      padding: '10px 0'
    }
    return (
      <StoreCardWrapper>
        <h3>{this.props.description}</h3>
        <Row gutter={12}>
          <Col md={6} sm={24} xs={24}>
            <ul>
              <li>{this.props.category.description} > {this.props.subcategory.description}</li>
              <li>{ this.shortNumber(this.props.total_refunded)} REFUNDED</li>
              <li>{ this.shortNumber(this.props.total_discounted)} DISCOUNTED</li>
            </ul>  
          </Col>
          <Col md={4} sm={24} xs={24} style={{marginBottom: '10px'}} >
            <BalanceSticker
              coin={'DSC'}
              amount={this.props.balance} 
              text={'Discoin balance'} 
              bgColor={'#f5f5f5'} />
          </Col>
          <Col md={4} sm={24} xs={24} style={{marginBottom: '10px'}} >
            <BalanceSticker
              coin={'DSC'}
              amount={this.props.initial_credit}
              text={'Initial Credit'} 
              bgColor={'#f5f5f5'} />
          </Col>
          <Col md={5} sm={24} xs={24} style={{marginBottom: '10px'}}>
            <BalanceSticker
              amount={(this.props.balance * 100 / this.props.initial_credit) || 0}
              text="Accepted / Received ratio"
              scale={[
                {value:10, color:"red"},
                {value:50, color:"yellow"},
                {value:100, color:"green"}
              ]}
              percentage={true}
              fontColor="#1C222C"
              bgColor="#f5f5f5"/>
          </Col>
          <Col md={5} sm={24} xs={24} style={{marginBottom: '10px'}}>
            <BalanceSticker
              amount={this.props.discount}
              percentage={true}
              text="Reward & Refund"
              fontColor="#1C222C"
              bgColor="#f5f5f5"/>
          </Col>
        </Row>
        <Row style={rowActions}>
          <Col xs={12}>
            <Button shape="circle" icon="delete" onClick={this.props.delete} />
          </Col>
          <Col xs={12} style={{textAlign:'right'}} className={'rightButtons'}>
            <Button shape="circle" onClick={this.props.info} icon="info" />
            <Button shape="circle" onClick={() => this.props.overdraft(this.props)}>$</Button>
            <Button shape="circle" onClick={this.props.key} icon="key" />
          </Col>
        </Row>
      </StoreCardWrapper>
    );
  }
}

class StoreOverdarfBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    }
    this.submit = this.submit.bind(this)
    this.cancel = this.cancel.bind(this)
  }
  submit() {
    this.props.submit(this.state.value)
    this.setState({ value: null })
  }
  cancel() {
    this.props.cancel()
    this.setState({value : null})
  }
  render() {
    if (this.props.visible === true) {
      if(this.state.value === null) {
        this.setState({value: this.props.business.initial_credit || 0})
      }
      return (
          <Modal
            visible={this.props.business.description}
            title={(<b>Overcraft</b>)} 
            onOk={this.submit}
            onCancel={this.cancel}>
            <label>{this.props.visible}</label>
            <Input
              type="number"
              defaultValue={this.props.business.initial_credit || 0}
              onChange={(e)=> this.setState({value: e.target.value})} /><br/>
          </Modal>
      )
    } else {
      return (false)
    }
  }
}

class ListStores extends Component {

  constructor(props) {
    super(props);
    this.state = {
      overdraftBox: false,
      businessSelected: null
    }
    this.renderStores = this.renderStores.bind(this);
    this.submitOverdraftBox = this.submitOverdraftBox.bind(this);
    this.removeOverdraftBox = this.removeOverdraftBox.bind(this);
    this.showOverdraft = this.showOverdraft.bind(this);

  }

  componentWillMount() {
    this.props.fetch();
  }

  showOverdraft(bussines) {
    this.setState({
      businessSelected: bussines,
      overdraftBox: true
    })
  }

  submitOverdraftBox(value) {
    this.props.setOverdraft(this.state.businessSelected, value)
    this.removeOverdraftBox()
  }

  removeOverdraftBox() {
    this.setState({
      overdraftBox: false,
      businessSelected: null
    })
  }

  renderStores() {
    return (
      <div style={{width:'100%'}}>
        {this.props.business.map(store => (
          <StoreCard
            {...store}
            key={store.id}
            overdraft={this.showOverdraft}
          />
        ))}
      </div>
    );
  }

  render() {
    return (
      <LayoutContentWrapper>
        
        <PageHeader>
          <IntlMessages id="sidebar.stores" />
        </PageHeader>

        <StoreCardMessageBox
          msg={this.props.msg}
          error={this.props.error}
          clean={this.props.removeMsg} />

        <StoreOverdarfBox 
          visible={this.state.overdraftBox}
          business={this.state.businessSelected}
          cancel = {this.removeOverdraftBox}
          submit = {this.submitOverdraftBox}
        />

        { (this.props.loading || this.props.business === null)? <PageLoading />: this.renderStores() }
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  business : state.Business.stores,
  loading : state.Business.loading,
  actionLoading : state.Business.actionLoading,
  error: state.Business.error,
  msg: state.Business.msg
});

const mapDispatchToProps = (dispatch) => ({
  fetch: bindActionCreators(actions.fetchBusinesses, dispatch),
  setOverdraft: bindActionCreators(actions.overdraft, dispatch),
  removeMsg: bindActionCreators(actions.removeMsg, dispatch),
})


export default connect(mapStateToProps, mapDispatchToProps)(ListStores);