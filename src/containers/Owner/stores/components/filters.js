import React, { Component } from "react";
import { Form, Col, Row } from "antd";
import Select, { SelectOption } from "../../../../components/uielements/select";
import Checkbox from "../../../../components/uielements/checkbox";
import Input from "../../../../components/uielements/input";
import IntlMessages from "../../../../components/utility/intlMessages";

import { connect } from "react-redux";
import { injectIntl } from "react-intl";

export class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.formChange = this.formChange.bind(this);
  }

  formChange() {
    const formValue = this.props.form.getFieldsValue();
    console.log("FOOO", formValue);
    this.props.onChange(formValue);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onChange={this.formChange} style={{ width: "100%" }}>
        <Row gutter={12}>
          <Col md={4}>
            <Form.Item
              label={
                <IntlMessages
                  defaultMessage="Store name"
                  id="filter.storeName"
                />
              }
            >
              {getFieldDecorator("search_text", {})(<Input />)}
            </Form.Item>
          </Col>
          <Col md={5}>
            <Form.Item
              label={
                <IntlMessages defaultMessage="Category" id="filter.category" />
              }
            >
              {getFieldDecorator("selected_categories[0]", {})(
                <Select
                  onChange={value => {
                    // Clean subcategory selectbox
                    let values = this.props.form.getFieldsValue();
                    values.selected_categories[0] = value;
                    values.selected_categories[1] = undefined;
                    this.props.form.setFieldsValue(values);
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
          <Col md={5}>
            <Form.Item
              label={
                <IntlMessages
                  id="filter.subcategory"
                  defaultMessage="Subcategory"
                />
              }
            >
              {getFieldDecorator("selected_categories[1]", {})(
                <Select
                  onChange={value => {
                    let values = this.props.form.getFieldsValue();
                    values.selected_categories[1] = value;
                    this.props.form.setFieldsValue(values);
                    this.formChange();
                  }}
                >
                  {this.props.subcategories
                    .filter(
                      category =>
                        category.parent_id ===
                        this.props.form.getFieldValue("selected_categories[0]")
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
          <Col md={5}>
            <Form.Item
              label={
                <IntlMessages
                  id="filter.overdraft"
                  defaultMessage="Overdraft only"
                />
              }
            >
              {getFieldDecorator("credited", {})(
                <Select
                  name="filter.credited"
                  onChange={value => {
                    let values = this.props.form.getFieldsValue();
                    values.credited = value;
                    this.props.form.setFieldsValue(values);
                    this.formChange();
                  }}
                >
                  <SelectOption key="credited_none" value={undefined}>
                    <IntlMessages defaultMessage="None" id="filter.none" />
                  </SelectOption>
                  <SelectOption key="credited_credit" value={"credit"}>
                    <IntlMessages
                      defaultMessage="Credited"
                      id="filter.credited"
                    />
                  </SelectOption>
                  <SelectOption key="credited_no-credit" value={"no-credited"}>
                    <IntlMessages
                      defaultMessage="No credit"
                      id="filter.noCredit"
                    />
                  </SelectOption>
                  <SelectOption
                    key="credited_overdraft_send"
                    value={"overdraft_send"}
                  >
                    <IntlMessages
                      defaultMessage="Overdraft send"
                      id="filter.overdraftSend"
                    />
                  </SelectOption>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={5}>
            <Form.Item
              label={
                <IntlMessages
                  id="filter.paymentMethods"
                  defaultMessage="Payment methods"
                />
              }
            >
              {getFieldDecorator("payment_methods", {})(
                <Select
                  mode="multiple"
                  name="filter.payment_methods"
                  onChange={values => {
                    let formValues = this.props.form.getFieldsValue();
                    formValues.payment_methods = values;
                    this.props.form.setFieldsValue(formValues);
                    this.formChange();
                  }}
                >
                  <SelectOption value={"cash"}>
                    <IntlMessages defaultMessage="Cash" id="filter.cash" />
                  </SelectOption>
                  <SelectOption value={"debit_card"}>
                    <IntlMessages
                      defaultMessages="Debit Card"
                      id="filter.debitCard"
                    />
                  </SelectOption>
                  <SelectOption value={"credit_card"}>
                    <IntlMessages
                      defaultMessages="Credit Card"
                      id="filter.creditCard"
                    />
                  </SelectOption>
                </Select>
              )}
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
