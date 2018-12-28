import React from "react";
import { Col } from "antd";
import PageHeader from "../../../../components/utility/pageHeader";
import IntlMessages from "../../../../components/utility/intlMessages";
import Sticker from "../../../../components/balance-sticker/balance-sticker";
import { txTotals } from "../../../../redux/api/selectors/transactions.selectors";
import { currency } from "../../../../config";

const Box = props => (
  <div style={{ marginBottom: "15px" }}>
    <Sticker {...props} />
  </div>
);

export const TransactionsTotals = ({ transactions }) => (
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
