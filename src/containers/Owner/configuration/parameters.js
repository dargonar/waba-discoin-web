import React, { Component } from "react";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";
import PageLoading from "../../../components/pageLoading";
import IntlMessages from "../../../components/utility/intlMessages";
import MessageBox from "../../../components/MessageBox";
import Button from "../../../components/uielements/button";
import { Col, Row } from "antd";
import ContentHolder from "../../../components/utility/contentHolder";
import Box from "../../../components/utility/box";
import Input from "../../../components/uielements/input";
import set from "lodash.set";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../../redux/owner/actions";

class Parameters extends Component {
  constructor(props) {
    super(props);
    this.onFormChange = this.onFormChange.bind(this);
    this.submit = this.submit.bind(this);
    this.state = {
      data: props.configuration.parameters
    };
  }

  componentWillMount() {
    this.props.fetch();
  }

  onFormChange(e) {
    const result = set(
      { data: this.props.configuration.parameters },
      e.target.id,
      e.target.value
    );
    this.setState({ data: result.data });
    console.log(this.state.data);
  }

  submit() {
    // let conf = { configuration : {...this.state.data}};
    let conf = this.state.data;
    console.log('------------------- submitting:', JSON.stringify( conf ));
    this.props.sendParameters( conf );
  }

  render() {
    const data = this.props.configuration.parameters;
    const rowStyle = {
      width: "100%",
      display: "flex",
      flexFlow: "row wrap"
    };

    const colStyle = {
      marginBottom: "16px",
      display: "flex",
      alignItems: "center"
    };

    const gutter = 16;

    const label = {
      width: "100%"
    };

    // console.log(" ---- render kpis", JSON.stringify(data));

    const renderForm = () => {
      return this.props.configuration.parameters !== null ? (
        <form ref="form">
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={8} sm={24} xs={24} style={colStyle}>
              <Box
                title={
                  <IntlMessages
                    defaultMessage="Warnings indicators"
                    id="parameters.waringns"
                  />
                }
              >
                <ContentHolder>
                  <Row gutter={gutter}>
                    <Col md={24} sm={24} xs={24} style={colStyle}>
                      <h4>
                        <IntlMessages
                          id="parameters.lightGreen"
                          defaultMessage="Green light"
                        />
                      </h4>
                    </Col>
                    <Col md={24} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages
                          defaultMessage="From"
                          id="parameters.from"
                        />{" "}
                      </span>
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        addonAfter={"%"}
                        id="data.warnings.first.from_amount"
                        defaultValue={data.warnings.first.from_amount}
                      />
                    </Col>
                    <Col md={24} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages defaultMessage="To" id="parameters.to" />{" "}
                      </span>
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        addonAfter={"%"}
                        id="data.warnings.first.to_amount"
                        defaultValue={data.warnings.first.to_amount}
                      />
                    </Col>
                    <Col md={24} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages
                          defaultMessage="% extra"
                          id="parameters.extra"
                        />
                      </span>{" "}
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        addonAfter={"%"}
                        id="data.warnings.first.extra_percentage"
                        defaultValue={data.warnings.first.extra_percentage}
                      />
                    </Col>
                  </Row>

                  <Row gutter={gutter}>
                    <Col md={24} sm={24} xs={24} style={colStyle}>
                      <h4>
                        <IntlMessages
                          id="parameters.lightYellow"
                          defaultMessage="Yellow light"
                        />
                      </h4>
                    </Col>
                    <Col md={24} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages
                          defaultMessage="From"
                          id="parameters.from"
                        />
                      </span>{" "}
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        addonAfter={"%"}
                        id="data.warnings.second.from_amount"
                        defaultValue={data.warnings.second.from_amount}
                      />
                    </Col>
                    <Col md={24} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages defaultMessage="To" id="parameters.to" />{" "}
                      </span>
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        addonAfter={"%"}
                        id="data.warnings.second.to_amount"
                        defaultValue={data.warnings.second.to_amount}
                      />
                    </Col>
                    <Col md={24} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages
                          defaultMessage="% extra"
                          id="parameters.extra"
                        />
                      </span>{" "}
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        addonAfter={"%"}
                        id="data.warnings.second.extra_percentage"
                        defaultValue={data.warnings.second.extra_percentage}
                      />
                    </Col>
                  </Row>

                  <Row gutter={gutter}>
                    <Col md={24} sm={24} xs={24} style={colStyle}>
                      <h4>
                        <IntlMessages
                          id="parameters.lightRed"
                          defaultMessage="Red light"
                        />
                      </h4>
                    </Col>
                    <Col md={24} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages
                          defaultMessage="From"
                          id="parameters.from"
                        />
                      </span>{" "}
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        addonAfter={"%"}
                        id="data.warnings.third.from_amount"
                        defaultValue={data.warnings.third.from_amount}
                      />
                    </Col>
                    <Col md={24} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages defaultMessage="To" id="parameters.to" />{" "}
                      </span>
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        addonAfter={"%"}
                        id="data.warnings.third.to_amount"
                        defaultValue={data.warnings.third.to_amount}
                      />
                    </Col>
                    <Col md={24} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages
                          defaultMessage="% extra"
                          id="parameters.extra"
                        />
                      </span>{" "}
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        addonAfter={"%"}
                        id="data.warnings.third.extra_percentage"
                        defaultValue={data.warnings.third.extra_percentage}
                      />
                    </Col>
                  </Row>
                </ContentHolder>
              </Box>
            </Col>
            <Col md={16} sm={24} xs={24} style={colStyle}>
              <Box
                title={
                  <IntlMessages
                    defaultMessage="Airdrop"
                    id="parameters.airdop"
                  />
                }
              >
                <ContentHolder>
                  <Row gutter={gutter}>
                    <Col md={24} sm={24} xs={24} style={colStyle}>
                      <h4>
                        <IntlMessages
                          defaultMessage="Referal System"
                          id="parameters.referalSystem"
                        />
                      </h4>
                    </Col>
                    <Col md={12} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages
                          defaultMessage="How many times can a user refer?"
                          id="parameters.referredMax"
                        />
                      </span>
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        style={{ width: "50%" }}
                        id="data.airdrop.by_referral.referred_max_quantity"
                        defaultValue={
                          data.airdrop.by_referral.referred_max_quantity
                        }
                      />
                    </Col>
                    <Col md={12} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages
                          defaultMessage="Reward to referer"
                          id="parameters.referrerAmount"
                        />
                      </span>
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        id="data.airdrop.by_referral.referrer_amount"
                        defaultValue={data.airdrop.by_referral.referrer_amount}
                      />
                    </Col>
                    <Col md={12} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages
                          defaultMessage="Reward to refered"
                          id="parameters.referredAmount"
                        />
                      </span>
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        id="data.airdrop.by_referral.referred_amount"
                        defaultValue={data.airdrop.by_referral.referred_amount}
                      />
                    </Col>
                  </Row>
                  <Row gutter={gutter}>
                    <Col md={24} sm={24} xs={24} style={colStyle}>
                      <h4>
                        <IntlMessages
                          defaultMessage="First wallets"
                          id="parameters.firstWallets"
                        />
                      </h4>
                    </Col>
                    <Col md={12} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages
                          defaultMessage="Number of downloads with reward"
                          id="parameters.firstWalletDownload"
                        />
                      </span>
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        style={{ width: "50%" }}
                        id="data.airdrop.by_wallet.first_wallet_download"
                        defaultValue={
                          data.airdrop.by_wallet.first_wallet_download
                        }
                      />
                    </Col>
                    <Col md={12} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages
                          defaultMessage="Download reward"
                          id="parameters.downloadReward"
                        />
                      </span>
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        id="data.airdrop.by_wallet.reward_amount"
                        defaultValue={data.airdrop.by_wallet.reward_amount}
                      />
                    </Col>
                    <Col md={12} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages
                          defaultMessage="First Tx reward"
                          id="parameters.firstTxReward"
                        />
                      </span>
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        id="data.airdrop.by_wallet.first_tx_reward_amount"
                        defaultValue={
                          data.airdrop.by_wallet.first_tx_reward_amount
                        }
                      />
                    </Col>
                  </Row>

                  <Row gutter={gutter}>
                    <Col md={24} sm={24} xs={24} style={colStyle}>
                      <h4>
                        <IntlMessages
                          defaultMessage="Staggered reimbursement per transaction"
                          id="parameters.reimbursement"
                        />
                      </h4>
                    </Col>

                    <Col md={24} sm={24} xs={24} style={colStyle}>
                      <h5>
                        <IntlMessages
                          defaultMessage="First stage"
                          id="parameters.reimbursementFirst"
                        />
                      </h5>
                    </Col>
                    <Col md={9} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages
                          defaultMessage="From transaction"
                          id="parameters.reimbursementFromTx"
                        />
                        :
                      </span>
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        addonAfter={"TX"}
                        id="data.airdrop.by_reimbursement.first.from_tx"
                        defaultValue={
                          data.airdrop.by_reimbursement.first.from_tx
                        }
                      />
                    </Col>
                    <Col md={15} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages
                          defaultMessage="To transaction"
                          id="parameters.reimbursementToTx"
                        />
                        :
                      </span>
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        addonAfter={"TX"}
                        id="data.airdrop.by_reimbursement.first.to_tx"
                        defaultValue={data.airdrop.by_reimbursement.first.to_tx}
                      />
                    </Col>
                    <Col md={15} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages
                          defaultMessage="Percentage refund to business and user"
                          id="parameters.reimbursementPercentRefunded"
                        />{" "}
                      </span>
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        addonAfter={"%"}
                        id="data.airdrop.by_reimbursement.first.tx_amount_percent_refunded"
                        defaultValue={
                          data.airdrop.by_reimbursement.first
                            .tx_amount_percent_refunded
                        }
                      />
                    </Col>

                    <Col md={24} sm={24} xs={24} style={colStyle}>
                      <h5>
                        {" "}
                        <IntlMessages
                          defaultMessage="Second stage"
                          id="parameters.reimbursementSecond"
                        />
                      </h5>
                    </Col>
                    <Col md={9} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages
                          defaultMessage="From transaction"
                          id="parameters.reimbursementFromTx"
                        />
                        :
                      </span>
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        addonAfter={"TX"}
                        id="data.airdrop.by_reimbursement.second.from_tx"
                        defaultValue={
                          data.airdrop.by_reimbursement.second.from_tx
                        }
                      />
                    </Col>
                    <Col md={15} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        {" "}
                        <IntlMessages
                          defaultMessage="To transaction"
                          id="parameters.reimbursementToTx"
                        />
                        :
                      </span>
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        addonAfter={"TX"}
                        id="data.airdrop.by_reimbursement.second.to_tx"
                        defaultValue={
                          data.airdrop.by_reimbursement.second.to_tx
                        }
                      />
                    </Col>
                    <Col md={15} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages
                          defaultMessage="Percentage refund to business and user"
                          id="parameters.reimbursementPercentRefunded"
                        />{" "}
                      </span>
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        addonAfter={"%"}
                        id="data.airdrop.by_reimbursement.second.tx_amount_percent_refunded"
                        defaultValue={
                          data.airdrop.by_reimbursement.second
                            .tx_amount_percent_refunded
                        }
                      />
                    </Col>

                    <Col md={24} sm={24} xs={24} style={colStyle}>
                      <h5>
                        <IntlMessages
                          defaultMessage="Third Stage"
                          id="parameters.reimbursementThird"
                        />
                      </h5>
                    </Col>
                    <Col md={9} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages
                          defaultMessage="From transaction"
                          id="parameters.reimbursementFromTx"
                        />
                        :
                      </span>
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        addonAfter={"TX"}
                        id="data.airdrop.by_reimbursement.third.from_tx"
                        defaultValue={
                          data.airdrop.by_reimbursement.third.from_tx
                        }
                      />
                    </Col>
                    <Col md={15} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages
                          defaultMessage="To transaction"
                          id="parameters.reimbursementToTx"
                        />
                        :
                      </span>
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        addonAfter={"TX"}
                        id="data.airdrop.by_reimbursement.third.to_tx"
                        defaultValue={data.airdrop.by_reimbursement.third.to_tx}
                      />
                    </Col>
                    <Col md={15} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages
                          defaultMessage="Percentage refund to business and user"
                          id="parameters.reimbursementPercentRefunded"
                        />{" "}
                      </span>
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        addonAfter={"%"}
                        id="data.airdrop.by_reimbursement.third.tx_amount_percent_refunded"
                        defaultValue={
                          data.airdrop.by_reimbursement.third
                            .tx_amount_percent_refunded
                        }
                      />
                    </Col>
                  </Row>
                </ContentHolder>
              </Box>
            </Col>
            <Col md={24} sm={24} xs={24} style={colStyle}>
              <Box
                title={
                  <IntlMessages
                    id="parameters.reserveFund"
                    defaultMessage="Reserve Fund"
                  />
                }
              >
                <ContentHolder style={{ width: "100%" }}>
                  <Row gutter={gutter}>
                    <Col md={12} sm={24} xs={24} style={colStyle}>
                      <span style={label}>
                        <IntlMessages
                          id="parameters.newBusiness"
                          defaultMessage="Percentage of each IC to new business"
                        />
                      </span>
                      <Input
                        onChange={this.onFormChange}
                        type="number"
                        id="data.reserve_fund.new_business_percent"
                        defaultValue={data.reserve_fund.new_business_percent}
                      />
                    </Col>
                  </Row>
                </ContentHolder>
              </Box>
            </Col>
          </Row>
          <Button
            type="primary"
            style={{ marginLeft: "auto", marginRight: "16px" }}
            onClick={this.submit}
          >
            <IntlMessages
              defaultMessage="Apply changes"
              id="parameters.apply"
            />
          </Button>
        </form>
      ) : (
        false
      );
    };

    return (
      <LayoutContentWrapper style={{ width: "100%" }}>
        <MessageBox
          msg={this.props.msg}
          error={this.props.error}
          clean={this.props.removeMsg}
        />
        <PageHeader>
          <IntlMessages id="sidebar.parameters" />
        </PageHeader>
        {this.props.configuration.loading === false ? (
          renderForm()
        ) : (
          <PageLoading />
        )}
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = state => ({
  configuration: state.Owner,
  error: state.Owner.error,
  msg: state.Owner.msg
});

const mapDispatchToProps = dispatch => ({
  fetch: bindActionCreators(actions.fetchParameteres, dispatch),
  sendParameters: bindActionCreators(actions.sendParameters, dispatch),
  removeMsg: bindActionCreators(actions.removeMsg, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Parameters);
