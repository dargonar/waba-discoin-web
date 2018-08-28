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

import Pagination from "../../../components/uielements/pagination";

import { push } from "react-router-redux";

import Filters from "./components/filters";
import { void_result } from "bitsharesjs/dist/serializer/src/operations";

function resolve(path, obj) {
  return path.split(".").reduce(function(prev, curr) {
    return prev ? prev[curr] : undefined;
  }, obj);
}

const filters = {
  search: (arg, business) => {
    return (
      business.account.toLowerCase().indexOf(arg.toLowerCase()) > -1 ||
      business.description.toLowerCase().indexOf(arg.toLowerCase()) > -1
    );
  },
  category: (arg, business) => business.category_id === arg,
  subcategory: (arg, business) => business.subcategory_id === arg,
  overdraft: (arg, business) => {
    if (arg === false) {
      return true;
    }
    return (!isNaN(business.balances.ready_to_access) &&
      parseInt(business.balances.ready_to_access) > 0) ||
      (!isNaN(business.balances.balance) &&
        parseInt(business.balances.balance) > 0) ||
      (!isNaN(business.balances.initial_credit) &&
        parseInt(business.balances.initial_credit) > 0)
      ? true
      : false;
  },
  value: (arg, business) => {
    switch (arg.action) {
      case "minor":
        return Number(resolve(arg.path, business)) < arg.amount;
      case "equal":
        return Number(resolve(arg.path, business)) === arg.amount;
      case "greater":
        return Number(resolve(arg.path, business)) > arg.amount;
      default:
        return false;
    }
  }
};

const order = (path, businesses, direction) => {
  const mult = direction === "ASC" ? 1 : -1;
  return businesses.sort(
    (a, b) =>
      resolve(path, a)
        .toString()
        .toLowerCase() <
      resolve(path, b)
        .toString()
        .toLowerCase()
        ? -1 * mult
        : 1 * mult
  );
};

const range = (businesses, page, size) => {
  const to = page * size - 1;
  const from = to - size - 1;
  return businesses.filter((business, key) => key > from && key <= to);
};

class ListStores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      overdraftBox: false,
      businessSelected: null,
      filters: [],
      orders: []
    };
    this.renderStores = this.renderStores.bind(this);
    this.submitOverdraftBox = this.submitOverdraftBox.bind(this);
    this.removeOverdraftBox = this.removeOverdraftBox.bind(this);
    this.showOverdraft = this.showOverdraft.bind(this);
    this.edit = this.edit.bind(this);
    this.accounts = this.accounts.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  applyFilters(businesses) {
    if (this.state.filters.length === 0) {
      return businesses;
    }
    let result = businesses.filter(
      business =>
        this.state.filters
          .map(item => filters[item.filter](item.arg, business)) // Check filters
          .reduce((prev, curr) => (!prev ? false : curr), true) // Check if one is false
    );
    console.log(result);
    return result;
  }

  applyOrder(businesses) {
    if (this.state.orders.length === 0) {
      return businesses;
    }
    return this.state.orders.reduce(
      (prev, act) => order(act.path, prev, act.type),
      businesses
    );
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

  changePage(page) {
    this.setState({ page });
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
        <Filters
          onChange={data => this.setState({ filters: data.filters, page: 1 })}
        />
        {range(
          this.applyOrder(this.applyFilters(this.props.business)),
          this.state.page,
          10
        ).map(store => (
          <StoreCard
            {...store}
            key={store.id}
            overdraft={this.showOverdraft}
            accounts={this.accounts}
            edit={this.edit}
            warnings={this.props.warnings}
          />
        ))}
        <Pagination
          defaultCurrent={this.state.page}
          total={this.applyFilters(this.props.business).length}
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
  warnings: state.Owner.parameters ? state.Owner.parameters.warnings || {} : {},
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
  fetchWarnings: bindActionCreators(actions.fetchParameteres, dispatch),
  setOverdraft: bindActionCreators(actions.overdraft, dispatch),
  removeMsg: bindActionCreators(actions.removeMsg, dispatch),
  goTo: url => dispatch(push(url))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListStores);
