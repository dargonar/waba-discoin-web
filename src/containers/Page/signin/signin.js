import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Input from '../../../components/uielements/input';
import Checkbox from '../../../components/uielements/checkbox';
import Button from '../../../components/uielements/button';
import authAction from '../../../redux/auth/actions';
import apiAction from '../../../redux/api/actions';
import IntlMessages from '../../../components/utility/intlMessages';
import SignInStyleWrapper from './signin.style';
import LocalLogin from './components/localLogin';
// import RegisterBox from './components/register';
import { bindActionCreators } from 'redux';
import message from '../../../components/uielements/message'

import { getToken } from '../../../helpers/utility';

const { login, loginFromLocal, cleanStorage } = authAction;

class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account             : '', //'discoin.admin',
      register            : false,
      ignoreLocal         : false,
      is_brainkey         : false,
      remember            : false,
      rememberKey         : '', //'1324',
      words               : ''  //'5JQGCnJCDyraociQmhDRDxzNFCd8WdcJ4BAj8q1YDZtVpk5NDw9'
    }
    
    this.handleLogin = this.handleLogin.bind(this);
    this.loginLocal = this.loginLocal.bind(this)
    this.toggle = this.toggle.bind(this)
    this.cancelLocal = this.cancelLocal.bind(this)
    this._handleKeyPress = this._handleKeyPress.bind(this);
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleLogin();
    }
  }

  cancelLocal() {
    console.log('[Page/signin/signin.js] ------- cleanStorage()');
    this.props.cleanStorage()
  }

  toggle(key) {
    this.setState({
      [key]: !this.state[key]
    })
  }

   loginLocal(password) {
    this.props.loginFromLocal(password);
  }

  componentWillMount() {
    this.props.getCategories();
    console.log(' --- signin::componentWillMount::redirecting to referrer ???? ');
    console.log('SIGNED IN???', this.props.isLoggedIn);
    if (this.props.isLoggedIn) {
      console.log(' --- this.props.isLoggedIn ---> signin::componentWillMount::redirecting to referrer');
    }
    console.log('-----signin::componentWillMount():', JSON.stringify(this.props.inLocal));

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error === true) {
      message.error(nextProps.msg);
      this.props.clearMsg();
    }
  }

  handleLogin = () => {

    // alert(this.state.words);
    if(this.state.remember && this.state.rememberKey=='')
    {
      alert('Debe ingresar una clave!');
      return;
    }
    this.props.login({
      account_name          : this.state.account,
      is_brainkey           : this.state.is_brainkey,
      remember              : this.state.remember,
      rememberKey           : this.state.rememberKey,
      mnemonics             : this.state.words,
      just_registered_data  : null
    });
  };

  render() {
    const from = { pathname: '/dashboard' };
    if (this.props.isLoggedIn) {
      console.log(' --- signin::render::redirecting to referrer');
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
                <Input size="large" placeholder="Username" value={this.state.account} onChange={(e)=> this.setState({account: e.target.value})}/>
              </div>

              <div className="isoInputWrapper">
                <Input size="large" type="text" placeholder="Password" value={this.state.words} onKeyPress={this._handleKeyPress} onChange={(e)=> this.setState({words: e.target.value})} />
              </div>
              {
                (this.state.remember)? (
                  <div className="isoInputWrapper">
                    <Input size="large" type="text" placeholder="Session password" value={this.state.rememberKey} onKeyPress={this._handleKeyPress} onChange={(e)=> this.setState({rememberKey: e.target.value})} />
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
                  onChange={()=>this.toggle('is_brainkey')}>
                  <IntlMessages id="page.isBrainKey" />
                </Checkbox>
                <Button type="primary" onClick={this.handleLogin} loading={this.props.isLoading} disabled={this.props.loading}>
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

const mapStateToProps = (state) => ({
  isLoggedIn: typeof state.Auth.account === 'string',
  isLoading: state.Auth.loading,
  inLocal: state.Auth.inLocal,
  error: state.Auth.error,
  msg: state.Auth.msg
})

const mapDispatchToProps = (dispatch) => ({
  login: bindActionCreators(login, dispatch),
  loginFromLocal: bindActionCreators(loginFromLocal, dispatch),
  cleanStorage: bindActionCreators(cleanStorage, dispatch),
  getCategories: bindActionCreators(apiAction.getCategories, dispatch),
  clearMsg: bindActionCreators(apiAction.cleanMsg, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
