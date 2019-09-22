import React from "react";
import { TouchableHighlight } from "react-native";
import PropTypes from "prop-types";

import Icon from "./Icon";
import s from "./styles/HamburgerButtonStyles";
import { colors } from "../themes";
import iconMap from "../constants/iconMap";

const MenuButton = ({ onPress }) => (
  <TouchableHighlight
    onPress={onPress}
    underlayColor="#fff"
    style={s.container}
  >
    <Icon name={iconMap.hamburger} size={20} color={colors.nero} />
  </TouchableHighlight>
);

MenuButton.propTypes = {
  onPress: PropTypes.func.isRequired
};

export default MenuButton;
