import React from "react";
import styled from "styled-components";
import { palette } from "styled-theme";

const StripMessageWrapper = styled.div`
  .stripMessage {
    position: fixed;
    background: #1890ff;
    bottom: 0px;
    left: 0px;
    width: 100%;
    padding: 20px;
    color: #fff;
    font-weight: bold;
    border-top: 2px solid rgba(255, 255, 255, 0.3);
    z-index: 1000;
    .actions {
      float: right;
      a {
        display: inline-block;
        color: #fff;
        border: 1px solid #fff;
        font-weight: normal;
        padding: 5px;
        margin-top: -6px;
        margin-left: 10px;
        border-radius: 3px;
        text-align: center;
      }
    }
  }
  .stripMessage.error {
    backgroundcolor: ${palette("error", 0)};
  }
  .stripMessage.info {
    backgroundcolor: ${palette("info", 0)};
  }
`;

export const StripMessage = ({ visible, type, msg, actions }) => (
  <StripMessageWrapper>
    <div className={"stripMessage " + type}>
      <span>{msg}</span>
      <div className="actions">
        {[].concat(actions).map((action, key) => (
          <a key={key} onClick={action.onClick}>
            {action.msg}
          </a>
        ))}
      </div>
    </div>
  </StripMessageWrapper>
);
