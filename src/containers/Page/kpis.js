import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { Row, Col } from 'antd';
import basicStyle from '../../config/basicStyle';

import { connect } from 'react-redux';
import BalanceSticker from '../../components/balance-sticker/balance-sticker'
import SingleProgressWidget from '../../components/progress/progress-single';
import ReportsWidget from '../../components/report/report-widget';
import {BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import PageLoading from '../../components/pageLoading'
import PageHeader from '../../components/utility/pageHeader';
import IntlMessages from '../../components/utility/intlMessages';

import actions from '../../redux/kpis/actions';
import { bindActionCreators } from 'redux'

class SimpleLineChart extends Component {
	render () {
  	return (
      <ResponsiveContainer width="100%" height={165}>
        <LineChart data={this.props.deltas}>
          <XAxis dataKey="name"/>
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
          <Tooltip/>
              <Bar fill={this.props.color || '#ccc'} dataKey={'amount'} label={{ position: 'top' }} />
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
            labelLine={true}
            outerRadius={60}
            fill="#8884d8"
            dataKey={'value'}
          >
            {
              this.props.data.map((entry, index) => <Cell fill={entry.color} key={index}/>)
            }
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}

class DiscountsAndRewards extends Component {
  componentDidMount() {
    this.props.fetch();
  }

  render() {
    const { rowStyle, colStyle } = basicStyle;
    const json = this.props.kpis.data;
    const aidropIssuing = {
      fontSize: '25px'
    }

    const getDeltas = (values) => values.map(data => ({
      name: new Date(data.timestamp).getMonth()+1 + '/' + new Date(data.timestamp).getDate(),
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

    // amount={json.main_asset[0].options.max_supply}
    /*
      <SingleProgressWidget
                    label={"Goal " + Number(json.airdrop.max_tx_quantity).toLocaleString() + " TX"}
                    percent={(json.airdrop.tx_quantity * 100 / json.airdrop.max_tx_quantity)}
                    barHeight={7}
                    status="active"
                    info={false} // Boolean: true, false
                  />
    */
    const renderKpis = () => {
      return (
        <div style={{width: '100%'}}>
          <Row style={rowStyle} gutter={16} justify="start">
              <Col md={7} sm={24} xs={24} style={colStyle}>
                <BalanceSticker
                  text="Quantity of Dicoins in circulation"
                  coin="DSC"
                  bgColor="#fff"
                  amount={json.main_asset.supply}
                  subtext={'Max suppply: DSC ' + json.main_asset.max_supply} />
              </Col>
              <Col md={10} sm={24} xs={24} style={colStyle}>
                <ReportsWidget label={"Daily Issuing"}>
                  <SimpleLineChart deltas={getDeltas(json.businesses.transactions.daily)}/>
                </ReportsWidget>
              </Col>
              <Col md={7} sm={24} xs={24} style={colStyle}>
                <ReportsWidget label="Airdrop Issuing">
                  <p>
                    <span style={aidropIssuing}><span style={{color: "#999"}}>DSC</span> {Number(json.airdrop.total_issued).toLocaleString()} <br/></span>
                    <span style={{color: "#999"}}> Dicoins airdroped</span>
                  </p>
                  <span style={aidropIssuing}>{Number(json.airdrop.by_referrals).toLocaleString()} por Referidos</span>
                  <span style={aidropIssuing}>{Number(json.airdrop.by_reimbursment).toLocaleString()} por Reembolso</span>
                  <span style={aidropIssuing}>{Number(json.airdrop.by_transactions).toLocaleString()} por Billeteras con TX</span>
                
              </ReportsWidget>
              </Col>
          </Row>


          <Row style={rowStyle} gutter={16} justify="start">
              <Col md={7} sm={24} xs={24} style={colStyle}>
                <BalanceSticker
                  text="Number of businesses in the network"
                  bgColor="#fff"
                  amount={getBusinessTotal(json.businesses.quantity.by_status)} />
              </Col>
              <Col md={8} sm={24} xs={24} style={colStyle}>
                <ReportsWidget label={"Businesses balance status"}>
                  <SimplePieChart data={getPieData(json.businesses.quantity.by_status)}/>
                </ReportsWidget>
              </Col>
              <Col md={9} sm={24} xs={24} style={colStyle}>
                <ReportsWidget label="Businesses by CI">
                  <SimpleBarChart data={getBarData(json.businesses.quantity.by_initial_credit)} color={'#42A5F8'} />
                </ReportsWidget>
              </Col>
          </Row>


          <Row style={rowStyle} gutter={16} justify="start">
              <Col md={7} sm={24} xs={24} style={colStyle}>
                <BalanceSticker
                  text="Number of transactions"
                  bgColor="#fff"
                  amount={json.businesses.transactions.total_quantity} />
              </Col>
              <Col md={17} sm={24} xs={24}>
              <Row style={rowStyle} gutter={8}>
                <Col md={8} sm={24} xs={24}>
                  <ReportsWidget label="Daily transactions" details={'Last 30 days'}>
                    <SimpleLineChart deltas={getDeltas(json.businesses.transactions.daily)}/>
                  </ReportsWidget>
                </Col>
                <Col md={8} sm={24} xs={24}>
                  <ReportsWidget label="New Users" details={'Last 30 days'}>
                    <SimpleLineChart deltas={getDeltas(json.businesses.users.new_users)}/>
                  </ReportsWidget>
                </Col>
                <Col md={8} sm={24} xs={24}>
                  <ReportsWidget label="New Businesses" details={'Last 30 days'}>
                    <SimpleLineChart deltas={getDeltas(json.businesses.quantity.new_businesses)}/>
                  </ReportsWidget>
                </Col>
                </Row>  
              </Col>
          </Row>
        </div>
      );
    }

    return (
      <LayoutContentWrapper>
        <PageHeader>
          <IntlMessages id="sidebar.kpis" />
        </PageHeader>
        { (this.props.kpis.loading)? <PageLoading /> : renderKpis() }
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  kpis : state.Kpis
});

const mapDispatchToProps = (dispatch) => ({
  fetch: bindActionCreators(actions.fetchKpis, dispatch)
})


export default connect(mapStateToProps, mapDispatchToProps)(DiscountsAndRewards)