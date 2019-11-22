import React from "react";
import T from "prop-types";
import { Text, TouchableOpacity, View } from "react-native";

import Icon from "./Icon";
import s from "./styles/SelectButtonStyles";
import { colors } from "../themes";
import iconMap from "../constants/iconMap";

const SelectButton = ({ onPress, children, containerStyle, touchStyle }) => (
  <TouchableOpacity onPress={onPress} style={[{ flex: 1 }, touchStyle]}>
    <View style={[s.container, containerStyle]}>
      <Text style={s.text}>{children}</Text>
      <Icon name={iconMap.dropdown} size={20} color={colors.nero} />
    </View>
  </TouchableOpacity>
);

SelectButton.propTypes = {
  containerStyle: T.any, // eslint-disable-line react/forbid-prop-types
  onPress: T.func.isRequired,
  children: T.string.isRequired
};

export default SelectButton;
