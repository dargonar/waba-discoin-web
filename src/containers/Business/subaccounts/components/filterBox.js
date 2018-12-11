import React, { Component } from "react";
import { Col, Switch, AutoComplete, DatePicker } from "antd";
import moment from "moment";
import { txAccounts } from "../../../../redux/api/selectors/transactions.selectors";
import { getFilter } from "../utils/txFilter";

export class FilterBox extends Component {
  filterChange(value) {
    typeof this.props.onChange === "function" ? this.props.onChange(value.filters) : false;
  }
  render() {
    const { transactions, filters } = this.props;
    return (
      <Col xs={24}>
        <Col md={12} lg={6}>
          <AutoComplete
            placeholder="Account"
            dataSource={txAccounts(transactions).map(account => ({ text: account.name, value: account.id }))}
            onSelect={value => {
              this.filterChange({
                filters: [...filters.filter(filter => filter.filter !== "user"), { filter: "user", arg: { account_id: value } }]
              });
            }}
          />
        </Col>
        <Col md={3} lg={2}>
          <Switch
            checkedChildren="To"
            unCheckedChildren="To"
            checked={!getFilter(filters, "user").notFound && getFilter(filters, "user").arg.direction !== true}
            disabled={getFilter(filters, "user").notFound}
            onChange={() =>
              this.filterChange({
                filters: [
                  ...filters.filter(filter => filter.filter !== "user"),
                  {
                    filter: "user",
                    arg: {
                      ...getFilter(filters, "user").arg,
                      direction:
                        typeof getFilter(filters, "user").arg.direction !== undefined
                          ? getFilter(filters, "user").arg.direction === true
                            ? undefined
                            : true
                          : true
                    }
                  }
                ]
              })
            }
          />
        </Col>

        <Col md={3} lg={2}>
          <Switch
            checkedChildren="From"
            unCheckedChildren="From"
            checked={!getFilter(filters, "user").notFound && getFilter(filters, "user").arg.direction !== false}
            disabled={getFilter(filters, "user").notFound}
            onChange={() =>
              this.filterChange({
                filters: [
                  ...filters.filter(filter => filter.filter !== "user"),
                  {
                    filter: "user",
                    arg: {
                      ...getFilter(filters, "user").arg,
                      direction:
                        typeof getFilter(filters, "user").arg.direction !== undefined
                          ? getFilter(filters, "user").arg.direction === false
                            ? undefined
                            : false
                          : false
                    }
                  }
                ]
              })
            }
          />
        </Col>
        <Col md={12} lg={8}>
          <DatePicker.RangePicker
            value={
              getFilter(filters, "between").notFound
                ? ["", ""]
                : [getFilter(filters, "between").arg.from, getFilter(filters, "between").arg.until]
            }
            onChange={dates => {
              this.filterChange({
                filters: [
                  ...filters.filter(filter => filter.filter !== "between"),
                  ...(dates.toString() !== ""
                    ? [
                        {
                          filter: "between",
                          arg: {
                            from: dates[0],
                            until: dates[1]
                          }
                        }
                      ]
                    : [])
                ]
              });
            }}
          />
        </Col>
        <Col md={3} lg={2}>
          <Switch
            checkedChildren="Hoy"
            unCheckedChildren="Hoy"
            checked={
              getFilter(filters, "between").notFound !== true
                ? getFilter(filters, "between").arg.from.isBetween(moment(), moment(), "days", []) &&
                  getFilter(filters, "between").arg.until.isBetween(moment(), moment(), "days", [])
                : false
            }
            onChange={value => {
              this.filterChange({
                filters: [
                  ...filters.filter(filter => filter.filter !== "between"),
                  ...(value === true
                    ? [
                        {
                          filter: "between",
                          arg: {
                            from: moment(),
                            until: moment()
                          }
                        }
                      ]
                    : [])
                ]
              });
            }}
          />
        </Col>
      </Col>
    );
  }
}
