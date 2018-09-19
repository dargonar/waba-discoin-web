import React, { Component } from "react";
import IntlMessages from "../../../../components/utility/intlMessages";
import { currency } from "../../../../config";
import { ColorBox } from "./colorBox";

export class AcceptDiscount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reward: 0
    };
    this.updateReward = this.updateReward.bind(this);
    this.checkValue = this.checkValue.bind(this);
  }

  updateReward(value) {
    this.setState({
      reward: this.checkValue(value)
    });
  }

  checkValue(value) {
    if (value >= 0 && value <= this.props.percentage) return value;
    return this.props.percentage;
  }

  render() {
    const roundAmount = value => Math.round(value * 100) / 100;

    return (
      <div>
        <ColorBox
          title={<IntlMessages id="reward" defaultMessage="Reward" />}
          value={this.state.reward}
          onChange={this.updateReward}
          buttonText={
            <IntlMessages
              id="mainBusiness.acceptPayment"
              values={{ currency: currency.plural }}
              defaultMessage="Accept Payment in {currency}"
            />
          }
          color="#ff8f5d"
        >
          <span>
            ${" "}
            {Number(
              this.props.amount -
                roundAmount(
                  (this.state.reward * (this.props.amount || 0)) / 100
                )
            ).toFixed(2)}
            <br />+ <br />
            {currency.symbol}{" "}
            {roundAmount(
              (this.state.reward * (this.props.amount || 0)) / 100
            ).toFixed(2)}
          </span>
        </ColorBox>
      </div>
    );
  }
}
