import React from "react";
import {strings} from "@/strings";

const Footer = () => {
    return (
       <div className="border-top-thin clearfix mt-2 mt-lg-4">
         <div className="container mx-auto px-2">
         <p className="col-8 sm-width-full left py-2 mb-0">{strings.copyright}</p>
         <ul className="list-reset right clearfix sm-width-full py-2 mb-2 mb-lg-0">
           <li className="inline-block mr-1">
             <a href={strings.github}>GitHub</a>
           </li>
         </ul>
         </div>
       </div>
    );
}

export default Footer;