import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../../redux/business/actions';
import { Col, Row } from 'antd';
import PageLoading from '../../../components/pageLoading'
import Alert from '../../../components/feedback/alert'
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import PageHeader from '../../../components/utility/pageHeader';
import IntlMessages from '../../../components/utility/intlMessages';

import AccountBox from './components/accountBox';

class AccountsStores extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  
    if (typeof this.props.match.params.id !== 'undefined') {
      this.setState({
        account_id: this.props.match.params.id
      })
      this.props.fetch({
        id:this.props.match.params.id
      })
      return
    };
    this.setState({ error: 'No account id'})
  }

  changePassword(account) {
    console.log('Change password', account)
  }

  changeAmmount(account) {
    console.log('Change ammount', account)
  }

  renderAccounts() {
    const {subaccounts, permissions } = this.props.subaccounts(this.state.account_id)
    return (
      <Row style={{width:'100%'}}>
        {(subaccounts.length === 0)?
          (<Alert message="Ups!" type="warning" description="This store does not have subaccounts" style={{margin:'10px'}}/> ):
          subaccounts.map(account => (
            <Col lg={8} md={12} sd={24}>
              <AccountBox 
                key={account.id+'-'+account.since}
                name={account.name}
                dailyPermission={account.ammount}
                changeAmmount={()=>this.changeAmmount(account)}
                changePassword={()=>this.changePassword(account)}
              />
            </Col>
          ))
        }
      </Row>
    );
  }

  render() {
    const account = this.props.account(this.state.account_id)
    const subaccounts = this.props.subaccounts(this.state.account_id)
    return (
      <LayoutContentWrapper>
        
        <PageHeader>
          <IntlMessages id="sidebar.accounts" />: {account.name}
        </PageHeader>
        { (this.props.actionLoading || subaccounts === null)? <PageLoading />: this.renderAccounts() }
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
const filterStores = (state) => (account_id) => {
  return state.Business.stores
    .filter(x => x.account_id === account_id)
    .reduce((pre,act)=> act, {
      name: ''
    })
};

const mapStateToProps = (state) => ({
  subaccounts : filterSubaccounts(state),
  account: filterStores(state),
  loading : state.Business.loading,
  actionLoading : state.Business.actionLoading,
  error: state.Business.error,
  msg: state.Business.msg
});

const mapDispatchToProps = (dispatch,state) => ({
  fetch: bindActionCreators(actions.fetchSubaccounts, dispatch, state)
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountsStores);
