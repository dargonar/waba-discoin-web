import React, { Component } from "react";
import { BalanceStickerWidgetWrapper } from "./style";

export default class extends Component {
  getScaleInfo(scale, amount, param) {
    console.log(' ------------------------ getScaleInfo ')
    console.log(JSON.stringify(scale),amount);
    if(!scale || scale.length==0)
    { 
      if (param === "color") return { backgroundColor: "gray" };
      if (param === "extra_percentage") return '0';
    }
    const obj = scale.reduce((prev, curr) => {
      //console.log(' ----- ' , JSON.stringify(curr));
      // if (amount >= curr.raw.from_amount && amount < curr.raw.to_amount) {
      if (amount >= curr.value && amount < curr.value) {
        return curr;
      } else {
        return prev;
      }
    });
    if (param === "color") return { backgroundColor: obj.color || "gray" };
    if (param === "extra_percentage") return obj.extra_percentage;
  }

  render() {
    const {
      fontColor,
      bgColor,
      width,
      coin,
      scale,
      amount,
      text,
      percentage,
      subtext
    } = this.props;

    let subtext2 = "";
    if (scale) {
      subtext2 = this.getScaleInfo(scale, amount, "extra_percentage");
    }
    const textColor = {
      color: fontColor
    };
    const widgetStyle = {
      backgroundColor: bgColor,
      width: width
    };

    return (
      <BalanceStickerWidgetWrapper
        className="isoBalanceStickerWidget"
        style={widgetStyle}
      >
        {coin || scale ? (
          <div className="isoCoinWrapper">
            <span className="isoCoinLabel" style={textColor}>
              {coin}
              {scale ? (
                <span
                  className="circle"
                  style={this.getScaleInfo(scale, amount, "color")}
                />
              ) : null}
            </span>
          </div>
        ) : null}

        <div className="isoContentWrapper">
          <h3 className="isoStatNumber" style={textColor}>
            {Number(amount).toLocaleString()} {percentage ? "%" : null}
          </h3>
          <span className="isoLabel" style={textColor}>
            {text}
            {subtext || subtext2 ? (
              <small>
                <br />
                {subtext} - {subtext2}
              </small>
            ) : (
              false
            )}
          </span>
        </div>
      </BalanceStickerWidgetWrapper>
    );
  }
}
