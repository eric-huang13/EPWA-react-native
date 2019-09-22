import React from "react";
import PropTypes from "prop-types";
import Touchable from "react-native-platform-touchable";

import Icon from "./Icon";
import s from "./styles/UndoButtonStyles";
import { colors } from "../themes";
import iconMap from "../constants/iconMap";

const UndoButton = ({ disabled, onPress, containerStyles }) => (
  <Touchable
    disabled={disabled}
    style={[s.container, containerStyles]}
    onPress={onPress}
  >
    <Icon name={iconMap.rewind} size={30} color={colors.white} />
  </Touchable>
);

UndoButton.propTypes = {
  disabled: PropTypes.bool,
  containerStyles: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  onPress: PropTypes.func.isRequired
};

export default UndoButton;
