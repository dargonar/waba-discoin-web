import React, { Component } from "react";
import { AutoComplete } from "antd";
const Option = AutoComplete.Option;

export class InputPlace extends Component {
  state = {
    value: undefined,
    dataSource: []
  };

  onSelect(value) {
    let values = value.split("//////");
    try {
      const gcoder = new window.google.maps.Geocoder();
      gcoder.geocode({ placeId: values[1] }, data => {
        if (
          data.length > 0 &&
          typeof this.props.locationChange === "function"
        ) {
          this.props.locationChange({
            latlng: data[0].geometry.location.toJSON(),
            address: values[0]
          });
        }
      });
    } catch (e) {
      console.log("Error loading google maps", e);
    }
  }

  onSearch = input => {
    try {
      const gplacesService = new window.google.maps.places.AutocompleteService();
      gplacesService.getPlacePredictions(
        { input, componentRestrictions: { country: "ar" } },
        (dataSource, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            this.setState({ dataSource });
            //console.log({ dataSource });
          }
        }
      );
    } catch (e) {
      console.log("Error loading google maps", e);
    }
  };

  render() {
    const options = this.state.dataSource.map(opt => (
      <Option key={opt.id} value={opt.description + "//////" + opt.place_id}>
        {opt.description}
      </Option>
    ));

    return (
      <AutoComplete
        defaultValue={this.props.defaultValue}
        onSelect={this.onSelect.bind(this)}
        onSearch={this.onSearch.bind(this)}
        dataSource={options}
        onChange={this.props.onChange}
      />
    );
  }
}
