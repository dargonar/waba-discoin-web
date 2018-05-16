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
import { push } from 'react-router-redux';

const { login, loginFromLocal, cleanStorage } = authAction;

class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirectToReferrer  : false,
      account             : null,
      ignoreLocal         : false,
      is_brainkey         : false,
      remember            : false,
      rememberKey         : '',
      words               : ''
    };
    this.loginLocal = this.loginLocal.bind(this)
    this.toggle = this.toggle.bind(this)
    this.cancelLocal = this.cancelLocal.bind(this)
  }
  
  cancelLocal() {
    this.props.cleanStorage()
  }

  toggle(key) {
    this.setState({
      [key]: !this.state[key]
    })
  }

   loginLocal(password) {
    this.props.loginFromLocal(password)
  }

  handleLogin = () => {
    this.props.login({
      account_name        : this.state.account,
      is_brainkey         : this.state.is_brainkey,
      remember            : this.state.remember,
      rememberKey         : this.state.rememberKey,
      mnemonics           : this.state.words
    });
  };
  render() {
    const from = { pathname: '/dashboard' };
    
    if (this.props.isLoggedIn) {
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
                <Input size="large" type="text" placeholder="Password" onChange={(e)=> this.setState({words: e.target.value})} />
              </div>
              {
                (this.state.remember)? (
                  <div className="isoInputWrapper">
                    <Input size="large" type="text" placeholder="Session password" onChange={(e)=> this.setState({rememberKey: e.target.value})} />
                  </div>
                ): false
              }
              
              <div className="isoInputWrapper isoLeftRightComponent">
                <Checkbox
                  onChange={()=>this.toggle('remember')}>
                  <IntlMessages id="page.signInRememberMe" />
                </Checkbox>
                <Checkbox 
                  defaultChecked={this.state.is_brainkey}
                  onChange={()=>this.toggle('id_brainkey')}>
                  <IntlMessages id="page.isBrainKey" />
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
  isLoggedIn: typeof state.Auth.account === 'string',
  inLocal: state.Auth.inLocal,
})

const mapDisptachToPops = dispatch => ({
  login: bindActionCreators(login, dispatch),
  loginFromLocal: bindActionCreators(loginFromLocal, dispatch),
  cleanStorage: bindActionCreators(cleanStorage, dispatch)
})

export default connect(mapStateToProps, mapDisptachToPops)(SignIn);
