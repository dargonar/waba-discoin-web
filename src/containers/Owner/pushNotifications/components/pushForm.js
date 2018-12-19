import React, { Component } from "react";
import { Input, Row, Col, Form, Modal } from "antd";
import Button from "../../../../components/uielements/button";
import IntlMessages from "../../../../components/utility/intlMessages";
import { currency } from "../../../../config";
import uuid from "uuid/v4";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 9 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 }
  }
};

export class PushForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      form: {}
    };
    this.send = this.send.bind(this);
    this.toggle = this.toggle.bind(this);
    this.changeField = this.changeField.bind(this);
  }

  changeField(key, value) {
    this.setState({
      form: {
        ...this.state.form,
        [key]: value
      }
    });
  }

  send() {
    this.props.onSend({ ...this.state.form, hash: uuid() });
    this.toggle();
  }

  toggle() {
    this.setState({ visible: !this.state.visible, form: {} });
  }

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.toggle}>
          New message
        </Button>
        <Modal
          visible={this.state.visible}
          title={<IntlMessages id="sidebar.pushNotifications" defaultMessage="Push Notificactions" />}
          okText={<IntlMessages id="push.send" defaultMessage="Send" />}
          onOk={this.send}
          onCancel={this.toggle}
        >
          <Row style={{ flex: 1 }}>
            <Col sm={24}>
              <Form.Item {...formItemLayout} label={<IntlMessages defaultMessage="Title" id="push.title" />}>
                <Input onChange={e => this.changeField("title", e.target.value)} />
              </Form.Item>
              <Form.Item {...formItemLayout} label={<IntlMessages defaultMessage="Short message" id="push.shortMessage" />}>
                <Input onChange={e => this.changeField("short_message", e.target.value)} />
              </Form.Item>
              <Form.Item {...formItemLayout} label={<IntlMessages defaultMessage="Image url" id="push.imageUrl" />}>
                <Input onChange={e => this.changeField("image_url", e.target.value)} />
              </Form.Item>
              <Form.Item {...formItemLayout} label={<IntlMessages defaultMessage="Bajada" id="push.bajada" />}>
                <Input onChange={e => this.changeField("bajada", e.target.value)} />
              </Form.Item>
              <Form.Item {...formItemLayout} label={<IntlMessages defaultMessage="Remate" id="push.remate" />}>
                <Input onChange={e => this.changeField("remate", e.target.value)} />
              </Form.Item>
              <Form.Item {...formItemLayout} label={<IntlMessages defaultMessage="Bussines Id" id="push.bussinesId" />}>
                <Input onChange={e => this.changeField("bussines_id", e.target.value)} />
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label={<IntlMessages defaultMessage="Amount of {symbol}" id="push.amount" values={{ symbol: currency.symbol }} />}
              >
                <Input type="number" min="0" onChange={e => this.changeField("bussines_id", e.target.value)} />
              </Form.Item>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
