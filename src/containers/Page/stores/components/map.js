import React, { Component } from 'react';
import 'leaflet';
import { mapboxConfig } from '../../../../config.js';
import LeafletMapWrapper from './map.style';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.mountMap = this.mountMap.bind(this);
    this.changeMarkerPosition = this.changeMarkerPosition.bind(this)
  }

  mountMap(element) {
    if (!element) return;
    const { L } = window;
    const map = L.map(element).setView(
      (!isNaN(this.props.marker.lat))? this.props.marker: mapboxConfig.center,
      !isNaN(mapboxConfig.defaultZoom) ? mapboxConfig.defaultZoom : 13
    );
    const osmAttr =
      '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    L.tileLayer(mapboxConfig.tileLayer, {
      maxZoom: !isNaN(mapboxConfig.maxZoom) ? mapboxConfig.maxZoom : 18,
      attribution: osmAttr
    }).addTo(map);
    let marker = L.marker(map.getCenter()).addTo(map)
    map.on('click', (e => { this.changeMarkerPosition(e, marker) }))
  }

  changeMarkerPosition(e, marker) {
      marker.setLatLng(e.latlng)
      this.props.onChange(e)
  }

  render() {
    return (
    <div>
      <LeafletMapWrapper className="isoLeafletMap">
        <div
          id="basic-map-marker"
          style={{ height: '400px', width: '100%' }}
          ref={this.mountMap}
        />
      </LeafletMapWrapper>
    </div>
    );
  }
}
