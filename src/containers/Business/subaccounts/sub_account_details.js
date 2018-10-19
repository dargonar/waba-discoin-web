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
  txTodayTotals
} from "../../../redux/api/selectors/subAccounts.selectors";
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
    this.renderContent = this.renderContent.bind(this);
  }

  componentWillMount() {
    !this.props.isCurrentSubAccount(this.props.match.params.id)
      ? this.props.fetchSubaccount(this.props.match.params.id)
      : false;
  }

  renderContent() {
    const txFiltred = applyFilters(
      [
        {
          arg: {
            from: "2018-10-11",
            until: "2018-10-13"
          },
          filter: "between"
        }
      ],
      this.props.transactions
    );

    return (
      <div style={{ width: "100%" }}>
        <AccountBox
          name={this.props.subaccount.name}
          dailyPermission={this.props.subaccount.amount}
          account={this.props.subaccount}
        />

        <Row gutter={18} style={{ marginTop: "30px" }}>
          <Col xs={24} md={18}>
            <PageHeader>
              <IntlMessages
                defaultMessage="Subaccount transactions"
                id="subaccountsDetails.transactions"
              />
            </PageHeader>
            {this.props.transactions.map((tx, key) => (
              <Transacction transaction={tx} key={"tx-" + key} />
            ))}
          </Col>

          <Col xs={24} md={6}>
            <PageHeader>
              <IntlMessages defaultMessage="Discounts" id="discounts" />
            </PageHeader>

            <Box
              amount={txTotals(this.props.transactions).discount.coin}
              text={<IntlMessages defaultMessage="Discounts" id="discounts" />}
              subtext={
                <IntlMessages
                  defaultMessage="{currency} sent"
                  id="discountsSent"
                  values={{ currency: currency.plural }}
                />
              }
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
      </div>
    );
  }

  render() {
    return (
      <LayoutContentWrapper>
        <PageHeader>
          <IntlMessages
            id="subaccountsDetails.title"
            defaultMessage="Subaccount"
          />
        </PageHeader>
        {!this.props.isCurrentSubAccount(this.props.match.params.id) ? (
          <PageLoading />
        ) : (
          this.renderContent()
        )}
      </LayoutContentWrapper>
    );
  }
}

export default connect(
  state => ({
    subaccount: subAccount(state),
    transactions: subAccountTxs(state, false), // false = show only transactions related to the main account // true = all transactions
    isCurrentSubAccount: isCurrentSubAccount(state)
  }),
  dispatch => ({
    fetchSubaccount: bindActionCreators(actions.fetchSubaccount, dispatch)
  })
)(SubAccountPage);
