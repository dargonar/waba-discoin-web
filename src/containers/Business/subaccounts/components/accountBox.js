import React from "react";
import Card from "../../../../components/uielements/card";
import HashImage from "../../../../components/hashImage";
import { Icon, Tooltip } from "antd";

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
      <BtnInfo text="Change amount" icon="edit" action={changeAmount} />
    ]}
  >
    <Card.Meta
      avatar={<HashImage text={name} size={50} />}
      title={name}
      description={
        <p>
          Tipo de cuenta: <b>{type}</b>
          <br />
          Monto diario: <b>DSC {Number(dailyPermission).toLocaleString()}0</b>
          <br />
          Desde: <b>{account.since}</b>
          <br />
          Hasta: <b>{account.expiration}</b>
          <br />
          Rerirado este período:{" "}
          <b>DSC {Number(account.claimed_this_period || 0).toLocaleString()}</b>
          <br />
        </p>
      }
    />
  </Card>
);

export default AccountBox;
