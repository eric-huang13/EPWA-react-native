import React from "react";
import { View, Text, Image } from "react-native";
import PropTypes from "prop-types";
import Touchable from "react-native-platform-touchable";

import Icon from "./Icon";
import s from "./styles/IconButtonStyles";
import { colors } from "../themes";

const IconButton = ({
  active,
  label,
  labelPosition,
  iconName,
  imagePath,
  onPress
}) => (
  <Touchable onPress={onPress}>
    <View
      style={[
        s.wrapper,
        {
          flexDirection:
            labelPosition === "bottom" ? "column" : "column-reverse"
        }
      ]}
    >
      <View
        style={[
          s.iconWrapper,
          {
            backgroundColor: active ? colors.lima : colors.white,
            justifyContent: "center",
            alignItem: "center"
          }
        ]}
      >
        {imagePath && (
          <Image
            source={imagePath}
            resizeMode="contain"
            style={{ width: 35, height: 35 }}
          />
        )}
        {/* iconName && <Icon name={iconName} size={30} color={colors.black} /> */}
        <Icon
          name={iconName}
          size={34}
          color={active ? colors.black : colors.egyptianBlue}
        />
      </View>
      <Text
        style={[
          s.text,
          {
            marginTop: labelPosition === "bottom" ? 10 : 0,
            marginBottom: labelPosition === "top" ? 10 : 0
          }
        ]}
      >
        {label}
      </Text>
    </View>
  </Touchable>
);

IconButton.defaultProps = {
  labelPosition: "bottom"
};

IconButton.propTypes = {
  active: PropTypes.bool,
  label: PropTypes.string.isRequired,
  labelPosition: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  iconName: PropTypes.string,
  imagePath: PropTypes.any // eslint-disable-line react/forbid-prop-types
};

export default IconButton;
