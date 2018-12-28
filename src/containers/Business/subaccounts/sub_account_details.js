import React, { Component } from "react";
import IntlMessages from "../../../components/utility/intlMessages";
import PageLoading from "../../../components/pageLoading";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";
import AccountBox from "./components/accountBox";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../redux/api/actions";

import { Pagination, Button } from "antd";

import { subAccount, isCurrentSubAccount } from "../../../redux/api/selectors/subAccounts.selectors";
import { TransactionsList } from "./components/transactionList";
import { TransactionsTotals } from "./components/transactionsTotals";
import { FiltetersToTags, TxFilterModal } from "./components/filterBox";

import {
  subAccountTxs,
  onlyAccountTx,
  txToday,
  txDiscounts,
  txRefunds,
  txBetween,
  txYesterday,
  txOnlyDiscounts,
  txOnlyRefounds
} from "../../../redux/api/selectors/transactions.selectors";

import { Row, Col } from "antd";
import { currency } from "../../../config";
import transactions from "../transactions/transactions";

const filters = {
  //arg = "today" (Default) || "yesterday"
  day: arg => txs => (arg === "yesterday" ? txYesterday(txs) : txToday(txs)),

  //arg = {from: Date, until: Date }
  between: arg => txs => txBetween({ from: arg.from, until: arg.until }, txs),

  //arg = "account_id"
  user: ({ account_id = "", direction }) => (txs = []) => txs.filter(onlyAccountTx(account_id)),

  //arg = true (from) false (to)
  direction: ({ account_id = "", direction }) => (txs = []) => (direction ? txOnlyDiscounts(txs)() : txOnlyRefounds(txs)()),

  //arg = "discount" (Default) || "refund"
  byType: arg => txs => {
    console.log(arg, txs);
    if (!arg) return txs;
    return arg === "refund" ? txRefunds(txs) : txDiscounts(txs);
  }
};

const applyFilters = (filterList = [], txs = []) =>
  filterList
    .map(item => filters[item.filter](item.arg)) // Init filters
    .reduce((prev, curr) => curr(prev), txs); // Apply filters

class SubAccountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: [],
      page: 1,
      showFiltersBox: false
    };
    this.renderContent = this.renderContent.bind(this);
    this.changePage = this.changePage.bind(this);
    this._filterRemove = this._filterRemove.bind(this);
    this._filtersChange = this._filtersChange.bind(this);
  }

  componentWillMount() {
    !this.props.isCurrentSubAccount(this.props.match.params.id) ? this.props.fetchSubaccount(this.props.match.params.id) : false;
  }

  changePage(page) {
    this.setState({ page });
    //Try to scroll up
    try {
      //STORES LIST > ISO LAYOUT > ANT LAYOUT > MAIN LAYOUT
      this.mainScroll.parentElement.parentElement.parentElement.scrollTo(0, 550);
    } catch (e) {
      console.log("Parent element not found - list.js");
    }
  }

  _filterRemove(name) {
    let filters;
    if (typeof name === "object") {
      filters = this.state.filters.filter(x => name.indexOf(x.filter) === -1);
    } else {
      filters = this.state.filters.filter(x => x.filter !== name);
    }
    this._filtersChange(filters);
  }

  _filtersChange(filters) {
    console.log(filters);
    this.setState({ filters, showFiltersBox: false, page: 1 });
    //this.props.fetchTransactions({ filters, page: 1 });
  }

  renderContent() {
    const txCount = applyFilters(this.state.filters, this.props.transactions).length;
    const txFiltred = applyFilters(this.state.filters, this.props.transactions).slice(this.state.page * 10 - 10, this.state.page * 10);

    return (
      <div style={{ width: "100%" }}>
        <TxFilterModal
          transactions={this.props.transactions}
          filters={this.state.filters}
          visible={this.state.showFiltersBox}
          onOk={this._filtersChange}
          onCancel={() => {
            this.setState({ showFiltersBox: false });
          }}
        />
        <AccountBox name={this.props.subaccount.name} dailyPermission={this.props.subaccount.amount} account={this.props.subaccount} />

        <Row style={{ marginTop: "30px", marginLeft: "10px", marginRight: "10px" }} gutter={16}>
          <TransactionsList transactions={txFiltred}>
            <div style={{ display: "flex", width: "100%", marginBottom: "20px" }}>
              <Button onClick={() => this.setState({ showFiltersBox: true })}>Aplicar Filtros</Button>
              <FiltetersToTags
                filters={this.state.filters}
                removeFilter={filter => this._filterRemove(filter)}
                style={{
                  padding: "4px 0px 3px 7px",
                  background: "#fff",
                  borderWidth: "1px 1px 1px 0",
                  borderColor: " #d9d9d9",
                  borderStyle: "solid",
                  flex: "1",
                  borderRadius: "0 4px 4px 0"
                }}
              />
            </div>
          </TransactionsList>
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
