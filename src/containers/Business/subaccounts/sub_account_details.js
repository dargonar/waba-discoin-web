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
  txTotals,
  txToday,
  txTodayTotals
} from "../../../redux/api/selectors/subAccounts.selectors";
import { Row, Col } from "antd";

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
    return (
      <div style={{ width: "100%" }}>
        <AccountBox
          name={this.props.subaccount.name}
          dailyPermission={this.props.subaccount.amount}
          account={this.props.subaccount}
        />

        <Row gutter={18} style={{ marginTop: "30px" }}>
          <Col xs={24} md={18}>
            <PageHeader>Subaccount transactions</PageHeader>
            {this.props.transactions.map((tx, key) => (
              <Transacction transaction={tx} key={"tx-" + key} />
            ))}
          </Col>

          <Col xs={24} md={6}>
            <PageHeader>Descuentos</PageHeader>

            <Box
              amount={txTotals(this.props.transactions).discount.coin}
              text="Descuentos"
              subtext="Discoins entregados"
              bgColor="#fff"
              coin="DSC"
            />

            <Box
              amount={txTotals(this.props.transactions).discount.fiat}
              text="Descuentos"
              subtext="Total facturado"
              bgColor="#fff"
              coin="$"
            />

            <PageHeader>Recompensas</PageHeader>

            <Box
              amount={txTotals(this.props.transactions).refund.coin}
              text="Descuentos"
              subtext="Discoins aceptados"
              bgColor="#fff"
              coin="DSC"
            />

            <Box
              amount={txTotals(this.props.transactions).refund.fiat}
              text="Descuentos"
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
    transactions: subAccountTxs(state, true),
    isCurrentSubAccount: isCurrentSubAccount(state)
  }),
  dispatch => ({
    fetchSubaccount: bindActionCreators(actions.fetchSubaccount, dispatch)
  })
)(SubAccountPage);
