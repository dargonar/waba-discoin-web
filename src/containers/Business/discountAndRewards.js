import React, { Component } from "react";
import LayoutContentWrapper from "../../components/utility/layoutWrapper";
import PageHeader from "../../components/utility/pageHeader";
import IntlMessages from "../../components/utility/intlMessages";

import Box from "../../components/utility/box";
import PageLoading from "../../components/pageLoading";

import { Col, Row } from "antd";

import Button from "../../components/uielements/button";
import actions from "../../redux/owner/actions";
import apiActions from "../../redux/api/actions";
import appActions from "../../redux/app/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Form from "../../components/uielements/form";
import { Input, Select, InputNumber } from "antd";
import { PaymentMetodsEncoder } from "../../utils/paymentsEncoder";

import basicStyle from "../../config/basicStyle";
import ContentHolder from "../../components/utility/contentHolder";

const FormItem = Form.Item;
const SelectOption = Select.Option;

const defualtSchedule = [
  { discount: "0", reward: "0", date: "monday" },
  { discount: "0", reward: "0", date: "tuesday" },
  { discount: "0", reward: "0", date: "wednesday" },
  { discount: "0", reward: "0", date: "thursday" },
  { discount: "0", reward: "0", date: "friday" },
  { discount: "0", reward: "0", date: "saturday" },
  { discount: "0", reward: "0", date: "sunday" }
];

const getMinimunDiscount = (categories, id) =>
  categories
    .filter(category => category.id === id)
    .reduce((prev, act) => act.discount, 0);

class DiscountsAndRewards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      form: {
        discount_schedule: defualtSchedule,
        links: {},
        mode: "edit"
      }
    };
    this.inputChange = this.inputChange.bind(this);
    this.initForm = this.initForm.bind(this);
    this.submit = this.submit.bind(this);
    this.togglePayment = this.togglePayment.bind(this);
    this.checkLoading = this.checkLoading.bind(this);
  }

  componentWillMount() {
    this.props.getCategories();

    if (typeof this.props.match.params.id !== "undefined") {
      this.props.getSchedule(this.props.match.params.id);
    } else {
      this.props.getSchedule();
    }
  }

  formatSchedule(category_id) {
    const categoryDiscount = this.props.categories.filter(
      cat => cat.id === category_id
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
          "----------------------- saving schedule:",
          JSON.stringify(result)
        );

        // this.props.showMessage({
        //   msg: "Esta en progreso :)",
        //   msgType: "error"
        // });

        // return;
        // if (!this.props.isAdmin) {
        //   result.discount_schedule =
        //     this.props.business.discount_schedule.length === 7
        //       ? this.props.business.discount_schedule
        //       : this.formatSchedule(result.category_id);
        // }
        // this.props.saveBusiness(result);
        this.props.updateSchedule(
          result,
          this.props.match.params.id || undefined
        );
      } else {
        this.props.showMessage({
          msg: "Por favor corrija los errores e intente nuevamente",
          msgType: "error"
        });
      }
    });
  }

  togglePayment(key, values) {
    let schedule = this.props.form.getFieldsValue().discount_schedule;
    schedule[key] = { ...schedule[key], ...values };
    this.props.form.setFieldsValue({ discount_schedule: schedule });
    console.log(" *** togglePayment(key, values): ", JSON.stringify(schedule));
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

  checkLoading = schedule => {
    console.log({ schedule });
    if (typeof schedule !== "undefined") {
      this.initForm(schedule);
    }
  };

  componentWillReceiveProps(nextProps) {
    // console.log(
    //   " ** componentWillReceiveProps",
    //   "---------this.props",
    //   nextProps
    // );
    if (this.state.loading === true) {
      this.checkLoading(nextProps.schedule);
    }

    //Check actionLoading status
    if (
      nextProps.actionLoading === true &&
      this.props.actionLoading === false
    ) {
      this.setState({ loading: true });
    }
  }

  initForm(schedule) {
    this.setState({
      form: {
        ...this.state.form,
        discount_schedule: schedule
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
    const { rowStyle, colStyle } = basicStyle;

    // console.log( " ===> render");
    // console.log( JSON.stringify(this.state.form));
    const { getFieldDecorator } = this.props.form;

    //const minimumDiscount = 20;
    const minimumDiscount = getMinimunDiscount(
      this.props.categories,
      this.props.business.category_id
    );

    //console.log(this.props.form, this.props.form.getFieldsValue());
    const paymentMethods = PaymentMetodsEncoder();
    return (
      <Form style={{ width: "100%" }} onSubmit={this.submit}>
        <Box>
          <h3>
            <IntlMessages id="profile.rates_extended" defaultMessage="Rates" />
          </h3>

          <Row style={{ width: "100%" }} gutter={16}>
            <Col lg={24} md={24} sm={24}>
              <FormItem>
                <Row style={rowStyle} gutter={16} justify="start">
                  {this.state.form.discount_schedule.map((discount, key) => (
                    <Col
                      md={6}
                      sm={12}
                      xs={24}
                      style={colStyle}
                      key={"discount-" + key}
                    >
                      <Box
                        title={
                          <span style={{ textTransform: "capitalize" }}>
                            <IntlMessages
                              defaultMessage={discount.date.substr(0, 3)}
                              id={"configSchedule." + discount.date}
                            />
                          </span>
                        }
                      >
                        <ContentHolder>
                          <span>
                            <IntlMessages
                              id="profile.discount"
                              defaultMessage="Discount"
                            />
                          </span>

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
                              "discount_schedule[" + key + "].discount",
                              {
                                initialValue: Number(
                                  discount.discount ? discount.discount : 0
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

                          <span>
                            <IntlMessages
                              id="profile.reward"
                              defaultMessage="Reward"
                            />
                          </span>
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

                          <span>
                            <IntlMessages
                              id="profile.paymentMethods"
                              defaultMessage="Payment methods"
                            />
                          </span>

                          {paymentMethods.paymentsLabels.map(method =>
                            getFieldDecorator(
                              "discount_schedule[" + key + "].pm_" + method,
                              {
                                initialValue: discount["pm_" + method]
                              }
                            )(
                              <Input
                                type="hidden"
                                key={key + "-hidden-" + method}
                              />
                            )
                          )}

                          <FormItem>
                            <Select
                              mode="multiple"
                              defaultValue={paymentMethods.encode(discount)}
                              style={{ width: "100%" }}
                              placeholder="Please select"
                              onChange={e =>
                                this.togglePayment(
                                  key,
                                  paymentMethods.decode(e)
                                )
                              }
                            >
                              {paymentMethods.paymentsLabels.map(method => (
                                <SelectOption
                                  value={method}
                                  key={key + "-" + method}
                                >
                                  {<IntlMessages
                                      id={"profile.payments."+method}
                                      defaultMessage=""
                                    />}
                                </SelectOption>
                              ))}
                            </Select>
                          </FormItem>
                        </ContentHolder>
                      </Box>
                    </Col>
                  ))}
                </Row>
              </FormItem>
            </Col>
          </Row>
          <Row style={{ width: "100%" }} gutter={16}>
            <h4
              style={{
                float: "right",
                color: "#fff",
                textAlign: "right",
                backgroundColor: "#f5222d"
              }}
            >
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
            <IntlMessages id="profile.saveStore" defaultMessage="Save" />
          </Button>
        </Box>
      </Form>
    );
  }

  render() {
    return (
      <LayoutContentWrapper>
        <PageHeader>
          <IntlMessages
            id="configSchedule.title"
            defaultMessage="Configuración"
          />
        </PageHeader>
        {this.state.loading ||
        this.props.categories.length === 0 ||
        typeof this.props.business === "undefined" ? (
          <PageLoading />
        ) : (
          this.renderForm()
        )}
        {/*<pre>
          {JSON.stringify(this.props.form.getFieldsValue(), null, "  ")}
        </pre>*/}
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = state => ({
  actionLoading: state.Api.actionLoading,
  isAdmin: state.Auth.accountType === "admin",
  categories: state.Api.categoriesList,
  business: state.Api.business || undefined,
  schedule: state.Api.schedule || undefined
});

const mapDispatchToProps = dispatch => ({
  showMessage: bindActionCreators(appActions.showMessage, dispatch),
  getCategories: bindActionCreators(apiActions.getCategoriesList, dispatch),
  fetchBusiness: bindActionCreators(actions.fetchBusiness, dispatch),
  updateSchedule: bindActionCreators(apiActions.updateSchedule, dispatch),
  getSchedule: bindActionCreators(apiActions.getSchedule, dispatch)
});

//inject this.props.form, inject redux state and actions
export default Form.create()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DiscountsAndRewards)
);
