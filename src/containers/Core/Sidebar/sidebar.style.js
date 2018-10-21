import styled from "styled-components";
import { palette } from "styled-theme";
import { transition, borderRadius } from "../../../config/style-util";
import WithDirection from "../../../config/withDirection";

const SidebarWrapper = styled.div`
  .brandLogo{
    background-image: url('');
  }
  .brandLogoContainer{
    height: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
  }
  .isomorphicSidebar {
    z-index: 1000;
    background: ${palette("grayscale", 4)};
    width: 280px;
    flex: 0 0 280px;

    .scrollarea {
      height: calc(100vh - 70px);
    }

    @media only screen and (max-width: 767px) {
      width: 240px !important;
      flex: 0 0 240px !important;
    }

    &.ant-layout-sider-collapsed {
      @media only screen and (max-width: 767px) {
        width: 0;
        min-width: 0 !important;
        max-width: 0 !important;
        flex: 0 0 0 !important;
      }
    }

    .isoLogoWrapper {
      border-bottom: 1px solid #e5e5e5;
      border-right: 1px solid #e5e5e5;
      height: 70px;
      margin: 0;
      padding: 0 10px;
      text-align: center;
      overflow: hidden;
      ${borderRadius()};

      h3 {
        margin: 0 0 0 15px;

        a {
          font-size: 12px;
          line-height: 70px;
          letter-spacing: 0.75px;
          text-transform: uppercase;
          color: ${palette("text", 3)};
          display: block;
          text-decoration: none;
        }
      }
    }

    &.ant-layout-sider-collapsed {
      .isoLogoWrapper {
        padding: 0;

        h3 {
          a {
            font-size: 27px;
            font-weight: 500;
            letter-spacing: 0;
          }
        }
      }
    }

    .isoDashboardMenu {
      padding-top: 35px;
      padding-bottom: 35px;
      background: transparent;

      a {
        text-decoration: none;
        font-weight: 400;
      }

      .ant-menu-item {
        width: 100%;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        padding: 0 24px;
        margin: 0;
      }

      .isoMenuHolder {
        display: flex;
        align-items: center;

        i {
          font-size: 19px;
          color: inherit;
          margin: ${props =>
            props["data-rtl"] === "rtl" ? "0 0 0 30px" : "0 30px 0 0"};
          width: 18px;
          ${transition()};
        }
      }

      .anticon {
        font-size: 18px;
        margin-right: 30px;
        color: inherit;
        ${transition()};
      }

      .nav-text {
        font-size: 14px;
        color: inherit;
        font-weight: 400;
        ${transition()};
      }

      .ant-menu-item-selected {
        // background: linear-gradient(to right, rgba(190,51,255,1) 0%,rgba(155,93,255,1) 100%);
        background: linear-gradient(to right, rgba(58,153,217,1) 0%,rgba(161,204,236,1) 100%);
        .anticon {
          color: #fff;
        }

        i {
          color: #fff!important;
        }

        .nav-text {
          color: #fff!important;
        }
      }

      > li {
        &:hover {
          i,
          .nav-text {
            color: rgba(58,153,217,1);
          }
        }
      }
    }

    .ant-menu-dark .ant-menu-inline.ant-menu-sub {
      background: ${palette("secondary", 5)};
    }

    .ant-menu-submenu-inline,
    .ant-menu-submenu-vertical {
      > .ant-menu-submenu-title {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 24px;

        > span {
          display: flex;
          align-items: center;
        }

        .ant-menu-submenu-arrow {
          left: ${props => (props["data-rtl"] === "rtl" ? "25px" : "auto")};
          right: ${props => (props["data-rtl"] === "rtl" ? "auto" : "25px")};

          &:before,
          &:after {
            width: 8px;
            ${transition()};
          }

          &:before {
            transform: rotate(-45deg) translateX(3px);
          }

          &:after {
            transform: rotate(45deg) translateX(-3px);
          }

          ${"" /* &:after {
            content: '\f123';
            font-family: 'Ionicons' !important;
            font-size: 16px;
            color: inherit;
            left: ${props => (props['data-rtl'] === 'rtl' ? '16px' : 'auto')};
            right: ${props => (props['data-rtl'] === 'rtl' ? 'auto' : '16px')};
            ${transition()};
          } */};
        }

        &:hover {
          .ant-menu-submenu-arrow {
            &:before,
            &:after {
              color: #ffffff;
            }
          }
        }
      }

      .ant-menu-inline,
      .ant-menu-submenu-vertical {
        > li:not(.ant-menu-item-group) {
          padding-left: ${props =>
            props["data-rtl"] === "rtl" ? "0px !important" : "74px !important"};
          padding-right: ${props =>
            props["data-rtl"] === "rtl" ? "74px !important" : "0px !important"};
          font-size: 13px;
          font-weight: 400;
          margin: 0;
          color: inherit;
          ${transition()};

          &:hover {
            a {
              color: #ffffff !important;
            }
          }
        }

        .ant-menu-item-group {
          padding-left: 0;

          .ant-menu-item-group-title {
            padding-left: 100px !important;
          }
          .ant-menu-item-group-list {
            .ant-menu-item {
              padding-left: 125px !important;
            }
          }
        }
      }

      .ant-menu-sub {
        box-shadow: none;
        background-color: transparent !important;
      }
    }

    &.ant-layout-sider-collapsed {
      .nav-text {
        display: none;
      }

      .ant-menu-submenu-inline > {
        .ant-menu-submenu-title:after {
          display: none;
        }
      }

      .ant-menu-submenu-vertical {
        > .ant-menu-submenu-title:after {
          display: none;
        }

        .ant-menu-sub {
          background-color: transparent !important;

          .ant-menu-item {
            height: 35px;
          }
        }
      }
    }
  }
`;

export default WithDirection(SidebarWrapper);
