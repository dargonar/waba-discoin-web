import React, { Component } from 'react';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import LayoutContent from '../components/utility/layoutContent';
import PageHeader from '../components/utility/pageHeader'
import IsoWidgetsWrapper from '../components/utility/widgets-wrapper';
import PageLoading from '../components/pageLoading';
import { Modal, Col, Row, Tooltip } from 'antd';
import basicStyle from '../config/basicStyle';

import BalanceSticker from '../components/balance-sticker/balance-sticker'
import RatingSticker from '../components/rating-sticker/rating-sticker'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../redux/api/actions';

import Button from '../components/uielements/button';

export class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      confirm_overdraft_visible:false
    }
    this.renderContent      = this.renderContent.bind(this);
    this.showApplyOverdraft = this.showApplyOverdraft.bind(this);

    this.doApplyOverdraft   = this.doApplyOverdraft.bind(this);
    this.doCancelOverdraft  = this.doCancelOverdraft.bind(this);
  }

  componentWillMount() {
    this.props.fetchProfile();
    this.props.fetchConfiguration();
  }

  showApplyOverdraft(){
    // alert(' -- applyOverdraft clicked');
    this.setState({ confirm_overdraft_visible: true })
  }

  doApplyOverdraft(){
    // console.log(' --- dashboard', this.props.account);
    // return;
    this.setState({ confirm_overdraft_visible: false })
    // applyOverdraft(business.account_name, business.wif).then( res => {
    this.props.applyOverdraft();
  }

  doCancelOverdraft(){
    this.setState({ confirm_overdraft_visible: false })
  }

  calcRatio(){
    if (this.props.api.business === null || this.props.api.configuration === null)
      return 0;
    if (this.props.api.business.balances.balance===null || this.props.api.business.balances.initial_credit===null)
      return 0;
    if (isNaN(this.props.api.business.balances.balance) || isNaN(this.props.api.business.balances.initial_credit))
      return 0;
    if (this.props.api.business.balances.initial_credit==0)
      return 0;
    console.log(' RATIO::', this.props.api.business.balances.balance, this.props.api.business.balances.initial_credit)
    return this.props.api.business.balances.balance * 100 / this.props.api.business.balances.initial_credit;
  }
  
  renderContent() {
    const { rowStyle, colStyle } = basicStyle;
    let _ratio = this.calcRatio();
    const getBalanceWarnings = (warnings) => {
      return Object.keys(warnings).map(key => {
        return { value: warnings[key].amount, color: warnings[key].color }
      })
    }
    
    const hasOverdraft = (this.props.api.business !== null && this.props.api.business.balances.ready_to_access>0);
     
    let button = null;
    if (hasOverdraft)
      button =  (
        <Tooltip title="Aceptar crédito disponible"><Button shape="circle" onClick={() => this.showApplyOverdraft()} icon="check"></Button></Tooltip>
      ) ;    
    
    if (this.props.api.business !== null && this.props.api.configuration !== null) {
      return (
        <Row style={rowStyle} gutter={0} justify="start">
          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <BalanceSticker
                amount={this.props.api.business.balances.balance}
                text="Discoin Balance"
                coin="DSC"
                fontColor="#1C222C"
                bgColor="#fff"/>
            </IsoWidgetsWrapper>
          </Col>

          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <BalanceSticker
                amount={this.props.api.business.balances.initial_credit}
                text="Initial Credit"
                coin={'DSC'}
                fontColor="#1C222C"
                bgColor="#fff"/>
            </IsoWidgetsWrapper>
          </Col>

          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <BalanceSticker
                amount={this.props.api.business.balances.ready_to_access}
                text="Endorsed"
                coin={'DSC'}
                fontColor="#1C222C"
                bgColor="#fff"/>
              {button}
            </IsoWidgetsWrapper>
          </Col>

          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <BalanceSticker
                amount={_ratio}
                text="Accepted / Received ratio"
                scale={getBalanceWarnings(this.props.api.configuration.warnings)}
                percentage={true}
                fontColor="#1C222C"
                bgColor="#fff"/>
            </IsoWidgetsWrapper>
          </Col>

          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <BalanceSticker
                amount={this.props.api.business.discount}
                percentage={true}
                text="Reward & Refund"
                fontColor="#1C222C"
                bgColor="#fff"/>
            </IsoWidgetsWrapper>
          </Col>

          <Col md={6} sm={12} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <RatingSticker
                full={0}
                stars={0}
                text={0}
                icon="user"
                fontColor="#1C222C"
                bgColor="#fff"/>
            </IsoWidgetsWrapper>
          </Col>
        </Row>
      )
    } else {
      return false;
    }
  }

  render() {
    return (
      <LayoutContentWrapper>
        <PageHeader>
          Dashboard
        </PageHeader>

        <Modal
            visible={this.state.confirm_overdraft_visible}
            title="Credito disponible"
            onOk={this.doApplyOverdraft}
            onCancel={this.doCancelOverdraft}>
            <label>Desea aceptar el credito disponible?</label>
        </Modal>

        { (
            this.props.api.loading !== false &&
            typeof this.props.api.configuration === 'null'
          )? (<PageLoading/>): this.renderContent() }     
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  api:      state.Api,
  account:  state.Auth
})

const dispatchToProps = (dispatch) => ({
  cleanMsg: bindActionCreators(actions.cleanMsg, dispatch),
  fetchProfile: bindActionCreators(actions.fetchProfile, dispatch),
  fetchConfiguration: bindActionCreators(actions.fetchConfiguration, dispatch),
  applyOverdraft: bindActionCreators(actions.applyOverdraft, dispatch)
})

export default connect(mapStateToProps, dispatchToProps)(Dashboard)