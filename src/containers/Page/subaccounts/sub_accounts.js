import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../../redux/business/actions';
import { Col, Row } from 'antd';
import PageLoading from '../../../components/pageLoading'
import Alert from '../../../components/feedback/alert'
import Button from '../../../components/uielements/button';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import PageHeader from '../../../components/utility/pageHeader';
import IntlMessages from '../../../components/utility/intlMessages';
import MessageBox from '../../../components/MessageBox'
import AccountBox from './components/accountBox';
import AccountDailyBox from './components/storeOvercraftBox'
import { push } from 'react-router-redux';

class SubAccounts extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dailyBox: false,
      accountSelected: null
    }
    this.submitDailyBox = this.submitDailyBox.bind(this);
    this.removeDailyBox = this.removeDailyBox.bind(this);
    this.showDaily = this.showDaily.bind(this);
    this.changeAmount = this.changeAmount.bind(this);
    this.newSubAccount = this.newSubAccount.bind(this)
  }

  newSubAccount(){
    this.props.goTo('/dashboard/find_account')
  }

  showDaily(bussines) {
    this.setState({
      accountSelected: bussines,
      dailyBox: true
    })
  }

  submitDailyBox(value) {
    this.props.updateSubaccount(this.state.accountSelected, value)
    this.removeDailyBox()
  }

  removeDailyBox() {
    this.setState({
      dailyBox: false,
      accountSelected: null
    })
  }

  componentWillMount() {

    if (typeof this.props.match.params.id !== 'undefined') {
      this.props.fetch()
      return
    };
    // this.setState({ error: 'No account id'})
  }

  changePassword(account) {
    console.log('Change password', account)
  }

  changeAmount(account) {
    this.showDaily(account)
  }

  renderAccounts() {
    const {subaccounts } = this.props.subaccounts(this.state.account_id)
    return (
      <Row style={{width:'100%'}}>
        {(subaccounts.length === 0)?
          (<Alert message="Ups!" type="warning" description="No subaccounts configured yet" style={{margin:'10px'}}/> ):
          subaccounts.map(account => (
            <Col lg={8} md={12} sd={24} key={account.id+'-'+account.since}>
              <AccountBox
                name={account.name}
                dailyPermission={account.amount}
                changeAmount={()=>this.changeAmount(account)}
                changePassword={()=>this.changePassword(account)}
              />
            </Col>
          ))
        }
      </Row>
    );
  }

  render() {
    // const account = this.props.account(this.state.account_id)
    // const account = this.state.account_id
    const subaccounts = this.props.subaccounts(this.props.account.account_id)
    return (
      <LayoutContentWrapper>
        {(this.state.dailyBox)? (
          <AccountDailyBox
            title={'Daily limit - '+ this.state.accountSelected.name}
            visible={this.state.dailyBox}
            business={this.state.accountSelected}
            value={(this.state.accountSelected)? this.state.accountSelected.amount: 0}
            cancel = {this.removeDailyBox}
            submit = {this.submitDailyBox}
          />
        ): false}
          <MessageBox
            msg={this.props.msg}
            error={this.props.error}
            clean={this.props.removeMsg} />
        <PageHeader>
          <IntlMessages id="sidebar.subaccounts_title" />
        </PageHeader>
        { (this.props.loading || subaccounts === null)? <PageLoading />: this.renderAccounts() }
        <Button type="primary" style={{margin: '20px 0' }} onClick={this.newSubAccount} >Nueva Subcuenta</Button>
      </LayoutContentWrapper>
    );
  }
}

const filterSubaccounts = (state) => (account_id) => {
  return state.Business.subaccounts
    .filter(x => x.account_id === account_id)
    .reduce((pre,act)=> act.subaccounts, {
      subaccounts:[]
    })
};
// const filterStores = (state) => (account_id) => {
//   return state.Business.stores
//     .filter(x => x.account_id === account_id)
//     .reduce((pre,act)=> act, {
//       name: ''
//     })
// };

const mapStateToProps = (state) => ({
  subaccounts : filterSubaccounts(state),
  // account: filterStores(state),
  // loading : state.Business.loading,
  // actionLoading : state.Business.actionLoading,
  // error: state.Business.error,
  // msg: state.Business.msg
  account: state.Auth,
  isLoading: state.Api.actionLoading,
  error: state.Api.error,
  msg: state.Api.msg
});

const mapDispatchToProps = (dispatch,state) => ({
  fetch: bindActionCreators(actions.fetchSubaccounts, dispatch, state),
  updateSubaccount: bindActionCreators(actions.updateSubaccount, dispatch),
  removeMsg: bindActionCreators(actions.removeMsg, dispatch),
  goTo: (url)=>dispatch(push(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(SubAccounts);