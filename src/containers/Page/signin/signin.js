import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import Input from '../../../components/uielements/input';
import Checkbox from '../../../components/uielements/checkbox';
import Button from '../../../components/uielements/button';
import authAction from '../../../redux/auth/actions';
import IntlMessages from '../../../components/utility/intlMessages';
import SignInStyleWrapper from './signin.style';
import LocalLogin from './components/localLogin';

const { login, loginFromLocal } = authAction;

class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirectToReferrer: false,
      account: null,
      ignoreLocal: false,
    };
    this.cancelLocal = this.cancelLocal.bind(this)
    this.loginLocal = this.loginLocal.bind(this)
  }
  

  cancelLocal() {
    this.setState({ignoreLocal: true})
  }

  loginLocal(password) {
    this.props.loginFromLocal(password)
    console.log(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.isLoggedIn !== nextProps.isLoggedIn &&
      nextProps.isLoggedIn === true
    ) {
      this.setState({ redirectToReferrer: true });
    }
  }
  handleLogin = () => {
    const { login } = this.props;
    login({account: this.state.account});
    this.props.history.push('/dashboard');
  };
  render() {
    const from = { pathname: '/dashboard' };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <SignInStyleWrapper className="isoSignInPage">
        <LocalLogin 
          visible={this.props.inLocal && !this.state.ignoreLocal }
          submit={this.loginLocal}
          cancel={this.cancelLocal}
        />
        <div className="isoLoginContentWrapper">
          <div className="isoLoginContent">
            <div className="isoLogoWrapper">
              <Link to="/dashboard">
                <IntlMessages id="page.signInTitle" />
              </Link>
            </div>

            <div className="isoSignInForm">
              <div className="isoInputWrapper">
                <Input size="large" placeholder="Username" onChange={(e)=> this.setState({account: e.target.value})}/>
              </div>

              <div className="isoInputWrapper">
                <Input size="large" type="password" placeholder="Password" />
              </div>

              <div className="isoInputWrapper isoLeftRightComponent">
                <Checkbox>
                  <IntlMessages id="page.signInRememberMe" />
                </Checkbox>
                <Button type="primary" onClick={this.handleLogin}>
                  <IntlMessages id="page.signInButton" />
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
  isLoggedIn: state.Auth.idToken !== null ? true : false,
  inLocal: state.Auth.inLocal,
  ...state.Auth,
})

const mapDisptachToPops = dispatch => ({
  login: login,
  loginFromLocal: bindActionCreators(loginFromLocal, dispatch)
})

export default connect(mapStateToProps, mapDisptachToPops)(SignIn);
