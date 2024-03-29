import styled from 'styled-components';
import { borderRadius } from '../../config/style-util';

const BalanceStickerWidgetWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  height: 90px;
  ${borderRadius('5px')};

  .isoCoinWrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    flex-shrink: 0;
    background-color: rgba(0, 0, 0, 0.1);

    i {
      font-size: 30px;
    }

    .circle {
      display:  block;
      width:  20px;
      height:  20px;
      border-radius: 20px;
      background:  green;
    }
  }

  .isoContentWrapper {
    width: 100%;
    padding: 20px 15px 20px 20px;
    display: flex;
    flex-direction: column;

    .isoStatNumber {
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

export { BalanceStickerWidgetWrapper };
