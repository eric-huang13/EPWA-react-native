import React from "react";
import T from "prop-types";
import { TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import s from "./styles/SubmitHeaderButtonStyles";

import { colors } from "../themes";
import iconMap from "../constants/iconMap";

const SubmitHeaderButton = ({ onPress, hitSlop }) => (
  <TouchableOpacity onPress={onPress} hitSlop={hitSlop || {}}>
    <MaterialIcons
      name={iconMap.send}
      size={24}
      color={colors.mediumPurple}
      style={s.icon}
    />
  </TouchableOpacity>
);

SubmitHeaderButton.propTypes = {
  hitSlop: T.object, // eslint-disable-line react/forbid-prop-types
  onPress: T.func
};

export default SubmitHeaderButton;
