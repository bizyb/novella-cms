import React, {FC} from "react";
import {strings} from "@/strings";

const Hero: FC<any> = (_props) => {
    return (
        <header>
          <div className="container mx-auto px-2 mb-2 clearfix header-text">
            <h1 className="h0 inline-block col-12 sm-width-full header-title"
                style={{marginTop: '2rem', textAlign: 'center'}}>{strings.projectName}</h1>
            <h1 className="h3 inline-block col-12 sm-width-full header-title"
                style={{marginTop: '0.5rem', textAlign: 'center'}}>{strings.description}</h1>
          </div>
        </header>
    );
}

export default Hero;