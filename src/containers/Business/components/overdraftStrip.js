import React, { Component } from "react";
import { Modal } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { StripMessage } from "../../../components/uielements/stripMessage";
import IntlMessage from "../../../components/utility/intlMessages";
import actions from "../../../redux/api/actions";
import appActions from "../../../redux/app/actions";
import { currency } from "../../../config";
import { getOverdraft, hasInitialCredit } from "../../../redux/api/selectors/business.selectors";
import { key } from "bitsharesjs";

class OverdraftStrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirm_overdraft_visible: false
    };
    this.doApplyOverdraft = this.doApplyOverdraft.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  doApplyOverdraft() {
    this.props.applyOverdraft();
    this.toggleModal();
  }

  toggleModal() {
    this.setState({ confirm_overdraft_visible: !this.state.confirm_overdraft_visible });
  }

  render() {
    const { hasInitialCredit, readyToAccess, ignoreOverdraft } = this.props;
    return hasInitialCredit && !ignoreOverdraft ? (
      // return !this.props.ignoreOverdraft ? ( //  <--- for debug
      <div>
        <Modal
          visible={this.state.confirm_overdraft_visible}
          title={<IntlMessage defaultMessage="Credit available" id="dashboard.overdraftAvailable" />}
          onOk={this.doApplyOverdraft}
          onCancel={this.toggleModal}
        >
          <label>
            <IntlMessage id="dashboard.acceptAvailableOverdraft" defaultMessage="Do you wish to accept the available overdraft?" />
          </label>
        </Modal>
        <StripMessage
          visible={true}
          type={"info"}
          msg={
            <IntlMessage
              id={"dashboard.overdraftQuestion"}
              defaultMessage={`You have a {symbol}{value} credit available. You want to take it?`}
              values={{
                symbol: currency.symbol,
                value: Number(readyToAccess).toLocaleString()
              }}
            />
          }
          actions={[
            {
              msg: <IntlMessage id="apply" defaultMessage="Apply" />,
              onClick: () => this.toggleModal()
            },
            {
              msg: <IntlMessage id="ignore" defaultMessage="Ignore" />,
              onClick: () => this.props.toggleOverdraft()
            }
          ]}
        />
      </div>
    ) : (
      false
    );
  }
}

export default connect(
  state => ({
    ignoreOverdraft: state.App.toJS().ignoreOverdraft,
    hasInitialCredit: hasInitialCredit(state),
    readyToAccess: getOverdraft(state) || 0
  }),
  dispatch => ({
    toggleOverdraft: () => dispatch(appActions.toggleOverdraft()),
    cleanMsg: bindActionCreators(actions.cleanMsg, dispatch),
    applyOverdraft: bindActionCreators(actions.applyOverdraft, dispatch)
  })
)(OverdraftStrip);
