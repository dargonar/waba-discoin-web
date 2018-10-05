import React, { Component } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../redux/owner/actions";

import Alert from "../../../components/feedback/alert";
import PageLoading from "../../../components/pageLoading";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";
import IntlMessages from "../../../components/utility/intlMessages";

import MessageBox from "../../../components/MessageBox";
import StoreCard from "./components/storeCard";
import StoreOverdarfBox from "./components/storeOvercraftBox";

import Pagination from "../../../components/uielements/pagination";

import { push } from "react-router-redux";

import Filters from "./components/filters";

class ListStores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      overdraftBox: false,
      businessSelected: null,
      filters: [],
      order: []
    };
    this.renderStores = this.renderStores.bind(this);
    this.submitOverdraftBox = this.submitOverdraftBox.bind(this);
    this.removeOverdraftBox = this.removeOverdraftBox.bind(this);
    this.showOverdraft = this.showOverdraft.bind(this);
    this.edit = this.edit.bind(this);
    this.accounts = this.accounts.bind(this);
    this.changePage = this.changePage.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData(data) {
    this.props.fetch(data);
  }

  componentWillReceiveProps(nextProps) {
    if (
      typeof nextProps.setting_overdraft !== "undefined" &&
      nextProps.setting_overdraft === false &&
      this.state.overdraftBox === true &&
      this.state.businessSelected
    ) {
      this.removeOverdraftBox();
      this.fetchData({
        page: this.state.page,
        filters: this.state.filters,
        order: this.state.order
      });
    }
  }

  componentWillMount() {
    this.fetchData({
      page: this.state.page,
      filters: this.state.filters,
      order: this.state.order
    });
    this.props.fetchWarnings();
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
        Number(bussines.balances.ready_to_access) > 0) ||
      (!isNaN(bussines.balances.balance) &&
        Number(bussines.balances.balance) > 0) ||
      (!isNaN(bussines.balances.initial_credit) &&
        Number(bussines.balances.initial_credit) > 0)
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
    this.removeOverdraftBox();
    this.props.setOverdraft(this.state.businessSelected, value);
  }

  removeOverdraftBox() {
    this.setState({
      overdraftBox: false,
      businessSelected: null
    });
  }

  changePage(page) {
    this.setState({ page });
    this.fetchData({
      filters: this.state.filters,
      order: this.state.order,
      page: page
    });
    //Try to scroll up
    try {
      //STORES LIST > ISO LAYOUT > ANT LAYOUT > MAIN LAYOUT
      this.mainScroll.parentElement.parentElement.parentElement.scrollTo(0, 0);
    } catch (e) {
      console.log("Parent element not found - list.js");
    }
  }

  renderStores() {
    
    return (
      <div
        style={{ width: "100%" }}
        ref={el => {
          this.mainScroll = el;
        }}
      >
        {this.props.actionLoading === false ? (
          this.props.businesses.map(store => (
            <StoreCard
              {...store}
              key={store.id}
              overdraft={this.showOverdraft}
              accounts={this.accounts}
              edit={this.edit}
              warnings={this.props.warnings}
            />
          ))
        ) : (
          <div style={{ width: "100%", textAlign: "center" }}>
            <PageLoading />
          </div>
        )}
        {this.props.businesses.length === 0 &&
        this.props.actionLoading === false ? (
          <Alert
            message="Ups!"
            type="warning"
            description={<IntlMessages id={"stores.notFound"} />}
            style={{ margin: "20px 0" }}
          />
        ) : (
          false
        )}
        <Pagination
          defaultCurrent={this.state.page}
          total={this.props.totalBusiness - 1}
          onChange={this.changePage}
        />
      </div>
    );
  }

  render() {
    return (
      <LayoutContentWrapper>
        <PageHeader>
          <IntlMessages id="sidebar.stores" defaultMessage="Stores" />
        </PageHeader>

        <MessageBox
          msg={this.props.msg}
          error={this.props.error}
          clean={this.props.removeMsg}
        />
        <Filters
          onChange={data => {
            this.setState({ filters: data, page: 1 });
            this.fetchData({ filters: data, page: 1 });
          }}
        />
        <StoreOverdarfBox
          visible={this.state.overdraftBox}
          business={this.state.businessSelected}
          cancel={this.removeOverdraftBox}
          submit={this.submitOverdraftBox}
        />

        {this.props.loading || this.props.businesses === null ? (
          <PageLoading />
        ) : (
          this.renderStores()
        )}
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = state => ({
  warnings: state.Owner.parameters ? state.Owner.parameters.warnings || {} : {},
  businesses: state.Owner.stores,
  totalBusiness: state.Owner.totalStores,
  loading: state.Owner.loading,
  actionLoading: state.Owner.actionLoading,
  setting_overdraft: state.Owner.setting_overdraft,
  error: state.Owner.error,
  msg: state.Owner.msg,
  keys: state.Auth.keys
});

const mapDispatchToProps = dispatch => ({
  fetch: bindActionCreators(actions.fetchListBusinesses, dispatch),
  fetchWarnings: bindActionCreators(actions.fetchParameteres, dispatch),
  setOverdraft: bindActionCreators(actions.overdraft, dispatch),
  removeMsg: bindActionCreators(actions.removeMsg, dispatch),
  goTo: url => dispatch(push(url))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListStores);
