import React, { Component } from 'react';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import PageHeader from '../../../components/utility/pageHeader';
import IntlMessages from '../../../components/utility/intlMessages';
import { Input, Icon } from 'antd';
import Button from '../../../components/uielements/button';
import TableWrapper from './antTable.style';
import LayoutContent from '../../../components/utility/layoutContent';

import clone from 'clone';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../../redux/configuration/actions'

class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
  }
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  render() {
    const { value, editable } = this.state;
    return (
      <div className="editable-cell">
        {
          editable ?
            <div className="editable-cell-input-wrapper">
              <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
              />
              <Icon
                type="check"
                className="editable-cell-icon-check"
                onClick={this.check}
              />
            </div>
            :
            <div className="editable-cell-text-wrapper">
              {value || ' '}
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit}
              />
            </div>
        }
      </div>
    );
  }
}


class Categories extends Component {
  
  constructor(props) {
    super(props);
    this.initState = this.initState.bind(this);
    this.addColumn = this.addColumn.bind(this);
    this.addRow = this.addRow.bind(this);
    this.getCell = this.getCell.bind(this);
    this.onCellChange = this.onCellChange.bind(this);
    this.onRowChange = this.onRowChange.bind(this);
    this.submit = this.submit.bind(this)
    this.state = {
      rowModal: false,
      columnModal: false,
      data: false
    }    
  }

  initState(prop) {
    if (this.state.data === false) {
      this.setState({data: prop});
    }
  }

  componentWillMount() {
    this.props.fetch();
  }

  submit() {
      this.props.sendCategories(this.state.data)
  }

  addRow(description) {
    this.setState({ data: {
        ...this.state.data,
        rows: this.state.data.rows.concat({
          row: this.state.data.rows.length + 1,
          description
        })
      }
    });
    return null;
  }

  addColumn(refund_rate) {
    this.setState({ 
      data : {
        ...this.state.data,
        cols: this.state.data.cols.concat({
          col: this.state.data.cols.length + 1,
          refund_rate
        })
      }
    });
    return null;
  }

  getCell(col,row) {
    return this.state.data.categories
      .filter(cell => cell.col === col && cell.row === row)
      .reduce((prev,act) => (typeof act !== 'undefined')? act: prev, {empty: true})
  }

  onColumnChange(col) {
    return (value) => {
      this.setState({
        data : {
          ...this.state.data,
          cols: this.state.data.cols
          .map(column => (column.col === col.col)? Object.assign({},col,{refund_rate:Number(value)|| 0}): column)
        }
      })
    }
  }

  onRowChange(row) {
    return (value) => {
      this.setState({
        data: {
          ...this.state.data,
          rows: this.state.data.rows
          .map(row_ => (row_.row === row.row)? Object.assign({},row_,{description: value || ''}): row_)
        }
      })
    }
  }

  onCellChange(col, row) {
    return (value) => {
      let categories = this.state.data.categories;
      //If is new -> create
      if (this.getCell(col,row).empty) {
        categories = categories.concat({
          col,
          row,
          initial_credit: value
        });
      }
      //Else update
      else {
        categories = categories.map(cell => {
          if(cell.row === row && cell.col === col ){
            return Object.assign(cell, { initial_credit:value })
          }
          return cell;
        })
      }

      this.setState({
        data: {
          ...this.state.data,
          categories: categories
        }
      });
      return null;
    }
  }

  render() {
    const margin = {
      margin: '8px 8px 8px 0'
    }

    const getColumns = (columns) => {
      let result = [{
        key:0,
        title: 'Description',
        dataIndex: 'description'
      }];
      
      return result.concat(columns.map((col, index)=> ({
        key: col.col,
        //title: col.refund_rate,
        title: (
            <EditableCell
              value={col.refund_rate}
              onChange={this.onColumnChange(col)}
          />
        ),
        dataIndex: col.col,
        width: '30%',
        render: (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(col.col,record.row  )}
        />
      ),
      })))
    }

    const getRows = ({columns, rows, categories}) => {
      let result = rows.map(row => {
        let newRow = {
          description:  (
            <EditableCell
              value={row.description}
              onChange={this.onRowChange(row)}
          />
        ),
          row: row.row
        };
        categories.forEach( category => {
          if(Number(category.row) === row.row ) {
            newRow[category.col] = category.initial_credit
          }
        });
        return newRow;
      })
      return result;
    }
    if(this.props.configuration.loading === false && this.props.configuration.categories.cols) {
      this.initState(this.props.configuration.categories);
    }
    
    if(this.props.configuration.loading === false && this.state.data !== false) {
      console.log(this.state.data)
      return (
        <LayoutContentWrapper>
          <PageHeader>
            <IntlMessages id="sidebar.categories" />
          </PageHeader>
          <LayoutContent>
              <TableWrapper pagination={false} columns={getColumns(this.state.data.cols)} dataSource={getRows(this.state.data)}/>
          </LayoutContent>
          <Button type="" style={margin} onClick={()=>this.addColumn()}>Add Category</Button>
          <Button type="" style={margin} onClick={()=>this.addRow()}>Add Discount</Button>
          <Button type="primary" style={margin} onClick={()=>this.submit()}>Save</Button>
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
  fetch: bindActionCreators(actions.fetchCategories, dispatch),
  sendCategories: bindActionCreators(actions.sendCategories, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Categories)