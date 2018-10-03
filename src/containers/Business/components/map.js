import React, { Component } from "react";
import "leaflet";
import { mapboxConfig } from "../../../config.js";
import LeafletMapWrapper from "./map.style";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.mountMap = this.mountMap.bind(this);
    this.marker = null;
    this.map = null;
    this.changeMarkerPosition = this.changeMarkerPosition.bind(this);
  }

  mountMap(element) {
    if (!element) return;
    const { L } = window;
    const map = L.map(element).setView(
      this.props.lat !== null &&
      typeof this.props.lat !== "undefined" &&
      !isNaN(this.props.lat)
        ? { lat: this.props.lat, lng: this.props.lng }
        : mapboxConfig.center,
      !isNaN(mapboxConfig.defaultZoom) ? mapboxConfig.defaultZoom : 13
    );
    this.map = map;
    const osmAttr =
      '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    L.tileLayer(mapboxConfig.tileLayer, {
      maxZoom: !isNaN(mapboxConfig.maxZoom) ? mapboxConfig.maxZoom : 18,
      attribution: osmAttr
    }).addTo(map);
    this.marker = L.marker(map.getCenter()).addTo(map);
    map.on("click", e => {
      this.changeMarkerPosition(e, this.marker);
    });
  }

  changeMarkerPosition(e, marker) {
    marker.setLatLng(e.latlng);
    this.props.onChange(e);
  }

  componentWillReceiveProps(newProps) {
    console.log("maps", { newProps });
    if (typeof newProps.lat !== "undefined") {
      const latlang = { lat: newProps.lat, lng: newProps.lng };
      //Change marker position
      this.marker.setLatLng(latlang);
      //And recenter map
      this.map.setView(latlang);
    }
  }

  render() {
    return (
      <div>
        <LeafletMapWrapper className="isoLeafletMap">
          <div
            id="basic-map-marker"
            style={{ height: "400px", width: "100%" }}
            ref={this.mountMap}
          />
        </LeafletMapWrapper>
      </div>
    );
  }
}
