import React, { Component } from "react";
import { Input, Modal, Radio, Form, DatePicker } from "antd";
import RadioGroup from "antd/lib/radio/group";
import moment from "moment";

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

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
    this.state = { filters: [] };
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    //this.setState({ filters: this.props.filters });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.visible === true) {
      this.setState({ filters: newProps.filters });
    }
  }

  onChange(filterType, arg) {
    this.setState({
      filters: [
        ...this.state.filters.filter(x => x.filter !== filterType),
        ...(typeof arg !== "undefinded" ? [{ filter: filterType, arg }] : [])
      ]
    });
  }

  render() {
    const { filters, visible } = this.props;

    //Get filters arguments by name
    const filterArgs = filterType =>
      this.state.filters
        .filter(x => x.filter === filterType)
        .reduce((prev, act) => (act.filter === filterType ? act.arg : undefined), undefined);

    return (
      <Modal
        visible={visible}
        title="Filtrar transacciones"
        onCancel={this.props.onCancel ? this.props.onCancel : false}
        onOk={() => (this.props.onOk ? this.props.onOk(this.state.filters) : false)}
      >
        <FormItem {...formItemLayout} label={"Tiempo"}>
          {/* <Input value={filterArgs("subaccount")} onChange={value => this.onChange("subaccount", value)} /> */}
          <Radio.Group
            onChange={e =>
              this.onChange("time", {
                type: e.target.value,
                value: e.target.value === "range" ? [moment().subtract(6, "days"), moment()] : undefined
              })
            }
            value={filterArgs("time") ? filterArgs("time").type : undefined}
          >
            <Radio value={"last"}>Últimas</Radio>
            <Radio value={"range"}>Desde/Hasta</Radio>
            <Radio value={"today"}>Hoy</Radio>
          </Radio.Group>
        </FormItem>
        {typeof filterArgs("time") !== "undefined" ? (
          <div>
            {filterArgs("time").type === "last" ? (
              <FormItem {...formItemLayout} label={"Cantidad"}>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={filterArgs("time").value || 50}
                  onChange={e => this.onChange("time", { type: "last", value: e.target.value })}
                />
              </FormItem>
            ) : (
              false
            )}
            {filterArgs("time").type === "range" ? (
              <FormItem {...formItemLayout} label={"Fechas a mostrar"}>
                <RangePicker value={filterArgs("time").value} onChange={e => this.onChange("time", { type: "range", value: e })} />
              </FormItem>
            ) : (
              false
            )}
          </div>
        ) : (
          false
        )}

        <FormItem {...formItemLayout} label={"Tipo de cuentas"}>
          <RadioGroup onChange={e => this.onChange("account", e.target.value)} value={filterArgs("account")}>
            <Radio value={"all"}>Todas</Radio>
            <Radio value={"master"}>Master</Radio>
            <Radio value={"subaccounts"}>Subcuentas</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem {...formItemLayout} label={"Tipo de transacción"}>
          <RadioGroup onChange={e => this.onChange("transactionType", e.target.value)} value={filterArgs("transactionType")}>
            <Radio value={"all"}>Todas</Radio>
            <Radio value={"received"}>Recibidas</Radio>
            <Radio value={"sent"}>Enviadas</Radio>
          </RadioGroup>
        </FormItem>
      </Modal>
    );
  }
}
