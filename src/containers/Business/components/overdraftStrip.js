import React, { Component } from "react";
import { Modal } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { StripMessage } from "../../../components/uielements/stripMessage";
import IntlMessage from "../../../components/utility/intlMessages";
import actions from "../../../redux/api/actions";
import appActions from "../../../redux/app/actions";
import { currency } from "../../../config";

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
    const hasOverdraft =
      (typeof this.props.business != 'undefined') && this.props.business !== null && this.props.business.balances !== null && !isNaN(this.props.business.balances.ready_to_access) && Number(this.props.business.balances.ready_to_access) > 0;

    if(hasOverdraft)
      console.log(' ---------- OverdraftStrip:', this.props.business.balances.ready_to_access);
    //return !hasOverdraft && this.props.ignoreOverdraft ? (
    return (!this.props.ignoreOverdraft&&hasOverdraft) ? (
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
                value: Number(this.props.business.balances.ready_to_access).toLocaleString()
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
    business: state.Api.business
  }),
  dispatch => ({
    toggleOverdraft: () => dispatch(appActions.toggleOverdraft()),
    cleanMsg: bindActionCreators(actions.cleanMsg, dispatch),
    applyOverdraft: bindActionCreators(actions.applyOverdraft, dispatch)
  })
)(OverdraftStrip);
