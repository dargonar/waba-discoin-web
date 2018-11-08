import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import apiActions from "../../../redux/api/actions";
import styled from "styled-components";
import Button from "../../../components/uielements/button";
import IntlMessages from "../../../components/utility/intlMessages";
import { apiConfig } from "../../../config";

const ConnectionStatusgWrapper = styled.div`
  .globalLoading {
    top: 0px;
    position: fixed;
    background: rgba(0, 0, 0, 0.7);
    height: 100%;
    width: 100%;
    color: #fff !important;
    text-align: center;
    z-index: 10000;
    .circle {
      position: relative;
      top: 150px;
      transform-origin: 704.5px 486px 0px;
      span {
        padding: 5px;
        display: inline-block;
      }
    }
  }
`;

class ConnectionStatusComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: undefined,
      stoped: true
    };
    this.startTrying = this.startTrying.bind(this);
    this.stopTrying = this.stopTrying.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    //If connection status change to false
    if (nextProps.connectionStatus.status === false && this.props.connectionStatus.status === true) {
      this.startTrying();
    }
    //If connection status change to true
    if (nextProps.connectionStatus.status === true && this.props.connectionStatus.status === false) {
      this.stopTrying();
    }
    //Stop after 3 failed attemps
    if (nextProps.connectionStatus.status === false && this.props.connectionStatus.tryNumber >= 2) {
      this.stopTrying();
    }
  }

  componentWillUnmount() {
    this.stopTrying();
  }

  startTrying() {
    //Check every 10 seconds
    const timer = setInterval(() => {
      this.props.checkStatus();
    }, apiConfig.interval_status_check_ms);
    //Save timer in state
    this.setState({ timer, stoped: false });
  }

  stopTrying() {
    if (typeof this.state.timer !== "undefined") {
      clearInterval(this.state.timer);
      this.setState({ timer: undefined, stoped: true });
    }
  }

  render() {
    return !this.props.connectionStatus.status ? (
      <ConnectionStatusgWrapper>
        <div className={"globalLoading"}>
          <div className={"circle"}>
            {!this.state.stoped ? <Button shape="circle" loading /> : <Button shape="circle" icon="exclamation" />}
            <br />
            <span>
              {!this.state.stoped ? (
                <IntlMessages
                  defaultMessage={"No connection, try number {times}"}
                  values={{ times: this.props.connectionStatus.tryNumber + 1 }}
                  id="connectionStatus.times"
                />
              ) : (
                <div>
                  <IntlMessages
                    defaultMessage="Fail to connect {times} times. Please retry leater"
                    values={{ times: this.props.connectionStatus.tryNumber, newLine: <br /> }}
                    id="connectionStatus.fail"
                  />
                  <br />{" "}
                  <Button onClick={this.props.recheckStatus} style={{ marginTop: "10px" }}>
                    <IntlMessages id="connectionStatus.retry" defaultMessage="Retry now" />
                  </Button>
                </div>
              )}
            </span>
          </div>
        </div>
      </ConnectionStatusgWrapper>
    ) : (
      false
    );
  }
}

export const ConnectionStatus = connect(
  state => ({
    connectionStatus: state.App.toJS().connectionStatus
  }),
  dispatch => ({
    checkStatus: bindActionCreators(apiActions.checkStatus, dispatch),
    recheckStatus: bindActionCreators(apiActions.recheckStatus, dispatch)
  })
)(ConnectionStatusComponent);
