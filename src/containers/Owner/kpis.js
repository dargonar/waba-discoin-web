import React, { Component } from "react";
import LayoutContentWrapper from "../../components/utility/layoutWrapper";
import { Row, Col } from "antd";
import basicStyle from "../../config/basicStyle";

import { connect } from "react-redux";
import BalanceSticker from "../../components/balance-sticker/balance-sticker";
import ReportsWidget from "../../components/report/report-widget";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import PageLoading from "../../components/pageLoading";
import PageHeader from "../../components/utility/pageHeader";
import IntlMessages from "../../components/utility/intlMessages";

import actions from "../../redux/owner/actions";
import { bindActionCreators } from "redux";
import { currency } from "../../config";

class SimpleLineChart extends Component {
  render() {
    return (
      <ResponsiveContainer width="100%" height={165}>
        <LineChart data={this.props.deltas}>
          <XAxis dataKey="name" />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Line type="monotone" dataKey="Amount" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}

class SimpleBarChart extends Component {
  render() {
    return (
      <ResponsiveContainer width="100%" height={165}>
        <BarChart data={this.props.data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={"name"} />
          <Tooltip />
          <Bar
            fill={this.props.color || "#ccc"}
            dataKey={"amount"}
            label={{ position: "top" }}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

class SimplePieChart extends Component {
  render() {
    return (
      <ResponsiveContainer width="100%" height={165}>
        <PieChart>
          <Pie
            data={this.props.data}
            labelLine={true}
            outerRadius={60}
            fill="#8884d8"
            dataKey={"value"}
          >
            {this.props.data.map((entry, index) => (
              <Cell fill={entry.color} key={index} />
            ))}
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
    const aidropIssuing = {
      fontSize: "25px"
    };

    const getDeltas = values =>
      values.map(data => ({
        name:
          new Date(data.timestamp).getMonth() +
          1 +
          "/" +
          new Date(data.timestamp).getDate(),
        Amount: Number(data.amount || data.quantity || 0)
      }));

    const getBusinessTotal = values => values.ok + values.yellow + values.red;

    const getPieData = values => [
      { name: "Red", value: values.red || 0, color: "#FF8042" },
      { name: "Green", value: values.ok || 0, color: "#00C49F" },
      { name: "Yellow", value: values.yellow || 0, color: "#FFBB28" }
    ];

    const getBarData = values =>
      values.map(data => ({
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
      const json = this.props.kpis;
      return (
        <div style={{ width: "100%" }}>
          <Row style={rowStyle} gutter={16} justify="start">
            <Col md={7} sm={24} xs={24} style={colStyle}>
              <BalanceSticker
                text={
                  <IntlMessages
                    defaultMessage="Admin balance"
                    id={"kpis.adminBalance"}
                  />
                }
                coin={currency.symbol}
                bgColor="#fff"
                amount={json.balances.balance}
                subtext={
                  <IntlMessages
                    defaultMessage="Reserved founds"
                    id={"kpis.reservedFounds"}
                  />
                }
              />
            </Col>
            <Col md={10} sm={24} xs={24} style={colStyle} />
            <Col md={7} sm={24} xs={24} style={colStyle} />
          </Row>

          <Row style={rowStyle} gutter={16} justify="start">
            <Col md={7} sm={24} xs={24} style={colStyle}>
              <BalanceSticker
                text={
                  <IntlMessages
                    defaultMessage="Quantity of Dicoins in circulation"
                    id={"kpis.circulation"}
                  />
                }
                coin={currency.symbol}
                bgColor="#fff"
                amount={json.main_asset.supply}
                subtext={
                  <IntlMessages
                    id={"kpis.maxSupply"}
                    values={{
                      symbol: currency.symbol,
                      amount: json.main_asset.max_supply
                    }}
                    defaultMessage="Max suppply: {symbol}{amount}"
                  />
                }
              />
            </Col>
            <Col md={10} sm={24} xs={24} style={colStyle}>
              <ReportsWidget
                label={
                  <IntlMessages
                    defaultMessage="Daily Issuing"
                    id={"kpis.dailyIssuing"}
                  />
                }
              >
                <SimpleLineChart
                  deltas={getDeltas(json.businesses.transactions.daily)}
                />
              </ReportsWidget>
            </Col>
            <Col md={7} sm={24} xs={24} style={colStyle}>
              <ReportsWidget
                label={
                  <IntlMessages
                    defaultMessage="Airdrop Issuing"
                    id={"kpis.airdrop"}
                  />
                }
              >
                <p>
                  <span style={aidropIssuing}>
                    <span style={{ color: "#999" }}>{currency.symbol}</span>{" "}
                    {Number(json.airdrop.total_issued).toLocaleString()} <br />
                  </span>
                  <span style={{ color: "#999" }}>
                    {" "}
                    <IntlMessages
                      values={{
                        currency: currency.plural
                      }}
                      defaultMessage="{currency} airdroped"
                      id={"kpis.airdroped"}
                    />
                  </span>
                </p>
                <span style={aidropIssuing}>
                  <IntlMessages
                    values={{
                      amount: Number(json.airdrop.by_referrals).toLocaleString()
                    }}
                    defaultMessage="{amount} por Referidos"
                    id={"kpis.amountRefered"}
                  />
                </span>
                <span style={aidropIssuing}>
                  <IntlMessages
                    values={{
                      amount: Number(
                        json.airdrop.by_reimbursment
                      ).toLocaleString()
                    }}
                    defaultMessage="{amount} por Reembolso"
                    id={"kpis.amountRefund"}
                  />
                </span>
                <span style={aidropIssuing}>
                  <IntlMessages
                    values={{
                      amount: Number(
                        json.airdrop.by_transactions
                      ).toLocaleString()
                    }}
                    defaultMessage="{amount} por Billeteras con TX"
                    id={"kpis.amountWalletTx"}
                  />
                </span>
              </ReportsWidget>
            </Col>
          </Row>

          <Row style={rowStyle} gutter={16} justify="start">
            <Col md={7} sm={24} xs={24} style={colStyle}>
              <BalanceSticker
                text={
                  <IntlMessages
                    defaultMessage="Number of businesses in the network"
                    id={"kpis.amountBusinesses"}
                  />
                }
                bgColor="#fff"
                amount={getBusinessTotal(json.businesses.quantity.by_status)}
              />
            </Col>
            <Col md={8} sm={24} xs={24} style={colStyle}>
              <ReportsWidget
                label={
                  <IntlMessages
                    defaultMessage="Businesses balance status"
                    id={"kpis.businessesBalance"}
                  />
                }
              >
                <SimplePieChart
                  data={getPieData(json.businesses.quantity.by_status)}
                />
              </ReportsWidget>
            </Col>
            <Col md={9} sm={24} xs={24} style={colStyle}>
              <ReportsWidget
                label={
                  <IntlMessages
                    defaultMessage="Businesses by CI"
                    id={"kpis.businessesCi"}
                  />
                }
              >
                <SimpleBarChart
                  data={getBarData(json.businesses.quantity.by_initial_credit)}
                  color={"#42A5F8"}
                />
              </ReportsWidget>
            </Col>
          </Row>

          <Row style={rowStyle} gutter={16} justify="start">
            <Col md={7} sm={24} xs={24} style={colStyle}>
              <BalanceSticker
                text={
                  <IntlMessages
                    defaultMessage="Number of transactions"
                    id={"kpis.numberTransactions"}
                  />
                }
                bgColor="#fff"
                amount={json.businesses.transactions.total_quantity}
              />
            </Col>
            <Col md={17} sm={24} xs={24}>
              <Row style={rowStyle} gutter={8}>
                <Col md={8} sm={24} xs={24}>
                  <ReportsWidget
                    label={
                      <IntlMessages
                        defaultMessage="Daily transactions"
                        id={"kpis.dailyTransactions"}
                      />
                    }
                    details={
                      <IntlMessages
                        defaultMessage="Last 30 days"
                        id={"kpis.last30Days"}
                      />
                    }
                  >
                    <SimpleLineChart
                      deltas={getDeltas(json.businesses.transactions.daily)}
                    />
                  </ReportsWidget>
                </Col>
                <Col md={8} sm={24} xs={24}>
                  <ReportsWidget
                    label={
                      <IntlMessages
                        defaultMessage="New Users"
                        id={"kpis.newUsers"}
                      />
                    }
                    details={
                      <IntlMessages
                        defaultMessage="Last 30 days"
                        id={"kpis.last30Days"}
                      />
                    }
                  >
                    <SimpleLineChart
                      deltas={getDeltas(json.businesses.users.new_users)}
                    />
                  </ReportsWidget>
                </Col>
                <Col md={8} sm={24} xs={24}>
                  <ReportsWidget
                    label={
                      <IntlMessages
                        defaultMessage="New Businesses"
                        id={"kpis.newBusinesses"}
                      />
                    }
                    details={
                      <IntlMessages
                        defaultMessage="Last 30 days"
                        id={"kpis.last30Days"}
                      />
                    }
                  >
                    <SimpleLineChart
                      deltas={getDeltas(
                        json.businesses.quantity.new_businesses
                      )}
                    />
                  </ReportsWidget>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      );
    };

    return (
      <LayoutContentWrapper>
        <PageHeader>
          <IntlMessages id="sidebar.kpis" />
        </PageHeader>
        {this.props.loading ? <PageLoading /> : renderKpis()}
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = state => ({
  kpis: state.Owner.kpis,
  loading: state.Owner.kpis ? false : true
});

const mapDispatchToProps = dispatch => ({
  fetch: bindActionCreators(actions.fetchKpis, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscountsAndRewards);
