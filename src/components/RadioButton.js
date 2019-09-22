import React from "react";
import T from "prop-types";
import { Text, View } from "react-native";
import Touchable from "react-native-platform-touchable";

import Icon from "./Icon";

import { colors, fonts } from "../themes";
import iconMap from "../constants/iconMap";

const RadioButton = ({ active, onPress, label }) => (
  <Touchable onPress={onPress}>
    <View
      style={{
        backgroundColor: colors.egyptianBlueDark,
        borderRadius: 28,
        paddingHorizontal: 20,
        minHeight: 46,
        flexDirection: "row",
        alignItems: "center",
        maxWidth: 200
      }}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderWidth: 1,
          borderRadius: 11,
          borderColor: colors.white,
          marginRight: 15,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: active ? colors.lima : colors.transparent
        }}
      >
        {active ? (
          <Icon name={iconMap.check} size={12} color={colors.white} />
        ) : null}
      </View>
      <Text
        style={{
          ...fonts.style.label,
          color: "white",
          flexShrink: 1,
          lineHeight: 15
        }}
      >
        {label}
      </Text>
    </View>
  </Touchable>
);

RadioButton.propTypes = {
  active: T.bool,
  label: T.string,
  onPress: T.func.isRequired
};

export default RadioButton;
