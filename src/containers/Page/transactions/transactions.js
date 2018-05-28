import React, { Component } from 'react';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import LayoutContent from '../../../components/utility/layoutContent';
import PageHeader from '../../../components/utility/pageHeader';
import PageLoading from '../../../components/pageLoading';
import { Row, Col } from 'antd';
import basicStyle from '../../../config/basicStyle';
import { InputSearch } from '../../../components/uielements/input';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../../redux/api/actions';

import TransactionBox from './components/transactionBox';

class Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: null,
        };
        this.renderContent = this.renderContent.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._handleKeyPress = this._handleKeyPress.bind(this);
    }

    componentDidMount(){
        console.log(' --- Transactions::componentDidMount PRE');
        this.props.searchTransactions();
        console.log(' --- Transactions::componentDidMount DONE');
    }

    _handleChange(e) {
        this.setState({ searchValue: e.target.value });
    }

    _handleKeyPress(e) {    
        if (e.key === 'Enter')
            this.props.searchTransactions(this.state.searchValue);
    }

    renderContent() {

        const { rowStyle, colStyle } = basicStyle;
        const inputStyle = {
            fontSize:'24px'
        }
    
        return (
            <Row style={rowStyle} gutter={16} justify="start">
                <Col xs={24} style={{marginBottom: '15px'}}>
                    <InputSearch placeholder={'Filter'} onKeyPress={this._handleKeyPress} onChange={this._handleChange} />
                </Col>
                <Col xs={24}>
                    { this.props.transactions.map(transaction => ( 
                        <TransactionBox
                            transaction={transaction}
                            key={transaction.date}
                        />
                    ))}
                </Col>
            </Row>
        );
    }

  render() {
    return (
      <LayoutContentWrapper>
        <PageHeader>
          Transactions
        </PageHeader>
        {this.renderContent()}
      </LayoutContentWrapper>
    );
  }
}

const mapStateToProps = (state) =>  ({
  transactions: state.Api.transactions
})

const mapDispatchToProps = (dispatch) => ({
  searchTransactions: bindActionCreators(actions.searchTransactions, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
