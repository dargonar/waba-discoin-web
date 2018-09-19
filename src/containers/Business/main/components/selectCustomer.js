import React, { Component } from "react";
import { Modal, List } from "antd";
import IntlMessages from "../../../../components/utility/intlMessages";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../../redux/api/actions";
import HashImg from "../../../../components/hashImage";

class CustomerPicker extends Component {
  componentWillReceiveProps(newProps) {
    if (this.props.visible !== newProps.visible && newProps.visible === true) {
      this.props.searchAccount();
    }
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        title={
          <IntlMessages
            defaultMessage="Select customer"
            id="businessMain.selectCustomer"
          />
        }
        footer={null}
        onCancel={this.props.onCancel}
      >
        <List
          dataSource={this.props.customers}
          renderItem={customer => (
            <List.Item
              onClick={() => this.props.onSelect(customer)}
              style={{ cursor: "pointer" }}
            >
              <List.Item.Meta
                title={customer.name}
                avatar={<HashImg text={customer.name} size={50} />}
              />
            </List.Item>
          )}
        />
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  customers: state.Api.customers || []
});

const dispatchToProps = dispatch => ({
  searchAccount: bindActionCreators(actions.searchAccount, dispatch)
});

export default connect(
  mapStateToProps,
  dispatchToProps
)(CustomerPicker);
