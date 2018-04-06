import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import IsoWidgetsWrapper from '../../components/utility/widgets-wrapper';
import { Row, Col } from 'antd';
import basicStyle from '../../config/basicStyle';
import Box from '../../components/utility/box';
import ContentHolder from '../../components/utility/contentHolder';
import Input from '../../components/uielements/input';

import { compose, graphql } from 'react-apollo';
import getCurrentGame from '../../apollo/getCurrentGame';

import BalanceSticker from '../../components/balance-sticker/balance-sticker'
import SingleProgressWidget from '../../components/progress/progress-single';
import ReportsWidget from '../../components/report/report-widget';
import {BarChart, Bar, PieChart, Legend, Pie, Sector, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

class SimpleLineChart extends Component {
	render () {
  	return (
      <ResponsiveContainer width="100%" height={165}>
        <LineChart data={this.props.deltas}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Line type="monotone" dataKey="Amount" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
};

class SimpleBarChart extends Component {
	render () {
  	return (
      <ResponsiveContainer width="100%" height={165}>
        <BarChart data={this.props.data}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey={"name"}/>
          <YAxis yAxisId="left" orientation="left"/>
          <YAxis yAxisId="right" orientation="right"/>
          <Tooltip/>
              <Bar yAxisId="left" fill={this.props.color || '#ccc'} dataKey={'amount'} label={{ position: 'top' }} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
};



class SimplePieChart extends Component {
	render () {
  	return (
      <ResponsiveContainer width="100%" height={165}>
        <PieChart>
          <Pie
            data={this.props.data} 
            label={'name'}
            labelLine={true}
            outerRadius={60} 
            fill="#8884d8"
          >
            {
              this.props.data.map((entry, index) => <Cell fill={entry.color}/>)
            }
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}

class DiscountsAndRewards extends Component {

  render() {
    const { rowStyle, colStyle } = basicStyle;
    const json = {
      "updated_at": "2017-01-16T23:12:18",
      "main_asset": {
        "id": "1.3.1236",
        "symbol": "MONEDAPAR",
        "precision": 2,
        "issuer": "1.2.150830",
        "options": {
          "max_supply": "10000000000",
          "issued": "25000",
          "market_fee_percent": 0,
          "max_market_fee": 0,
          "issuer_permissions": 79,
          "flags": 4,
          "core_exchange_rate": {
            "base": {
              "amount": 130625,
              "asset_id": "1.3.0"
            },
            "quote": {
              "amount": 50,
              "asset_id": "1.3.1236"
            }
          },
          "whitelist_authorities": [],
          "blacklist_authorities": [],
          "whitelist_markets": [],
          "blacklist_markets": [],
          "description": {
            "main" : "Moneda PAR",
            "short_name":"Moneda PAR",
            "market":""
          },
          "extensions": []
        },
        "dynamic_asset_data_id": "2.3.1236",
        "daily_issuing": [{
          "timestamp": "2017-01-16T23:12:18",
          "amount": "999.6"
        },
        {
          "timestamp": "2017-01-17T23:12:18",
          "amount": "999.6"
        },
        {
          "timestamp": "2017-01-18T23:12:18",
          "amount": "1050.6"
        }
      ],
      "airdrop": {
        "issued": "9999.69",
        "max_supply": "99999999",
        "tx_quantity": "1526",
        "max_tx_quantity": "100000"
      },
      "businesses": {
          "quantity": {
            "by_status": {
              "ok": 582,
              "yellow": 452,
              "red": 556,
              "out": 10
            },
            "by_initial_credit": [
              {
                "initial_credit": 10000,
                "quantity": 15
              },
              {
                "initial_credit": 15000,
                "quantity": 50
              },
              {
                "initial_credit": 20000,
                "quantity": 36
              }
            ],
            "new_businesses": [
              {
                "quantity": "15000",
                "timestamp": "2017-01-17T00:00:01"
              },
              {
                "quantity": "15001",
                "timestamp": "2017-01-18T00:00:01"
              },
              {
                "quantity": "15002",
                "timestamp": "2017-01-19T00:00:01"
              },
            ]
          },
          "transactions": {
            "total_quantity": "15230000",
            "daily": [{
                "quantity": "15000",
                "timestamp": "2017-01-17T00:00:01"
              },
              {
                "quantity": "15001",
                "timestamp": "2017-01-18T00:00:01"
              },
              {
                "quantity": "15002",
                "timestamp": "2017-01-19T00:00:01"
              },
            ]
          },
          "users": {
            "total_quantity": 50000,
            "new_users": [{
                "quantity": "15000",
                "timestamp": "2017-01-17T00:00:01"
              },
              {
                "quantity": "15001",
                "timestamp": "2017-01-18T00:00:01"
              },
              {
                "quantity": "15002",
                "timestamp": "2017-01-19T00:00:01"
              },
            ]
          }
        }
      }
    };

    const inputStyle = {
      fontSize:'24px'
    }
    const avgStyle = {
      display: 'block',
      paddingTop: '15px'
    }

    const aidropIssuing = {
      fontSize: '25px'
    }

    const getDeltas = (values) => values.map(data => ({
      name: new Date(data.timestamp).toDateString(),
      Amount: Number(data.amount || data.quantity || 0)
    }));

    const getBusinessTotal = (values) => 
      values.ok + values.yellow + values.red;

    const getPieData = (values) => ([
      {name: 'Red', value: values.red || 0, color: '#FF8042' },
      {name: 'Green', value: values.ok || 0, color: '#00C49F' },
      {name: 'Yellow', value: values.yellow || 0, color: '#FFBB28' },
    ])

    const getBarData = (values) => values.map(data => ({
      name: data.initial_credit,
      amount: data.quantity
    }));

    return (
      <LayoutContentWrapper>
        <Row style={rowStyle} gutter={16} justify="start">
            <Col md={7} sm={24} xs={24} style={colStyle}>
              <BalanceSticker
                text="Quantity of Dicoins in circulation"
                coin="DSC"
                bgColor="#fff"
                amount={json.main_asset.options.max_supply} />
            </Col>
            <Col md={10} sm={24} xs={24} style={colStyle}>
              <ReportsWidget label={"Daily Issuing"}>
                <SimpleLineChart deltas={getDeltas(json.main_asset.daily_issuing)}/>
              </ReportsWidget>
            </Col>
            <Col md={7} sm={24} xs={24} style={colStyle}>
              <ReportsWidget label="Airdrop Issuing">
                <p>
                  <span style={aidropIssuing}><span style={{color: "#999"}}>DSC</span> {Number(json.main_asset.airdrop.issued).toLocaleString()} <br/></span>
                  <span style={{color: "#999"}}> Quantity of Dicoins in airdropped</span>
                </p>
                <p>
                  <span style={aidropIssuing}>{Number(json.main_asset.airdrop.tx_quantity).toLocaleString()} TXs</span>
                  <SingleProgressWidget
                    label={"Goal " + Number(json.main_asset.airdrop.max_tx_quantity).toLocaleString() + " TX"}
                    percent={(json.main_asset.airdrop.tx_quantity * 100 / json.main_asset.airdrop.max_tx_quantity)}
                    barHeight={7}
                    status="active"
                    info={false} // Boolean: true, false
                  />
                </p>
            </ReportsWidget>
            </Col>
        </Row>


        <Row style={rowStyle} gutter={16} justify="start">
            <Col md={7} sm={24} xs={24} style={colStyle}>
              <BalanceSticker
                text="Number of businesses in the network"
                bgColor="#fff"
                amount={getBusinessTotal(json.main_asset.businesses.quantity.by_status)} />
            </Col>
            <Col md={8} sm={24} xs={24} style={colStyle}>
              <ReportsWidget label={"Businesses balance status"}>
                <SimplePieChart data={getPieData(json.main_asset.businesses.quantity.by_status)}/>
              </ReportsWidget>
            </Col>
            <Col md={9} sm={24} xs={24} style={colStyle}>
              <ReportsWidget label="Businesses by CI">
                <SimpleBarChart data={getBarData(json.main_asset.businesses.quantity.by_initial_credit)} color={'#42A5F8'} />
              </ReportsWidget>
            </Col>
        </Row>


        <Row style={rowStyle} gutter={16} justify="start">
            <Col md={7} sm={24} xs={24} style={colStyle}>
              <BalanceSticker
                text="Number of transactions"
                bgColor="#fff"
                amount={json.main_asset.businesses.transactions.total_quantity} />
            </Col>
            <Col md={17} sm={24} xs={24}>
            <Row style={rowStyle} gutter={8}>
              <Col md={8} sm={24} xs={24}>
                <ReportsWidget label="Daily transactions" details={'Last 30 days'}>
                  <SimpleLineChart deltas={getDeltas(json.main_asset.businesses.transactions.daily)}/>
                </ReportsWidget>
              </Col>
              <Col md={8} sm={24} xs={24}>
                <ReportsWidget label="New Users" details={'Last 30 days'}>
                  <SimpleLineChart deltas={getDeltas(json.main_asset.daily_issuing)}/>
                </ReportsWidget>
              </Col>
              <Col md={8} sm={24} xs={24}>
                <ReportsWidget label="New Businesses" details={'Last 30 days'}>
                  <SimpleLineChart deltas={getDeltas(json.main_asset.daily_issuing)}/>
                </ReportsWidget>
              </Col>
              </Row>  
            </Col>
        </Row>

      </LayoutContentWrapper>
    );
  }
}

export default compose(
  graphql(getCurrentGame, {
    props: ({data: { currentGame } }) => ({
      currentGame
    })
  })
)(DiscountsAndRewards)