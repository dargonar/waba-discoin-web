import React, { Component } from "react";
import Dropzone from "../../../components/uielements/dropzone.js";
import DropzoneWrapper from "./dropzone.style";

export class DropImage extends Component {
  constructor(props) {
    super(props);
    this.dropzone = null;
  }

  componentConfig = {
    iconFiletypes: [".jpg", ".png", ".gif"],
    showFiletypeIcon: true,
    parallelUploads: 1,
    uploadMultiple: false,
    maxFilesize: 1, // MB
    dictRemoveFile: "Delete",
    dictCancelUploadConfirmation: "Are you sure to cancel upload?",
    postUrl: "no-url"
  };

  djsConfig = {
    autoProcessQueue: false
  };

  render() {
    const eventHandlers = {
      init: dz => {
        this.dropzone = dz;
        dz.on("addedfile", function(file) {
          if (dz.files.length > 1) {
            dz.removeFile(dz.files[0]);
          }
        });
      },
      addedfile: file => {
        this.dropzone.emit("complete", file);
        this.props.onUpload(file);
      }
    };

    return (
      <DropzoneWrapper>
        <Dropzone
          config={this.componentConfig}
          eventHandlers={eventHandlers}
          djsConfig={this.djsConfig}
        />
      </DropzoneWrapper>
    );
  }
}
