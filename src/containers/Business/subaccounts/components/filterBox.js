import React, { Component } from "react";
import { Switch, AutoComplete } from "antd";
import moment from "moment";
import { txAccounts } from "../../../../redux/api/selectors/transactions.selectors";
import { getFilter } from "../utils/txFilter";
import { Modal, Radio, Form, DatePicker, Tag } from "antd";
import IntlMessages from "../../../../components/utility/intlMessages";
import intlMessages from "../../../../components/utility/intlMessages";
const RadioGroup = Radio.Group;

const IntlText = ({ text = "", pre = "", values }) => (
  <IntlMessages id={pre + text.toLowerCase().replace(/ /g, "_")} defaultMessage={text} values={values} />
);

const formatDates = ({ from, until }) => ({
  from: moment(from).format("l"),
  until: moment(until).format("l")
});

const timeToString = item => {
  const { from, until } = formatDates(item.arg);
  const isToday = moment().diff(item.arg.from, "days") === 0 && moment().diff(item.arg.until, "days") === 0;
  switch (isToday) {
    case false:
      return `From ${from} until ${until}`;
      break;
    case true:
      return `Only today`;
      break;
  }
};

const accountToString = item => item.arg.account_name || item.arg.account_id;

const transactionTypeToString = item => {
  switch (item.arg.direction) {
    case undefined:
      return "All transactions";
    case true:
      return "Only received";
    case false:
      return "Only sent";
  }
};

export const FiltetersToTags = ({ style, filters = [], removeFilter }) => {
  return filters.length > 0 ? (
    <div style={style}>
      {filters.map(item => {
        if (item.filter === "between")
          return (
            <Tag key={item.filter} closable onClose={() => removeFilter("between")}>
              {timeToString(item).indexOf("today") !== -1 ? (
                <IntlMessages defaultMessage="Today" id="today" />
              ) : (
                <IntlMessages defaultMessage={"From {from} until {until}"} values={formatDates(item.arg)} id={"tag.dateRange"} />
              )}
            </Tag>
          );
        else if (item.filter === "user")
          return (
            <Tag key={item.filter} closable onClose={() => removeFilter(["user", "direction"])}>
              {accountToString(item)}
            </Tag>
          );
        else if (item.filter === "direction")
          return (
            <Tag key={item.filter} closable onClose={() => removeFilter("direction")}>
              <IntlText text={transactionTypeToString(item)} pre="tag." />
            </Tag>
          );
        else return false;
      })}
    </div>
  ) : (
    <div style={style}>
      <Tag>
        <IntlMessages id="unfiltredTransacctions" defaultMessage="Unfiltred transactoins" />
      </Tag>
    </div>
  );
};

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};

export class TxFilterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: []
    };
    this.filterChange = this.filterChange.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.visible === true) {
      this.setState({ filters: newProps.filters });
    }
  }

  onChange(filterType, arg) {
    this.filterChange({
      filters: [
        ...this.state.filters.filter(x => x.filter !== filterType),
        ...(typeof arg !== "undefinded" ? [{ filter: filterType, arg }] : [])
      ]
    });
  }

  filterChange({ filters }) {
    //console.log({ data });
    this.setState({ filters });
  }

  render() {
    const { visible, transactions } = this.props;
    const filters = this.state.filters;

    //Get filters arguments by name
    const filterArgs = filterType =>
      filters.filter(x => x.filter === filterType).reduce((prev, act) => (act.filter === filterType ? act.arg : {}), {});

    return (
      <Modal
        visible={visible}
        title={<IntlMessages defaultMessage="Add filters" id="addFilters" />}
        onCancel={this.props.onCancel ? this.props.onCancel : false}
        onOk={() => (this.props.onOk ? this.props.onOk(filters) : false)}
      >
        <FormItem {...formItemLayout} label={<IntlMessages id="account" defaultMessage="Account" />}>
          <AutoComplete
            placeholder={<IntlMessages id="account" defaultMessage="Account" />}
            dataSource={txAccounts(transactions).map(account => ({ text: account.name, value: account.id }))}
            onSelect={value => {
              this.filterChange({
                filters: [
                  ...filters.filter(filter => filter.filter !== "user"),
                  {
                    filter: "user",
                    arg: { account_id: value, account_name: txAccounts(transactions).filter(account => account.id === value)[0].name }
                  }
                ]
              });
            }}
          />
        </FormItem>

        <FormItem {...formItemLayout} label={<IntlMessages defaultMessage="Transactions" id="transactions" />}>
          <RadioGroup
            disabled={getFilter(filters, "user").notFound}
            onChange={e => this.onChange("direction", { ...filterArgs("direction"), direction: e.target.value })}
            value={filterArgs("direction").direction}
          >
            <Radio value={undefined}>
              <IntlMessages id="transactions.all" defaultMessage="All" />
            </Radio>
            <Radio value={true}>
              <IntlMessages id="transactions.received" defaultMessage="Received" />
            </Radio>
            <Radio value={false}>
              <IntlMessages id="transactions.sent" defaultMessage="Sent" />
            </Radio>
          </RadioGroup>
        </FormItem>

        <FormItem {...formItemLayout} label={<IntlMessages id="dates" defaultMessage="Dates" />}>
          {/* <Input value={filterArgs("subaccount")} onChange={value => this.onChange("subaccount", value)} /> */}
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
          <Switch
            checkedChildren={<IntlMessages id="today" defaultMessage="Today" />}
            unCheckedChildren={<IntlMessages id="today" defaultMessage="Today" />}
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
        </FormItem>
      </Modal>
    );
  }
}
