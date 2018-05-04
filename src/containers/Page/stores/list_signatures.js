import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../../redux/business/actions';

import PageLoading from '../../../components/pageLoading'
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import PageHeader from '../../../components/utility/pageHeader';
import IntlMessages from '../../../components/utility/intlMessages';

import StoreCardWrapper from './store.style'
import StoreMessageBox from './components/storeMessageBox'
import StoreCard from './components/storeCard';
import StoreOverdarfBox from './components/storeOvercraftBox'

// ********************************************************************
// ********************************************************************
// HACK ***************************************************************
import {Signature, ChainStore, FetchChain, PrivateKey, TransactionHelper, Aes, TransactionBuilder, key} from "bitsharesjs";
import {hash, PublicKey, BigInteger, sign, recoverPubKey, verify, calcPubKeyRecoveryParam } from 'bitsharesjs'; // bitsharesjs/lib/ecc/src/signature.js
import {Serializer, ops, sha256 } from 'bitsharesjs'; //'./hash';
import {getCurveByName} from 'ecurve';

import { getPath, apiCall } from '../../../httpService';
const privKey   = "5JQGCnJCDyraociQmhDRDxzNFCd8WdcJ4BAj8q1YDZtVpk5NDw9";
let pKey        = PrivateKey.fromWif(privKey);
let pubKey      = pKey.toPublicKey().toString();
const chain_id  = '2cfcf449d44f477bc8415666766d2258aa502240cb29d290c1b0de91e756c559';


var secp256k1 = getCurveByName('secp256k1');
// ********************************************************************
// ********************************************************************

class ListStores extends Component {

  constructor(props) {
    super(props);
    this.state = {
      overdraftBox: false,
      businessSelected: null
    }
    this.renderStores = this.renderStores.bind(this);
    this.submitOverdraftBox = this.submitOverdraftBox.bind(this);
    this.removeOverdraftBox = this.removeOverdraftBox.bind(this);
    this.showOverdraft = this.showOverdraft.bind(this);

  }

  componentWillMount() {
    this.props.fetch();
  }

  showOverdraft(bussines) {
    this.setState({
      businessSelected: bussines,
      overdraftBox: true
    })
  }

  submitOverdraftBox(value) {
    console.log(' -- submitOverdraftBox');
    this.createOverdraft(value);
    // this.removeOverdraftBox();
  }

  // *********************************************************
  // HELP fns ************************************************

  getDummyTx(){
    return JSON.parse('{    "expiration": "20180426T191755",    "operations": [      [        7,        {          "account_to_list": "1.2.22",          "authorizing_account": "1.2.18",          "fee": {            "amount": 300000,            "asset_id": "1.3.0"          },          "new_listing": 0        }      ],      [        0,        {          "amount": {            "amount": 25000,            "asset_id": "1.3.8"          },          "fee": {            "amount": 2096679,            "asset_id": "1.3.0"          },          "from": "1.2.18",          "memo": {            "message": "7e69653a3138303432363a312e322e32323a3235303030"          },          "to": "1.2.22"        }      ],      [        7,        {          "account_to_list": "1.2.22",          "authorizing_account": "1.2.18",          "fee": {            "amount": 300000,            "asset_id": "1.3.0"          },          "new_listing": 2        }      ]    ],    "ref_block_num": 307149,    "ref_block_prefix": 1342226333}');
    // return JSON.parse('{    "expiration": "2018-04-26T19:17:55",    "operations": [      [        7,        {          "account_to_list": "1.2.22",          "authorizing_account": "1.2.18",          "fee": {            "amount": 300000,            "asset_id": "1.3.0"          },          "new_listing": 0        }      ],      [        0,        {          "amount": {            "amount": 25000,            "asset_id": "1.3.8"          },          "fee": {            "amount": 2096679,            "asset_id": "1.3.0"          },          "from": "1.2.18",          "memo": {            "message": "7e69653a3138303432363a312e322e32323a3235303030", "from"    : "GPH6bM4zBP7PKcSmXV7voEdauT6khCDGUqXyAsq5NCHcyYaNSMYBk", "to"      : "GPH6bM4zBP7PKcSmXV7voEdauT6khCDGUqXyAsq5NCHcyYaNSMYBk", "nonce":132465 },          "to": "1.2.22"        }      ],      [        7,        {          "account_to_list": "1.2.22",          "authorizing_account": "1.2.18",          "fee": {            "amount": 300000,            "asset_id": "1.3.0"          },          "new_listing": 2        }      ]    ],    "ref_block_num": 307149,    "ref_block_prefix": 1342226333}');
  }

  

  hexEncode(value){
    var hex, i;

    var result = "";
    for (i=0; i<value.length; i++) {
        hex = value.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result;
  }

  // *********************************************************
  // SIGN fns ************************************************
  
  sign(tx) {

    let private_key = pKey;
    let public_key  = pubKey;
    // new Buffer(chain_id, "hex"), 
    var sig = Signature.signBuffer(
        Buffer.concat([new Buffer(chain_id, "hex"), new Buffer(JSON.stringify(tx), "hex") ]),
        private_key
    );
    // ,public_key
    
    if(!tx['signatures']) tx['signatures'] = [];
    tx['signatures'].push(sig.toHex());
    tx['signatures'].push(sig.toBuffer());

    this.consoleLogTx(tx, sig);

    return tx;
  }

  sign2(tx){

    // let tr = new TransactionBuilder()
    let private_key = pKey;

    var b = ops.transaction.toBuffer(tx);

    var _hash       = sha256(b);
    var _signature  = Signature.signBufferSha256(_hash, private_key);
    console.log(' ================= sign2');
    console.log(_signature);
    console.log(_signature == '1f0694579f042cad38f297e70aed495bfdae16c90f5efc5e5a59d3d84a797527ab4f76f1ad2cf528c74398ec0a5c06e379bd2c2337d3aa3e57e709c02772a05e85');
    return _signature;
  }
  
  sign3(tx){
    var tr_x = ops.transaction.fromObject(tx);
    let signed_tr_json = TransactionHelper.signed_tr_json(tr_x, [pKey]);
    console.log(' TX === > ', JSON.stringify(signed_tr_json));
    return signed_tr_json;
  }

  sign4(tx){

    let private_key = pKey;
    let public_key  = pubKey;

    var signatures = [];
    // var tr_buffer = hash.sha256(tx).toString('hex');
    var tr_buffer = new Buffer(this.hexEncode(JSON.stringify(tx)));
    // var tr_buffer = 
    // var tr_buffer = ops.transaction.toBuffer(tx);
    // var tr_buffer = tx.toBuffer().toString('hex');

    // console.log(' ======= >> tr_buffer:');
    console.log(tr_buffer);
    
    var sig = Signature.signBuffer(
        Buffer.concat([new Buffer(chain_id, 'hex'), tr_buffer]),
        private_key,
        public_key
    );
    signatures.push(sig.toBuffer());

    if(!tx['signatures']) tx['signatures'] = [];
    tx['signatures'].push(sig.toHex());
    // tx['signatures'].push(sig.toBuffer());
    this.consoleLogTx(tx, sig);

    return tx;
  }
  
  consoleLogTx(tx, sig){
    
    console.log(' ====> sign(tx) ');
    console.log(JSON.stringify(tx));
    console.log(' ====> isOkSign ');
    console.log(tx['signatures'][0]);
    console.log(tx['signatures'][0]  == '1f0694579f042cad38f297e70aed495bfdae16c90f5efc5e5a59d3d84a797527ab4f76f1ad2cf528c74398ec0a5c06e379bd2c2337d3aa3e57e709c02772a05e85');
    // console.log(tx['signatures'][1]);
    // console.log(tx['signatures'][1]  == '1f0694579f042cad38f297e70aed495bfdae16c90f5efc5e5a59d3d84a797527ab4f76f1ad2cf528c74398ec0a5c06e379bd2c2337d3aa3e57e709c02772a05e85');
    
    console.log(' ====> compact:');
    // console.log(sig.toCompact());

    let pub1 = sig.recoverPublicKeyFromBuffer(tx['signatures'][0]);
    // let pub2 = sig.recoverPublicKeyFromBuffer(tx['signatures'][1]);
    console.log(' pub#1 ==> ' + pub1.toString());
    // console.log(' pub#2 ==> ' + pub2.toString());
    console.log(' mustb ==> ' + pubKey);

    return tx;
  }

  createOverdraft(amount) {
    
    // let tx = this.getDummyTx();
    // this.sign4(tx);
    // this.sign3(tx);
    // this.sign2(tx);
    // this.sign(tx);
    // return;

    console.log(' Business Account ID=== > ', this.state.businessSelected.account_id);
    // 1 get tx by query
    const url = getPath('URL/SET_OVERDRAFT');
    const body = {
        business_name: this.state.businessSelected.account,
        initial_credit: amount
    };
    
    console.log( ' SENDING ============= > ' , JSON.stringify(body));
    console.log( ' TO ============= > ' , url);

    fetch(url, {
        method: 'POST',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      })
    .then((response) => response.json()
        , err => {
          console.log(' ===== #1' ,JSON.stringify(err));
          
        }) 
      .then((responseJson) => {
        console.log('createOverdraft()::res ==> ', url, JSON.stringify(responseJson));
        
        // 2 firmar
        let tx = responseJson.tx;
        console.log('createOverdraft():: about to sign ==> ', tx);
        let signed_tx = this.sign4(tx);

        // 3 pushear           
        const push_url = getPath('URL/PUSH_TX');
        console.log('createOverdraft():: about to push tx ==> ', JSON.stringify(signed_tx));


        fetch(push_url, {
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify( {tx:signed_tx})
          })
        .then((response) => response.json()
            , err => {
              console.log(' ===== #2' ,JSON.stringify(err));
              
        })
        .then((responseJson) => {
          console.log('pushTX()::res ==> ', JSON.stringify(responseJson));
        }, err => {
          console.log(' ===== #3' ,JSON.stringify(err));
          
        });

        

      }, err => {
        console.log(' ===== #2' ,JSON.stringify(err));
        
      });

    

  }

  removeOverdraftBox() {
    this.setState({
      overdraftBox: false,
      businessSelected: null
    })
  }

  renderStores() {
    return (
      <div style={{width:'100%'}}>
        {this.props.business.map(store => (
          <StoreCard
            {...store}
            key={store.id}
            overdraft={this.showOverdraft}
          />
        ))}
      </div>
    );
  }

  render() {
    return (
      <LayoutContentWrapper>
        
        <PageHeader>
          <IntlMessages id="sidebar.stores" />
        </PageHeader>

        <StoreMessageBox
          msg={this.props.msg}
          error={this.props.error}
          clean={this.props.removeMsg} />

        <StoreOverdarfBox 
          visible={this.state.overdraftBox}
          business={this.state.businessSelected}
          cancel = {this.removeOverdraftBox}
          submit = {this.submitOverdraftBox}
        />

        { (this.props.loading || this.props.business === null)? <PageLoading />: this.renderStores() }
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  business : state.Business.stores,
  loading : state.Business.loading,
  actionLoading : state.Business.actionLoading,
  error: state.Business.error,
  msg: state.Business.msg
});

const mapDispatchToProps = (dispatch) => ({
  fetch: bindActionCreators(actions.fetchBusinesses, dispatch),
  setOverdraft: bindActionCreators(actions.overdraft, dispatch),
  removeMsg: bindActionCreators(actions.removeMsg, dispatch),
})


export default connect(mapStateToProps, mapDispatchToProps)(ListStores);