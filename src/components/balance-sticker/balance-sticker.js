import React, { Component } from 'react';
import { BalanceStickerWidgetWrapper } from './style';

export default class extends Component {

  getScaleInfo(scale,amount, param) {
    console.log(JSON.stringify(scale),amount)
    const obj = scale.reduce((prev,curr)=> {
      if (amount >= curr.raw.from_amount && amount < curr.raw.to_amount) {
        return curr
      } else {
        return prev
      }
    });
    if(param=='color')
      return { backgroundColor: obj.color || 'gray'}
    if(param=='exrta_percentage')
      return obj.extra_percentage;
  }

  render() {
    const { fontColor, bgColor, width, coin, scale, amount, text, percentage, subtext } = this.props;

    let subtext2 = '';
    if (scale)
    {
      subtext2 = this.getScaleInfo(scale,amount, 'extra_percentage');
    }
    const textColor = {
      color: fontColor
    };
    const widgetStyle = {
      backgroundColor: bgColor,
      width: width
    };

    return (
      <BalanceStickerWidgetWrapper className="isoBalanceStickerWidget" style={widgetStyle}>

      {coin || scale ? (
        < div className="isoCoinWrapper">
          <span className="isoCoinLabel" style={textColor}>
            {coin}
            { scale? (
              <span className="circle" style={this.getScaleInfo(scale,amount,'color')}></span>
            ): null }
          </span>
        </div>
      ): null }

        <div className="isoContentWrapper">
          <h3 className="isoStatNumber" style={textColor}>
            {Number(amount).toLocaleString()} { percentage?'%': null }
          </h3>
          <span className="isoLabel" style={textColor}>
            {text}
            <small><br/>{subtext}<br/>{subtext2}</small>
          </span>
        </div>
      </BalanceStickerWidgetWrapper>
    );
  }
}
