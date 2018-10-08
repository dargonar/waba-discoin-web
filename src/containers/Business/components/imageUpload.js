import React, { Component } from "react";
import { Upload, Icon } from "antd";
import { apiConfig } from "../../../config";
import ImageUploadWrapper from "./imageUpload.syle";
import IntlMessages from "../../../components/utility/intlMessages";
import { createThumbnailFromUrl } from "../../../utils/imageResize";
const DEFAULT = {
  width: 200,
  height: 200
};

export class ImageUpload extends Component {
  state = {
    file: []
  };

  componentWillReceiveProps(newProps) {
    if (typeof newProps === "undefined" || this.state.file.length > 0) {
      return;
    }
    if (
      typeof newProps.defaultImage !== "undefined" &&
      newProps.defaultImage !== ""
    ) {
      this.setState({
        file: [
          {
            uid: 1,
            name: newProps.defaultImage,
            status: "done",
            url: apiConfig.baseImages + newProps.defaultImage
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
      className: "upload-list-inline",
      multiple: false,
      onRemove: file => this.setState({ file: [] }),
      beforeUpload: file => {
        console.log(file);
        createThumbnailFromUrl(
          file,
          this.props.width || DEFAULT.width,
          this.props.height || DEFAULT.height,
          image => {
            this.props.fileChange(image);
            this.setState({
              file: [
                {
                  uid: 1,
                  name: file.name,
                  status: "done",
                  url: image
                }
              ]
            });
          }
        );
        return false;
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
