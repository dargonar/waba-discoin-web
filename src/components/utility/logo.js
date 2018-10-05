import React from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../../config.js";

export default ({ collapsed }) => {
  return (
    <div className="isoLogoWrapper">
      {collapsed ? (
        <div>
          <h3>
            <Link to="./">
              <img src={process.env.PUBLIC_URL + '/images/logo/logo-c-04.png'} alt="" className="logoSidebarClosed" />
            </Link>
          </h3>
        </div>
      ) : (
        <h3>
          <Link to="./">
            <img src={process.env.PUBLIC_URL + '/images/logo/logo-c-04.png'} alt="" className="logoSidebarOpen" />
            {siteConfig.siteName}
          </Link>
        </h3>
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
