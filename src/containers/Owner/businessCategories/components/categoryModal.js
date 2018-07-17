import React, { Component } from "react";
import IntlMessages from "../../../../components/utility/intlMessages";
import { Modal, Form } from "antd";
import Input from "../../../../components/uielements/input";
import Select, { SelectOption } from "../../../../components/uielements/select";

export default class CategoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.submit = this.submit.bind(this);
  }

  submit() {
    this.props.onOk(this.props.form);
  }

  render() {
    return (
      <Modal
        title={this.props.edit ? "Edit category" : "Add category"}
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        onOk={this.submit}
      >
        <Form>
          <label>Name</label>
          <Input defaultValue={this.props.form.name} />
          <label>Description</label>
          <Input defaultValue={this.props.form.description} />
          <label>Parent category</label>
          <Select
            style={{ width: "100%" }}
            defaultValue={this.props.form.parent_id}
          >
            {this.props.categories.map(category => (
              <SelectOption value={category.id}>{category.name}</SelectOption>
            ))}
          </Select>
          <label>Discount</label>
          <Input
            type="number"
            defaultValue={Number(this.props.form.discount) || 0}
          />
        </Form>
      </Modal>
    );
  }
}
