import React, { Component } from "react";
import { Upload, Icon } from "antd";
import { apiConfig } from "../../../config";
import ImageUploadWrapper from "./imageUpload.syle";
import IntlMessages from "../../../components/utility/intlMessages";
import { createThumbnailFromUrl, isAllowed } from "../../../utils/imageResize";

const DEFAULT = {
  width: null,
  height: null,
  allowed: ["image/png", "image/jpeg"]
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

  isValid(file, allowedFormats) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => {
        const allowed = allowedFormats || DEFAULT.allowed;
        isAllowed(reader.result, allowedFormats || DEFAULT.allowed)
          ? res(true)
          : rej({ error: "Format not allowed", allowed });
      };
      reader.readAsDataURL(file);
    });
  }

  render() {
      console.log(' -------------------------- ImageUpload!!', this.props.width, this.props.height);
    const props = {
      action: "/",
      fileList: this.state.file,
      listType: "picture-card",
      className: "upload-list-inline",
      multiple: false,
      onRemove: file => this.setState({ file: [] }),
      beforeUpload: file => {
        //Check file type
        this.isValid(file, this.props.allowed)
          .then(() =>
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
            )
          )
          .catch(
            error =>
              this.props.onError
                ? this.props.onError(error)
                : console.warn(error)
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
