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
import LocalLogin from "../Core/Signin/components/localLogin";
import AppRouter from "./AppRouter";
import { AppLocale } from "../../dashApp";
import { siteConfig } from "../../config.js";
import themes from "../../config/themes";
import { themeConfig } from "../../config";
import AppHolder from "./commonStyle";
import "./global.css";
import { Icon, Button, Row, Col } from "antd";
import IntlMessages from "../../components/utility/intlMessages";
const { Content, Footer } = Layout;
const { logout } = authAction;
const { toggleAll, togglePasswordBox } = appActions;

export class App extends Component {
  render() {
    const { url } = this.props.match;
    const { locale } = this.props;
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
                        background: "#F5F9FD"
                      }}
                    >
                      {this.props.isEncrypted ? (
                        <Row
                          style={{
                            padding: "20px",
                            background: "#ffbf00"
                          }}
                        >
                          {this.props.passwordBox}
                          <Col md={20} style={{ marginTop: "6px" }}>
                            <Icon type="warning" />
                            <strong>
                              {" "}
                              <IntlMessages
                                defaultMessage="Your keys are encrypted"
                                id="localLogin.keysEncryptedTitle"
                              />
                            </strong>
                            {": "}
                            <IntlMessages
                              defaultMessage="Please enter your local storage password to unlock them"
                              id="localLogin.keysEncryptedMessage"
                            />
                          </Col>
                          <Col md={4} style={{ textAlign: "right" }}>
                            <Button
                              type="danger"
                              onClick={this.props.togglePasswordBox}
                            >
                              <IntlMessages
                                defaultMessage="Unlock"
                                id="localLogin.unlock"
                              />
                            </Button>
                          </Col>
                        </Row>
                      ) : (
                        false
                      )}
                      <LocalLogin />
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
    locale: state.App.toJS().language.locale,
    isEncrypted: state.Auth.encrypted === true
  }),
  { logout, toggleAll, togglePasswordBox }
)(App);
