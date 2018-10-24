import React, { Component } from "react";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";
import { Row, Col } from "antd";
import basicStyle from "../../../config/basicStyle";
import { InputSearch } from "../../../components/uielements/input";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../redux/api/actions";
import appActions from "../../../redux/app/actions";
import IntlMessages from "../../../components/utility/intlMessages";
import { injectIntl } from "react-intl";
import TransactionBox from "./components/transactionBox";
import PageLoading from "../../../components/pageLoading";

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: null
    };
    this.renderContent = this.renderContent.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
  }

  componentDidMount() {
    console.log(" --- Transactions::componentDidMount PRE");
    this.props.searchTransactions();
    console.log(" --- Transactions::componentDidMount DONE");
  }

  componentWillReceiveProps(newProps) {
    console.log(
      " ------- > transactions.js::componentWillReceiveProps",
      JSON.stringify(newProps)
    );
  }

  _handleChange(e) {
    this.setState({ searchValue: e.target.value });
  }

  _handleKeyPress(e) {
    if (e.key === "Enter")
      this.props.searchTransactions(this.state.searchValue);
  }

  renderContent() {
    const { rowStyle } = basicStyle;

    return (
      <Row style={rowStyle} gutter={16} justify="start">
        <Col xs={24} style={{ marginBottom: "15px" }}>
          <InputSearch
            placeholder={
              this.props.intl.messages["transactions.filter"] || "Filter"
            }
            onKeyPress={this._handleKeyPress}
            onChange={this._handleChange}
          />
        </Col>
        {this.props.loading ? (
          <PageLoading />
        ) : (
          <Col xs={24}>
            {this.props.transactions === "undefined" ||
            !this.props.transactions ||
            this.props.transactions.length === 0 ? (
              <Col style={{ textAlign: "center", padding: "10px" }} xs={24}>
                <IntlMessages
                  id="transactions.notFound"
                  defaultMessage="No transactions were found"
                />
              </Col>
            ) : (
              this.props.transactions.map(transaction => (
                <TransactionBox
                  transaction={transaction}
                  key={transaction.date}
                />
              ))
            )}
          </Col>
        )}
      </Row>
    );
  }

  render() {
    return (
      <LayoutContentWrapper>
        <PageHeader>
          <IntlMessages
            id="sidebar.transactions"
            defaultMessage="Transactions"
          />
        </PageHeader>
        {this.renderContent()}
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = state => ({
  transactions: state.Api.transactions || [],
  loading: state.Api.transactionsLoading
});

const mapDispatchToProps = dispatch => ({
  searchTransactions: bindActionCreators(actions.searchTransactions, dispatch)
});

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Transactions)
);
