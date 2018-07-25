import React, { Component } from "react";
import { Form, Col, Row } from "antd";
import Select, { SelectOption } from "../../../../components/uielements/select";
import Checkbox from "../../../../components/uielements/checkbox";
import Input from "../../../../components/uielements/input";
import IntlMessages from "../../../../components/utility/intlMessages";

import { connect } from "react-redux";
import intlMessages from "../../../../components/utility/intlMessages";
import { injectIntl } from "react-intl";

export class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.formChange = this.formChange.bind(this);
  }

  formChange() {
    let formValue = this.props.form.getFieldsValue();
    let result = {
      orders: [], // to implement
      filters: []
    };

    //SEARCH
    if (formValue.name && formValue.name !== "") {
      result.filters = result.filters.concat({
        filter: "search",
        arg: formValue.name
      });
    }

    //OVERDRAFT
    if (formValue.overdraft === true) {
      result.filters = result.filters.concat({
        filter: "overdraft",
        arg: formValue.overdraft
      });
    }

    //CATEGORY
    if (typeof formValue.category !== "undefined") {
      result.filters = result.filters.concat({
        filter: "category",
        arg: formValue.category
      });
    }

    //OVERDRAFT
    if (typeof formValue.subcategory !== "undefined") {
      result.filters = result.filters.concat({
        filter: "subcategory",
        arg: formValue.subcategory
      });
    }

    this.props.onChange(result);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onChange={this.formChange} style={{ width: "100%" }}>
        <Row gutter={12}>
          <Col md={6}>
            <Form.Item label={<IntlMessages id="filter.storeName" />}>
              {getFieldDecorator("name", {})(<Input />)}
            </Form.Item>
          </Col>
          <Col md={6}>
            <Form.Item label={<IntlMessages id="filter.category" />}>
              {getFieldDecorator("category", {})(
                <Select
                  onChange={value => {
                    // Clean subcategory selectbox
                    this.props.form.setFieldsValue({
                      subcategory: undefined,
                      category: value
                    });
                    // Trigger from change
                    this.formChange();
                  }}
                >
                  {this.props.categories.map(category => (
                    <SelectOption value={category.id}>
                      {category.name}
                    </SelectOption>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={6}>
            <Form.Item label={<IntlMessages id="filter.subcategory" />}>
              {getFieldDecorator("subcategory", {})(
                <Select
                  onChange={value => {
                    this.props.form.setFieldsValue({
                      subcategory: value
                    });
                    this.formChange();
                  }}
                >
                  {this.props.subcategories
                    .filter(
                      category =>
                        category.parent_id ===
                        this.props.form.getFieldValue("category")
                    )
                    .map(category => (
                      <SelectOption value={category.id}>
                        {category.name}
                      </SelectOption>
                    ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={6}>
            <Form.Item label={<IntlMessages id="filter.overdraft" />}>
              {getFieldDecorator("overdraft", {
                initialValue: false
              })(<Checkbox />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

const FiltersForm = Form.create()(injectIntl(Filters));

export default connect(state => ({
  categories: state.Api.categoriesList.filter(cat => cat.parent_id === 0),
  subcategories: state.Api.categoriesList.filter(cat => cat.parent_id > 0)
}))(FiltersForm);
