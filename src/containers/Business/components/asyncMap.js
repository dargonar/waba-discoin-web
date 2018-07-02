import React from "react";
import Async from "../../../helpers/asyncComponent";

export const BasicLeafletMapWithMarker = props => (
  <Async
    load={import(/* webpackChunkName: "basicLeafletMapWithMarker" */ "./map.js")}
    componentProps={props}
    componentArguement={"leafletMap"}
  />
);
