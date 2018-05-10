import React, { Component } from 'react';
import { BalanceStickerWidgetWrapper } from './style';

export default class extends Component {
  
  getColorScale(scale,amount) {
    console.log(scale,amount)
    const color = scale.reduce((prev,curr)=> {
      if (amount > curr.value) { 
        return curr
      } else {
        return prev
      }
    },{value:0, color:'gray'}).color;
    return { backgroundColor: color || 'gray'}
  }
  
  render() {
    const { fontColor, bgColor, width, coin, scale, amount, text, percentage, subtext } = this.props;

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
              <span className="circle" style={this.getColorScale(scale,amount)}></span>
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
            <small><br/>{subtext}</small>
          </span>
        </div>
      </BalanceStickerWidgetWrapper>
    );
  }
}
