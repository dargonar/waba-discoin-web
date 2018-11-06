import React, { Component } from "react";
import IntlMessages from "../../../components/utility/intlMessages";
import PageLoading from "../../../components/pageLoading";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";
import AccountBox from "./components/accountBox";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../redux/api/actions";

import Transacction from "../transactions/components/transactionBox";
import Sticker from "../../../components/balance-sticker/balance-sticker";
import { AutoComplete, DatePicker } from "antd"; // from "../../../components/uielements/autocomplete";
import moment from "moment";

import Switch from "../../../components/uielements/switch";

import {
  subAccount,
  isCurrentSubAccount,
  subAccountTxs,
  onlyAccountTx,
  txTotals,
  txToday,
  txDiscounts,
  txRefunds,
  txBetween,
  txYesterday,
  txAccounts,
  txTodayTotals,
  txOnlyFrom,
  txOnlyTo
} from "../../../redux/api/selectors/subAccounts.selectors";
import { Row, Col } from "antd";
import { currency } from "../../../config";
import { isMoment } from "moment";

const filters = {
  //arg = "today" (Default) || "yesterday"
  day: arg => txs => (arg === "yesterday" ? txYesterday(txs) : txToday(txs)),

  //arg = {from: Date, until: Date }
  between: arg => txs => txBetween({ from: arg.from, until: arg.until }, txs),

  //arg = "account_id"
  user: ({ account_id, direction }) => txs => {
    switch (direction) {
      case true:
        return txOnlyFrom(account_id, txs);
      case false:
        return txOnlyTo(account_id, txs);
      default:
        return txs.filter(onlyAccountTx(account_id));
    }
  },

  //arg = "discount" (Default) || "refund"
  byType: arg => txs => {
    if (!arg) return txs;
    return arg === "refund" ? txRefunds(txs) : txDiscounts(txs);
  }
};

const applyFilters = (filterList = [], txs = []) =>
  filterList.length > 0
    ? filterList
        .map(item => filters[item.filter](item.arg)) // Init filters
        .reduce((prev, curr) => curr(prev), txs)
    : txs; // Apply filters

const getFilter = (filterList = [], filterName) =>
  filterList.filter(x => x.filter === filterName).reduce((prev, act) => act, { notFound: true });

const Box = props => (
  <div style={{ marginBottom: "15px" }}>
    <Sticker {...props} />
  </div>
);

const TransactionsList = ({ transactions }) => (
  <Col xs={24} md={18}>
    <PageHeader>
      <IntlMessages defaultMessage="Subaccount transactions" id="subaccountsDetails.transactions" />
    </PageHeader>
    {transactions.length > 0 ? (
      transactions.map((tx, key) => <Transacction transaction={tx} key={"tx-" + key} />)
    ) : (
      <p style={{ textAlign: "center" }}>Esta subcuenta no ha realizado ninguna transacción por el momento.</p>
    )}
  </Col>
);

const TransactionsTotals = ({ transactions }) => (
  <Col xs={24} md={6}>
    <PageHeader>
      <IntlMessages defaultMessage="Discounts" id="discounts" />
    </PageHeader>

    <Box
      amount={txTotals(transactions).discount.coin}
      text={<IntlMessages defaultMessage="Discounts" id="discounts" />}
      subtext={<IntlMessages defaultMessage="{currency} sent" id="discountsSent" values={{ currency: currency.plural }} />}
      bgColor="#fff"
      coin="DSC"
    />

    <Box
      amount={txTotals(transactions).discount.fiat}
      text={<IntlMessages defaultMessage="Discounts" id="discounts" />}
      subtext="Total facturado"
      bgColor="#fff"
      coin="$"
    />

    <PageHeader>Recompensas</PageHeader>

    <Box amount={txTotals(transactions).refund.coin} text="Recompensas" subtext="Discoins aceptados" bgColor="#fff" coin="DSC" />

    <Box amount={txTotals(transactions).refund.fiat} text="Recompensas" subtext="Total facturado" bgColor="#fff" coin="$" />
  </Col>
);

class SubAccountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: []
    };
    this.renderContent = this.renderContent.bind(this);
  }

  componentWillMount() {
    !this.props.isCurrentSubAccount(this.props.match.params.id) ? this.props.fetchSubaccount(this.props.match.params.id) : false;
  }

  renderContent() {
    const txFiltred = applyFilters(this.state.filters, this.props.transactions);

    return (
      <div style={{ width: "100%" }}>
        <AccountBox name={this.props.subaccount.name} dailyPermission={this.props.subaccount.amount} account={this.props.subaccount} />

        <Row gutter={18} style={{ marginTop: "30px" }}>
          <PageHeader>
            <IntlMessages defaultMessage="Filters" id="subaccountsDetails.filters" />
          </PageHeader>
          <Col xs={24}>
            <Col md={12} lg={6}>
              <AutoComplete
                placeholder="Account"
                dataSource={txAccounts(this.props.transactions).map(account => ({ text: account.name, value: account.id }))}
                onSelect={value => {
                  this.setState({
                    filters: [
                      ...this.state.filters.filter(filter => filter.filter !== "user"),
                      { filter: "user", arg: { account_id: value } }
                    ]
                  });
                }}
              />
            </Col>
            <Col md={3} lg={2}>
              <Switch
                checkedChildren="To"
                unCheckedChildren="To"
                checked={!getFilter(this.state.filters, "user").notFound && getFilter(this.state.filters, "user").arg.direction !== true}
                disabled={getFilter(this.state.filters, "user").notFound}
                onChange={() =>
                  this.setState({
                    filters: [
                      ...this.state.filters.filter(filter => filter.filter !== "user"),
                      {
                        filter: "user",
                        arg: {
                          ...getFilter(this.state.filters, "user").arg,
                          direction:
                            typeof getFilter(this.state.filters, "user").arg.direction !== undefined
                              ? getFilter(this.state.filters, "user").arg.direction === true
                                ? undefined
                                : true
                              : true
                        }
                      }
                    ]
                  })
                }
              />
            </Col>

            <Col md={3} lg={2}>
              <Switch
                checkedChildren="From"
                unCheckedChildren="From"
                checked={!getFilter(this.state.filters, "user").notFound && getFilter(this.state.filters, "user").arg.direction !== false}
                disabled={getFilter(this.state.filters, "user").notFound}
                onChange={() =>
                  this.setState({
                    filters: [
                      ...this.state.filters.filter(filter => filter.filter !== "user"),
                      {
                        filter: "user",
                        arg: {
                          ...getFilter(this.state.filters, "user").arg,
                          direction:
                            typeof getFilter(this.state.filters, "user").arg.direction !== undefined
                              ? getFilter(this.state.filters, "user").arg.direction === false
                                ? undefined
                                : false
                              : false
                        }
                      }
                    ]
                  })
                }
              />
            </Col>
            <Col md={12} lg={8}>
              <DatePicker.RangePicker
                value={
                  getFilter(this.state.filters, "between").notFound
                    ? ["", ""]
                    : [getFilter(this.state.filters, "between").arg.from, getFilter(this.state.filters, "between").arg.until]
                }
                onChange={dates => {
                  this.setState({
                    filters: [
                      ...this.state.filters.filter(filter => filter.filter !== "between"),
                      ...(dates.toString() !== ""
                        ? [
                            {
                              filter: "between",
                              arg: {
                                from: dates[0],
                                until: dates[1]
                              }
                            }
                          ]
                        : [])
                    ]
                  });
                }}
              />
            </Col>
            <Col md={3} lg={2}>
              <Switch
                checkedChildren="Hoy"
                unCheckedChildren="Hoy"
                checked={
                  getFilter(this.state.filters, "between").notFound !== true
                    ? getFilter(this.state.filters, "between").arg.from.isBetween(moment(), moment(), "days", []) &&
                      getFilter(this.state.filters, "between").arg.until.isBetween(moment(), moment(), "days", [])
                    : false
                }
                onChange={value => {
                  this.setState({
                    filters: [
                      ...this.state.filters.filter(filter => filter.filter !== "between"),
                      ...(value === true
                        ? [
                            {
                              filter: "between",
                              arg: {
                                from: moment(),
                                until: moment()
                              }
                            }
                          ]
                        : [])
                    ]
                  });
                }}
              />
            </Col>
          </Col>
        </Row>
        <Row style={{ marginTop: "30px" }} gutter={16}>
          <TransactionsList transactions={txFiltred} />
          <TransactionsTotals transactions={txFiltred} />
        </Row>
      </div>
    );
  }

  render() {
    return (
      <LayoutContentWrapper>
        <PageHeader>
          <IntlMessages id="subaccountsDetails.title" defaultMessage="Subaccount" />
        </PageHeader>
        {!this.props.isCurrentSubAccount(this.props.match.params.id) ? <PageLoading /> : this.renderContent()}
      </LayoutContentWrapper>
    );
  }
}

export default connect(
  state => ({
    subaccount: subAccount(state),
    transactions: subAccountTxs(state, true), // false = show only transactions related to the main account // true = all transactions
    isCurrentSubAccount: isCurrentSubAccount(state)
  }),
  dispatch => ({
    fetchSubaccount: bindActionCreators(actions.fetchSubaccount, dispatch)
  })
)(SubAccountPage);
