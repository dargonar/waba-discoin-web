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
  }
  
  toggle(key) {
    this.setState({
      [key]: !this.state[key]
    })
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
          cancel={()=>this.toggle('ignoreLocal')}
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
  isLoggedIn: (typeof state.Auth.account === 'string')? true : false,
  inLocal: state.Auth.inLocal,
})

const mapDisptachToPops = dispatch => ({
  login: login,
  loginFromLocal: bindActionCreators(loginFromLocal, dispatch)
})

export default connect(mapStateToProps, mapDisptachToPops)(SignIn);
