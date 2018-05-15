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

    const renderForm = () => {
       return (this.props.configuration.parameters !== null)? (
        <form ref="form">
            <Row style={rowStyle} gutter={gutter} justify="start">
                <Col md={12} sm={24} xs={24} style={colStyle}>
                    <Box title="Warnings indicators">
                        <ContentHolder>
                            <Row gutter={gutter}>
                                <Col md={24} sm={24} xs={24} style={colStyle}>
                                <h4>Yellow Light</h4>
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>IC limit </span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'%'} 
                                        id="data.warnings.first.amount"
                                        defaultValue={data.warnings.first.amount} />
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Extra discount </span>
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
                                    <h4>Red Light</h4>
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>IC limit </span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'%'} 
                                        id="data.warnings.second.amount"
                                        defaultValue={data.warnings.second.amount} />
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Extra discount </span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'%'} 
                                        id="data.warnings.second.extra_percentage"
                                        defaultValue={data.warnings.second.extra_percentage} />
                                    </Col>
                            </Row>
                        </ContentHolder>
                    </Box>
                </Col>
                <Col md={12} sm={24} xs={24} style={colStyle}>
                    <Box title="SingUp">
                        <ContentHolder>
                            <Row gutter={gutter}>
                                <Col md={24} sm={24} xs={24} style={colStyle}>
                                    <h4>Referral</h4>
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Initical Credit</span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        id="data.bootstrap.referral.reward"
                                        defaultValue={data.bootstrap.referral.reward} />
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>Max times referred</span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        style={{width:'50%'}}
                                        id="data.bootstrap.referral.max_referrals"
                                        defaultValue={data.bootstrap.referral.max_referrals} />
                                </Col>
                            </Row>
                            <Row gutter={gutter}>
                                <Col md={24} sm={24} xs={24} style={colStyle}>
                                    <h4>Rewards</h4>
                                </Col>
                                <Col md={9} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>First</span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        id="data.bootstrap.airdrop.max_registered_users"
                                        defaultValue={data.bootstrap.airdrop.max_registered_users} />
                                </Col>
                                <Col md={15} sm={24} xs={24} style={colStyle}>
                                    <span style={label}>wallets will receive </span>
                                    <Input 
                                        onChange={this.onFormChange}
                                        type="number"
                                        addonAfter={'D'} 
                                        id="data.bootstrap.airdrop.amount"
                                        defaultValue={data.bootstrap.airdrop.amount} />
                                </Col>
                            </Row>
                        </ContentHolder>        
                    </Box>
                </Col>
                <Col md={24} sm={24} xs={24} style={colStyle}>
                        <Box title="Transactions">
                            <ContentHolder style={{width:'100%'}}>
                            <Row gutter={gutter}>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                <span style={label}>Max refund by transaction</span>
                                <Input 
                                    onChange={this.onFormChange}
                                    type="number"
                                    id="data.bootstrap.transactions.max_refund_by_tx"
                                    defaultValue={data.bootstrap.transactions.max_refund_by_tx} />
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
  })
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(Parameters)