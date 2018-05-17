import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Input from '../../components/uielements/input';
import Checkbox from '../../components/uielements/checkbox';
import Button from '../../components/uielements/button';
import authAction from '../../redux/auth/actions';
import IntlMessages from '../../components/utility/intlMessages';
import SignInStyleWrapper from './signin.style';

import { bizLogin } from '../../httpService';

const { login } = authAction;


class SignIn extends Component {
  state = {
    redirectToReferrer  : false,
    account             : null
  };
  
  status = {
    account             : null,
    is_brainkey         : false,
    words               : ''
  };


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
    
    // console.log ('this.state:', this.state);
    // console.log ('this.status:', this.status);
    // return;
    bizLogin(this.state.account, this.state.words, true)
    .then((responseJson) => {
      console.log('===========> handleLogin()::res ==> ', JSON.stringify(responseJson));
      
      console.log ('handleLogin()::responseJson.login', responseJson.login);
      if(responseJson.login)
      {
        login({account: this.state.account});
        this.props.history.push('/dashboard');
      }   
      else{
        alert('No te pudiste logear');
      }
      
    }, err => {
      console.log(' handleLogin() ===== #3' ,JSON.stringify(err));
      alert('Error: No te pudiste logear');
    });

  };

  render() {
    const from = { pathname: '/dashboard' };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    return (
      <SignInStyleWrapper className="isoSignInPage">
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
                <Input size="large" type="text" placeholder="Password" onChange={(e)=> this.setState({words: e.target.value})} />
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

export default connect(
  state => ({
    isLoggedIn: state.Auth.get('idToken') !== null ? true : false,
  }),
  { login }
)(SignIn);
