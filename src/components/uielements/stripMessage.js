import React from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const StripMessageWrapper = styled.div`
.stripMessage {
    position: fixed;
    background: #1890ff;
    bottom: 0px;
    left:0px;
    width: 100%;
    padding: 20px;
    color: #fff;
    font-weight: bold;
    border-top: 2px solid rgba(255,255,255,0.3);
    z-index: 99999;
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
    backgroundColor:  ${palette('error', 0)};
}
.stripMessage.info {
    backgroundColor:  ${palette('info', 0)};
}`;

export const StripMessage = ({visible, type, msg, actions}) => (
    <StripMessageWrapper>
        <div className={"stripMessage " + type }>
            <span>{msg}</span>
            <div class="actions">
                {
                    [].concat(actions).map(action => (<a onClick={action.onClick}>{action.msg}</a>))
                }
            </div>
        </div>
    </StripMessageWrapper>
);