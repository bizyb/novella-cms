import React, {FC} from "react";
import {strings} from "@/strings";

const Header: FC<any> = (_props) => {
    return (
        <>
              <header className="px-2 clearfix">
                <div className="left sm-width-full py-1 mt-1 mt-lg-0">
                  <a href="/" className="align-middle link-primary text-accent title">{strings.projectName}</a>
                </div>
                <div className="right sm-width-full">
                  {/*<ul className="list-reset mt-lg-1 mb-2 mb-lg-1">*/}
                  {/*  <li className="inline-block">*/}
                  {/*    <a href={strings.github} className="align-middle link-primary mr-2 mr-lg-0 ml-lg-2">GitHub</a>*/}
                  {/*  </li>*/}
                  {/*</ul>*/}
                </div>
              </header>
        </>
    );
}

export default Header;