import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, LocaleProvider } from "antd";
import { IntlProvider } from "react-intl";
import { Debounce } from "react-throttle";
import WindowResizeListener from "react-window-size-listener";
import { ThemeProvider } from "styled-components";
import authAction from "../../redux/auth/actions";
import appActions from "../../redux/app/actions";
import Sidebar from "../Core/Sidebar/Sidebar";
import Topbar from "../Core/Topbar/Topbar";
import AppRouter from "./AppRouter";
import { AppLocale } from "../../dashApp";
import { siteConfig } from "../../config.js";
import themes from "../../config/themes";
import { themeConfig } from "../../config";
import AppHolder from "./commonStyle";
import "./global.css";

const { Content, Footer } = Layout;
const { logout } = authAction;
const { toggleAll } = appActions;

export class App extends Component {
  render() {
    const { url } = this.props.match;
    const { locale, selectedTheme } = this.props;
    const currentAppLocale = AppLocale[locale];
    return (
      <LocaleProvider locale={currentAppLocale.antd}>
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <ThemeProvider theme={themes[themeConfig.theme]}>
            <AppHolder>
              <Layout style={{ height: "100vh" }}>
                <Debounce time="1000" handler="onResize">
                  <WindowResizeListener
                    onResize={windowSize =>
                      this.props.toggleAll({
                        width: windowSize.windowWidth,
                        height: windowSize.windowHeight
                      })
                    }
                  />
                </Debounce>
                <Topbar url={url} />
                <Layout style={{ flexDirection: "row", overflowX: "hidden" }}>
                  <Sidebar url={url} />
                  <Layout
                    className="isoContentMainLayout"
                    style={{
                      height: "100vh"
                    }}
                  >
                    <Content
                      className="isomorphicContent"
                      style={{
                        padding: "70px 0 0",
                        flexShrink: "0",
                        background: "#f1f3f6"
                      }}
                    >
                      <AppRouter url={url} />
                    </Content>
                    <Footer
                      style={{
                        background: "#ffffff",
                        textAlign: "center",
                        borderTop: "1px solid #ededed"
                      }}
                    >
                      {siteConfig.footerText}
                    </Footer>
                  </Layout>
                </Layout>
              </Layout>
            </AppHolder>
          </ThemeProvider>
        </IntlProvider>
      </LocaleProvider>
    );
  }
}

export default connect(
  state => ({
    auth: state.Auth,
    locale: state.App.toJS().language.locale
  }),
  { logout, toggleAll }
)(App);
