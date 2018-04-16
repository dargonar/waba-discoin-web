import React, { Component } from 'react';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import PageHeader from '../../../components/utility/pageHeader';
import IntlMessages from '../../../components/utility/intlMessages';
import { Col, Row } from 'antd';
import BalanceSticker from '../../../components/balance-sticker/balance-sticker';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../../redux/business/actions';


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
    const props = {
      "account": "discoin.biz1",
      "account_id": "1.2.21",
      "address": "Calle 22 n75, La Plata",
      "balance": 0,
      "balances": {},
      "category": {
        "description": "Gastronomía",
        "id": 1,
        "name": "Gastronomía",
        "parent_id": null
      },
      "category_id": 1,
      "description": "Cerveceria Antares",
      "discount": 10,
      "discount_schedule": [
        {
          "business_id": 1,
          "date": "monday",
          "discount": 20,
          "id": 1
        },
        {
          "business_id": 1,
          "date": "tuesday",
          "discount": 20,
          "id": 2
        },
        {
          "business_id": 1,
          "date": "wednesday",
          "discount": 20,
          "id": 3
        },
        {
          "business_id": 1,
          "date": "thursday",
          "discount": 20,
          "id": 4
        },
        {
          "business_id": 1,
          "date": "friday",
          "discount": 20,
          "id": 5
        },
        {
          "business_id": 1,
          "date": "saturday",
          "discount": 20,
          "id": 6
        },
        {
          "business_id": 1,
          "date": "sunday",
          "discount": 20,
          "id": 7
        }
      ],
      "id": 1,
      "image": "",
      "initial_credit": 0,
      "latitude": -34.919665,
      "location": "",
      "longitude": -57.960685,
      "name": "Antares",
      "subcategory": {
        "description": "Restaurantes",
        "id": 2,
        "name": "Restaurantes",
        "parent_id": 1
      },
      "subcategory_id": 2,
      "total_discounted": 0,
      "total_refunded": 0
    }
    return (
      <Row>
        <Col md={6} sm={5} xs={24}>
          <h3>{this.props.description}</h3>
          <ul>
            <li>{this.props.category.description} > {this.props.subcategory.description}</li>
            <li>{ this.shortNumber(this.props.total_refunded)} REFUNDED</li>
            <li>{ this.shortNumber(this.props.total_discounted)} DISCOUNTED</li>
          </ul>  
        </Col>
        <Col md={4} sm={5} xs={24}>
          <BalanceSticker 
            coin={'DSC'}
            amount={this.props.balance} 
            text={'Discoin balance'} 
            bgColor={'#ffffff'} />
        </Col>
        <Col md={4} sm={5} xs={24}>
          <BalanceSticker 
            coin={'DSC'}
            amount={this.props.initial_credit}
            text={'Initial Credit'} 
            bgColor={'#ffffff'} />
        </Col>
        <Col md={5} sm={5} xs={24}>
          <BalanceSticker
            amount={(this.props.balance * 100 / this.props.initial_credit)}
            text="Accepted / Received ratio"
            scale={[
              {value:10, color:"red"},
              {value:50, color:"yellow"},
              {value:100, color:"green"}
            ]}
            percentage={true}
            fontColor="#1C222C"
            bgColor="#fff"/>
        </Col>
        <Col md={5} sm={5} xs={24}>
          <BalanceSticker
            amount={this.props.discount}
            percentage={true}
            text="Reward & Refund"
            fontColor="#1C222C"
            bgColor="#fff"/>
        </Col>
      </Row>
    );
  }
}

class ListStores extends Component {

  constructor(props) {
    super(props);
    this.renderStores = this.renderStores.bind(this);
  }

  componentWillMount() {
    this.props.fetch();
  }


  renderLoading() {
    return (<div>Loading...</div>);
  }

  renderStores() {
    return (
      <div style={{width:'100%'}}>
        {this.props.business.map(store => (<StoreCard {...store} />))}
      </div>
    );
  }

  render() {
    return (
      <LayoutContentWrapper>
        <PageHeader>
          <IntlMessages id="sidebar.stores" />
        </PageHeader>
        { (this.props.loading || this.props.business === null)? this.renderLoading(): this.renderStores() }
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  business : state.Business.stores,
  loading : state.Business.loading,
});

const mapDispatchToProps = (dispatch) => ({
  fetch: bindActionCreators(actions.fetchBusinesses, dispatch)
})


export default connect(mapStateToProps, mapDispatchToProps)(ListStores);