import React, { Component } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../redux/owner/actions";

import PageLoading from "../../../components/pageLoading";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";
import IntlMessages from "../../../components/utility/intlMessages";

import MessageBox from "../../../components/MessageBox";
import StoreCard from "./components/storeCard";
import StoreOverdarfBox from "./components/storeOvercraftBox";

import { push } from "react-router-redux";

class ListStores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overdraftBox: false,
      businessSelected: null
    };
    this.renderStores = this.renderStores.bind(this);
    this.submitOverdraftBox = this.submitOverdraftBox.bind(this);
    this.removeOverdraftBox = this.removeOverdraftBox.bind(this);
    this.showOverdraft = this.showOverdraft.bind(this);
    this.edit = this.edit.bind(this);
    this.accounts = this.accounts.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      typeof nextProps.setting_overdraft !== "undefined" &&
      nextProps.setting_overdraft === false &&
      this.state.overdraftBox == true &&
      this.state.businessSelected
    ) {
      this.removeOverdraftBox();
      this.props.fetch();
    }
  }

  componentWillMount() {
    this.props.fetch();
  }

  edit(businessId) {
    this.props.goTo("/dashboard/owner/store/" + businessId + "/edit");
  }

  accounts(businessId) {
    this.props.goTo("/dashboard/owner/store/" + businessId + "/accounts");
  }

  showOverdraft(bussines) {
    // console.log(JSON.stringify(bussines.balances));
    if (
      (!isNaN(bussines.balances.ready_to_access) &&
        parseInt(bussines.balances.ready_to_access) > 0) ||
      (!isNaN(bussines.balances.balance) &&
        parseInt(bussines.balances.balance) > 0) ||
      (!isNaN(bussines.balances.initial_credit) &&
        parseInt(bussines.balances.initial_credit) > 0)
    ) {
      alert("Funcion no disponible aun para comercios con credito.");
      return;
    }

    this.setState({
      businessSelected: bussines,
      overdraftBox: true
    });
  }

  submitOverdraftBox(value) {
    this.props.setOverdraft(this.state.businessSelected, value);
    // const action = 'URL/SET_OVERDRAFT' ; //getPath();
    // const parameters = {
    //     business_name: this.state.businessSelected.account,
    //     initial_credit: value
    // };
    // const privKey = this.props.keys.privKey;

    // getAndSignTx(action, parameters, privKey).then( res => {
    //     console.log(action, '====OK===>', JSON.stringify(res));
    //     this.removeOverdraftBox();
    //   }, err => {
    //     console.log(action, '====ERR===>', JSON.stringify(err));
    //     this.removeOverdraftBox();
    // });
  }

  removeOverdraftBox() {
    this.setState({
      overdraftBox: false,
      businessSelected: null
    });
  }

  renderStores() {
    return (
      <div style={{ width: "100%" }}>
        {this.props.business.map(store => (
          <StoreCard
            {...store}
            key={store.id}
            overdraft={this.showOverdraft}
            accounts={this.accounts}
            edit={this.edit}
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

        <MessageBox
          msg={this.props.msg}
          error={this.props.error}
          clean={this.props.removeMsg}
        />

        <StoreOverdarfBox
          visible={this.state.overdraftBox}
          business={this.state.businessSelected}
          cancel={this.removeOverdraftBox}
          submit={this.submitOverdraftBox}
        />

        {this.props.loading || this.props.business === null ? (
          <PageLoading />
        ) : (
          this.renderStores()
        )}
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = state => ({
  business: state.Owner.stores,
  loading: state.Owner.loading,
  actionLoading: state.Owner.actionLoading,
  setting_overdraft: state.Owner.setting_overdraft,
  error: state.Owner.error,
  msg: state.Owner.msg,
  keys: state.Auth.keys
});

const mapDispatchToProps = dispatch => ({
  fetch: bindActionCreators(actions.fetchBusinesses, dispatch),
  setOverdraft: bindActionCreators(actions.overdraft, dispatch),
  removeMsg: bindActionCreators(actions.removeMsg, dispatch),
  goTo: url => dispatch(push(url))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListStores);