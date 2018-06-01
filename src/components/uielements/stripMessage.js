import React from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const StripMessageWrapper = styled.div`
.stripMessage {
    position: fixed;
    background: #1890ff;
    bottom: 0px;
    width: 100%;
    padding: 20px;
    color: #fff;
    font-weight: bold;
    border-top: 1px solid #fff;
    z-index: 99999;
    .actions {
      float: right;
      a {
        display: inline-block;
        color: #fff;
        border: 1px solid #fff;
        font-weight: normal;
        padding 5px;
        border-radius: 3px;
        text-align: center;
      }
    }
  }
.stripMessage.error {
    backgroundColor:  ${palette('error', 0)};
}
.stripMessage.success {
    backgroundColor:  ${palette('success', 0)};
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