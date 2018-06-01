import React, { Component } from 'react';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import PageHeader from '../../../components/utility/pageHeader';
import PageLoading from '../../../components/pageLoading'
import IntlMessages from '../../../components/utility/intlMessages';
import MessageBox from '../../../components/MessageBox'
import Button from '../../../components/uielements/button';
import { Col, Row } from 'antd';
import ContentHolder from '../../../components/utility/contentHolder';
import Box from '../../../components/utility/box';
import Input from '../../../components/uielements/input';
import set from 'lodash.set'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../../redux/configuration/actions';


class Parameters extends Component {
  constructor(props) {
    super(props)
    this.onFormChange = this.onFormChange.bind(this)
    this.submit = this.submit.bind(this)
    this.state = {
        data: {}
    }
  }

  componentWillMount() {
      this.props.fetch();
  }

  onFormChange(e) {
    const result = set(
        { data: this.props.configuration.parameters },
        e.target.id,
        e.target.value
    )
    this.setState({data: result.data});    
    console.log(this.state.data)
  }

  submit() {
      this.props.sendParameters(this.state.data)
  }

  render() {
    const data = this.props.configuration.parameters
    const rowStyle = {
        width: '100%',
        display: 'flex',
        flexFlow: 'row wrap'
    };

    const colStyle = {
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center'
    };

    const gutter = 16;

    const label = {
        width:'100%'
    };

    console.log(' ---- render kpis', JSON.stringify(data));
    
    const renderForm = () => {
       return (this.props.configuration.parameters !== null)? (
        <form ref="form">
            <Row style={rowStyle} gutter={gutter} justify="start">
                <Col md={12} sm={24} xs={24} style={colStyle}>
                    <Box title="Warnings indicators">
                        <ContentHolder>
                            <Row gutter={gutter}>
                                <Col md={24} sm={24} xs={24} style={colStyle}>
                                <h4>Luz verde</h4>
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Desde </span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'%'} 
                                        id="data.warnings.first.from_amount"
                                        defaultValue={data.warnings.first.from_amount} />
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Hasta </span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'%'} 
                                        id="data.warnings.first.to_amount"
                                        defaultValue={data.warnings.first.to_amount} />
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>% extra </span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'%'} 
                                        id="data.warnings.first.extra_percentage"
                                        defaultValue={data.warnings.first.extra_percentage} />
                                </Col>
                            </Row>
                            
                            <Row gutter={gutter}>
                                <Col md={24} sm={24} xs={24} style={colStyle}>
                                <h4>Luz amarilla</h4>
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Desde </span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'%'} 
                                        id="data.warnings.second.from_amount"
                                        defaultValue={data.warnings.second.from_amount} />
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Hasta </span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'%'} 
                                        id="data.warnings.second.to_amount"
                                        defaultValue={data.warnings.second.to_amount} />
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>% extra </span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'%'} 
                                        id="data.warnings.second.extra_percentage"
                                        defaultValue={data.warnings.second.extra_percentage} />
                                </Col>
                            </Row>

                            <Row gutter={gutter}>
                                <Col md={24} sm={24} xs={24} style={colStyle}>
                                <h4>Luz roja</h4>
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Desde </span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'%'} 
                                        id="data.warnings.third.from_amount"
                                        defaultValue={data.warnings.third.from_amount} />
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Hasta </span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'%'} 
                                        id="data.warnings.third.to_amount"
                                        defaultValue={data.warnings.third.to_amount} />
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>% extra </span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'%'} 
                                        id="data.warnings.third.extra_percentage"
                                        defaultValue={data.warnings.third.extra_percentage} />
                                </Col>
                            </Row>

                        </ContentHolder>
                    </Box>
                </Col>
                <Col md={12} sm={24} xs={24} style={colStyle}>
                    <Box title="Airdrop">
                        <ContentHolder>
                            <Row gutter={gutter}>
                                <Col md={24} sm={24} xs={24} style={colStyle}>
                                    <h4>Sistema de referidos</h4>
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Cuantas veces puede referir un usuario?</span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        style={{width:'50%'}}
                                        id="data.airdrop.by_referral.referred_max_quantity"
                                        defaultValue={data.airdrop.by_referral.referred_max_quantity} />
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Recompensa al que refiere</span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        id="data.airdrop.by_referral.referrer_amount"
                                        defaultValue={data.airdrop.by_referral.referrer_amount} />
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Recompensa al referido</span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        id="data.airdrop.by_referral.referred_amount"
                                        defaultValue={data.airdrop.by_referral.referred_amount} />
                                </Col>
                            </Row>
                            <Row gutter={gutter}>
                                <Col md={24} sm={24} xs={24} style={colStyle}>
                                    <h4>Primeras wallets</h4>
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Cantidad de descargas con premio</span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        style={{width:'50%'}}
                                        id="data.airdrop.by_wallet.first_wallet_download"
                                        defaultValue={data.airdrop.by_wallet.first_wallet_download} />
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Recompensa por descarga</span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        id="data.airdrop.by_wallet.reward_amount"
                                        defaultValue={data.airdrop.by_wallet.reward_amount} />
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Recompensa en primer Tx</span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        id="data.airdrop.by_wallet.first_tx_reward_amount"
                                        defaultValue={data.airdrop.by_wallet.first_tx_reward_amount} />
                                </Col>
                            </Row>

                            <Row gutter={gutter}>
                                <Col md={24} sm={24} xs={24} style={colStyle}>
                                    <h4>Reembloso escalonado por transacción</h4>
                                </Col>
                                
                                <Col md={24} sm={24} xs={24} style={colStyle}>
                                    <h5>Primer escalón</h5>
                                </Col>
                                <Col md={9} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Desde transaccion:</span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'TX'} 
                                        id="data.airdrop.by_reimbursement.first.from_tx"
                                        defaultValue={data.airdrop.by_reimbursement.first.from_tx} />
                                </Col>
                                <Col md={15} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Hasta transaccion:</span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'TX'} 
                                        id="data.airdrop.by_reimbursement.first.to_tx"
                                        defaultValue={data.airdrop.by_reimbursement.first.to_tx} />
                                </Col>
                                <Col md={15} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Reintegro porcentual a comercio y usuario </span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'%'} 
                                        id="data.airdrop.by_reimbursement.first.tx_amount_percent_refunded"
                                        defaultValue={data.airdrop.by_reimbursement.first.tx_amount_percent_refunded} />
                                </Col>



                                <Col md={24} sm={24} xs={24} style={colStyle}>
                                    <h5>Segundo escalón</h5>
                                </Col>
                                <Col md={9} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Desde transaccion:</span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'TX'} 
                                        id="data.airdrop.by_reimbursement.second.from_tx"
                                        defaultValue={data.airdrop.by_reimbursement.second.from_tx} />
                                </Col>
                                <Col md={15} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Hasta transaccion:</span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'TX'} 
                                        id="data.airdrop.by_reimbursement.second.to_tx"
                                        defaultValue={data.airdrop.by_reimbursement.second.to_tx} />
                                </Col>
                                <Col md={15} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Reintegro porcentual a comercio y usuario </span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'%'} 
                                        id="data.airdrop.by_reimbursement.second.tx_amount_percent_refunded"
                                        defaultValue={data.airdrop.by_reimbursement.second.tx_amount_percent_refunded} />
                                </Col>


                                <Col md={24} sm={24} xs={24} style={colStyle}>
                                    <h5>Tercer escalón</h5>
                                </Col>
                                <Col md={9} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Desde transaccion:</span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'TX'} 
                                        id="data.airdrop.by_reimbursement.third.from_tx"
                                        defaultValue={data.airdrop.by_reimbursement.third.from_tx} />
                                </Col>
                                <Col md={15} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Hasta transaccion:</span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'TX'} 
                                        id="data.airdrop.by_reimbursement.third.to_tx"
                                        defaultValue={data.airdrop.by_reimbursement.third.to_tx} />
                                </Col>
                                <Col md={15} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Reintegro porcentual a comercio y usuario </span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'%'} 
                                        id="data.airdrop.by_reimbursement.third.tx_amount_percent_refunded"
                                        defaultValue={data.airdrop.by_reimbursement.third.tx_amount_percent_refunded} />
                                </Col>
                            </Row>
                        </ContentHolder>        
                    </Box>
                </Col>
                <Col md={24} sm={24} xs={24} style={colStyle}>
                        <Box title="Fondo de reserva">
                            <ContentHolder style={{width:'100%'}}>
                            <Row gutter={gutter}>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                <span style={label}>Porcentaje de cada CI a nuevo negocio</span>
                                <Input 
                                    onChange={this.onFormChange}
                                    type="number"
                                    id="data.reserve_fund.new_business_percent"
                                    defaultValue={data.reserve_fund.new_business_percent} />
                                </Col>
                            </Row>    
                        </ContentHolder>
                    </Box>
                </Col>
            </Row>
            <Button type="primary" style={{marginLeft: 'auto', marginRight: '16px'}} onClick={this.submit} >Apply changes</Button>
        </form>): false;
    };

    return (
    <LayoutContentWrapper style={{width:'100%'}}>
        <MessageBox
            msg={this.props.msg}
            error={this.props.error}
            clean={this.props.removeMsg} />
        <PageHeader>
            <IntlMessages id="sidebar.parameters" />
        </PageHeader>
        {(this.props.configuration.loading === false)? renderForm() : (<PageLoading />)}
    </LayoutContentWrapper>
    );
  }
}

  const mapStateToProps = (state) => ({
    configuration : state.Configuration,
    error: state.Configuration.error,
    msg: state.Configuration.msg
  });
  
  const mapDispatchToProps = (dispatch) => ({
    fetch: bindActionCreators(actions.fetchParameteres, dispatch),
    sendParameters: bindActionCreators(actions.sendParameters, dispatch),
    removeMsg: bindActionCreators(actions.removeMsg, dispatch)
  });
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(Parameters)