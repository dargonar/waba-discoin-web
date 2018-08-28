import React from "react";
import Card from "../../../../components/uielements/card";
import HashImage from "../../../../components/hashImage";
import { Icon, Tooltip } from "antd";
import { currency } from "../../../../config";
import IntlMessages from "../../../../components/utility/intlMessages";

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
  changeAmount,
  changePassword
}) => (
  <Card
    style={style.box}
    actions={[
      <BtnInfo
        text={
          <IntlMessages
            defaultMessage="Change amount"
            id="stores.changeAmount"
          />
        }
        icon="edit"
        action={changeAmount}
      />,
      <BtnInfo
        text={
          <IntlMessages
            defaultMessage="Change password"
            id="stores.changePassword"
          />
        }
        icon="unlock"
        action={changePassword}
      />
    ]}
  >
    <Card.Meta
      avatar={<HashImage text={name} size={50} />}
      title={name}
      description={
        <p>
          <b>
            <IntlMessages defaultMessage="Type" id="stores.type" />:
          </b>{" "}
          {type}
          <br />
          <b>
            <IntlMessages
              defaultMessage="Daily Permission"
              id="stores.dailyPermission"
            />
            :
          </b>{" "}
          {currency.symbol} {Number(dailyPermission).toLocaleString()}
        </p>
      }
    />
  </Card>
);

export default AccountBox;
