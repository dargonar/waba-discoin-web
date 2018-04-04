import styled from 'styled-components';
import { borderRadius } from '../../config/style-util';

const RatingStickerWidgetWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  height: 90px;
  ${borderRadius('5px')};

  .isoContentWrapper {
    width: 100%;
    padding: 20px 15px 20px 20px;
    display: flex;
    flex-direction: column;
    text-align: center;

    .isoStars {
      font-size: 20px;
      font-weight: 500;
      line-height: 1.1;
      margin: 0 0 5px;
    }

    .isoLabel {
      font-size: 14px;
      font-weight: 400;
      margin: 0;
      line-height: 1.2;
    }
  }
`;

export { RatingStickerWidgetWrapper };
