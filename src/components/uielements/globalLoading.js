import React from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import Button from './button';

const GlobalLoadingWrapper = styled.div`
.globalLoading {
    position: fixed;
    background: rgba(0,0,0,0.7);
    height: calc(100%);
    width: 100%;
    padding-top: calc(50% - 78px);
    color: #fff !important;
    text-align: center;
    z-index:10000;
    span {
        padding: 5px;
        display: inline-block;
    }
  }`;

export const GlobalLoading = ({msg}) => (
    <GlobalLoadingWrapper>
        <div className={"globalLoading"}>
            <Button shape="circle" loading /><br/>
            <span>{msg}</span>
        </div>
    </GlobalLoadingWrapper>
);