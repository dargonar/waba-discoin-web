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
    const scrollheight = app.height;
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
              <Menu.Item key="kpis">
                <Link to={`${url}/kpis`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <span className="nav-text">
                      <IntlMessages id="sidebar.kpis" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>
              <SubMenu
                key="configuration"
                title={
                  <span className="isoMenuHolder" style={submenuColor}>
                    <span className="nav-text">
                      <IntlMessages id="sidebar.configuration" />
                    </span>
                  </span>
                }>
                  <Menu.Item key="parameters" style={submenuStyle}>
                    <Link to={`${url}/parameters`}  style={submenuColor}>
                      <IntlMessages id="sidebar.parameters" />
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="categories" style={submenuStyle}>
                    <Link to={`${url}/categories`} style={submenuColor}>
                      <IntlMessages id="sidebar.categories" />
                    </Link>
                  </Menu.Item>
              </SubMenu>
              <SubMenu
                key="stores"
                title={
                  <span className="isoMenuHolder" style={submenuColor}>
                    <span className="nav-text">
                      <IntlMessages id="sidebar.stores" />
                    </span>
                  </span>
                }>
                <Menu.Item key="store-list" style={submenuStyle}>
                  <Link to={`${url}/store-list`} style={submenuColor}>
                    <IntlMessages id="sidebar.list" />
                  </Link>
                </Menu.Item>
                <Menu.Item key="store-create" style={submenuStyle}>
                  <Link to={`${url}/store-create`} style={submenuColor}>
                    <IntlMessages id="sidebar.createStore" />
                  </Link>
                </Menu.Item>
              </SubMenu>
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
