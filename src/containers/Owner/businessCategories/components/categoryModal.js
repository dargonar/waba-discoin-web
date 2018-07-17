import React, { Component } from "react";
import IntlMessages from "../../../../components/utility/intlMessages";
import { Modal, Form } from "antd";
import Input from "../../../../components/uielements/input";
import Select, { SelectOption } from "../../../../components/uielements/select";

export default class CategoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDiscount: true,
      form: {
        name: undefined,
        description: undefined,
        discount: undefined,
        parent_id: 0
      }
    };
    this.submit = this.submit.bind(this);
    this.changeForm = this.changeForm.bind(this);
  }

  submit() {
    let formValue = this.state.form;
    if (formValue.parent_id !== 0) {
      delete formValue.discount;
    }
    this.props.onOk(formValue);
  }

  componentWillMount() {
    this.setState({
      form: this.props.form
    });
  }

  changeForm(field, value) {
    let form = this.state.form;
    form[field] = value;
    this.setState({ form });
  }

  render() {
    return (
      <Modal
        title={
          this.props.form.id ? (
            <IntlMessages id={"Edit Category"} />
          ) : (
            <IntlMessages id={"Add Category"} />
          )
        }
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        onOk={this.submit}
      >
        <Form>
          <label>
            <IntlMessages id={"Name"} />
          </label>
          <Input
            defaultValue={this.props.form.name}
            onChange={e => this.changeForm("name", e.target.value)}
          />
          <label>
            <IntlMessages id={"Description"} />
          </label>
          <Input
            defaultValue={this.props.form.description}
            onChange={e => this.changeForm("description", e.target.value)}
          />
          <label>
            <IntlMessages id={"Parent Category"} />
          </label>
          <Select
            style={{ width: "100%" }}
            defaultValue={this.props.form.parent_id || 0}
            onChange={value => this.changeForm("parent_id", value)}
          >
            <SelectOption value={0}>
              <IntlMessages id={"None"} />
            </SelectOption>
            {this.props.categories.map(category => (
              <SelectOption value={category.id}>{category.name}</SelectOption>
            ))}
          </Select>
          {this.state.form.parent_id ? (
            false
          ) : (
            <div>
              <label>
                <IntlMessages id={"Discount"} />
              </label>
              <Input
                type="number"
                addonBefore="%"
                defaultValue={Number(this.props.form.discount) || 0}
                onChange={e => this.changeForm("discount", e.target.value)}
              />
            </div>
          )}
        </Form>
      </Modal>
    );
  }
}
