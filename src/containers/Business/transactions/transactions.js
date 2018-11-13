import React, { Component } from "react";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";
import { Row, Col, Button, Pagination, Alert } from "antd";
import basicStyle from "../../../config/basicStyle";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../redux/api/actions";
import IntlMessages from "../../../components/utility/intlMessages";
import { injectIntl } from "react-intl";
import TransactionBox from "./components/transactionBox";
import PageLoading from "../../../components/pageLoading";
import { TxFilterModal } from "./components/filterModal";
import { FiltetersToTags } from "./components/filterBar";

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: null,
      filters: [],
      page: 1,
      showFiltersBox: false
    };
    this.renderContent = this.renderContent.bind(this);
    this._filterRemove = this._filterRemove.bind(this);
    this._filtersChange = this._filtersChange.bind(this);
  }

  _filterRemove(name) {
    const filters = this.state.filters.filter(x => x.filter !== name);
    this._filtersChange(filters);
  }

  _filtersChange(filters) {
    this.setState({ filters, showFiltersBox: false, page: 1 });
    this.props.fetchTransactions({ filters, page: 1 });
  }

  _pageChange(page) {
    this.setState({ page });
    this.props.fetchTransactions({ filters: this.state.filters, page });
  }

  componentDidMount() {
    console.log(" --- Transactions::componentDidMount PRE");
    this.props.fetchTransactions({ filters: [], page: 1 });
    console.log(" --- Transactions::componentDidMount DONE");
  }

  componentWillReceiveProps(newProps) {
    console.log(" ------- > transactions.js::componentWillReceiveProps", JSON.stringify(newProps));
  }

  renderContent() {
    const { rowStyle } = basicStyle;

    return (
      <Row style={rowStyle} gutter={16} justify="start">
        <TxFilterModal
          filters={this.state.filters}
          visible={this.state.showFiltersBox}
          onOk={this._filtersChange}
          onCancel={() => {
            this.setState({ showFiltersBox: false });
          }}
        />
        <div style={{ margin: "10px", display: "flex", width: "100%" }}>
          <Button onClick={() => this.setState({ showFiltersBox: true })}>Filtros</Button>
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
        <Alert
          message={"Request - (Debug)"}
          style={{ margin: "10px", width: "100%", padding: "10px" }}
          description={
            <code>
              <pre>
                {JSON.stringify(
                  {
                    account_id: this.props.account_id,
                    query: {
                      filters: this.state.filters,
                      page: this.state.page
                    }
                  },
                  null,
                  "  "
                )}
              </pre>
            </code>
          }
        />
        {this.props.loading ? (
          <PageLoading />
        ) : (
          <Col xs={24}>
            {this.props.transactions === "undefined" || !this.props.transactions || this.props.transactions.length === 0 ? (
              <Col style={{ textAlign: "center", padding: "10px" }} xs={24}>
                <IntlMessages id="transactions.notFound" defaultMessage="No transactions were found" />
              </Col>
            ) : (
              this.props.transactions.map(transaction => <TransactionBox transaction={transaction} key={transaction.date} />)
            )}
          </Col>
        )}
        <Col xs={24}>
          <Pagination page={this.state.page} total={this.props.transactionsTotal} onChange={this._pageChange} />
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <LayoutContentWrapper>
        <PageHeader>
          <IntlMessages id="sidebar.transactions" defaultMessage="Transactions" />
        </PageHeader>
        {this.renderContent()}
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = state => ({
  account_id: state.Auth.account_id,
  transactions: state.Api.transactions || [],
  transactionsTotal: state.Api.transactionsTotal || 0,
  loading: state.Api.transactionsLoading
});

const mapDispatchToProps = dispatch => ({
  fetchTransactions: bindActionCreators(actions.fetchTransactions, dispatch)
});

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Transactions)
);
