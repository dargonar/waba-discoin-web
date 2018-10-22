import React from "react";
import { Icon, Card, Col, Row, Avatar } from "antd";
import Review from "../../../../components/uielements/rate";
import { getBase64 } from "../../../../components/hashImage";
import moment from "moment";
import IntlMessages from "../../../../components/utility/intlMessages";

export default ({ transaction }) => (
  <Card style={{ marginBottom: "10px" }}>
    <Row gutter={16}>
      <Col
        md={2}
        xs={24}
        style={{  }}
      >
       <div style={{
            border: "none",
            display: "block",
            width: "80px",
            height: "80px",
            borderRadius: "2px",
            position: "absolute",
            background: (transaction.type=='discount')?"#3A99D9":((transaction.type=='refund')?"#FF9E5D":"#e1e1e1"),
            color: "#fff",
            textTransform: "uppercase",
            textAlign: "center",
            paddingTop: "25px",
            marginTop: "5px",
            opacity: 1,
            cursor: "pointer",
            left: "0",
            right: "0",
            boxShadow: "5px 6px 10px rgba(0,0,0,0.15)"
          }}>
            <Icon type={(transaction.type=='discount')?"arrow-down":((transaction.type=='refund')?"arrow-up":"arrow-right")} style={{ fontSize: '30px', color: '#fff' }} />
          </div>
      </Col>
      <Col
        md={12}
        xs={24}
        style={{ marginBottom: "15px", fontSize: "1.4em", fontWeight: 300 }}
      >
        <div className="tx_list_item_data_container">
          <div className="flex5">
            <Avatar shape="square" src={getBase64(transaction.from.name, 60)} /> 
            {" " + transaction.from.name}
          </div>
          <div className="flex1">
            <Icon type={"right"} style={{ fontSize: '15px' }} />
          </div>
          <div className="flex5">
            <Avatar shape="square" src={getBase64(transaction.to.name, 60)} /> 
            {" " + transaction.to.name}
          </div>
        </div>
      </Col>
      <Col md={6} xs={24}>
        
        <div className="tx_list_item_data_container">
          <span className="first"> 
            Tipo: 
          </span> 
          <span className="second"> 
            <IntlMessages id={ "transactions." + (transaction.type || 'transfer') } defautlMessage="N/D" />
          </span>
        </div>
        
        <div className="tx_list_item_data_container">
          <span className="first"> 
            <IntlMessages id="transactions.rate" defautlMessage="Porcentaje" />:
          </span> 
          <span className="second"> 
            {parseFloat(transaction.discount).toFixed(2)}%
          </span>
        </div>
        
        <div className="tx_list_item_data_container">
          <span className="first"> 
            <IntlMessages id="transactions.amountInvoiced" defautlMessage="Amount invoiced" />:
          </span> 
          <span className="second"> 
            ${parseFloat(transaction.bill_amount).toFixed(2)}
          </span> 
        </div>

        <div className="tx_list_item_data_container">
          <span className="first"> 
            <IntlMessages id="transactions.invoice" defautlMessage="Invoice" />:
          </span> 
          <span className="second"> 
            {(transaction.bill_id && transaction.bill_id!='None')?transaction.bill_id:'N/D'}
          </span> 
        </div>

        <div className="tx_list_item_data_container">
          <span className="first"> 
            <IntlMessages id="transactions.date" defautlMessage="Date" />:
          </span> 
          <span className="second"> 
            {moment(transaction.date).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        </div>

          
        {/*
          <br />
                <b>
                  <IntlMessages id="transactions.review" defautlMessage="Review" />
                </b>
                : <Review disabled defaultValue={transaction.review} />
        */}
      </Col>
      <Col md={4} xs={24} style={{height:'100%'}}>
        <div className="tx_list_item">
          <div className="tx_list_item_container">
            <img alt="#" src="/static/media/logo.035fac34.png" height="12" className="tx_list_item_amount_icon" ></img>
            <span className="tx_list_item_amount" style={{fontColor:'#1C222C'}}>
                {parseFloat(transaction.amount).toFixed(2)}
            </span>
          </div>
        </div>
      </Col>
    </Row>
  </Card>
);
