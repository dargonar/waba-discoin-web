import React, { Component } from "react";
import { Col, Row, Tooltip } from "antd";
import StoreCardWrapper from "../store.style";
import BalanceSticker from "../../../../components/balance-sticker/balance-sticker";
import Button from "../../../../components/uielements/button";
import { currency } from "../../../../config";

class StoreCard extends Component {
  shortNumber(number) {
    number = number.toString();
    switch (number.length) {
      case 6:
        return number.slice(0, 3) + "K";
      case 7:
        return number.slice(0, 3) + "M";
      default:
        return number;
    }
  }

  render() {
    const rowActions = {
      borderTop: "1px solid rgb(201, 205, 212)",
      padding: "10px 0"
    };
    const testing = true;

    const getBalanceWarnings = warnings => {
      return Object.keys(warnings).map(key => {
        return {
          value: warnings[key].amount,
          color: warnings[key].color,
          raw: warnings[key]
        };
      });
    };

    return (
      <StoreCardWrapper>
        <h3>{this.props.description}</h3>
        <Row gutter={12}>
          <Col md={5} sm={24} xs={24}>
            <ul>
              <li>
                {this.props.category.description} >{" "}
                {this.props.subcategory.description}
              </li>
              <li>{this.shortNumber(this.props.total_refunded)} REFUNDED</li>
              <li>
                {this.shortNumber(this.props.total_discounted)} DISCOUNTED
              </li>
              <li>
                <i>
                  Id > {this.props.account_id} | {this.props.account}
                </i>
              </li>
            </ul>
          </Col>
          <Col md={4} sm={24} xs={24} style={{ marginBottom: "10px" }}>
            <BalanceSticker
              coin={currency.symbol}
              amount={this.props.balances.balance}
              text={"Balance"}
              bgColor={"#f5f5f5"}
            />
          </Col>
          <Col md={4} sm={24} xs={24} style={{ marginBottom: "10px" }}>
            <BalanceSticker
              coin={currency.symbol}
              amount={this.props.balances.initial_credit}
              text={"Credito inicial"}
              bgColor={"#f5f5f5"}
            />
          </Col>
          <Col md={4} sm={24} xs={24} style={{ marginBottom: "10px" }}>
            <BalanceSticker
              coin={currency.symbol}
              amount={this.props.balances.ready_to_access}
              text={"Disponible para solicitar credito"}
              bgColor={"#f5f5f5"}
            />
          </Col>
          <Col md={4} sm={24} xs={24} style={{ marginBottom: "10px" }}>
            <BalanceSticker
              amount={
                (this.props.balances.balance * 100) /
                  this.props.balances.initial_credit || 0
              }
              text="Descuentos & Recompensas"
              scale={getBalanceWarnings(this.props.warnings)}
              percentage={true}
              fontColor="#1C222C"
              bgColor="#f5f5f5"
            />
          </Col>
          <Col md={3} sm={24} xs={24} style={{ marginBottom: "10px" }}>
            <BalanceSticker
              amount={this.props.discount}
              percentage={true}
              text="% de Descuento"
              fontColor="#1C222C"
              bgColor="#f5f5f5"
            />
          </Col>
        </Row>
        <Row style={rowActions}>
          <Col xs={12}>
            <Button shape="circle" icon="delete" onClick={this.props.delete} />
          </Col>
          <Col
            xs={12}
            style={{ textAlign: "right" }}
            className={"rightButtons"}
          >
            {testing ? (
              <Tooltip title="Edit account profile">
                <Button
                  shape="circle"
                  onClick={() => this.props.edit(this.props.account_id)}
                  icon="info"
                />
              </Tooltip>
            ) : null}
            <Tooltip title="Change initial credit">
              <Button
                shape="circle"
                onClick={() => this.props.overdraft(this.props)}
              >
                $
              </Button>
            </Tooltip>
            {testing ? (
              <Tooltip title="Manage subaccounts">
                <Button
                  shape="circle"
                  onClick={() => this.props.accounts(this.props.account_id)}
                  icon="key"
                />
              </Tooltip>
            ) : null}
          </Col>
        </Row>
      </StoreCardWrapper>
    );
  }
}

export default StoreCard;
