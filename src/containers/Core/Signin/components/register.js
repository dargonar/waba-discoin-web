import React, { Component } from "react";
import IntlMessages from "../../../../components/utility/intlMessages";
import { Input, Select, Modal, notification, Tooltip, Icon } from "antd";
import Form from "../../../../components/uielements/form";
import Button from "../../../../components/uielements/button";
import { injectIntl } from "react-intl";
import Steps from "../../../../components/uielements/steps";
import PageLoading from "../../../../components/pageLoading";
import { ChainValidation } from "bitsharesjs";
import { recoverAccountFromSeed } from "../../../../utils";
import { connect } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { cleanMnemonics, getPath } from "../../../../httpService";
import bip39 from "bip39";

const FormItem = Form.Item;
const Step = Steps.Step;
const SelectOption = Select.Option;

export const accountGenerator = (value = "") =>
  value
    .toLowerCase()
    .replace(/ä|á|à|â|ã|ª/g, "a")
    .replace(/ë|é|è|ê/g, "e")
    .replace(/ï|í|ì|î/g, "i")
    .replace(/ö|ó|ò|ô|õ|º/g, "o")
    .replace(/ü|ú|ù|û/g, "u")
    .replace(/ñ/g, "n")
    .replace(/ç/g, "c")
    .replace(/ /g, ".")
    .replace(/[^a-z0-9.]/g, "");

export class Register extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.cancel = this.cancel.bind(this);
    this.checkAccontName = this.checkAccontName.bind(this);
    this.checkAccontNameAvailable = this.checkAccontNameAvailable.bind(this);
    this.openNotificationWithIcon = this.openNotificationWithIcon.bind(this);
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
      message: this.props.intl.messages["register.brainKey"] || "Brain Key",
      description: this.props.intl.messages["register.brainKeyMessage"] || "The words have been copied to the clipboard. Keep them safe!"
    });
  }

  next() {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const current = this.state.current + 1;
        this.setState({
          form: {
            ...this.state.form,
            ...values,
            seed: cleanMnemonics(bip39.generateMnemonic(null, null, bip39.wordlists.spanish)),
            keys: undefined,
            privKey: undefined
          },
          current,
          copied: false
        });
        console.log(this.state);
      }
    });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({
      current
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

    //Send callback ->> HACK: If its ok this change null for undefined
    return callback(ChainValidation.is_account_name_error(value) || undefined);
  }

  componentWillMount() {}

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
        else callback(<IntlMessages id="register.account_already_exists" defaultMessage="Account already exists" />);
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
        ...this.state.form
      }
    });
  }

  getStep(step) {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };

    const codeStyle = {
      margin: "20px 0",
      display: "block",
      border: "1px solid #ccc",
      padding: "10px",
      background: "#f5f5f5"
    };

    switch (step) {
      case 0:
        return {
          id: "account",
          title: <IntlMessages id="register.accountTitle" defaultMessage="Account" />,
          content: (
            <Form onSubmit={console.log}>
              <FormItem
                {...formItemLayout}
                label={
                  <span>
                    <IntlMessages id="register.name" defaultMessage="Name" />{" "}
                    <Tooltip
                      title={
                        <IntlMessages
                          id="register.nameHelper"
                          defaultMessage="This is the name of the business that will be shown to the users of the application."
                        />
                      }
                    >
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
              >
                {getFieldDecorator("name", {
                  initialValue: this.state.form.name,
                  rules: [
                    {
                      required: true,
                      message: this.props.intl.messages["register.name.empty"]
                    }
                  ]
                })(
                  <Input
                    name="name"
                    id="name"
                    title="Nombre del comercio"
                    onChange={e => {
                      const accountName = accountGenerator(e.target.value);
                      if (!this.props.form.isFieldTouched()) {
                        this.props.form.setFieldsValue({ account_name: accountName });
                        this.props.form.validateFields(["account_name"]);
                      }
                    }}
                  />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label={
                  <span>
                    <IntlMessages id="register.account_name" defaultMessage="Account name" />{" "}
                    <Tooltip
                      title={
                        <IntlMessages
                          defaultMessage={"The account name will be used to access the application"}
                          id="register.account_name.helper"
                        />
                      }
                    >
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
                hasFeedback
              >
                {getFieldDecorator("account_name", {
                  initialValue: this.state.form.account_name,
                  rules: [
                    {
                      required: true,
                      message: this.props.intl.messages["register.account_name.empty"] || "Account name is required"
                    },
                    {
                      validator: this.checkAccontName
                    },
                    {
                      validator: this.checkAccontNameAvailable
                    }
                  ]
                })(
                  <Input
                    name="account_name"
                    id="account_name"
                    title="Nombre de usuario: Sólo letras minúsculas, números, puntos y guiones, debe comenzar con una letra y finalizar con letra o número. Longitud mayor a 2 caracteres."
                  />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={<IntlMessages id="register.email" defaultMessage="Email" />} hasFeedback>
                {getFieldDecorator("email", {
                  initialValue: this.state.form.email,
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
                })(<Input name="email" id="email" email="email" />)}
              </FormItem>

              <FormItem {...formItemLayout} label={<IntlMessages id="register.telephone" defaultMessage="Telephone" />} hasFeedback>
                {getFieldDecorator("telephone", {
                  initialValue: this.state.form.telephone,
                  rules: [
                    {
                      required: true,
                      message: this.props.intl.messages["register.telephone.empty"] || "Telephone is required"
                    }
                  ]
                })(<Input name="telephone" id="telephone" />)}
              </FormItem>
            </Form>
          )
        };
      case 1:
        return {
          id: "caregories",
          title: <IntlMessages id="register.categoriesTitle" defaultMessage="Categories" />,
          content: (
            <Form onSubmit={console.log}>
              <FormItem {...formItemLayout} label={<IntlMessages id="register.category" defaultMessage="Category" />}>
                {this.state.current === 1
                  ? getFieldDecorator("category", {
                      initialValue: this.state.form.category,
                      rules: [
                        {
                          required: true,
                          message: this.props.intl.messages["register.category.empty"]
                        }
                      ]
                    })(
                      <Select
                        style={{ width: "100%" }}
                        placeholder={<IntlMessages id="register.pleaseSelect" defaultMessage="Please select one" />}
                        onChange={() =>
                          this.props.form.setFieldsValue({
                            subcategory: undefined
                          })
                        }
                      >
                        {this.props.categories.map((category, index) => (
                          <SelectOption key={category.id} value={Number(category.id)}>
                            {category.name}
                          </SelectOption>
                        ))}
                      </Select>
                    )
                  : false}
              </FormItem>

              <FormItem {...formItemLayout} label={<IntlMessages id="register.subcategory" defaultMessage="Subcategory" />}>
                {this.state.current === 1
                  ? getFieldDecorator("subcategory", {
                      initialValue: this.state.form.subcategory,
                      rules: [
                        {
                          required: true,
                          message: this.props.intl.messages["register.subcategory.empty"]
                        }
                      ]
                    })(
                      <Select
                        style={{ width: "100%" }}
                        placeholder={<IntlMessages id="register.pleaseSelect" defaultMessage="Please select one" />}
                      >
                        {this.props.subcategories
                          .filter(category => Number(category.parent_id) === Number(this.props.form.getFieldValue("category")))
                          .map((category, index) => (
                            <SelectOption key={category.id} value={Number(category.id)}>
                              {category.name}
                            </SelectOption>
                          ))}
                      </Select>
                    )
                  : false}
              </FormItem>
            </Form>
          )
        };
      case 2:
        return {
          id: "credentials",
          title: <IntlMessages id="register.credentialsTitle" defaultMessage="Credentials" />,
          content: (
            <div>
              <h3>
                <IntlMessages defaultMessage="Brain Key" id="register.brainKey" />
              </h3>
              <p>
                <IntlMessages
                  defaultMessage={
                    "The brain key is used as source for all cryptographic keys generated in the wallet. If you have it secured, you will be able to regain access to your accounts and funds (unless the access keys have been changed)"
                  }
                  id={"register.brainKey.helper"}
                />
              </p>
              <code style={codeStyle}>{this.state.form.seed}</code>
              {typeof this.state.form.privKey !== "undefined" ? (
                <div>
                  <h3>
                    <IntlMessages defaultMessage="Private Key (Wip)" id="register.wip" />
                  </h3>
                  <code style={codeStyle}>{this.state.form.privKey}</code>
                </div>
              ) : (
                false
              )}
              <CopyToClipboard
                text={this.state.form.seed}
                disabled={typeof this.state.form.privKey !== "undefined"}
                type="primary"
                onCopy={this.setPrivateKey}
              >
                <Button>
                  <IntlMessages defaultMessage="I have saved this brainkey" id="register.brainKeyCopy" />
                </Button>
              </CopyToClipboard>
            </div>
          )
        };
      default:
        return false;
    }
  }

  render() {
    const { current } = this.state;

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
              {this.state.current < 2 && (
                <Button type="primary" onClick={() => this.next()}>
                  <IntlMessages defaultMessage="Next" id="register.next" />
                </Button>
              )}
              {this.state.current === 2 && (
                <Button type="primary" onClick={this.submit} disabled={typeof this.state.form.privKey === "undefined"}>
                  <IntlMessages defaultMessage="Done" id="register.done" />
                </Button>
              )}
              {this.state.current > 0 && (
                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                  <IntlMessages defaultMessage="Previous" id="register.previous" />
                </Button>
              )}
            </div>
          )
        }
      >
        <Steps current={current}>
          {[
            {
              id: "account",
              title: <IntlMessages id="register.accountTitle" defaultMessage="Account" />
            },
            {
              id: "caregories",
              title: <IntlMessages id="register.categoriesTitle" defaultMessage="Categories" />
            },
            {
              id: "credentials",
              title: <IntlMessages id="register.credentialsTitle" defaultMessage="Credentials" />
            }
          ].map(item => (
            <Step key={item.id} title={item.title} />
          ))}
        </Steps>

        {!this.props.loading ? (
          <div s="steps-content" style={{ margin: "20px 0" }}>
            {this.getStep(this.state.current).content}
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
