import React from "react";
import T from "prop-types";
import Touchable from "react-native-platform-touchable";

import s from "./styles/CircleButtonStyles";

const CircleButton = ({ children, containerStyles = {}, onPress }) => (
  <Touchable style={[s.container, containerStyles]} onPress={onPress}>
    {children}
  </Touchable>
);

CircleButton.propTypes = {
  containerStyles: T.any, // eslint-disable-line react/forbid-prop-types
  children: T.node,
  onPress: T.func
};

export default CircleButton;
