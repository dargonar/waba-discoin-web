import React, { Component } from "react";
import { Modal } from "antd";
import Input from "../../../../components/uielements/input";
import IntlMessages from "../../../../components/utility/intlMessages";
import { injectIntl } from "react-intl";

class LocalLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
    this.submit = this.submit.bind(this);
    this.cancel = this.cancel.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
  }

  _handleKeyPress(e) {
    if (e.key === "Enter") {
      this.submit();
    }
  }

  submit() {
    this.props.submit(this.state.value);
    this.setState({ value: null });
  }
  cancel() {
    this.props.cancel();
    this.setState({ value: null });
  }
  render() {
    return (
      <Modal
        visible={this.props.visible}
        title={
          <IntlMessages
            defaultMessage="Resume session"
            id="localLogin.resume"
          />
        }
        onOk={this.submit}
        onCancel={this.cancel}
      >
        <Input
          type="password"
          placeholder={
            this.props.intl.messages["core.sessionPassword"] ||
            "Local storage password"
          }
          onKeyPress={this._handleKeyPress}
          onChange={e => this.setState({ value: e.target.value })}
        />
        <br />
      </Modal>
    );
  }
}

export default injectIntl(LocalLogin);
