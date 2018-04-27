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
        accoutn_id: this.props.match.params.id
      })
      return
    };
    this.setState({ error: 'No account id'})
  }

  renderAccounts() {
    return (
      <div style={{width:'100%'}}>
        {(this.props.accounts(this.state.account_id).length === 0)? 'This store does not have an account': ''}
      </div>
    );
  }

  render() {
    return (
      <LayoutContentWrapper>
        
        <PageHeader>
          <IntlMessages id="sidebar.accounts" />
        </PageHeader>
        { (this.props.loading || this.props.accounts(this.state.account_id) === null)? <PageLoading />: this.renderAccounts() }
      </LayoutContentWrapper>
    );
  }
}

const filterAccounts = (state) => (account_id) => {
    if (state.Business.stores !== null) {
        const store = state.Business.stores.filter(x => x.account_id === account_id)
        if (store.length !== 0) {
            return store[0].accounts
        }
    }
    return [];
};

const mapStateToProps = (state) => ({
  accounts : filterAccounts(state),
  loading : state.Business.loading,
  actionLoading : state.Business.actionLoading,
  error: state.Business.error,
  msg: state.Business.msg
});

const mapDispatchToProps = (dispatch) => ({
  
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountsStores);
