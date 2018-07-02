import React, { Component } from "react";
import PageHeader from "../../../components/utility/pageHeader";
import IntlMessages from "../../../components/utility/intlMessages";
import Box from "../../../components/utility/box";
import Form from "../../../components/uielements/form";
import PageLoading from "../../../components/pageLoading";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper";
import { message, Col, Row, Input, Select, InputNumber } from "antd";
//import Input from "../../../components/uielements/input";

import Button from "../../../components/uielements/button";
//import Select, { SelectOption } from "../../../components/uielements/select";
import { DropImage } from "../components/dropzone";
import actions from "../../../redux/owner/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { BasicLeafletMapWithMarker } from "../components/asyncMap";
import { initFormState } from "./initFormState";

const FormItem = Form.Item;
const SelectOption = Select.Option;

const formatSchedules = formData => {
  //Format discount schedule
  formData.discount_schedule = formData.discount_schedule.map((value, key) => {
    let formated = initFormState.discount_schedule[key];
    formated.discount = value;
    return formated;
  });

  //Format refound schedule
  formData.refound_schedule = formData.refound_schedule.map((value, key) => {
    let formated = initFormState.refound_schedule[key];
    formated.refound = value;
    return formated;
  });

  return formData;
};

class CreateStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: Object.assign({}, initFormState),
      loading: true
    };

    // Form handlers
    this.initForm = this.initForm.bind(this);
    this.locationChange = this.locationChange.bind(this);
    this.categoryChange = this.categoryChange.bind(this);
    this.imageUpload = this.imageUpload.bind(this);
    this.submit = this.submit.bind(this);
  }

  // This method will be deprecated
  UNSAFE_componentWillMount() {
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

  // This method will be deprecated
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      typeof nextProps.business !== "undefined" &&
      nextProps.business !== null
    ) {
      this.initForm(nextProps.business);
    }
  }

  submit() {
    let result = this.props.form.getFieldsValue();
    result = formatSchedules(result);
    this.props.form.validateFields((err, val) => {
      if (err === null) {
        this.props.saveBusiness(Object.assign({}, this.props.business, result));
      } else {
        message.error("Por favor corrija los errores e intente nuevamente");
      }
    });
  }

  initForm(business) {
    let refound_schedule = business.refound_schedule || [];
    this.setState({
      form: {
        ...this.state.form,
        ...business,
        discount_schedule: initFormState.discount_schedule.map((v, k) =>
          Object.assign({}, v, business.discount_schedule[k])
        ),
        refound_schedule: initFormState.refound_schedule.map((v, k) =>
          Object.assign({}, v, refound_schedule[k])
        )
      },
      loading: false
    });
  }

  imageUpload(file, cb) {
    setTimeout(() => {
      this.props.form.setFieldsValue({ image: file.dataURL });
    }, 1000);
  }

  locationChange(e) {
    this.props.form.setFieldsValue({
      latitude: e.latlng.lat.toString(),
      longitude: e.latlng.lng.toString()
    });
  }

  categoryChange(id) {
    const subcategory =
      this.props.form.getFieldsValue().category_id !== id
        ? { subcategory_id: this.state.subcategory_id }
        : {};
    this.props.form.setFieldsValue(subcategory);
  }

  render() {
    const textAreaStyle = {
      width: "100%",
      padding: "10px",
      height: "221px",
      borderRadius: "4px",
      border: "1px solid #e9e9e9"
    };

    console.log(this.props.form);

    const renderForm = () => {
      const { getFieldDecorator } = this.props.form;

      const getMinimunDiscount = (categories, id) =>
        categories
          .filter(category => category.id === id)
          .reduce((prev, act) => act.discount, 0);

      return (
        <Form
          style={{
            width: "100%"
          }}
          onSubmit={console.log}
        >
          <Box>
            <Row
              style={{
                width: "100%"
              }}
              gutter={16}
            >
              <Col lg={12} md={24} sm={24}>
                {getFieldDecorator("account_id", {
                  initialValue: this.state.form.account_id
                })(<Input type="hidden" name="acccount_id" />)}
                <FormItem label="Name">
                  {getFieldDecorator("name", {
                    initialValue: this.state.form.name,
                    rules: [
                      {
                        required: true,
                        message: <IntlMessages id="register.name.empty" />
                      }
                    ]
                  })(<Input type="text" name="name" />)}
                </FormItem>
                <FormItem label="Email">
                  {getFieldDecorator("email", {
                    initialValue: this.state.form.email,
                    rules: [
                      {
                        required: true,
                        type: "email",
                        message: <IntlMessages id="register.email" />
                      }
                    ]
                  })(<Input type="text" name="email" />)}
                </FormItem>
                <FormItem label="Telephone">
                  {getFieldDecorator("telephone", {
                    initialValue: this.state.form.telephone,
                    rules: [
                      {
                        required: true,
                        message: <IntlMessages id="register.telephone" />
                      }
                    ]
                  })(<Input type="tel" name="telephone" />)}
                </FormItem>
                <FormItem label="Address">
                  {getFieldDecorator("address", {
                    initialValue: this.state.form.address,
                    rules: [
                      {
                        required: true,
                        message: <IntlMessages id="register.address" />
                      }
                    ]
                  })(<Input type="text" name="address" />)}
                </FormItem>
                <FormItem label="Description">
                  {getFieldDecorator("description", {
                    initialValue: this.state.form.description,
                    rules: [
                      {
                        required: true,
                        message: <IntlMessages id="register.description" />
                      }
                    ]
                  })(<textarea style={textAreaStyle} name="description" />)}
                </FormItem>
                <FormItem label="Category">
                  {getFieldDecorator("category_id", {
                    initialValue: this.state.form.category_id,
                    rules: [
                      {
                        required: true,
                        message: <IntlMessages id="register.category" />
                      }
                    ]
                  })(
                    <Select
                      name="category_id"
                      style={{
                        width: "100%"
                      }}
                      placeholder="Please select"
                      onChange={this.categoryChange}
                    >
                      {this.props.categories
                        .filter(category => category.parent_id === 0)
                        .map((category, index) => (
                          <SelectOption
                            key={category.id}
                            value={Number(category.id)}
                            selected={
                              !this.props.form.getFieldsValue().category_id
                                ? index === 0
                                : this.props.form
                                    .getFieldValue("category_id")
                                    .toString() === category.id.toString()
                            }
                          >
                            {category.name}
                          </SelectOption>
                        ))}
                    </Select>
                  )}
                </FormItem>
                <FormItem label="Subcategory">
                  {getFieldDecorator("subcategory_id", {
                    initialValue: this.state.form.subcategory_id,
                    rules: [
                      {
                        required: true,
                        message: <IntlMessages id="register.subcategory" />
                      }
                    ]
                  })(
                    <Select
                      name="subcategory_id"
                      style={{
                        width: "100%"
                      }}
                      placeholder="Please select"
                    >
                      {this.props.categories
                        .filter(
                          category =>
                            Number(category.parent_id) ===
                            Number(this.props.form.getFieldsValue().category_id)
                        )
                        .map((category, index) => (
                          <SelectOption
                            key={category.id}
                            value={Number(category.id)}
                            selected={
                              !this.props.form.getFieldsValue().subcategory_id
                                ? index === 0
                                : this.props.form
                                    .getFieldsValue()
                                    .subcategory_id.toString() ===
                                  category.id.toString()
                            }
                          >
                            {category.name}
                          </SelectOption>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="Location">
                  {getFieldDecorator("latitude", {
                    initialValue: this.state.form.latitude
                  })(<Input type="hidden" name="latitude" />)}
                  {getFieldDecorator("longitude", {
                    initialValue: this.state.form.longitude
                  })(<Input type="hidden" name="longitude" />)}
                  <BasicLeafletMapWithMarker
                    onChange={this.locationChange}
                    marker={{
                      lat: this.state.form.latitude,
                      lng: this.state.form.longitude
                    }}
                  />
                </FormItem>
                <FormItem label="Image">
                  {getFieldDecorator("image", {
                    initialValue: this.state.form.image
                  })(<Input type="hidden" name="image" />)}
                  <DropImage onUpload={this.imageUpload} />
                </FormItem>
                <FormItem label="Rates">
                  <Row
                    style={{
                      width: "100%"
                    }}
                  >
                    <Col sm={3}>
                      <Row
                        style={{
                          width: "100%",
                          textAlign: "center"
                        }}
                      >
                        <Col> Type </Col> <Col>Refound </Col>
                        <Col> Discount </Col>
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
                            {discount.date.substr(0, 3)}
                          </Col>
                          <Col>
                            {getFieldDecorator(
                              "refound_schedule[" + key + "].refound",
                              {
                                initialValue: Number(
                                  this.state.form.refound_schedule[key].refound
                                )
                              }
                            )(
                              <InputNumber
                                name={"refound_schedule[" + key + "].refound"}
                                style={{
                                  width: "100%"
                                }}
                                min={getMinimunDiscount(
                                  this.props.categories,
                                  this.props.form.getFieldValue("category_id")
                                )}
                              />
                            )}
                          </Col>
                          <Col>
                            {getFieldDecorator(
                              "discount_schedule[" + key + "].discount",
                              {
                                initialValue: Number(discount.discount)
                              }
                            )(
                              <InputNumber
                                name={"discount_schedule[" + key + "].discount"}
                                min={getMinimunDiscount(
                                  this.props.categories,
                                  this.props.form.getFieldValue("category_id")
                                )}
                                max={100}
                                style={{
                                  width: "100%"
                                }}
                              />
                            )}
                          </Col>
                        </Row>
                      </Col>
                    ))}
                  </Row>
                </FormItem>
              </Col>
            </Row>
            <Button
              type="primary"
              style={{
                margin: "20px 0"
              }}
              onClick={this.submit}
            >
              Save store
            </Button>
          </Box>
        </Form>
      );
    };

    return (
      <LayoutContentWrapper>
        <PageHeader>
          <IntlMessages id="store.edit" />
        </PageHeader>
        {this.state.loading ? <PageLoading /> : renderForm()}
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = state => ({
  categories: state.Api.categoriesList,
  business: state.Api.business
});

const mapDispatchToProps = dispatch => ({
  fetchBusiness: bindActionCreators(actions.fetchBusiness, dispatch),
  saveBusiness: bindActionCreators(actions.saveBusiness, dispatch)
});

//Inject form manager
let CreateStoreForm = Form.create()(CreateStore);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateStoreForm);
