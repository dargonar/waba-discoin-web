import React, { Component } from "react";
import { connect } from "react-redux";
import Popover from "../../../components/uielements/popover";
import IntlMessages from "../../../components/utility/intlMessages";
import authAction from "../../../redux/auth/actions";
import TopbarDropdownWrapper from "./topbarDropdown.style";
import HashImg from "../../../components/hashImage";
import IntlBox from "../LanguageSwitcher/withModal";

const { logout } = authAction;

class TopbarUser extends Component {
  constructor(props) {
    super(props);
    this.handleVisibleChange = this.handleVisibleChange.bind(this);
    this.hide = this.hide.bind(this);
    this.state = {
      visible: false,
      isIntlActivated: false
    };
    this.switchActivation = this.switchActivation.bind(this);
  }

  switchActivation() {
    this.setState({ isIntlActivated: !this.state.isIntlActivated });
  }

  hide() {
    this.setState({ visible: false });
  }
  handleVisibleChange() {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    const content = (
      <TopbarDropdownWrapper className="isoUserDropdown">
        <a className="isoDropdownLink" onClick={this.switchActivation}>
          <IntlMessages id="intlselector" />
        </a>
        <a className="isoDropdownLink" onClick={this.props.logout}>
          <IntlMessages id="topbar.logout" />
        </a>
      </TopbarDropdownWrapper>
    );

    return (
      <div>
        <Popover
          content={content}
          trigger="click"
          visible={this.state.visible}
          onVisibleChange={this.handleVisibleChange}
          arrowPointAtCenter={true}
          placement="bottomLeft"
        >
          <div className="isoImgWrapper">
            <HashImg
              text={this.props.account}
              size={430}
            />
          </div>
        </Popover>
        {this.state.isIntlActivated ? (
          <IntlBox switchActivation={this.switchActivation} />
        ) : (
          false
        )}
      </div>
    );
  }
}
export default connect(
  null,
  { logout }
)(TopbarUser);
