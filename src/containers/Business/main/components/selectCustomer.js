import React, { Component } from "react";
import { Modal, List } from "antd";
import IntlMessages from "../../../../components/utility/intlMessages";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../../redux/api/actions";
import HashImg from "../../../../components/hashImage";
import { injectIntl } from "react-intl";
import { Row, Col, Input } from "antd";

const InputSearch = Input.Search;

class CustomerPicker extends Component {
  constructor(props) {
    super(props);
    this._handleChange = this._handleChange.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
    this.state = { searchValue: undefined };
  }

  componentWillReceiveProps(newProps) {
    if (this.props.visible !== newProps.visible && newProps.visible === true) {
      this.props.searchAccount();
    }
  }

  _handleChange(e) {
    this.setState({ searchValue: e.target.value });
  }

  _handleKeyPress(e) {
    let searchValue = this.state.searchValue;
    console.log(" -- _handleKeyPress:", { value: searchValue });
    if (e.key === "Enter") {
      this.props.searchAccount(searchValue);
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
        <Row gutter={16} justify="start">
          <Col xs={24} style={{ marginBottom: "15px" }}>
            <InputSearch
              placeholder={
                this.props.intl.messages["refund.searchCustomer"] ||
                "Search Customer"
              }
              onKeyPress={this._handleKeyPress}
              onSearch={() => this.props.searchAccount(this.state.searchValue)}
              onChange={this._handleChange}
              enterButton={
                <IntlMessages
                  defaultMessage="Force Search"
                  id="refund.forceSearch"
                />
              }
            />
          </Col>
          <Col xs={24}>
            <List
              loading={this.props.isLoading}
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
          </Col>
        </Row>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  customers: state.Api.customers || [],
  isLoading: state.Api.actionLoading
});

const dispatchToProps = dispatch => ({
  searchAccount: bindActionCreators(actions.searchAccount, dispatch)
});

export default connect(
  mapStateToProps,
  dispatchToProps
)(injectIntl(CustomerPicker));
