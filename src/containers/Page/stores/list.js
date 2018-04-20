import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../../redux/business/actions';

import PageLoading from '../../../components/pageLoading'
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import PageHeader from '../../../components/utility/pageHeader';
import IntlMessages from '../../../components/utility/intlMessages';

import StoreCardWrapper from './store.style'
import StoreMessageBox from './components/storeMessageBox'
import StoreCard from './components/storeCard';
import StoreOverdarfBox from './components/storeOvercraftBox'


class ListStores extends Component {

  constructor(props) {
    super(props);
    this.state = {
      overdraftBox: false,
      businessSelected: null
    }
    this.renderStores = this.renderStores.bind(this);
    this.submitOverdraftBox = this.submitOverdraftBox.bind(this);
    this.removeOverdraftBox = this.removeOverdraftBox.bind(this);
    this.showOverdraft = this.showOverdraft.bind(this);

  }

  componentWillMount() {
    this.props.fetch();
  }

  showOverdraft(bussines) {
    this.setState({
      businessSelected: bussines,
      overdraftBox: true
    })
  }

  submitOverdraftBox(value) {
    this.props.setOverdraft(this.state.businessSelected, value)
    this.removeOverdraftBox()
  }

  removeOverdraftBox() {
    this.setState({
      overdraftBox: false,
      businessSelected: null
    })
  }

  renderStores() {
    return (
      <div style={{width:'100%'}}>
        {this.props.business.map(store => (
          <StoreCard
            {...store}
            key={store.id}
            overdraft={this.showOverdraft}
          />
        ))}
      </div>
    );
  }

  render() {
    return (
      <LayoutContentWrapper>
        
        <PageHeader>
          <IntlMessages id="sidebar.stores" />
        </PageHeader>

        <StoreMessageBox
          msg={this.props.msg}
          error={this.props.error}
          clean={this.props.removeMsg} />

        <StoreOverdarfBox 
          visible={this.state.overdraftBox}
          business={this.state.businessSelected}
          cancel = {this.removeOverdraftBox}
          submit = {this.submitOverdraftBox}
        />

        { (this.props.loading || this.props.business === null)? <PageLoading />: this.renderStores() }
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  business : state.Business.stores,
  loading : state.Business.loading,
  actionLoading : state.Business.actionLoading,
  error: state.Business.error,
  msg: state.Business.msg
});

const mapDispatchToProps = (dispatch) => ({
  fetch: bindActionCreators(actions.fetchBusinesses, dispatch),
  setOverdraft: bindActionCreators(actions.overdraft, dispatch),
  removeMsg: bindActionCreators(actions.removeMsg, dispatch),
})


export default connect(mapStateToProps, mapDispatchToProps)(ListStores);