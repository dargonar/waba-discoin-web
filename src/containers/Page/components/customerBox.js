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

    handleProfileClick() {
        // console.log('The link was clicked.');
        this.props.onProfile({name:this.props.name, account_id:this.props.account_id});
    }

    handleScheduleClick() {
        // console.log('The link was clicked.');
        this.props.onTransactions({name:this.props.name, account_id:this.props.account_id});
    }

    // { (
    //     this.props.api.loading !== false &&
    //     typeof this.props.api.configuration === 'null'
    //   )? (<PageLoading/>): this.renderContent() }


    render() {

        const icon1 = (<Icon type={this.props.iconUser || 'user'} onClick={(e) => this.handleProfileClick(e)}/>)
        return (
            <Card
                actions={[
                    icon1,
                    (<Icon type='schedule' onClick={(e) => this.handleScheduleClick(e)}/>),
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
    iconUser: PropTypes.string,
    onPerfil: PropTypes.func,
    onTransactions: PropTypes.func,
    onElement: PropTypes.func,
}

export default CustomerBox
