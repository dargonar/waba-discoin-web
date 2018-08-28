import React, { Component } from "react";
import IntlMessages from "../../../../components/utility/intlMessages";
import { Modal, Form, Button, Popconfirm } from "antd";
import Input from "../../../../components/uielements/input";
import Select, { SelectOption } from "../../../../components/uielements/select";

export default class CategoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDiscount: true,
      form: {
        name: "",
        description: "",
        discount: 0,
        parent_id: 0
      }
    };
    this.submit = this.submit.bind(this);
    this.changeForm = this.changeForm.bind(this);
  }

  submit() {
    this.props.onOk(this.state.form);
  }

  componentWillMount() {
    this.setState({
      form: {
        ...this.state.form,
        ...this.props.form
      }
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
            <IntlMessages
              defaultMessage={"Edit Category"}
              id="bCategories.edit"
            />
          ) : (
            <IntlMessages
              defaultMessage={"Add Category"}
              id="bCategories.add"
            />
          )
        }
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        onOk={this.submit}
        footer={
          <div>
            {this.props.form.id ? (
              <Popconfirm
                title={
                  <IntlMessages
                    id="bCategories.confirmMsg"
                    defaultMessage={
                      "Are you sure you want to remove this category?"
                    }
                  />
                }
                okText={<IntlMessages id="Yes" />}
                cancelText={<IntlMessages id="No" />}
                onConfirm={() => this.props.onDelete(this.props.form.id)}
              >
                <Button type="danger">
                  <IntlMessages
                    defaultMessage="Delete"
                    id="bCategories.delete"
                  />
                </Button>
              </Popconfirm>
            ) : (
              false
            )}
            <Button type="" onClick={this.props.onCancel}>
              <IntlMessages defaultMessage="Cancel" id="bCategories.cancel" />
            </Button>
            <Button type="primary" onClick={this.submit}>
              <IntlMessages defaultMessage="Save" id="bCategories.save" />
            </Button>
          </div>
        }
      >
        <Form>
          <label>
            <IntlMessages defaultMessage={"Name"} id="bCategories.nam,e" />
          </label>
          <Input
            defaultValue={this.props.form.name}
            onChange={e => this.changeForm("name", e.target.value)}
          />
          <label>
            <IntlMessages
              defaultMessage={"Description"}
              id="bCategories.description"
            />
          </label>
          <Input
            defaultValue={this.props.form.description}
            onChange={e => this.changeForm("description", e.target.value)}
          />
          <label>
            <IntlMessages
              defaultMessage={"Parent Category"}
              id="bCategories.parentCategory"
            />
          </label>
          <Select
            style={{ width: "100%" }}
            defaultValue={this.props.form.parent_id || 0}
            onChange={value => this.changeForm("parent_id", value)}
          >
            <SelectOption value={0}>
              <IntlMessages defaultMessage={"None"} id="bCategories.none" />
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
                <IntlMessages
                  defaultMessage={"Discount"}
                  id="bCategories.discount"
                />
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
