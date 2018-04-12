import React, { Component } from 'react';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import PageHeader from '../../../components/utility/pageHeader';
import IntlMessages from '../../../components/utility/intlMessages';
import { Input, Icon } from 'antd';
import Button from '../../../components/uielements/button';
import TableWrapper from './antTable.style';
import LayoutContent from '../../../components/utility/layoutContent';

import { categoriesJSON } from '../../../api/fake'
import clone from 'clone';

import set from 'lodash.set';
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
    this.addColumn = this.addColumn.bind(this);
    this.addRow = this.addRow.bind(this);
    this.getCell = this.getCell.bind(this);
    this.onCellChange = this.onCellChange.bind(this);
    this.onRowChange = this.onRowChange.bind(this);
    this.onFormChange = this.onFormChange.bind(this)
    this.submit = this.submit.bind(this)
    this.state = {
      rows: categoriesJSON.rows,
      columns: categoriesJSON.cols,
      categories: categoriesJSON.categories,
      rowModal: false,
      columnModal: false,
      data: {}
    }    
  }

  componentWillMount() {
    this.props.fetch();
  }

  onFormChange(e) {
    const result = set(
        { data: this.props.configuration.categories },
        e.target.id,
        e.target.value
    )
    this.setState({data: result.data});    
  }

  submit() {
      this.props.sendCategories(this.state.data)
  }

  addRow(description) {
    this.setState({
      rows: this.state.rows.concat({
        row: this.state.rows.length + 1,
        description
      }),
      columns: clone(this.state.columns),
      categories: clone(this.state.categories)
    });
    return null;
  }

  addColumn(refund_rate) {
    this.setState({
      columns: this.state.columns.concat({
        col: this.state.columns.length + 1,
        refund_rate
      }),
      rows: clone(this.state.rows),
      categories: clone(this.state.categories)
    });
    return null;
  }

  getCell(col,row) {
    return this.state.categories
      .filter(cell => cell.col === col && cell.row === row)
      .reduce((prev,act) => (typeof act !== 'undefined')? act: prev, {empty: true})
  }

  onColumnChange(col) {
    return (value) => {
      this.setState({
        columns: this.state.columns
        .map(column => (column.col === col.col)? Object.assign({},col,{refund_rate:Number(value)|| 0}): column)
      })
    }
  }

  onRowChange(row) {
    return (value) => {
      this.setState({
        rows: this.state.rows
        .map(row_ => (row_.row === row.row)? Object.assign({},row_,{desctription: value || ''}): row_)
      })
    }
  }

  onCellChange(col, row) {
    return (value) => {
      let categories = this.state.categories;
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
        categories: categories,
        rows: clone(this.state.rows),
        columns: clone(this.state.columns)
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

    const getRows = (columns, rows, categories) => {
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
      return (
        <LayoutContentWrapper>
          <PageHeader>
            <IntlMessages id="sidebar.categories" />
          </PageHeader>
          <LayoutContent>
              <TableWrapper pagination={false} columns={getColumns(this.props.configuration.categories.cols)} dataSource={getRows(this.props.configuration.categories.cols, this.props.configuration.categories.rows, this.props.configuration.categories.categories)}/>
          </LayoutContent>
          <Button type="primary" style={margin} onClick={()=>this.addColumn()}>Add Category</Button>
          <Button type="primary" style={margin} onClick={()=>this.addRow()}>Add Discount</Button>
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