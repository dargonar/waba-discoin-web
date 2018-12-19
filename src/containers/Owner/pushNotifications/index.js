import React, { Component } from "react";
import LayoutContentWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";
import IntlMessages from "../../../components/utility/intlMessages";
import { PushForm } from "./components/pushForm";
import { PushTable } from "./components/pushTable";
import { PushView } from "./components/pushView";
import { apiCall, getPath } from "../../../httpService";
import { Row, Col, Modal, message } from "antd";

const isDefined = a => typeof a !== "undefined";
const areFieldsDefined = (obj, fields) => fields.reduce((prev, act) => (prev === false ? false : isDefined(obj[act])), true);

const isPushValid = (push, extraFields = []) =>
  new Promise((res, rej) => {
    const fields = ["short_message", "title", "image_url", "bajada", "remate", "business_id", "discoin_amount", "hash", ...extraFields];
    if (areFieldsDefined(push, fields)) {
      res(true);
      return;
    }
    rej("Invalid push notification");
  });

const api = {
  load: () => apiCall(getPath("URL/PUSH_NOTIFICATIONS"), "GET")(),
  send: push => apiCall(getPath("URL/PUSH_NOTIFICATIONS"), "POST", { add: { ...push } })(),
  delete: push => apiCall(getPath("URL/PUSH_NOTIFICATIONS"), "POST", { delete: { ...push } })()
};

export default class PushPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pushes: [],
      form: {},
      showPush: undefined
    };
    this.sendPush = this.sendPush.bind(this);
    this.deletePush = this.deletePush.bind(this);
    this.loadPushes = this.loadPushes.bind(this);
    this.showPush = this.showPush.bind(this);
  }

  showPush(push) {
    Modal.info({
      title: "Push Notifications", //<IntlMessages id="sidebar.pushNotifications" defaultMessage="Push Notifications" />,
      content: <pre>{JSON.stringify(push, null, "  ")}</pre>
    });
  }

  sendPush(push = {}) {
    isPushValid(push)
      .then(() => api.send(push))
      .then(({ data, error }) => {
        if (isDefined(data) && !error) {
          message.success("Push notification successfully sent");
          this.loadPushes();
        }
      })
      .catch(e => {
        console.warn("Error sending push notifiation", e);
        message.error("Something went wrong, check your form and try again");
      });
    this.setState({
      pushes: [...this.state.pushes, push]
    });
  }

  deletePush(push = {}) {
    isPushValid(push, ["id"])
      .then(() => api.delete(push))
      .then(({ data, error }) => {
        if (isDefined(data) && !error) {
          this.setState({ msg: { type: "success", text: "Push notification successfully deleted" } });
          this.loadPushes();
        }
      });
  }

  loadPushes() {
    api.load().then(({ data, error }) => {
      if (isDefined(data) && !error) {
        this.setState({ pushes: data.pushes || [] });
      }
    });
  }

  componentWillMount() {
    //Load Pushes
    this.loadPushes();
    //Reload every 20 secconds
    this.interval = setInterval(this.loadPushes, 20000);
  }

  componentWillUnmount() {
    //Stop realod pushes
    clearInterval(this.interval);
  }

  render() {
    return (
      <LayoutContentWrapper>
        <PageHeader>
          <IntlMessages id="sidebar.pushNotifications" defaultMessage="Push Notifications" />
        </PageHeader>
        <PushTable
          style={{ width: "100%", marginBottom: "20px" }}
          pushes={this.state.pushes}
          onDelete={this.deletePush}
          onShowMore={this.showPush}
        />
        <PushForm onSend={this.sendPush} />
        {/* <PushView push={this.state.showPush} onClose={() => this.showPush()} /> */}
      </LayoutContentWrapper>
    );
  }
}
