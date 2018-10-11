import React from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../../config.js";
import Image from '../../image/logo.png';

export default ({ collapsed }) => {
  // <img src={process.env.PUBLIC_URL + '/images/logo/logo-c-04.png'} alt="" className="logoSidebarClosed" />
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
          <Link to="./">
            <img src={process.env.PUBLIC_URL + '/images/logo/logo-c-04.png'} alt="" className="logoSidebarOpen" />
            {siteConfig.siteName}
          </Link>
        </h3>
      </div>  
      )}
    </div>
  );

  // return (
  //   <div className="isoLogoWrapper">
  //     {collapsed ? (
  //       <div>
  //         <h3>
  //           <Link to="./">
  //             <i className={siteConfig.siteIcon} />
  //           </Link>
  //         </h3>
  //       </div>
  //     ) : (
  //       <h3>
  //         <Link to="./">{siteConfig.siteName}</Link>
  //       </h3>
  //     )}
  //   </div>
  // );
};
