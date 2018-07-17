import React, { Component } from "react";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";
import PageLoading from "../../../components/pageLoading";
import IntlMessages from "../../../components/utility/intlMessages";
import MessageBox from "../../../components/MessageBox";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import apiActions from "../../../redux/api/actions";

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.fetchCategories();
  }

  renderPage() {
    return (
      <ul>
        {this.props.categories.map(category => (
          <li>
            {category.name}
            <ul>
              {this.props.subcategories
                .filter(subcategory => subcategory.parent_id === category.id)
                .map(subcategory => <li>{subcategory.name}</li>)}
            </ul>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    return (
      <LayoutContentWrapper>
        <MessageBox
          msg={this.props.msg}
          error={this.props.error}
          clean={this.props.removeMsg}
        />
        <PageHeader>
          <IntlMessages id="sidebar.businessCategories" />
        </PageHeader>
        {this.props.loading === false ? this.renderPage() : <PageLoading />}
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = state => ({
  categories: state.Api.categoriesList.filter(x => x.parent_id === 0) || [],
  subcategories: state.Api.categoriesList.filter(x => x.parent_id !== 0) || [],
  loading: state.Api.actionLoading,
  error: state.Api.error,
  msg: state.Api.msg
});

const mapDispatchToProps = dispatch => ({
  fetchCategories: bindActionCreators(apiActions.getCategoriesList, dispatch),
  removeMsg: bindActionCreators(apiActions.cleanMsg, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Categories);
