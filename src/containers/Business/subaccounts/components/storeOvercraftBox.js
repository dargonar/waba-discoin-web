import React, { Component } from "react";
import { Modal } from "antd";
import Input from "../../../../components/uielements/input";
import IntlMessages from "../../../../components/utility/intlMessages";

class StoreOverdarfBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
    this.submit = this.submit.bind(this);
    this.cancel = this.cancel.bind(this);
  }
  submit() {
    if (this.props.value === this.state.value) this.props.submit();
    else this.props.submit(this.state.value);

    this.setState({ value: null });
  }
  cancel() {
    this.props.cancel();
    this.setState({ value: null });
  }
  render() {
    if (this.props.visible === true) {
      if (this.state.value === null) {
        this.setState({ value: this.props.value || 0 });
      }
      return (
        <Modal
          visible={
            typeof this.props.business.name !== "undefined" ? true : false
          }
          title={
            this.props.title || (
              <b>
                <IntlMessages
                  id="subaccounts.allocateCredit"
                  defaultValue="Allocate pre-arranged credit"
                />
              </b>
            )
          }
          onOk={this.submit}
          onCancel={this.cancel}
        >
          <label>{this.props.visible}</label>
          <Input
            type="number"
            defaultValue={
              this.props.business.initial_credit || this.props.value || 0
            }
            onChange={e => this.setState({ value: e.target.value })}
          />
          <br />
        </Modal>
      );
    } else {
      return false;
    }
  }
}

export default StoreOverdarfBox;
