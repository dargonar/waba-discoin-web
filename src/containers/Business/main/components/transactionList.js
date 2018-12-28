import React, { Component } from "react";
import Transaction from "../../transactions/components/transactionBox";

export class TransactionList extends Component {
  render() {
    return (
      <div>
        {this.props.txs ? this.props.txs.map(tx => <Transaction key={tx.id} transaction={tx} style={{ margin: "10px 0" }} />) : false}
      </div>
    );
  }
}
