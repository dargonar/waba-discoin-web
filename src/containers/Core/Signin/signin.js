import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Input from "../../../components/uielements/input";
import Checkbox from "../../../components/uielements/checkbox";
import Button from "../../../components/uielements/button";
import authAction from "../../../redux/auth/actions";
import apiAction from "../../../redux/api/actions";
import IntlMessages from "../../../components/utility/intlMessages";
import SignInStyleWrapper from "./signin.style";
import LocalLogin from "./components/localLogin";
import RegisterBox from "./components/register";
import { bindActionCreators } from "redux";
import message from "../../../components/uielements/message";
import { injectIntl } from "react-intl";
import { siteConfig } from "../../../config";

const { login, loginFromLocal, cleanStorage, register } = authAction;

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "", //'benoit',
      register: false,
      ignoreLocal: false,
      is_brainkey: true,
      remember: false,
      rememberKey: "", //'1324',
      words: "" //'onza redondo ficha polvo lista útil vivero goteo potro mucho dosis aire'
    };

    this.sessionPasswordInput = React.createRef();
    this.handleLogin = this.handleLogin.bind(this);
    this.loginLocal = this.loginLocal.bind(this);
    this.toggle = this.toggle.bind(this);
    this.cancelLocal = this.cancelLocal.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
  }

  _handleKeyPress(e) {
    if (e.key === "Enter") {
      this.handleLogin();
    }
  }

  cancelLocal() {
    console.log("[Page/signin/sinin.js] ------- cleanStorage()");
    this.props.cleanStorage();
  }

  toggle(key) {
    this.setState({
      [key]: !this.state[key]
    });
  }

  loginLocal(password) {
    this.props.loginFromLocal(password);
  }

  componentWillMount() {
    this.props.getCategoriesList();
    console.log(
      " --- signin::componentWillMount::redirecting to referrer ???? "
    );
    console.log("SIGNED IN???", this.props.isLoggedIn);
    if (this.props.isLoggedIn) {
      console.log(
        " --- this.props.isLoggedIn ---> signin::componentWillMount::redirecting to referrer"
      );
    }
    console.log(
      "-----signin::componentWillMount():",
      JSON.stringify(this.props.inLocal)
    );
  }

  handleLogin = () => {
    // alert(this.state.words);
    if (this.state.remember && this.state.rememberKey === "") {
      message.warning(
        this.props.intl.messages["core.sessionPasswordWarning"] ||
          "You must enter a session password"
      );
      return;
    }
    this.props.login({
      account_name: this.state.account,
      is_brainkey: this.state.is_brainkey,
      remember: this.state.remember,
      rememberKey: this.state.rememberKey,
      mnemonics: this.state.words,
      just_registered_data: null
    });
  };

  render() {
    const from = { pathname: `/dashboard/${this.props.userType}/` };
    if (this.props.isLoggedIn) {
      console.log(" --- signin::render::redirecting to referrer");
      return <Redirect to={from} />;
    }

    return (
      <SignInStyleWrapper className="isoSignInPage">
        <LocalLogin
          visible={this.props.inLocal && !this.state.ignoreLocal}
          submit={this.loginLocal}
          cancel={this.cancelLocal}
        />
        <RegisterBox
          visible={this.state.register}
          cancel={() => {
            this.setState({ register: false });
          }}
          submit={this.props.register}
          loading={this.props.loading}
          error={this.props.error}
        />
        <div className="isoLoginContentWrapper">
          <div className="isoLoginContent">
            <div className="isoLogoWrapper">
              <Link to="/dashboard">
                <IntlMessages
                  id="page.signInTitle"
                  defaultMessage={siteConfig.siteName}
                />
              </Link>
            </div>

            <div className="isoSignInForm">
              <div className="isoInputWrapper">
                <Input
                  size="large"
                  placeholder={
                    this.props.intl.messages["core.username"] || "Username"
                  }
                  value={this.state.account}
                  onChange={e => this.setState({ account: e.target.value })}
                />
              </div>

              <div className="isoInputWrapper">
                <Input
                  size="large"
                  type="text"
                  placeholder={
                    this.props.intl.messages["core.password"] || "Password"
                  }
                  value={this.state.words}
                  onKeyPress={this._handleKeyPress}
                  onChange={e => this.setState({ words: e.target.value })}
                />
              </div>
              {this.state.remember ? (
                <div
                  className="isoInputWrapper"
                  ref={this.sessionPasswordInput}
                >
                  <Input
                    required={true}
                    size="large"
                    type="text"
                    placeholder={
                      this.props.intl.messages["core.sessionPassword"] ||
                      "Session password"
                    }
                    value={this.state.rememberKey}
                    onKeyPress={this._handleKeyPress}
                    onChange={e =>
                      this.setState({ rememberKey: e.target.value })
                    }
                  />
                </div>
              ) : (
                false
              )}

              <div className="isoInputWrapper isoLeftRightComponent">
                <Checkbox
                  onChange={e => {
                    this.toggle("remember");
                    setTimeout(
                      () =>
                        e.target.checked
                          ? this.sessionPasswordInput.current.children[0].focus()
                          : false,
                      500
                    );
                  }}
                >
                  <IntlMessages
                    id="page.signInRememberMe"
                    defaultMessage="Remember me"
                  />
                </Checkbox>
                <Checkbox
                  defaultChecked={this.state.is_brainkey}
                  onChange={() => this.toggle("is_brainkey")}
                >
                  <IntlMessages
                    id="page.isBrainKey"
                    defaultMessage="Is brain key"
                  />
                </Checkbox>
                <Button
                  type="primary"
                  onClick={this.handleLogin}
                  loading={this.props.isLoading}
                  disabled={this.props.loading}
                >
                  <IntlMessages
                    id="page.signInButton"
                    defaultMessage="Sign In"
                  />
                </Button>
              </div>

              <div className="isoInputWrapper isoOtherLogin">
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({ register: true });
                  }}
                >
                  <IntlMessages
                    id="page.signUpButton"
                    defaultMessage="Sign Up"
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SignInStyleWrapper>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: typeof state.Auth.account === "string",
  isLoading: state.Auth.loading,
  inLocal: state.Auth.inLocal,
  error: state.Auth.error,
  msg: state.Auth.msg,
  userType: state.Auth.accountType
});

const mapDispatchToProps = dispatch => ({
  login: bindActionCreators(login, dispatch),
  loginFromLocal: bindActionCreators(loginFromLocal, dispatch),
  cleanStorage: bindActionCreators(cleanStorage, dispatch),
  getCategoriesList: bindActionCreators(apiAction.getCategoriesList, dispatch),
  clearMsg: bindActionCreators(apiAction.cleanMsg, dispatch),
  register: bindActionCreators(register, dispatch)
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(SignIn));
