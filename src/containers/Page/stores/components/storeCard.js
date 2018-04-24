import React, { Component } from 'react';
import { Col, Row, Tooltip } from 'antd';
import StoreCardWrapper from '../store.style'
import BalanceSticker from '../../../../components/balance-sticker/balance-sticker';
import Button from '../../../../components/uielements/button';

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
          <Col md={5} sm={24} xs={24}>
            <ul>
              <li>{this.props.category.description} > {this.props.subcategory.description}</li>
              <li>Id > {this.props.account_id}</li>
              <li>{ this.shortNumber(this.props.total_refunded)} REFUNDED</li>
              <li>{ this.shortNumber(this.props.total_discounted)} DISCOUNTED</li>
            </ul>  
          </Col>
          <Col md={4} sm={24} xs={24} style={{marginBottom: '10px'}} >
            <BalanceSticker
              coin={'DSC'}
              amount={this.props.balance} 
              text={'Balance'} 
              bgColor={'#f5f5f5'} />
          </Col>
          <Col md={4} sm={24} xs={24} style={{marginBottom: '10px'}} >
            <BalanceSticker
              coin={'DSC'}
              amount={this.props.balances.initial_credit}
              text={'Initial Credit'} 
              bgColor={'#f5f5f5'} />
          </Col>
          <Col md={4} sm={24} xs={24} style={{marginBottom: '10px'}} >
            <BalanceSticker
              coin={'DSC'}
              amount={this.props.balances.ready_to_access}
              text={'Endorsed'} 
              bgColor={'#f5f5f5'} />
          </Col>
          <Col md={4} sm={24} xs={24} style={{marginBottom: '10px'}}>
            <BalanceSticker
              amount={(this.props.balances.balance * 100 / this.props.balances.initial_credit) || 0}
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
          <Col md={3} sm={24} xs={24} style={{marginBottom: '10px'}}>
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
            <Tooltip title="Change initial credit">
              <Button shape="circle" onClick={() => this.props.overdraft(this.props)}>$</Button>
            </Tooltip>
            <Button shape="circle" onClick={this.props.key} icon="key" />
          </Col>
        </Row>
      </StoreCardWrapper>
    );
  }
}

export default StoreCard;
