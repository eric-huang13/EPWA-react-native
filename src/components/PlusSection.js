import React from "react";
import T from "prop-types";
import { TouchableOpacity, View } from "react-native";

import Icon from "./Icon";

import s from "./styles/PlusSectionStyles";

import { colors } from "../themes";
import iconMap from "../constants/iconMap";

const PlusSection = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={s.container}>
      <Icon name={iconMap.plus} size={24} color={colors.mediumPurple} />
    </View>
  </TouchableOpacity>
);

PlusSection.propTypes = {
  onPress: T.func.isRequired
};

export default PlusSection;
