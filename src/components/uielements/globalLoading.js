import React from "react";
import styled from "styled-components";
import Button from "./button";

const GlobalLoadingWrapper = styled.div`
  .globalLoading {
    top: 0px;
    position: fixed;
    background: rgba(0, 0, 0, 0.7);
    height: 100%;
    width: 100%;
    color: #fff !important;
    text-align: center;
    z-index: 10000;
    .circle {
      position: relative;
      top: 150px;
      transform-origin: 704.5px 486px 0px;
      span {
        padding: 5px;
        display: inline-block;
      }
    }
  }
`;

export const GlobalLoading = ({ msg }) => (
  <GlobalLoadingWrapper>
    <div className={"globalLoading"}>
      <div className={"circle"}>
        <Button shape="circle" loading />
        <br />
        <span>{msg}</span>
      </div>
    </div>
  </GlobalLoadingWrapper>
);
