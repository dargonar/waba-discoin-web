import React, { Component } from 'react';
import { connect } from 'react-redux';
import clone from 'clone';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import Scrollbars from '../../components/utility/customScrollBar.js';
import Menu from '../../components/uielements/menu';
import IntlMessages from '../../components/utility/intlMessages';
import SidebarWrapper from './sidebar.style';

import appActions from '../../redux/app/actions';
import Logo from '../../components/utility/logo';
import { getCurrentTheme } from '../ThemeSwitcher/config';
import { themeConfig } from '../../config';

const SubMenu = Menu.SubMenu;

const { Sider } = Layout;
const {
  toggleOpenDrawer,
  changeOpenKeys,
  changeCurrent,
  toggleCollapsed,
} = appActions;

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.onOpenChange = this.onOpenChange.bind(this);
  }
  handleClick(e) {
    this.props.changeCurrent([e.key]);
    if (this.props.app.view === 'MobileView') {
      setTimeout(() => {
        this.props.toggleCollapsed();
        this.props.toggleOpenDrawer();
      }, 100);
    }
  }
  onOpenChange(newOpenKeys) {
    const { app, changeOpenKeys } = this.props;
    const latestOpenKey = newOpenKeys.find(
      key => !(app.openKeys.indexOf(key) > -1)
    );
    const latestCloseKey = app.openKeys.find(
      key => !(newOpenKeys.indexOf(key) > -1)
    );
    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    changeOpenKeys(nextOpenKeys);
  }
  getAncestorKeys = key => {
    const map = {
      sub3: ['sub2'],
    };
    return map[key] || [];
  };

  render() {
    const { url, app, toggleOpenDrawer } = this.props;
    const customizedTheme = getCurrentTheme('sidebarTheme', themeConfig.theme);
    const collapsed = clone(app.collapsed) && !clone(app.openDrawer);
    const { openDrawer } = app;
    const mode = collapsed === true ? 'vertical' : 'inline';
    const hidden = { display: 'none' }
    const onMouseEnter = event => {
      if (openDrawer === false) {
        toggleOpenDrawer();
      }
      return;
    };
    const onMouseLeave = () => {
      if (openDrawer === true) {
        toggleOpenDrawer();
      }
      return;
    };
    const scrollheight = app.height || window.innerHeight;
    const styling = {
      backgroundColor: customizedTheme.backgroundColor,
    };
    const submenuColor = {
      color: customizedTheme.textColor,
    };
    const submenuStyle = {
      backgroundColor: 'rgba(0,0,0,0.3)',
      color: customizedTheme.textColor,
    };
    return (
      <SidebarWrapper>
        <Sider
          trigger={null}
          collapsible={true}
          collapsed={collapsed}
          width="240"
          className="isomorphicSidebar"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={styling}
        >
          <Logo collapsed={collapsed} />
          <Scrollbars style={{ height: scrollheight - 70 }}>
            <Menu
              onClick={this.handleClick}
              theme="dark"
              mode={mode}
              openKeys={collapsed ? [] : app.openKeys}
              selectedKeys={app.current}
              onOpenChange={this.onOpenChange}
              className="isoDashboardMenu"
            >
              <Menu.Item key="home">
                <Link to={`${url}`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <span className="nav-text">
                      <IntlMessages id="sidebar.home" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="discountRewards">
                <Link to={`${url}/discount-and-rewards`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <span className="nav-text">
                      <IntlMessages id="sidebar.discountRewards" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="refound">
                <Link to={`${url}/refound`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <span className="nav-text">
                      <IntlMessages id="sidebar.refound" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="transactions">
                <Link to={`${url}/transactions`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <span className="nav-text">
                      <IntlMessages id="sidebar.transactions" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="subAccounts" style={hidden}>
                <Link to={`${url}/sub-accounts`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <span className="nav-text">
                      <IntlMessages id="sidebar.subAccounts" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="contactList" style={hidden}>
                <Link to={`${url}/contact-list`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <span className="nav-text">
                      <IntlMessages id="sidebar.contactList" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="notifications" style={hidden}>
                <Link to={`${url}/notifications`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <span className="nav-text">
                      <IntlMessages id="sidebar.notifications" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="profile" style={hidden}>
                <Link to={`${url}/profile`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <span className="nav-text">
                      <IntlMessages id="sidebar.profile" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>
            </Menu>
          </Scrollbars>
        </Sider>
      </SidebarWrapper>
    );
  }
}

export default connect(
  state => ({
    app: state.App.toJS(),
  }),
  { toggleOpenDrawer, changeOpenKeys, changeCurrent, toggleCollapsed }
)(Sidebar);
