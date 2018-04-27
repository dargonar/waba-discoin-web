import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../../redux/business/actions';

import PageLoading from '../../../components/pageLoading'
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import PageHeader from '../../../components/utility/pageHeader';
import IntlMessages from '../../../components/utility/intlMessages';

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

  renderAccounts() {
    const subaccounts = this.props.subaccounts(this.state.account_id)
    return (
      <div style={{width:'100%'}}>
        {(subaccounts.subaccounts.length === 0)? 'This store does not have an account': (
        <pre>
          {JSON.stringify(subaccounts, null, '  ')}
        </pre>)}
      </div>
    );
  }

  render() {
    return (
      <LayoutContentWrapper>
        
        <PageHeader>
          <IntlMessages id="sidebar.accounts" />
        </PageHeader>
        { (this.props.actionLoading || this.props.subaccounts(this.state.account_id) === null)? <PageLoading />: this.renderAccounts() }
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
  return state.Business.stores.filter(x => x.account_id === account_id)
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
