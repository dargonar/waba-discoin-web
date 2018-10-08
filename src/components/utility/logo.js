import React from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../../config.js";
import Image from '../../image/logo.png';

export default ({ collapsed }) => {
  return (
    <div className="isoLogoWrapper">
      {collapsed ? (
        <div class="brandLogoContainer">
          <span class="brandLogo">
            <Link to="./">
              <img alt="#" src={Image} height='25'/>
            </Link>
          </span> 
        </div>
      ) : (
      <div class="brandLogoContainer">
        <img alt="#" src={Image} height='25'/> 
        <h3>
          <Link to="./">{siteConfig.siteName}</Link>
        </h3>
      </div>  
      )}
    </div>
  );
};
