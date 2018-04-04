import React, { Component } from 'react';
import { RatingStickerWidgetWrapper } from './style';
import { Icon } from 'antd';

export default class extends Component {
  
  render() {
    const { fontColor, bgColor, width,icon, text, stars, full } = this.props;

    const textColor = {
      color: fontColor
    };
    const widgetStyle = {
      backgroundColor: bgColor,
      width: width
    };

    const makeStars = function(stars,full) {
        const iconFull = (<Icon type="star" />);
        const iconEmpty = (<Icon type="star-o" />);

        return (
            <div>
                {
                    Array(full).fill(1).map((el, i) => (i < stars)? iconFull: iconEmpty )
                }
            </div>
        )
    }

    return (
      <RatingStickerWidgetWrapper className="isoRatingStickerWidget" style={widgetStyle}>

        <div className="isoContentWrapper">
          <h3 className="isoStatNumber" style={textColor}>
            {makeStars(stars,full)}
          </h3>
          <span className="isoLabel" style={textColor}>
            {text} <Icon type={icon} style={textColor} />
          </span>
        </div>
      </RatingStickerWidgetWrapper>
    );
  }
}
