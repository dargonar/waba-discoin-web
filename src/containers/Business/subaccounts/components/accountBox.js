import React from "react";
import Card from "../../../../components/uielements/card";
import HashImage from "../../../../components/hashImage";
import { Icon, Tooltip } from "antd";
import IntlMessages from "../../../../components/utility/intlMessages";
import { currency } from "../../../../config";

const style = {
  box: {
    borderRadius: "7px",
    overflow: "hidden",
    margin: "10px"
  },
  button: {}
};

const BtnInfo = ({ text, icon, action }) => (
  <Tooltip title={text}>
    <Icon type={icon} onClick={action} />
  </Tooltip>
);

const AccountBox = ({
  name,
  type,
  dailyPermission,
  account,
  changeAmount,
  changePassword
}) => (
  <Card
    style={style.box}
    actions={[
      <BtnInfo
        text={
          <IntlMessages
            id="subaccounts.changeAmount"
            defaultMessage="Change Amount"
          />
        }
        icon="edit"
        action={changeAmount}
      />
    ]}
  >
    <Card.Meta
      avatar={<HashImage text={name} size={50} />}
      title={name}
      description={
        <p>
          <IntlMessages
            id="subaccounts.accountType"
            defaultMessage="Account type"
          />
          {": "}
          <b>{type}</b>
          <br />
          <IntlMessages
            id="subaccounts.dailyLimit"
            defaultMessage="Daily amount"
          />
          {": "}
          <b>
            {currency.symbol} {Number(dailyPermission).toLocaleString()}
          </b>
          <br />
          <IntlMessages
            id="subaccounts.enabledSince"
            defaultMessage="Enabled Since"
          />
          {": "}
          <b>{account.since}</b>
          <br />
          <IntlMessages id="subaccounts.until" defaultMessage="Until" />
          {": "}
          <b>{account.expiration}</b>
          <br />
          <IntlMessages
            id="subaccounts.withdrawn"
            defaultMessage="Withdrawn in this period"
          />
          {": "}
          <b>
            {currency.symbol}{" "}
            {(Number(account.claimed_this_period || 0)/Math.pow(10,currency.asset_precision)).toLocaleString()}
          </b>
          <br />
        </p>
      }
    />
  </Card>
);

export default AccountBox;
