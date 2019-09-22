import React from "react";
import T from "prop-types";
import { ImageBackground } from "react-native";

import stablePhoto from "../images/stable.png";

const StableImageBackground = (props) => (
  <ImageBackground source={stablePhoto} {...props}>
    {props.children}
  </ImageBackground>
);

StableImageBackground.propTypes = {
  children: T.node
};

export default StableImageBackground;
