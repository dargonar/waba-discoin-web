import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import appActions from '../../redux/app/actions';
import TopbarUser from './topbarUser';
import TopbarWrapper from './topbar.style';
import themes from '../../config/themes';
import { themeConfig } from '../../config';

const { Header } = Layout;
const { toggleCollapsed } = appActions;
const customizedTheme = themes[themeConfig.theme];

class Topbar extends Component {
  render() {
    const { toggleCollapsed } = this.props;
    const collapsed = this.props.App.collapsed && !this.props.App.openDrawer;
    const styling = {
      background: customizedTheme.backgroundColor,
      position: 'fixed',
      width: '100%',
      height: 70
    };
    return (
      <TopbarWrapper>
        <Header
          style={styling}
          className={
            collapsed ? 'isomorphicTopbar collapsed' : 'isomorphicTopbar'
          }
        >
          <div className="isoLeft">
            <button
              className={
                collapsed ? 'triggerBtn menuCollapsed' : 'triggerBtn menuOpen'
              }
              style={{ color: customizedTheme.textColor }}
              onClick={toggleCollapsed}
            />
          </div>

          <ul className="isoRight">
            <li>{this.props.Auth.account}</li>
            <li
              onClick={() => this.setState({ selectedItem: 'user' })}
              className="isoUser"
            >
              <TopbarUser account={this.props.Auth.account}/>
            </li>
          </ul>
        </Header>
      </TopbarWrapper>
    );
  }
}

export default connect(
  state => ({
    App: {...state.App.toJS()},
    Auth: {...state.Auth.toJS()}
  }),
  { toggleCollapsed }
)(Topbar);
