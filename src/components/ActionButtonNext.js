import React from "react";
import T from "prop-types";
import ActionButton from "react-native-action-button";

import Icon from "./Icon";

import { colors } from "../themes";
import iconMap from "../constants/iconMap";

const ActionButtonNext = ({ onPress }) => (
  <ActionButton
    buttonColor={colors.mediumPurple}
    onPress={onPress}
    renderIcon={() => (
      <Icon name={iconMap.arrowRight} size={24} color={colors.white} />
    )}
  />
);

ActionButtonNext.propTypes = {
  onPress: T.func
};

export default ActionButtonNext;
