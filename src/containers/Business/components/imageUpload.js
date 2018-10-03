import React, { Component } from "react";
import { Upload, Icon } from "antd";
import { apiConfig } from "../../../config";
import ImageUploadWrapper from "./imageUpload.syle";
import IntlMessages from "../../../components/utility/intlMessages";

export class ImageUpload extends Component {
  state = {
    file: []
  };

  componentWillReceiveProps(newProps) {
    if (typeof newProps === "undefined" || this.state.file.length > 0) {
      return;
    }
    if (typeof newProps.defaultImage !== "undefined") {
      this.setState({
        file: [
          {
            uid: 1,
            name: newProps.defaultImage,
            status: "done",
            url: apiConfig.baseFiles + newProps.defaultImage
          }
        ]
      });
    }
  }

  render() {
    const props = {
      action: "/",
      fileList: this.state.file,
      listType: "picture-card",
      multiple: false,
      onRemove: file => this.setState({ file: [] }),
      beforeUpload: file => {
        this.setState({ file: [file] });

        //Get base64 and send callback
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => this.props.fileChange(reader.result);

        return false;
      },
      handlePreview: file => {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true
        });
      }
    };

    return (
      <ImageUploadWrapper>
        <Upload {...props}>
          <div>
            <Icon type="upload" />
            <div className="ant-upload-text">
              <IntlMessages id="profile.upload" defaultMessage="Upload" />
            </div>
          </div>
        </Upload>
      </ImageUploadWrapper>
    );
  }
}
