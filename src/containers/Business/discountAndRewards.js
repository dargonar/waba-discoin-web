import React, { Component } from "react";
import LayoutContentWrapper from "../../components/utility/layoutWrapper";
import PageHeader from "../../components/utility/pageHeader";
import IntlMessages from "../../components/utility/intlMessages";

import Box from "../../components/utility/box";
import PageLoading from "../../components/pageLoading";

import { Col, Row } from "antd";

import Button from "../../components/uielements/button";
import Async from "../../helpers/asyncComponent";
import actions from "../../redux/owner/actions";
import apiActions from "../../redux/api/actions";
import appActions from "../../redux/app/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Form from "../../components/uielements/form";
import { Input, Select, InputNumber } from "antd";

const socialMedia = ["Website", "Twiter", "Instagram", "Facebook"];

const FormItem = Form.Item;
const SelectOption = Select.Option;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
};

const defualtSchedule = [
  { discount: "0", reward: "0", date: "monday" },
  { discount: "0", reward: "0", date: "tuesday" },
  { discount: "0", reward: "0", date: "wednesday" },
  { discount: "0", reward: "0", date: "thursday" },
  { discount: "0", reward: "0", date: "friday" },
  { discount: "0", reward: "0", date: "saturday" },
  { discount: "0", reward: "0", date: "sunday" }
];

class DiscountsAndRewards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        discount_schedule: defualtSchedule,
        links: {},
        mode: "edit"
      }
    };
    this.inputChange = this.inputChange.bind(this);
    this.initForm = this.initForm.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    this.props.getCategories();
    if (typeof this.props.match.params.id !== "undefined") {
      this.setState({
        loading: true,
        mode: "edit",
        id: this.props.match.params.id
      });
      this.props.fetchBusiness(this.props.match.params.id);
    }

    console.log(
      " ** componentWillMount",
      "---------this.props.business",
      this.props.business
    );
    if (
      typeof this.props.business !== "undefined" &&
      this.props.business !== null
    ) {
      this.setState({
        mode: "edit",
        id: this.props.business.account_id,
        loading: false
      });
      this.initForm(this.props.business);
    }
  }

  formatSchedule(category_id) {
    const categoryDiscount = this.props.categories.filter(
      cat => cat.id == category_id
    )[0];
    return defualtSchedule.map(day => ({
      ...day,
      discount: categoryDiscount.discount,
      reward: categoryDiscount.discount
    }));
  }

  submit() {
    // TODO: Validation!
    console.log("*****> submit");
    let result = this.props.form.getFieldsValue();
    // result = formatSchedules(result);
    this.props.form.validateFields((err, val) => {
      if (err === null) {
        console.log(
          "----------------------- saving business:",
          JSON.stringify(result)
        );

        this.props.showMessage({
          msg: "Esta en progreso :)",
          msgType: "error"
        });

        return;
        
        // if (!this.props.isAdmin) {
        //   result.discount_schedule =
        //     this.props.business.discount_schedule.length === 7
        //       ? this.props.business.discount_schedule
        //       : this.formatSchedule(result.category_id);
        // }
        // this.props.saveBusiness(result);
        this.props.updateSchedule(this.state.discounts);
        
      } else {
        this.props.showMessage({
          msg: "Por favor corrija los errores e intente nuevamente",
          msgType: "error"
        });
      }
    });
  }

  changeSchedule(type, key, value) {
    if (isNaN(value)) return;
    // let schedule = this.state.form[type + "_schedule"];
    let schedule = this.state.form["discount_schedule"];
    schedule[key][type] = Number(value);
    this.setState({
      form: {
        ...this.state.form,
        discount_schedule: schedule
      }
    });
    // [type + "_schedule"]: schedule
  }

  componentWillUnmount() {
    this.setState({
      form: {
        links: {},
        discount_schedule: defualtSchedule,
        location: {}
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    const checkLoading = business => {
      if (business && this.state.id) {
        const editableBusiness = business.filter(
          x => x.account_id === this.state.id
        );
        if (editableBusiness.length !== 0) {
          this.initForm(editableBusiness[0]);
        }
      } else if (business) {
        this.initForm(business);
      }
    };

    console.log(
      " ** componentWillReceiveProps",
      "---------this.props",
      nextProps
    );
    if (this.state.loading === true) {
      checkLoading(nextProps.business || nextProps.businesses);
    }
  }

  initForm(business) {
    // console.log('==========initForm:');
    // console.log(JSON.stringify(business));
    this.setState({
      form: {
        ...this.state.form,
        ...business
      },
      loading: false
    });
  }

  inputChange(e) {
    // this.setState({
    //   form: {
    //     ...this.state.form,
    //     latitude: e.latlng.lat,
    //     longitude: e.latlng.lng
    //   }
    // })

    // const result = set(
    //   { data: this.state.form },
    //   e.target.id,
    //   e.target.value
    // )

    var key = e.target.id.replace("form.", "");
    var val = e.target.value;
    var obj = this.state.form;
    obj[key] = val;
    this.setState(obj);
  }

  renderForm() {
    // console.log( " ===> render");
    // console.log( JSON.stringify(this.state.form));
    const { getFieldDecorator } = this.props.form;

    const getMinimunDiscount = (categories, id) =>
      categories
        .filter(category => category.id === id)
        .reduce((prev, act) => act.discount, 0);

    const minimumDiscount = 20;
    // const minimumDiscount = getMinimunDiscount(
    //   this.props.categories,
    //   this.props.business.category_id
    // );

    //console.log(this.props.form, this.props.form.getFieldsValue());
    return (
      <Form style={{ width: "100%" }} onSubmit={this.submit}>
        <Box>
          <h3>
            <intlMessages id="profile.profile_info" defaultMessage="Perfil" />
          </h3>
          <Row style={{ width: "100%" }} gutter={16}>
            <Col lg={24} md={24} sm={24}>
              {getFieldDecorator("account_id", {
                initialValue: this.state.form.account_id
              })(<Input type="hidden" name="acccount_id" />)}
              {getFieldDecorator("post_type", {
                initialValue: "discounts"
              })(<Input type="hidden" name="post_type" />)}

              <FormItem
                {...formItemLayout}
                label={
                  <IntlMessages
                    id="profile.paymentMethods"
                    defaultMessage="Payment methods"
                  />
                }
              >
                {getFieldDecorator("payments", {})(
                  <Select mode="multiple">
                    <SelectOption value="cash">
                      <IntlMessages
                        id="profile.payments.cash"
                        defaultMessage="Cash"
                      />
                    </SelectOption>
                    <SelectOption value="debit">
                      <IntlMessages
                        id="profile.payments.debit"
                        defaultMessage="Debit"
                      />
                    </SelectOption>
                    <SelectOption value="credit">
                      <IntlMessages
                        id="profile.payments.credit"
                        defaultMessage="Credit"
                      />
                    </SelectOption>
                    <SelectOption value="mercadopago">
                      <IntlMessages
                        id="profile.payments.mercadopago"
                        defaultMessage="MercadoPago"
                      />
                    </SelectOption>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row style={{ width: "100%" }} gutter={16}>
            <Col lg={24} md={24} sm={24}>
              <FormItem>
                <h3>
                  <IntlMessages
                    id="profile.rates_extended"
                    defaultMessage="Rates"
                  />
                </h3>
                <Row style={{ width: "100%" }}>
                  <Col sm={3}>
                    <Row style={{ width: "100%", textAlign: "center" }}>
                      <Col>
                        <IntlMessages defaultMessage="Type" id="profile.type" />
                      </Col>
                      <Col>
                        <IntlMessages
                          defaultMessage="Reward"
                          id="profile.reward"
                        />
                      </Col>
                      <Col>
                        <IntlMessages
                          defaultMessage="Discount"
                          id="profile.discount"
                        />
                      </Col>
                    </Row>
                  </Col>
                  {this.state.form.discount_schedule.map((discount, key) => (
                    <Col sm={3} key={"discount-" + key}>
                      <Row>
                        <Col
                          style={{
                            textAlign: "center",
                            textTransform: "capitalize"
                          }}
                        >
                          <IntlMessages
                            defaultMessage={discount.date.substr(0, 3)}
                            id={"profile.day-" + discount.date.substr(0, 3)}
                          />
                        </Col>
                        <Col>
                          {getFieldDecorator(
                            "discount_schedule[" + key + "].date",
                            {
                              initialValue: this.state.form.discount_schedule[
                                key
                              ].date
                            }
                          )(
                            <Input
                              type="hidden"
                              name={"discount_schedule[" + key + "].date"}
                            />
                          )}
                          <FormItem style={{ marginBottom: "3px" }}>
                            {getFieldDecorator(
                              "discount_schedule[" + key + "].reward",
                              {
                                initialValue: Number(
                                  discount.reward ? discount.reward : 0
                                ),
                                rules: [
                                  {
                                    message: "",
                                    validator: (field, value, cb) => {
                                      value >= minimumDiscount
                                        ? cb()
                                        : cb(true);
                                    }
                                  }
                                ]
                              }
                            )(
                              <InputNumber
                                name={"discount_schedule[" + key + "].reward"}
                                max={100}
                                style={{
                                  width: "90%"
                                }}
                                formatter={value => `${value}%`}
                                parser={value => value.replace("%", "")}
                              />
                            )}
                          </FormItem>
                        </Col>
                        <Col>
                          <FormItem style={{ marginBottom: "3px" }}>
                            {getFieldDecorator(
                              "discount_schedule[" + key + "].discount",
                              {
                                initialValue: Number(
                                  discount ? discount.discount : 0
                                ),
                                rules: [
                                  {
                                    message: "",
                                    validator: (field, value, cb) => {
                                      value >= minimumDiscount
                                        ? cb()
                                        : cb(true);
                                    }
                                  }
                                ]
                              }
                            )(
                              <InputNumber
                                name={"discount_schedule[" + key + "].discount"}
                                max={100}
                                style={{
                                  width: "90%"
                                }}
                                formatter={value => `${value}%`}
                                parser={value => value.replace("%", "")}
                              />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                    </Col>
                  ))}
                </Row>
              </FormItem>
            </Col>
          </Row>
          <Row style={{ width: "100%" }} gutter={16}>
            <h4 style={{ textAlign: "right" }}>
              <IntlMessages
                id="configSchedule.minimumDiscount"
                defaultMessage="Descuento mínimo de : {min}"
                values={{ minimumDiscount }}
              />
            </h4>
          </Row>
          <Button
            type="primary"
            style={{ margin: "20px 0" }}
            onClick={this.submit}
          >
            <IntlMessages id="profile.saveStore" defaultMessage="Save store" />
          </Button>
        </Box>
      </Form>
    );
  }

  render() {
    const textAreaStyle = {
      width: "100%",
      padding: "10px",
      height: "221px",
      borderRadius: "4px",
      border: "1px solid #e9e9e9"
    };

    return (
      <LayoutContentWrapper>
        <PageHeader>
          <IntlMessages
            id="configSchedule.title"
            defaultMessage="Configuración"
          />
        </PageHeader>
        {this.state.loading ? <PageLoading /> : this.renderForm()}
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = state => ({
  isAdmin: state.Auth.accountType === "admin",
  categories: state.Api.categoriesList,
  business: state.Api.business
});

const mapDispatchToProps = dispatch => ({
  showMessage: bindActionCreators(appActions.showMessage, dispatch),
  getCategories: bindActionCreators(apiActions.getCategoriesList, dispatch),
  fetchBusiness: bindActionCreators(actions.fetchBusiness, dispatch),
  updateSchedule: bindActionCreators(apiActions.updateSchedule, dispatch),
  getSchedule: bindActionCreators(apiActions.getSchedule, dispatch),
});

//inject this.props.form, inject redux state and actions
export default Form.create()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DiscountsAndRewards)
);
