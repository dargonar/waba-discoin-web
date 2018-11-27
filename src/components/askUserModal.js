import React, { Component } from "react";
import { Modal } from "antd";
import { connect } from "react-redux";
import actionsUI from "../redux/app/actions";
import authActions from "../redux/auth/actions";
import { bindActionCreators } from "redux";
import IntlMessages from "./utility/intlMessages";

class PrompLogin extends Component {
  render() {
    const { account, isEncrypted, onOk, onCancel } = this.props;
    return (
      <Modal visible={isEncrypted} onOk={onOk} onCancel={onCancel}>
        <IntlMessages
          id={"userBox.message"}
          defaultMessage={"Are you {account} ({account_id})?"}
          values={{ ...account }}
        />
      </Modal>
    );
  }
}

export default connect(
  state => ({
    isEncrypted: state.Auth.encrypted,
    account: { account: state.Auth.account, account_id: state.Auth.account_id }
  }),
  dispatch => ({
    onOk: bindActionCreators(actionsUI.togglePasswordBox, dispatch),
    onCancel: bindActionCreators(authActions.logout, dispatch)
  })
)(PrompLogin);
