import React from "react";
import { Modal } from "antd";
import IntlMessages from "../../../../components/utility/intlMessages";

export const PushView = ({ push, onClose }) => (
  <Modal
    visible={typeof push !== "undefined"}
    title={<IntlMessages id="sidebar.pushNotifications" defaultMessage="Push Notification" />}
    onOk={onClose}
    cancelText={false}
  >
    <pre>{JSON.stringify(push, null, "  ")}</pre>
  </Modal>
);
