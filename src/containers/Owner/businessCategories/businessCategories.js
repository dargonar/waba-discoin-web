import React, { Component } from "react";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper";
import CategoryTableWrapper from "./businessCategories.style";
import PageHeader from "../../../components/utility/pageHeader";
import PageLoading from "../../../components/pageLoading";
import IntlMessages from "../../../components/utility/intlMessages";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import apiActions from "../../../redux/api/actions";
import CategoryModal from "./components/categoryModal";
import Button from "../../../components/uielements/button";

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
    this.deleteCategory = this.deleteCategory.bind(this);
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
    this.props.saveCategory(data);
    this.toggleModal();
  }

  deleteCategory(id) {
    this.props.deleteCategory(id);
    this.toggleModal();
  }

  renderPage() {
    const printCategoryItem = (data, parent) => (
      <span key={data.id} onClick={() => this.showEdit(data)}>
        {data.name} {parent ? `(%${data.discount})` : false}
      </span>
    );

    return (
      <CategoryTableWrapper>
        {this.state.modal.visible ? (
          <CategoryModal
            {...this.state.modal}
            onCancel={this.toggleModal}
            onOk={this.submitCategory}
            onDelete={this.deleteCategory}
            categories={this.props.categories}
          />
        ) : (
          false
        )}
        <ul>
          {this.props.categories.map(category => (
            <li key={category.id} className="category">
              {printCategoryItem(category, true)}
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
        <Button
          type="primary"
          onClick={this.toggleModal}
          className="pull-right"
        >
          Add new
        </Button>
      </CategoryTableWrapper>
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
  saveCategory: bindActionCreators(apiActions.addOrUpdateCategory, dispatch),
  deleteCategory: bindActionCreators(apiActions.deleteCategory, dispatch),
  removeMsg: bindActionCreators(apiActions.cleanMsg, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Categories);
