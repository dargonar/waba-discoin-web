import React, { Component } from 'react';
import { Modal, Row, Col } from 'antd';
import Input from '../../../components/uielements/input';

export class RefundBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            amount: 0,
            dsc: 0,
            refound: 30
        }
        this.updateAmounts = this.updateAmounts.bind(this)
        this.updateDsc = this.updateDsc.bind(this)
        this.updateRefound = this.updateRefound.bind(this)
    }   

    updateRefound(e) {
        let refound = e.target.value
        this.setState({
            refound: refound,
            dsc: Math.round(refound * this.state.amount / 100)
        })
    }


    updateAmounts(e) {
        let amount = e.target.value
        this.setState({
            amount: amount,
            dsc: Math.round(this.state.refound * amount / 100)
        })
    }

    updateDsc(e) {
        let dsc = e.target.value
        this.setState({
            dsc: dsc,
            refound: Math.round(dsc * 100 / this.state.amount)
        })
    }

    render() {
        const colStyle = { marginBottom: '15px' }
    
        let name;
        try {
            name = this.props.customer.name
        } catch(e) {
            name = ''
        }

            return (
                <Modal 
                    title={'Refound to '+ name}
                    visible={this.props.visible}
                    onCancel={this.props.cancel}
                    onOk={this.props.submit}
                >
                    <Row gutter={16}>
                        <Col style={colStyle} xs={24}>
                            Amount
                            <Input addonBefore={'$'} defaultValue={this.state.amount} onChange={this.updateAmounts}/>
                        </Col>
                        <Col style={colStyle} xs={24} md={12}>
                            Discoins
                            <Input addonBefore={'DSC'} value={this.state.dsc} onChange={this.updateDsc} />
                        </Col>
                        <Col style={colStyle} xs={24} md={12}>
                            Refound
                            <Input addonAfter={'%'} value={this.state.refound}  onChange={this.updateRefound} />
                        </Col>
                    </Row>
                </Modal>
            );
    }
}

export default RefundBox;
