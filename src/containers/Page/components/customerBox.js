import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import HashImage from '../../../components/hashImage';
import { Card, Icon } from 'antd';

export class CustomerBox extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Card 
                actions={[
                    (<Icon type='user' onClick={this.props.onPerfil}/>),
                    (<Icon type='schedule' onClick={this.props.onPerfil}/>),
                ]}>
                <HashImage text={this.props.account_id} size={50} />
                <span style={{ padding: '0 10px', fontSize: '120%' }}>{this.props.name}</span>
            </Card>
        );
    }
};

CustomerBox.protoTypes = {
    name: PropTypes.string,
    account_id: PropTypes.string,
    onPerfil: PropTypes.func,
    onTransactions: PropTypes.func
}

export default CustomerBox