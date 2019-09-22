import React from "react";
import { TouchableHighlight } from "react-native";
import PropTypes from "prop-types";

import Icon from "./Icon";
import s from "./styles/HamburgerButtonStyles";
import { colors } from "../themes";
import iconMap from "../constants/iconMap";

const CalendarButton = ({ onPress, hitSlop }) => (
  <TouchableHighlight
    hitSlop={hitSlop || {}}
    onPress={onPress}
    underlayColor="#fff"
    style={{
      paddingTop: 10,
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 10,
      marginRight: 10,
      borderRadius: 20,
      backgroundColor: colors.egyptianBlue
    }}
  >
    <Icon name={iconMap.info} size={20} color={colors.white} />
  </TouchableHighlight>
);

CalendarButton.propTypes = {
  hitSlop: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onPress: PropTypes.func.isRequired
};

export default CalendarButton;
