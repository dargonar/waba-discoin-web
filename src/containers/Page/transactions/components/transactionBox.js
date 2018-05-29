import React from 'react';
import { Card, Col, Row, Avatar } from 'antd';
import Review from '../../../../components/uielements/rate'
import { getBase64 } from '../../../../components/hashImage';
import moment from 'moment';

export default ({transaction}) => (
    <Card style={{marginBottom: '10px'}}>
        <Row gutter={16}> 
            <Col md={6} xs={24} style={{marginBottom: '15px', fontSize: '1.4em', fontWeight: 300}}>
                <Avatar src={getBase64(transaction.from.name,60)} /> <br/>
                DE: {transaction.from.name}
            </Col>
            <Col md={6} xs={24} style={{marginBottom: '15px', fontSize: '1.4em', fontWeight: 300}}>
                <Avatar src={getBase64(transaction.to.name,60)} /> <br/>
                A: {transaction.to.name}
            </Col>
            <Col md={6} xs={24}>
                    <b>Amount</b>: D$C{ Number(transaction.amount).toLocaleString() }<br/>
                    <b>Discount</b>: %{ transaction.discount }<br/> 
                    <b>Bill amount</b>: ${ transaction.bill_amount }
                    <b>Bill id</b>: { transaction.bill_id }
            </Col>
            <Col md={6} xs={24}>
                    <b>Date</b>: { moment(transaction.date).format('LLLL') }<br/>
                    <b>Review</b>: <Review disabled defaultValue={transaction.review} />
            </Col>
        </Row>
    </Card>
);