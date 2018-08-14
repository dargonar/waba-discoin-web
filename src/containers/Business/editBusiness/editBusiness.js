import React, { Component } from "react";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";
import IntlMessages from "../../../components/utility/intlMessages";

import Box from "../../../components/utility/box";
import Form from "../../../components/uielements/form";
import PageLoading from "../../../components/pageLoading";

import { Col, Row } from "antd";
import Input from "../../../components/uielements/input";
import Button from "../../../components/uielements/button";
import Select, { SelectOption } from "../../../components/uielements/select";
import Async from "../../../helpers/asyncComponent";
import Dropzone from "../../../components/uielements/dropzone.js";
import DropzoneWrapper from "../components/dropzone.style";
import actions from "../../../redux/owner/actions";
import apiActions from "../../../redux/api/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { generateAccount } from "../../../httpService";

const FormItem = Form.Item;

const BasicLeafletMapWithMarker = props => (
  <Async
    load={import(/* webpackChunkName: "basicLeafletMapWithMarker" */ "../components/map.js")}
    componentProps={props}
    componentArguement={"leafletMap"}
  />
);

class CreateStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        discount_schedule: [
          { discount: "0", reward: "0", date: "monday" },
          { discount: "0", reward: "0", date: "tuesday" },
          { discount: "0", reward: "0", date: "wednesday" },
          { discount: "0", reward: "0", date: "thursday" },
          { discount: "0", reward: "0", date: "friday" },
          { discount: "0", reward: "0", date: "saturday" },
          { discount: "0", reward: "0", date: "sunday" }
        ],
        location: {}
      }
    };
    this.inputChange = this.inputChange.bind(this);
    this.locationChange = this.locationChange.bind(this);
    this.categoryChange = this.categoryChange.bind(this);
    this.subcategoryChange = this.subcategoryChange.bind(this);
    this.componentConfig = {
      iconFiletypes: [".jpg", ".png", ".gif"],
      showFiletypeIcon: true,
      parallelUploads: 1,
      uploadMultiple: false,
      maxFilesize: 1, // MB
      dictRemoveFile: "Delete",
      dictCancelUploadConfirmation: "Are you sure to cancel upload?",
      postUrl: "no-url"
    };
    this.djsConfig = {
      autoProcessQueue: false,
      thumbnailHeight: 300,
      thumbnailWidth: 300
    };
    this.imageUpload = this.imageUpload.bind(this);
    this.changeSchedule = this.changeSchedule.bind(this);
    this.initForm = this.initForm.bind(this);
    this.dropzone = null;
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    this.props.getCategories();

    // if (typeof this.props.match.params.id !== "undefined") {
    //   this.setState({
    //     loading: true,
    //     mode: "edit",
    //     id: this.props.match.params.id
    //   });
    //   this.props.fetchBusiness(this.props.match.params.id);
    // }

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

  submit() {
    // TODO: Validation!
    console.log("*****> submit");

    console.log(JSON.stringify(this.state.form));
    this.props.saveBusiness(this.state.form);

    // if (typeof this.props.match.params.id !== "undefined") {
    //   console.log(JSON.stringify(this.state.form));
    //   this.props.saveBusiness(this.state.form);
    // } else {
    //   console.log(this.state.form.name);
    //   generateAccount(this.state.form.name);
    // }

    // updateBusinessProfile()
  }

  changeSchedule(type, key, value) {
    if (isNaN(value)) return;
    // let schedule = this.state.form[type + "_schedule"];
    let schedule = this.state.form["discount_schedule"];
    schedule[key][type] = Number(value);
    this.setState({
      form: {
        ...this.state.form,
        ["discount_schedule"]: schedule
      }
    });
    // [type + "_schedule"]: schedule
  }

  componentWillReceiveProps(nextProps) {
    const checkLoading = business => {
      if (business) {
        // const business = businesses.filter(x => x.account_id === this.state.id);
        // if (business.length !== 0) {
        this.initForm(business);
        // }
      }
    };

    console.log(
      " ** componentWillReceiveProps",
      "---------this.props.business",
      nextProps.business
    );
    if (this.state.loading === true) {
      checkLoading(nextProps.business);
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

  imageUpload(file) {
    this.setState({
      form: {
        ...this.state.form,
        image: file
      }
    });
    //this.dropzone.emit("complete", file);
  }

  locationChange(e) {
    this.setState({
      form: {
        ...this.state.form,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng
      }
    });
    console.log(" **********> locationChange");
    console.log(e);
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

    // console.log( " ===> inputChange e.target.id");
    // console.log(e.target.id);
    // console.log( " ===> inputChange e.target.value");
    // console.log(e.target.value);

    // console.log( " ===> inputChange result form");
    // console.log(result.form);
    // this.setState({ form : result.form   });
    // console.log( " ===> inputChange state form");
    // console.log(this.state.form)
  }

  categoryChange(id) {
    this.setState({
      form: {
        ...this.state.form,
        category_id: id,
        subcategory_id: null
      }
    });
  }

  subcategoryChange(id) {
    this.setState({
      form: {
        ...this.state.form,
        subcategory_id: id
      }
    });
  }

  render() {
    const textAreaStyle = {
      width: "100%",
      padding: "10px",
      height: "221px",
      borderRadius: "4px",
      border: "1px solid #e9e9e9"
    };

    const eventHandlers = {
      init: dz => {
        this.dropzone = dz;
        dz.on("addedfile", function(file) {
          if (dz.files.length > 1) {
            dz.removeFile(dz.files[0]);
          }
        });
      },
      thumbnail: (fullimage, data) =>
        setTimeout(() => this.imageUpload(data), 1000)
    };

    const renderForm = () => {
      // console.log( " ===> render");
      // console.log( JSON.stringify(this.state.form));

      return (
        <Form style={{ width: "100%" }}>
          <Box>
            <Row style={{ width: "100%" }} gutter={16}>
              <Col lg={12} md={24} sm={24}>
                <FormItem
                  label={
                    <IntlMessages id="profile.name" defaultMessage="Name" />
                  }
                >
                  <Input
                    type="text"
                    defaultMessage={this.state.form.name}
                    id="form.name"
                    onChange={this.inputChange}
                  />
                </FormItem>

                <FormItem
                  label={
                    <IntlMessages id="profile.email" defaultMessage="Email" />
                  }
                >
                  <Input
                    type="email"
                    defaultMessage={this.state.form.email}
                    id="form.email"
                    onChange={this.inputChange}
                  />
                </FormItem>

                <FormItem
                  label={
                    <IntlMessages
                      id="profile.telephone"
                      defaultMessage="Telephone"
                    />
                  }
                >
                  <Input
                    type="tel"
                    defaultMessage={this.state.form.telephone}
                    id="form.telephone"
                    onChange={this.inputChange}
                  />
                </FormItem>

                <FormItem
                  label={
                    <IntlMessages
                      id="profile.address"
                      defaultMessage="Address"
                    />
                  }
                >
                  <Input
                    type="text"
                    defaultMessage={this.state.form.address}
                    id="form.address"
                    onChange={this.inputChange}
                  />
                </FormItem>

                <FormItem
                  label={
                    <IntlMessages
                      id="profile.description"
                      defaultMessage="Description"
                    />
                  }
                >
                  <textarea
                    id="form.description"
                    defaultMessage={this.state.form.description}
                    onChange={this.inputChange}
                    style={textAreaStyle}
                  />
                </FormItem>

                <FormItem
                  label={
                    <IntlMessages
                      id="profile.category"
                      defaultMessage="Category"
                    />
                  }
                >
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    defaultMessage={this.state.form.category_id}
                    onChange={this.categoryChange}
                  >
                    {this.props.categories
                      .filter(category => category.parent_id === 0)
                      .map((category, index) => (
                        <SelectOption
                          key={category.id}
                          value={Number(category.id)}
                          selected={
                            !this.state.form.category_id
                              ? index == 0
                              : this.state.form.category_id.toString() ===
                                category.id.toString()
                          }
                        >
                          {category.name} (descuento mínimo: {category.discount}
                          )
                        </SelectOption>
                      ))}
                  </Select>
                </FormItem>

                <FormItem
                  label={
                    <IntlMessages
                      id="profile.subcategory"
                      defaultMessage="Subcategory"
                    />
                  }
                >
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    defaultMessage={this.state.form.subcategory_id}
                    onChange={this.subcategoryChange}
                  >
                    {this.props.categories
                      .filter(
                        category =>
                          category.parent_id === this.state.form.category_id
                      )
                      .map((category, index) => (
                        <SelectOption key={category.id} value={category.id}>
                          {category.name}
                        </SelectOption>
                      ))}
                  </Select>
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem
                  label={
                    <IntlMessages
                      id="profile.location"
                      defaultMessage="Location"
                    />
                  }
                >
                  <BasicLeafletMapWithMarker
                    onChange={this.locationChange}
                    marker={{
                      lat: this.state.form.latitude,
                      lng: this.state.form.longitude
                    }}
                  />
                </FormItem>

                <FormItem
                  label={
                    <IntlMessages id="profile.image" defaultMessage="Image" />
                  }
                >
                  <DropzoneWrapper>
                    <Dropzone
                      config={this.componentConfig}
                      eventHandlers={eventHandlers}
                      djsConfig={this.djsConfig}
                    />
                  </DropzoneWrapper>
                </FormItem>

                <FormItem
                  label={
                    <IntlMessages id="profile.rates" defaultMessage="Rates" />
                  }
                >
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
                            <Input
                              type="number"
                              defaultMessage={
                                this.state.form.discount_schedule[key].reward
                              }
                              onChange={e =>
                                this.changeSchedule(
                                  "reward",
                                  key,
                                  e.target.value
                                )
                              }
                              style={{ width: "100%" }}
                            />
                          </Col>
                          <Col>
                            <Input
                              type="number"
                              defaultMessage={discount.discount}
                              onChange={e =>
                                this.changeSchedule(
                                  "discount",
                                  key,
                                  e.target.value
                                )
                              }
                              style={{ width: "100%" }}
                            />
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
  categories: state.Api.categoriesList,
  business: state.Api.business
});

const mapDispatchToProps = dispatch => ({
  getCategories: bindActionCreators(apiActions.getCategoriesList, dispatch),
  fetchBusiness: bindActionCreators(actions.fetchBusiness, dispatch),
  saveBusiness: bindActionCreators(actions.saveBusiness, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateStore);
