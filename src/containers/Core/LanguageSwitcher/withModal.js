import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "../../../components/feedback/modal";
import Button from "../../../components/uielements/button";
import actions from "../../../redux/app/actions";
import config from "./config";

const { changeLanguage } = actions;

class LanguageSwitcher extends Component {
  render() {
    const { language, changeLanguage, switchActivation } = this.props;
    return (
      <Modal
        title={"Select Language"}
        visible={true}
        onCancel={switchActivation}
        cancelText="Cancel"
        footer={[]}
      >
        <div>
          {config.options.map(option => {
            const { languageId, text } = option;
            const type =
              languageId === language.languageId ? "primary" : "success";
            return (
              <Button
                type={type}
                key={languageId}
                onClick={() => {
                  switchActivation();
                  changeLanguage(languageId);
                }}
              >
                {text}
              </Button>
            );
          })}
        </div>
      </Modal>
    );
  }
}

export default connect(
  state => ({
    ...state.App.toJS()
  }),
  { changeLanguage }
)(LanguageSwitcher);
