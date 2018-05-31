import React, { Component } from 'react';
import { RatingStickerWidgetWrapper } from './style';
import { Icon } from 'antd';
import Review from '../../components/uielements/rate';

const StarIcon = ({full}) =>
  (<Icon type={(full)? 'star': 'star-o'} />);

export default class extends Component {

  render() {
    const { fontColor, bgColor, width,icon, text, stars, full, rating } = this.props;

    const textColor = {
      color: fontColor
    };
    const widgetStyle = {
      backgroundColor: bgColor,
      width: width
    };

    const makeStars = function(stars,full) {

        return (
            <div>
                {
                    Array(full).fill(1).map((el, i) => (i < stars)? (<StarIcon full={true} key={i} />) : (<StarIcon full={false} key={i} />) )
                }
            </div>
        )
    }

    // {makeStars(stars,full)}
    return (
      <RatingStickerWidgetWrapper className="isoRatingStickerWidget" style={widgetStyle}>

        <div className="isoContentWrapper">
          <h3 className="isoStatNumber" style={textColor}>
            <Review allowHalf disabled defaultValue={rating.rating} />
          </h3>
          <span className="isoLabel" style={textColor}>
            {rating.reviews.total} <Icon type={icon} style={textColor} />
          </span>
        </div>
      </RatingStickerWidgetWrapper>
    );
  }
}
