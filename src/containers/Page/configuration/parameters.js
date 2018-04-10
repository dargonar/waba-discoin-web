import React, { Component } from 'react';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import PageHeader from '../../../components/utility/pageHeader';
import IntlMessages from '../../../components/utility/intlMessages';
import Button from '../../../components/uielements/button';
import { Col, Row } from 'antd';
import ContentHolder from '../../../components/utility/contentHolder';
import Box from '../../../components/utility/box';
import Input from '../../../components/uielements/input';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../../redux/configuration/actions';


class Parameters extends Component {
  componentWillMount() {
      this.props.fetch();
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

    if(this.props.configuration.loading === false && this.props.configuration.parameters.warnings) {
        return (
        <LayoutContentWrapper style={{width:'100%'}}>
            <PageHeader>
            <IntlMessages id="sidebar.parameters" />
            </PageHeader>
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
                                <Input type="number" addonAfter={'%'} value={data.warnings.first.amount}/>
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                <span style={label}>Extra discount </span>
                                <Input type="number" addonAfter={'%'}  value={data.warnings.first.extra_percentage}/>
                                </Col>
                            </Row>
                            <Row gutter={gutter}>
                                <Col md={24} sm={24} xs={24} style={colStyle}>
                                <h4>Red Light</h4>
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                <span style={label}>IC limit </span>
                                <Input type="number" addonAfter={'%'} value={data.warnings.second.amount}/>
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                <span style={label}>Extra discount </span>
                                <Input type="number" addonAfter={'%'}  value={data.warnings.second.extra_percentage}/>
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
                                <span style={label}>
                                    Initical Credit
                                </span>
                                <Input type="number" value={data.boostrap.referral.reward}/>
                                </Col>
                                <Col md={12} sm={24} xs={24} style={colStyle}>
                                <span style={label}>
                                    Max times referred
                                </span>
                                <Input type="number" style={{width:'50%'}} value={data.boostrap.referral.max_referrals}/>
                                </Col>
                            </Row>
                            <Row gutter={gutter}>
                                <Col md={24} sm={24} xs={24} style={colStyle}>
                                <h4>Rewards</h4>
                                </Col>
                                <Col md={9} sm={24} xs={24} style={colStyle}>
                                <span style={label}>First</span>
                                <Input type="number" value={data.boostrap.airdrop.max_registered_users}/>
                                </Col>
                                <Col md={15} sm={24} xs={24} style={colStyle}>
                                <span style={label}>wallets will receive </span>
                                <Input type="number" addonAfter={'D'} value={data.boostrap.airdrop.amount}/>
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
                                <Input type="number" value={data.boostrap.transactions.max_refund_by_tx}/>
                                </Col>
                            </Row>    
                        </ContentHolder>
                    </Box>
                </Col>
                </Row>
                <Button type="primary" style={{marginLeft: 'auto', marginRight: '16px'}}>Apply changes</Button>
        </LayoutContentWrapper>
        );
    } else {
        return (<div></div>);
    }
  }
}

const mapStateToProps = (state) => ({
    configuration : state.Configuration
  });
  
  const mapDispatchToProps = (dispatch) => ({
    fetch: bindActionCreators(actions.fetchParameteres, dispatch)
  })
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(Parameters)