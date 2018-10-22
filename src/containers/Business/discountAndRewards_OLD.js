import React, { Component } from "react";
import LayoutContentWrapper from "../../components/utility/layoutWrapper";
import PageHeader from "../../components/utility/pageHeader";
import PageLoading from "../../components/pageLoading";
import { Row, Col } from "antd";
import basicStyle from "../../config/basicStyle";
import Box from "../../components/utility/box";
import ContentHolder from "../../components/utility/contentHolder";
import Input from "../../components/uielements/input";
import Button from "../../components/uielements/button";
import IntlMessages from "../../components/utility/intlMessages";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../redux/api/actions";
import MessageBox from "../../components/MessageBox";

import Form from "../../components/uielements/form";
import { Select, InputNumber } from "antd";
const defualtSchedule = [
  { discount: "0", reward: "0", date: "monday" },
  { discount: "0", reward: "0", date: "tuesday" },
  { discount: "0", reward: "0", date: "wednesday" },
  { discount: "0", reward: "0", date: "thursday" },
  { discount: "0", reward: "0", date: "friday" },
  { discount: "0", reward: "0", date: "saturday" },
  { discount: "0", reward: "0", date: "sunday" }
];
const FormItem = Form.Item;
const SelectOption = Select.Option;
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


class DiscountsAndRewards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        discount_schedule: defualtSchedule
      }
    };
    this.renderContent = this.renderContent.bind(this);
    this.updateRefounds = this.updateRefounds.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    if (this.props.api.schedule === null) {
      console.log(" -- DiscountsAndRewards:componentWillMount() -- ");
      this.props.getSchedule();
    }
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

  updateRefounds(e, key) {
    const value = e.target.value;
    let discounts = this.state.discounts || this.props.api.schedule;
    if (discounts[key]) {
      discounts[key] = { ...discounts[key], discount: value };
    }
    this.setState({ discounts: discounts });
  }

  submit() {
    console.log(" -- submit():schedule:", JSON.stringify(this.state.discounts));
    if (typeof this.state.discounts !== "undefined") {
      this.props.updateSchedule(this.state.discounts);
    }
  }

  renderContent() {
    const { rowStyle, colStyle } = basicStyle;

    const inputStyle = {
      fontSize: "24px"
    };
    const avgStyle = {
      display: "block",
      paddingTop: "15px"
    };
    

    if (this.props.api.schedule !== null) {
      
      // const { getFieldDecorator } = this.props.form;
      
      return (
        <Form style={{ width: "100%" }} onSubmit={this.submit}>
          <Row style={rowStyle} gutter={16} justify="start">
            {this.props.api.schedule.map((data, key) => (
              <Col md={6} sm={12} xs={24} style={colStyle} key={key}>
                <Box
                  title={
                    <span style={{ textTransform: "capitalize" }}>
                      <IntlMessages id={"configSchedule."+data.date} defaultMessage={data.date} />
                    </span>
                  }
                >
                  <ContentHolder>
                    <span><IntlMessages id="profile.discount" defaultMessage="Discount" /></span>
                    <Input
                      type="number"
                      defaultValue={data.discount}
                      style={inputStyle}
                      onChange={e => this.updateRefounds(e, key)}
                    />
                    {data.avg ? (
                      <span style={avgStyle}>
                        Avg. {Number(data.avg).toLocaleString()} %
                      </span>
                    ) : (
                      false
                    )}
                    <br/>
                    <span><IntlMessages id="profile.reward" defaultMessage="Reward" /></span>
                    <Input
                      type="number"
                      defaultValue={data.reward}
                      style={inputStyle}
                      onChange={e => this.updateRefounds(e, key)}
                    />
                  </ContentHolder>
                </Box>
              </Col>
            ))}
          </Row>

          <Row style={rowStyle} gutter={16} justify="start">
            <FormItem
                  {...formItemLayout}
                  label={
                    <IntlMessages
                      id="profile.payments"
                      defaultMessage="Payments methods"
                    />
                  }
                >
                  
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
                  
              </FormItem>
            </Row>

          <Button
            type="primary"
            style={{ marginLeft: "auto", marginRight: "16px" }}
            onClick={this.submit}
            loading={this.props.api.actionLoading}
          >
            <IntlMessages defaultMessage="Apply changes" id="parameters.apply" />
          </Button>
        </Form>
      );
    } else {
      return false;
    }
  }

  render() {
    
    console.log('this.props.api.loading: ', this.props.api.loading);
    console.log('this.props.api.schedule: ', this.props.api.schedule);
    console.log('this.state.loading: ', this.state.loading);
    return (
      <LayoutContentWrapper>
        <MessageBox
          clean={this.props.cleanMsg}
          msg={this.props.api.msg}
          error={this.props.api.error !== false}
        />
        <PageHeader><IntlMessages id="configSchedule.title" defaultMessage="Configuración" /></PageHeader>
        { ((this.props.api.loading !== false &&
            this.props.api.schedule === null)
            || this.state.loading)
            ? (
              <PageLoading />
            ) : (
              this.renderContent()
            )
        }
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = state => ({
  api: state.Api,
  business: state.Api.business,
});

const mapDispatchToProps = dispatch => ({
  cleanMsg: bindActionCreators(actions.cleanMsg, dispatch),
  getSchedule: bindActionCreators(actions.getSchedule, dispatch),
  updateSchedule: bindActionCreators(actions.updateSchedule, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscountsAndRewards);
