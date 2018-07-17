import React, { Component } from "react";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";
import PageLoading from "../../../components/pageLoading";
import IntlMessages from "../../../components/utility/intlMessages";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import apiActions from "../../../redux/api/actions";
import CategoryModal from "./components/categoryModal";

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: {
        visible: false,
        form: {}
      }
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.submitCategory = this.submitCategory.bind(this);
  }

  componentWillMount() {
    this.props.fetchCategories();
  }

  toggleModal() {
    this.setState({
      modal: {
        form: {},
        visible: !this.state.modal.visible
      }
    });
  }

  submitCategory(data) {
    console.log("CREATE OR UPDATE CATEGORY", data);
    this.toggleModal();
  }

  renderPage() {
    const printCategoryItem = data => (
      <span key={data.id} onClick={() => this.showEdit(data)}>
        {data.name}
      </span>
    );

    return (
      <div>
        <button onClick={this.toggleModal}>Add new</button>
        {this.state.modal.visible ? (
          <CategoryModal
            {...this.state.modal}
            onCancel={this.toggleModal}
            onOk={this.submitCategory}
            categories={this.props.categories}
          />
        ) : (
          false
        )}
        <ul>
          {this.props.categories.map(category => (
            <li key={category.id}>
              {printCategoryItem(category)}
              <ul>
                {this.props.subcategories
                  .filter(subcategory => subcategory.parent_id === category.id)
                  .map(subcategory => (
                    <li>{printCategoryItem(subcategory)}</li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  showEdit(categotyData) {
    this.setState({
      modal: {
        ...this.state.modal,
        visible: true,
        form: {
          ...categotyData
        }
      }
    });
  }

  render() {
    return (
      <LayoutContentWrapper>
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
