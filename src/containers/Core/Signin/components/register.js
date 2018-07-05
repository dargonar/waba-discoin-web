import React, { Component } from "react";
import IntlMessages from "../../../../components/utility/intlMessages";
import { Modal, notification } from "antd";
import Form from "../../../../components/uielements/form";
import Input from "../../../../components/uielements/input";
import Button from "../../../../components/uielements/button";
import Select, { SelectOption } from "../../../../components/uielements/select";
import { injectIntl } from "react-intl";
import Steps from "../../../../components/uielements/steps";
import PageLoading from "../../../../components/pageLoading";
import { ChainValidation } from "bitsharesjs";
import { getPath } from "../../../../httpService";
import { recoverAccountFromSeed } from "../../../../utils";
import { connect } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import bip39 from "bip39";

const FormItem = Form.Item;
const Step = Steps.Step;

export class Register extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.cancel = this.cancel.bind(this);
    this.checkAccontName = this.checkAccontName.bind(this);
    this.checkAccontNameAvailable = this.checkAccontNameAvailable.bind(this);
    this.setPrivateKey = this.setPrivateKey.bind(this);
    this.newSeed = this.newSeed.bind(this);
    this.initState = {
      current: 0,
      form: {},
      copied: false
    };
    this.state = this.initState;
  }

  cancel() {
    this.props.form.resetFields();
    this.setState(this.initState);
    this.props.cancel();
  }

  openNotificationWithIcon(type) {
    notification[type]({
      message: "Palabras Mnemonicas",
      description:
        "Las palabras han sido copiadas al portapapeles. Resguárdelas de manera segura!"
    });
  }

  next() {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const current = this.state.current + 1;
        this.setState({
          form: {
            ...this.state.form,
            ...values
          },
          current
        });
        console.log(this.state);
      }
    });
  }

  prev() {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const current = this.state.current - 1;
        this.setState({
          form: {
            ...this.state.form,
            ...values
          },
          current
        });
      }
    });
  }

  submit() {
    if (typeof this.state.form.privKey !== "undefined") {
      // this.props.submit(this.state.form);
      console.log(JSON.stringify(this.state.form));
      let data = this.state.form;
      // delete data['privKey'];
      // delete data['seed'];
      this.props.submit(data);
    }
  }

  checkAccontName(rule, value, callback) {
    // Avoid duplicate checking
    if (typeof value === "undefined" || value.length === 0) return callback();

    // Set state
    let accountName = {
      value: value,
      valid: ChainValidation.is_account_name(value)
    };

    //Send callback ->> HACK: If its ok this change null for undefined
    return callback(ChainValidation.is_account_name_error(value) || undefined);
  }

  componentWillMount() {
    this.newSeed();
  }

  checkAccontNameAvailable(rule, value, callback) {
    let url;
    try {
      url = getPath("URL/ACCOUNT_BY_NAME", { name: value });
    } catch (e) {
      return callback();
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.res === "account_not_found") callback();
        else callback("account_already_exists");
      })
      .catch(e => {
        callback("network_error");
      });
  }

  setPrivateKey() {
    const seed = this.state.form.seed;
    let keys = recoverAccountFromSeed(seed, true);

    this.setState({
      copied: true,
      form: {
        ...this.state.form,
        ...keys,
        privKey: keys.active.wif
      }
    });
    this.openNotificationWithIcon("success");
  }

  newSeed() {
    this.setState({
      form: {
        ...this.state.form,
        seed: bip39.generateMnemonic(null, null, bip39.wordlists.spanish)
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { current } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      }
    };

    const codeStyle = {
      margin: "20px 0",
      display: "block",
      border: "1px solid #ccc",
      padding: "10px",
      background: "#f5f5f5"
    };

    const steps = [
      {
        title: "Account",
        content: (
          <Form onSubmit={console.log}>
            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="register.name" />}
            >
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: this.props.intl.messages["register.name.empty"]
                  }
                ]
              })(<Input name="name" id="name" />)}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="register.account_name" />}
              hasFeedback
            >
              {getFieldDecorator("account_name", {
                rules: [
                  {
                    required: true,
                    message: this.props.intl.messages[
                      "register.account_name.empty"
                    ]
                  },
                  {
                    validator: this.checkAccontName
                  },
                  {
                    validator: this.checkAccontNameAvailable
                  }
                ]
              })(<Input name="account_name" id="account_name" />)}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="register.email" />}
              hasFeedback
            >
              {getFieldDecorator("email", {
                rules: [
                  {
                    type: "email",
                    message: this.props.intl.messages["register.email.invalid"]
                  },
                  {
                    required: true,
                    message: this.props.intl.messages["register.email.empty"]
                  }
                ]
              })(<Input name="email" id="email" />)}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="register.telephone" />}
              hasFeedback
            >
              {getFieldDecorator("telephone", {
                rules: [
                  {
                    required: true,
                    message: this.props.intl.messages[
                      "register.telephone.empty"
                    ]
                  }
                ]
              })(<Input name="telephone" id="telephone" />)}
            </FormItem>
          </Form>
        )
      },
      {
        title: "Categories",
        content: (
          <Form onSubmit={console.log}>
            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="register.category" />}
            >
              {this.state.current === 1
                ? getFieldDecorator("category", {
                    rules: [
                      {
                        required: true,
                        message: this.props.intl.messages[
                          "register.category.empty"
                        ]
                      }
                    ]
                  })(
                    <Select
                      style={{ width: "100%" }}
                      placeholder={<IntlMessages id="register.please_select" />}
                    >
                      {this.props.categories.map((category, index) => (
                        <SelectOption
                          key={category.id}
                          value={Number(category.id)}
                        >
                          {category.name}
                        </SelectOption>
                      ))}
                    </Select>
                  )
                : false}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={<IntlMessages id="register.subcategory" />}
            >
              {this.state.current === 1
                ? getFieldDecorator("subcategory", {
                    rules: [
                      {
                        required: true,
                        message: this.props.intl.messages[
                          "register.subcategory.empty"
                        ]
                      }
                    ]
                  })(
                    <Select
                      style={{ width: "100%" }}
                      placeholder={<IntlMessages id="register.please_select" />}
                    >
                      {this.props.subcategories
                        .filter(
                          category =>
                            Number(category.parent_id) ===
                            Number(this.props.form.getFieldValue("category"))
                        )
                        .map((category, index) => (
                          <SelectOption
                            key={category.id}
                            value={Number(category.id)}
                          >
                            {category.name}
                          </SelectOption>
                        ))}
                    </Select>
                  )
                : false}
            </FormItem>
          </Form>
        )
      },
      {
        title: "Credentials",
        content: (
          <div>
            <h3>Brain Key</h3>
            <code style={codeStyle}>{this.state.form.seed}</code>
            <h3>Private Key (Wip)</h3>
            <code style={codeStyle}>{this.state.form.privKey}</code>
            <CopyToClipboard
              text={this.state.form.seed}
              disabled={typeof this.state.form.privKey !== "undefined"}
              type="primary"
              onCopy={this.setPrivateKey}
            >
              <Button>I have saved this brainkey</Button>
            </CopyToClipboard>
          </div>
        )
      }
    ];

    return (
      <Modal
        destroyOnClose={true}
        title={<IntlMessages id="register.bussines" />}
        visible={this.props.visible}
        onOk={this.submit}
        onCancel={this.cancel}
        footer={
          this.props.loading ? (
            false
          ) : (
            <div className="steps-action">
              {this.state.current < steps.length - 1 && (
                <Button type="primary" onClick={() => this.next()}>
                  Next
                </Button>
              )}
              {this.state.current === steps.length - 1 && (
                <Button
                  type="primary"
                  onClick={this.submit}
                  disabled={typeof this.state.form.privKey === "undefined"}
                >
                  Done
                </Button>
              )}
              {this.state.current > 0 && (
                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                  Previous
                </Button>
              )}
            </div>
          )
        }
      >
        <Steps current={current}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>

        {!this.props.loading ? (
          <div s="steps-content" style={{ margin: "20px 0" }}>
            {steps[this.state.current].content}
          </div>
        ) : (
          <div style={{ width: "100%", margin: "40px 0", textAlign: "center" }}>
            <PageLoading />
          </div>
        )}
      </Modal>
    );
  }
}

//Inject form manager
let RegisterForm = Form.create()(injectIntl(Register));

//Inject categories
const mapToProps = state => ({
  categories: state.Api.categoriesList.filter(x => x.parent_id === 0),
  subcategories: state.Api.categoriesList.filter(x => x.parent_id !== 0)
});
export default connect(mapToProps)(RegisterForm);