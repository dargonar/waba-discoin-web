import React from "react";
import { Col } from "antd";
import PageHeader from "../../../../components/utility/pageHeader";
import IntlMessages from "../../../../components/utility/intlMessages";
import Transacction from "../../transactions/components/transactionBox";

export const TransactionsList = ({ transactions }) => (
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
