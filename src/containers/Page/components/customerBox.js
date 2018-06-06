import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import HashImage from '../../../components/hashImage';
import { Card, Icon } from 'antd';

export class CustomerBox extends Component {
    constructor(props) {
        super(props)

    }

    handleClick() {
        // console.log('The link was clicked.');
        this.props.onElement({name:this.props.name, account_id:this.props.account_id});
    }

    // handleProfileClick() {
    handleButton1Click() {
        // console.log('The link was clicked.');
        this.props.onIcon1({name:this.props.name, account_id:this.props.account_id});
    }

    //handleScheduleClick() {
    handleButton2Click() {
        // console.log('The link was clicked.');
        this.props.onIcon2({name:this.props.name, account_id:this.props.account_id});
    }

    // { (
    //     this.props.api.loading !== false &&
    //     typeof this.props.api.configuration === 'null'
    //   )? (<PageLoading/>): this.renderContent() }


    render() {

        const icon1 = (<Icon type={this.props.icon1 || 'user'} onClick={(e) => this.handleButton1Click(e)}/>)
        const icon2 = this.props.icon2!='hidden'?(<Icon type={this.props.icon2 || 'schedule'} onClick={(e) => this.handleButton2Click(e)}/>):false;
        return (
            <Card
                actions={[
                    icon1,
                    icon2
                ]}>
                <HashImage text={this.props.account_id} size={50} onClick={(e) => this.handleClick(e)} />
                <span style={{ padding: '0 10px', fontSize: '120%' }} onClick={(e) => this.handleClick(e)} >{this.props.name}</span>
            </Card>
        );
    }
};

CustomerBox.protoTypes = {
    name: PropTypes.string,
    account_id: PropTypes.string,
    icon1: PropTypes.string,
    icon2: PropTypes.string,
    onIcon1: PropTypes.func,
    onIcon2: PropTypes.func,
    onElement: PropTypes.func,
}

export default CustomerBox
