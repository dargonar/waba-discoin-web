import React from "react";
import moment from "moment";
import { Tag } from "antd";

const timeToString = item => {
  switch (item.arg.type) {
    case "last":
      return `Últimas ${item.arg.value}`;
      break;
    case "range":
      return `Desde ${moment(item.arg.value[0]).format("l")} hasta ${moment(item.arg.value[1]).format("l")}`;
      break;
    case "today":
      return `Solo hoy`;
      break;
  }
};

const accountTypeToString = item => {
  switch (item.arg) {
    case "all":
      return "De master y subcuentas";
    case "master":
      return "Solo de master";
    case "subaccounts":
      return "Solo de subcuentas";
  }
};

const transactionTypeToString = item => {
  switch (item.arg) {
    case "all":
      return "Enviadas y Recividas";
    case "received":
      return "Solo recibidas";
    case "sent":
      return "Solo enviadas";
  }
};

export const FiltetersToTags = ({ style, filters = [], removeFilter }) => {
  return filters.length > 0 ? (
    <div style={style}>
      {filters.map(item => {
        if (item.filter === "time")
          return (
            <Tag key={item.filter} closable onClose={() => removeFilter("time")}>
              {timeToString(item)}
            </Tag>
          );
        else if (item.filter === "account")
          return (
            <Tag key={item.filter} closable onClose={() => removeFilter("account")}>
              {accountTypeToString(item)}
            </Tag>
          );
        else if (item.filter === "transactionType")
          return (
            <Tag key={item.filter} closable onClose={() => removeFilter("transactionType")}>
              {transactionTypeToString(item)}
            </Tag>
          );
        else return false;
      })}
    </div>
  ) : (
    <div style={style}>
      <Tag>Transacciones sin filtrar</Tag>
    </div>
  );
};
