import React from "react";
import T from "prop-types";
import { Image, Text, View } from "react-native";
import Touchable from "react-native-platform-touchable";

import Icon from "./Icon";

import { colors, fonts } from "../themes";
import iconMap from "../constants/iconMap";

const ActiveIcon = () => (
  <View
    style={{
      width: 36,
      height: 36,
      borderWidth: 1,
      borderRadius: 36 / 2,
      borderColor: colors.white,
      marginRight: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.white
    }}
  >
    <Icon name={iconMap.check} size={16} color={colors.lima} />
  </View>
);

const InactiveIcon = () => (
  <View
    style={{
      width: 22,
      height: 22,
      borderWidth: 1,
      borderRadius: 11,
      borderColor: colors.nero,
      marginRight: 20,
      backgroundColor: colors.transparent
    }}
  />
);

const RadioSection = ({ active, onPress, label, imageSource }) => (
  <Touchable onPress={onPress}>
    <View
      style={{
        paddingHorizontal: 20,
        minHeight: 80,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: active ? colors.lima : colors.transparent,
        borderBottomWidth: 1,
        borderBottomColor: colors.darkFilter
      }}
    >
      {active ? <ActiveIcon /> : <InactiveIcon />}
      {!imageSource ? ( // eslint-disable-line no-nested-ternary
        <View />
      ) : Array.isArray(imageSource) ? (
        <View style={{ flexDirection: "row" }}>
          {imageSource.map((src, index) => (
            <Image
              key={index}
              source={src}
              style={{ height: 50, width: 50, marginRight: 20 }}
            />
          ))}
        </View>
      ) : (
        <Image
          source={imageSource}
          style={{ height: 50, width: 50, marginRight: 20 }}
        />
      )}

      <Text
        style={{
          ...fonts.style.normal,
          color: colors.nero,
          flexShrink: 1,
          lineHeight: 20
        }}
      >
        {label}
      </Text>
    </View>
  </Touchable>
);

RadioSection.propTypes = {
  active: T.bool,
  imageSource: T.any, // eslint-disable-line react/forbid-prop-types
  label: T.string,
  onPress: T.func.isRequired
};

export default RadioSection;
