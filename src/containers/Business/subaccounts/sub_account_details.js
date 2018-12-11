import React, { Component } from "react";
import IntlMessages from "../../../components/utility/intlMessages";
import PageLoading from "../../../components/pageLoading";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";
import AccountBox from "./components/accountBox";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../redux/api/actions";

import { Pagination } from "antd";

import { subAccount, isCurrentSubAccount } from "../../../redux/api/selectors/subAccounts.selectors";

import {
  subAccountTxs,
  onlyAccountTx,
  txTotals,
  txToday,
  txDiscounts,
  txRefunds,
  txBetween,
  txYesterday
} from "../../../redux/api/selectors/transactions.selectors";

import { Row, Col } from "antd";
import { currency } from "../../../config";

const filters = {
  //arg = "today" (Default) || "yesterday"
  day: arg => txs => (arg === "yesterday" ? txYesterday(txs) : txToday(txs)),

  //arg = {from: Date, until: Date }
  between: arg => txs => txBetween({ from: arg.from, until: arg.until }, txs),

  //arg = "account_id"
  user: arg => txs => onlyAccountTx(arg)(txs),

  //arg = "discount" (Default) || "refund"
  byType: arg => txs => {
    if (!arg) return txs;
    return arg === "refund" ? txRefunds(txs) : txDiscounts(txs);
  }
};

const applyFilters = (filterList = [], txs = []) =>
  filterList
    .map(item => filters[item.filter](item.arg)) // Init filters
    .reduce((prev, curr) => curr(prev), txs); // Apply filters

const Box = props => (
  <div style={{ marginBottom: "15px" }}>
    <Sticker {...props} />
  </div>
);

class SubAccountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: [],
      page: 1
    };
    this.renderContent = this.renderContent.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  componentWillMount() {
    !this.props.isCurrentSubAccount(this.props.match.params.id) ? this.props.fetchSubaccount(this.props.match.params.id) : false;
  }

  renderContent() {
    const txCount = applyFilters(this.state.filters, this.props.transactions).length;
    const txFiltred = applyFilters(this.state.filters, this.props.transactions).slice(this.state.page * 10 - 10, this.state.page * 10);

    return (
      <div style={{ width: "100%" }}>
        <AccountBox name={this.props.subaccount.name} dailyPermission={this.props.subaccount.amount} account={this.props.subaccount} />

        <Row gutter={18} style={{ marginTop: "30px" }}>
          <Col xs={24} md={18}>
            <PageHeader>
              <IntlMessages defaultMessage="Subaccount transactions" id="subaccountsDetails.transactions" />
            </PageHeader>
            {this.props.transactions.length > 0 ? (
              this.props.transactions.map((tx, key) => <Transacction transaction={tx} key={"tx-" + key} />)
            ) : (
              <p style={{ textAlign: "center" }}>Esta subcuenta no ha realizado ninguna transacción por el momento.</p>
            )}
          </Col>

          <Col xs={24} md={6}>
            <PageHeader>
              <IntlMessages defaultMessage="Discounts" id="discounts" />
            </PageHeader>

            <Box
              amount={txTotals(this.props.transactions).discount.coin}
              text={<IntlMessages defaultMessage="Discounts" id="discounts" />}
              subtext={<IntlMessages defaultMessage="{currency} sent" id="discountsSent" values={{ currency: currency.plural }} />}
              bgColor="#fff"
              coin="DSC"
            />

            <Box
              amount={txTotals(this.props.transactions).discount.fiat}
              text={<IntlMessages defaultMessage="Discounts" id="discounts" />}
              subtext="Total facturado"
              bgColor="#fff"
              coin="$"
            />

            <PageHeader>Recompensas</PageHeader>

            <Box
              amount={txTotals(this.props.transactions).refund.coin}
              text="Recompensas"
              subtext="Discoins aceptados"
              bgColor="#fff"
              coin="DSC"
            />

            <Box
              amount={txTotals(this.props.transactions).refund.fiat}
              text="Recompensas"
              subtext="Total facturado"
              bgColor="#fff"
              coin="$"
            />
          </Col>
        </Row>
        <Row style={{ marginTop: "30px" }} gutter={16}>
          <TransactionsList transactions={txFiltred} />
          <TransactionsTotals transactions={txFiltred} />
        </Row>
        <Pagination pageSize={10} current={this.state.page} total={txCount} onChange={this.changePage} />
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
