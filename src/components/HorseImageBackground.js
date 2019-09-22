import React from "react";
import T from "prop-types";
import { ImageBackground } from "react-native";

import horsePhoto from "../images/horse.jpeg";

const HorseImageBackground = (props) => (
  <ImageBackground source={horsePhoto} {...props}>
    {props.children}
  </ImageBackground>
);

HorseImageBackground.propTypes = {
  children: T.node
};

export default HorseImageBackground;
