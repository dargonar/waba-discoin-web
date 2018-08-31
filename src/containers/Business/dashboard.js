import React, { Component } from "react";
import LayoutContentWrapper from "../../components/utility/layoutWrapper";
import PageHeader from "../../components/utility/pageHeader";
import IsoWidgetsWrapper from "../../components/utility/widgets-wrapper";
import PageLoading from "../../components/pageLoading";
import { Modal, Col, Row } from "antd";
import basicStyle from "../../config/basicStyle";
import { StripMessage } from "../../components/uielements/stripMessage";
import BalanceSticker from "../../components/balance-sticker/balance-sticker";
import RatingSticker from "../../components/rating-sticker/rating-sticker";
import IntlMessage from "../../components/utility/intlMessages";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "../../redux/api/actions";

import { currency } from "../../config";

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirm_overdraft_visible: false,
      ignoreOverdraft: false
    };
    this.renderContent = this.renderContent.bind(this);
    this.showApplyOverdraft = this.showApplyOverdraft.bind(this);

    this.doApplyOverdraft = this.doApplyOverdraft.bind(this);
    this.doCancelOverdraft = this.doCancelOverdraft.bind(this);
  }

  componentWillMount() {
    this.props.fetchProfile();
    this.props.fetchConfiguration();
  }

  showApplyOverdraft() {
    // alert(' -- applyOverdraft clicked');
    this.setState({ confirm_overdraft_visible: true });
  }

  doApplyOverdraft() {
    // console.log(' --- dashboard', this.props.account);
    // return;
    this.setState({ confirm_overdraft_visible: false });
    this.props.applyOverdraft();
  }

  doCancelOverdraft() {
    this.setState({ confirm_overdraft_visible: false });
  }

  calcRatio() {
    if (
      this.props.api.business === null ||
      this.props.api.configuration === null
    )
      return 0;
    if (
      this.props.api.business.balances.balance === null ||
      this.props.api.business.balances.initial_credit === null
    )
      return 0;
    if (
      isNaN(this.props.api.business.balances.balance) ||
      isNaN(this.props.api.business.balances.initial_credit)
    )
      return 0;
    if (this.props.api.business.balances.initial_credit === 0) return 0;
    console.log(
      " RATIO::",
      this.props.api.business.balances.balance,
      this.props.api.business.balances.initial_credit
    );
    return (
      (this.props.api.business.balances.balance * 100) /
      this.props.api.business.balances.initial_credit
    );
  }

  renderContent() {
    const { rowStyle, colStyle } = basicStyle;
    let _ratio = this.calcRatio();
    const getBalanceWarnings = warnings => {
      return Object.keys(warnings).map(key => {
        return {
          value: warnings[key].amount,
          color: warnings[key].color,
          raw: warnings[key]
        };
      });
    };

    const hasOverdraft =
      this.props.api.business !== null &&
      this.props.api.business.balances !== null &&
      this.props.api.business.balances.ready_to_access > 0;

    let button = null;
    if (hasOverdraft && !this.state.ignoreOverdraft)
      button = (
        <StripMessage
          visible={true}
          type={"info"}
          msg={
            <IntlMessage
              id={"dashboard.overdraftQuestion"}
              defaultMessage={`You have a {symbol}{value} credit available. You want to take it?`}
              values={{
                symbol: currency.symbol,
                value: Number(
                  this.props.api.business.balances.ready_to_access
                ).toLocaleString()
              }}
            />
          }
          actions={[
            {
              msg: <IntlMessage id="apply" defaultMessage="Apply" />,
              onClick: () => this.showApplyOverdraft()
            },
            {
              msg: <IntlMessage id="ignore" defaultMessage="Ignore" />,
              onClick: () => this.setState({ ignoreOverdraft: true })
            }
          ]}
        />
      );

    if (
      this.props.api.business !== null &&
      this.props.api.configuration !== null
    ) {
      return (
        <Row style={rowStyle} gutter={0} justify="start">
          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <BalanceSticker
                amount={this.props.api.business.balances.balance}
                text={
                  <IntlMessage
                    id="dashboard.balance"
                    values={{
                      currency: currency.name
                    }}
                    defaultMessage={"{currency} Balance"}
                  />
                }
                coin={currency.symbol}
                fontColor="#1C222C"
                bgColor="#fff"
              />
            </IsoWidgetsWrapper>
          </Col>

          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <BalanceSticker
                amount={this.props.api.business.balances.initial_credit}
                text={
                  <IntlMessage
                    defaultMessage="Initial Credit"
                    id="dashboard.initialCredit"
                  />
                }
                coin={currency.symbol}
                fontColor="#1C222C"
                bgColor="#fff"
              />
            </IsoWidgetsWrapper>
          </Col>

          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <BalanceSticker
                amount={this.props.api.business.balances.ready_to_access}
                text={
                  <IntlMessage
                    defaultMessage="Endorsed"
                    id="dashboard.endorsed"
                  />
                }
                coin={currency.symbol}
                fontColor="#1C222C"
                bgColor="#fff"
              />
              {button}
            </IsoWidgetsWrapper>
          </Col>

          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <BalanceSticker
                amount={_ratio}
                text={
                  <IntlMessage
                    defaultMessage="Accepted / Received ratio"
                    id="dashboard.acceptedRatio"
                  />
                }
                scale={getBalanceWarnings(
                  this.props.api.configuration.warnings
                )}
                percentage={true}
                fontColor="#1C222C"
                bgColor="#fff"
              />
            </IsoWidgetsWrapper>
          </Col>

          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <BalanceSticker
                amount={this.props.api.business.discount}
                percentage={true}
                text={
                  <IntlMessage
                    defaultMessage="Reward & Refund"
                    id="dashboard.rewardAndRefund"
                  />
                }
                fontColor="#1C222C"
                bgColor="#fff"
              />
            </IsoWidgetsWrapper>
          </Col>

          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <RatingSticker
                rating={this.props.api.business.rating}
                full={0}
                stars={0}
                text={0}
                icon="user"
                fontColor="#1C222C"
                bgColor="#fff"
              />
            </IsoWidgetsWrapper>
          </Col>
        </Row>
      );
    } else {
      return false;
    }
  }

  render() {
    return (
      <LayoutContentWrapper>
        <PageHeader>
          <IntlMessage id="dashboard.dashboard" defaultMessage="Dashboard" />
        </PageHeader>

        <Modal
          visible={this.state.confirm_overdraft_visible}
          title={
            <IntlMessage
              defaultMessage="Credit available"
              id="dashboard.overdraftAvailable"
            />
          }
          onOk={this.doApplyOverdraft}
          onCancel={this.doCancelOverdraft}
        >
          <label>
            <IntlMessage
              id="dashboard.acceptAvailableOverdraft"
              defaultMessage="Do you wish to accept the available overdraft?"
            />
          </label>
        </Modal>

        {this.props.api.loading !== false ||
        this.props.api.business === null ||
        this.props.api.configuration === null ? (
          <PageLoading />
        ) : (
          this.renderContent()
        )}
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = state => ({
  api: state.Api,
  account: state.Auth
});

const dispatchToProps = dispatch => ({
  cleanMsg: bindActionCreators(actions.cleanMsg, dispatch),
  fetchProfile: bindActionCreators(actions.fetchProfile, dispatch),
  fetchConfiguration: bindActionCreators(actions.fetchConfiguration, dispatch),
  applyOverdraft: bindActionCreators(actions.applyOverdraft, dispatch)
});

export default connect(
  mapStateToProps,
  dispatchToProps
)(Dashboard);
