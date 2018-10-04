import React, { Component } from "react";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";
import IntlMessages from "../../../components/utility/intlMessages";

import Box from "../../../components/utility/box";
import PageLoading from "../../../components/pageLoading";

import { Col, Row } from "antd";

import Button from "../../../components/uielements/button";
import actions from "../../../redux/owner/actions";
import apiActions from "../../../redux/api/actions";
import appActions from "../../../redux/app/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Form from "../../../components/uielements/form";
import { Input, Select, InputNumber } from "antd";
import { ImageUpload } from "../components/imageUpload";
import { InputPlace } from "../components/placeInput";
import Map from "../components/map";
const FormItem = Form.Item;
const SelectOption = Select.Option;

const socialMedia = ["Website", "Twiter", "Instagram", "Facebook"];

const BasicLeafletMapWithMarker = props => <Map {...props} />;

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

const defualtSchedule = [
  { discount: "0", reward: "0", date: "monday" },
  { discount: "0", reward: "0", date: "tuesday" },
  { discount: "0", reward: "0", date: "wednesday" },
  { discount: "0", reward: "0", date: "thursday" },
  { discount: "0", reward: "0", date: "friday" },
  { discount: "0", reward: "0", date: "saturday" },
  { discount: "0", reward: "0", date: "sunday" }
];

class CreateStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        discount_schedule: defualtSchedule,
        location: {},
        links: {},
        mode: "edit"
      }
    };
    this.inputChange = this.inputChange.bind(this);
    this.locationChange = this.locationChange.bind(this);
    this.categoryChange = this.categoryChange.bind(this);
    this.imageUpload = this.imageUpload.bind(this);
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
      "---------this.props.business"
      //this.props.business
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
      cat => Number(cat.id) === Number(category_id)
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
        return;
        //Inject discount:schedule after submit
        if (!this.props.isAdmin) {
          result.discount_schedule =
            this.props.business.discount_schedule.length === 7
              ? this.props.business.discount_schedule
              : this.formatSchedule(result.category_id);
        }
        this.props.saveBusiness(result);
      } else {
        this.props.showMessage({
          msg: "Por favor corrija los errores e intente nuevamente",
          msgType: "error"
        });
      }
    });

    //this.props.saveBusiness(this.state.form);
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

  imageUpload(file, field) {
    this.props.form.setFieldsValue({ [field]: file });
  }

  locationChange(e) {
    this.props.form.setFieldsValue({
      latitude: e.latlng.lat.toString(),
      longitude: e.latlng.lng.toString()
    });
    if (e.address) {
      this.props.form.setFieldsValue({ address: e.address });
    }
    console.log(" **********> locationChange", e);
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

  categoryChange(id) {
    const subcategory =
      this.props.form.getFieldsValue().category_id !== id
        ? { subcategory_id: this.state.subcategory_id }
        : {};
    this.props.form.setFieldsValue(subcategory);
    const minimumDiscount = this.props.categories
      .filter(category => category.id === id)
      .reduce((prev, act) => act.discount, 0);

    const discount_schedule = this.props.form
      .getFieldsValue()
      .discount_schedule.map(day => {
        day.reward =
          day.reward < minimumDiscount ? minimumDiscount : day.reward;
        day.discount =
          day.discount < minimumDiscount ? minimumDiscount : day.discount;
        return day;
      });
    this.props.form.setFieldsValue({ discount_schedule });
  }

  render() {
    const textAreaStyle = {
      width: "100%",
      padding: "10px",
      height: "221px",
      borderRadius: "4px",
      border: "1px solid #e9e9e9"
    };

    const renderForm = () => {
      // console.log( " ===> render");
      // console.log( JSON.stringify(this.state.form));
      const { getFieldDecorator } = this.props.form;

      const getMinimunDiscount = (categories, id) =>
        categories
          .filter(category => category.id === id)
          .reduce((prev, act) => act.discount, 0);

      const minimumDiscount = getMinimunDiscount(
        this.props.categories,
        this.props.form.getFieldValue("category_id")
      );

      //console.log(this.props.form, this.props.form.getFieldsValue());
      return (
        <Form style={{ width: "100%" }} onSubmit={this.submit}>
          <Box>
            <h3>
              <IntlMessages id="profile.profile_info" defaultMessage="Perfil" />
            </h3>
            <Row style={{ width: "100%" }} gutter={16}>
              <Col lg={12} md={24} sm={24}>
                {getFieldDecorator("account_id", {
                  initialValue: this.state.form.account_id
                })(<Input type="hidden" name="acccount_id" />)}
                {getFieldDecorator("post_type", {
                  initialValue: "profile"
                })(<Input type="hidden" name="post_type" />)}
                <FormItem
                  {...formItemLayout}
                  label={
                    <IntlMessages id="profile.name" defaultMessage="Name" />
                  }
                >
                  {getFieldDecorator("name", {
                    initialValue: this.state.form.name,
                    rules: [
                      {
                        required: true,
                        message: (
                          <IntlMessages
                            id="register.name.empty"
                            defaultMessage="Business Name is required"
                          />
                        )
                      }
                    ]
                  })(<Input id="form.name" />)}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label={
                    <IntlMessages id="profile.email" defaultMessage="Email" />
                  }
                >
                  {getFieldDecorator("email", {
                    initialValue: this.state.form.email,
                    rules: [
                      {
                        required: true,
                        type: "email",
                        message: (
                          <IntlMessages
                            id="register.email.empy"
                            defaultMessage="Email is required"
                          />
                        )
                      }
                    ]
                  })(<Input type="text" name="email" />)}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label={
                    <IntlMessages
                      id="profile.telephone"
                      defaultMessage="Telephone"
                    />
                  }
                >
                  {getFieldDecorator("telephone", {
                    initialValue: this.state.form.telephone,
                    rules: [
                      {
                        required: true,
                        message: (
                          <IntlMessages
                            id="register.telephone.empty"
                            defaultMessage="Telephone is required"
                          />
                        )
                      }
                    ]
                  })(<Input type="tel" name="telephone" />)}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label={
                    <IntlMessages
                      id="profile.description"
                      defaultMessage="Description"
                    />
                  }
                >
                  {getFieldDecorator("description", {
                    initialValue: this.state.form.description,
                    rules: [
                      {
                        required: true,
                        message: (
                          <IntlMessages
                            id="register.description"
                            defaultMessage="Description is required"
                          />
                        )
                      }
                    ]
                  })(<textarea style={textAreaStyle} name="description" />)}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label={
                    <IntlMessages
                      id="profile.category"
                      defaultMessage="Category"
                    />
                  }
                >
                  {getFieldDecorator("category_id", {
                    initialValue: this.state.form.category_id,
                    rules: [
                      {
                        required: true,
                        message: (
                          <IntlMessages
                            id="register.category"
                            defaultMessage="Category is required"
                          />
                        )
                      }
                    ]
                  })(
                    <Select
                      disabled={!this.props.isAdmin}
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
                            <span>
                              {category.name}{" "}
                              <IntlMessages
                                id="profile.minimumDiscount"
                                defaultMessage={`(Minimum discount: {discount})`}
                                values={{ discount: category.discount }}
                              />
                            </span>
                          </SelectOption>
                        ))}
                    </Select>
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label={
                    <IntlMessages
                      id="profile.subcategory"
                      defaultMessage="Subcategory"
                    />
                  }
                >
                  {getFieldDecorator("subcategory_id", {
                    initialValue: this.state.form.subcategory_id,
                    rules: [
                      {
                        required: true,
                        message: (
                          <IntlMessages
                            id="register.subcategory.empty"
                            defaultMessage="Subcategory id required"
                          />
                        )
                      }
                    ]
                  })(
                    <Select
                      disabled={!this.props.isAdmin}
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

                <h3>
                  <IntlMessages
                    id="profile.linksAndSocialMedia"
                    defaultMessage="Links and Social Media"
                  />
                </h3>
                {socialMedia.map(media => (
                  <FormItem
                    {...formItemLayout}
                    label={
                      <IntlMessages
                        id={"profile.linksAndSocialMedia." + media}
                        defaultMessage={media}
                      />
                    }
                  >
                    {getFieldDecorator("links." + media.toLowerCase(), {
                      initialValue: this.state.form.links[media.toLowerCase()]
                    })(<Input type="url" name={"links." + media} />)}
                  </FormItem>
                ))}
              </Col>

              <Col md={24} lg={12}>
                <FormItem
                  {...formItemLayout}
                  label={
                    <IntlMessages
                      id="profile.address"
                      defaultMessage="Address"
                    />
                  }
                >
                  {getFieldDecorator("address", {
                    initialValue: this.state.form.address,
                    rules: [
                      {
                        required: true,
                        message: (
                          <IntlMessages
                            id="profile.address.empty"
                            defaultMessage="Address is required"
                          />
                        )
                      }
                    ]
                  })(
                    <InputPlace
                      defaultValue={this.state.form.address}
                      locationChange={this.locationChange}
                      onChange={(v, e) => {
                        this.props.form.setFieldsValue({
                          address:
                            e.props.children.split("//////")[0] ||
                            e.props.value.split("//////")[0]
                        });
                      }}
                    />
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label={
                    <IntlMessages
                      id="profile.location"
                      defaultMessage="Location"
                    />
                  }
                >
                  {getFieldDecorator("location", {
                    initialValue: this.state.form.location
                  })(<Input type="hidden" name="latitude" />)}
                  {getFieldDecorator("latitude", {
                    initialValue: this.state.form.latitude
                  })(<Input type="hidden" name="latitude" />)}
                  {getFieldDecorator("longitude", {
                    initialValue: this.state.form.longitude
                  })(<Input type="hidden" name="longitude" />)}

                  <BasicLeafletMapWithMarker
                    onChange={this.locationChange}
                    lat={this.props.form.getFieldValue("latitude")}
                    lng={this.props.form.getFieldValue("longitude")}
                  />
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label={
                    <IntlMessages id="profile.logo" defaultMessage="Logo" />
                  }
                >
                  {getFieldDecorator("image", {
                    initialValue: this.state.form.image
                  })(<Input type="hidden" name="image" />)}
                  <ImageUpload
                    fileChange={image => this.imageUpload(image, "image")}
                    defaultImage={this.state.form.image}
                  />
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label={
                    <IntlMessages id="profile.avatar" defaultMessage="Avatar" />
                  }
                >
                  {getFieldDecorator("avatar", {
                    initialValue: this.state.form.avatar
                  })(<Input type="hidden" name="avatar" />)}
                  <ImageUpload
                    fileChange={image => this.imageUpload(image, "avatar")}
                    defaultImage={this.state.form.avatar}
                  />
                </FormItem>
              </Col>
            </Row>

            {this.props.isAdmin ? (
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
                            <IntlMessages
                              defaultMessage="Type"
                              id="profile.type"
                            />
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
                      {this.state.form.discount_schedule.map(
                        (discount, key) => (
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
                                  id={
                                    "profile.day-" + discount.date.substr(0, 3)
                                  }
                                />
                              </Col>
                              <Col>
                                {getFieldDecorator(
                                  "discount_schedule[" + key + "].date",
                                  {
                                    initialValue: this.state.form
                                      .discount_schedule[key].date
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
                                      name={
                                        "discount_schedule[" + key + "].reward"
                                      }
                                      max={100}
                                      style={{
                                        width: "100%"
                                      }}
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
                                      name={
                                        "discount_schedule[" +
                                        key +
                                        "].discount"
                                      }
                                      max={100}
                                      style={{
                                        width: "100%"
                                      }}
                                    />
                                  )}
                                </FormItem>
                              </Col>
                            </Row>
                          </Col>
                        )
                      )}
                    </Row>
                  </FormItem>
                </Col>
              </Row>
            ) : (
              false
            )}
            <Button
              type="primary"
              style={{ margin: "20px 0" }}
              onClick={this.submit}
            >
              <IntlMessages
                id="profile.saveStore"
                defaultMessage="Save store"
              />
            </Button>
          </Box>
        </Form>
      );
    };

    return (
      <LayoutContentWrapper>
        <PageHeader>
          {this.state.mode !== "edit" ? (
            <IntlMessages
              id="sidebar.createStore"
              defaultMessage="Create store"
            />
          ) : (
            <IntlMessages id="profile.edit" defaultMessage="Edit store" />
          )}
        </PageHeader>
        {this.state.loading ? <PageLoading /> : renderForm()}
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = state => ({
  isAdmin: state.Auth.accountType === "admin",
  categories: state.Api.categoriesList,
  business: state.Api.business,
  businesses: state.Owner.stores
});

const mapDispatchToProps = dispatch => ({
  showMessage: bindActionCreators(appActions.showMessage, dispatch),
  getCategories: bindActionCreators(apiActions.getCategoriesList, dispatch),
  fetchBusiness: bindActionCreators(actions.fetchBusiness, dispatch),
  saveBusiness: bindActionCreators(actions.saveBusiness, dispatch)
});

//inject this.props.form, inject redux state and actions
export default Form.create()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CreateStore)
);
