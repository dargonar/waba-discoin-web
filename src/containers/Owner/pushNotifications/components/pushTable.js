import React from "react";
import { Table, Divider } from "antd";

export const PushTable = ({ style, pushes, onDelete, onShowMore }) => {
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title"
    },
    {
      title: "Short Message",
      dataIndex: "short_message",
      key: "short_message"
    },
    {
      title: "Hash",
      dataIndex: "hash",
      key: "hash"
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={() => onDelete(record)}>
            Delete
          </a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => onShowMore(record)}>
            Show more
          </a>
        </span>
      )
    }
  ];

  return <Table style={style} dataSource={pushes} columns={columns} />;
};
