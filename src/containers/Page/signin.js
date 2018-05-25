import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Input from '../../components/uielements/input';
import Checkbox from '../../components/uielements/checkbox';
import Button from '../../components/uielements/button';
import authAction from '../../redux/auth/actions';
import apiAction from '../../redux/api/actions';
import IntlMessages from '../../components/utility/intlMessages';
import SignInStyleWrapper from './signin.style';

import RegisterBox from './components/register';
import { bindActionCreators } from 'redux';
const { login } = authAction;

class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirectToReferrer: false,
      account: null,
      register: false,
    }
    // this.registerAccount = this.registerAccount.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.isLoggedIn !== nextProps.isLoggedIn &&
      nextProps.isLoggedIn === true
    ) {
      this.setState({ redirectToReferrer: true });
    }
  }
  
  componentWillMount() {
    this.props.getCategories();
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
        <RegisterBox 
          visible={this.state.register}
          cancel={()=>{this.setState({register: false})}}
          submit={this.props.registerAccount}
          loading={this.props.loading}
          error={this.props.error}
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

              <div className="isoInputWrapper isoOtherLogin">
                <Button type="primary" onClick={()=>{this.setState({register: true})}}>
                    <IntlMessages id="page.signUpButton" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SignInStyleWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.Auth.get('idToken') !== null ? true : false
})

const mapDispatchToProps = (dispatch) => ({
  login: login,
  getCategories: bindActionCreators(apiAction.getCategories, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
