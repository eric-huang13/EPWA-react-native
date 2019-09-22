import React from "react";
import { View, Text, Image } from "react-native";
import PropTypes from "prop-types";
import Touchable from "react-native-platform-touchable";

import Icon from "./Icon";
import s from "./styles/TimerIntroButtonStyles";
import { colors } from "../themes";

const TimerIntroButton = ({
  label,
  labelPosition,
  iconName,
  imagePath,
  onPress
}) => (
  <Touchable onPress={onPress}>
    <View style={[s.wrapper]}>
      {labelPosition === "top" && (
        <View style={[s.textWrapper, { marginBottom: 10 }]}>
          <Text style={[s.text]}>{label}</Text>
        </View>
      )}
      <View style={[s.iconWrapper, { backgroundColor: colors.white }]}>
        {imagePath && (
          <Image
            source={imagePath}
            resizeMode="contain"
            style={{ width: 40, height: 40 }}
          />
        )}
        {iconName && <Icon name={iconName} size={30} color={colors.black} />}
      </View>
      {labelPosition === "bottom" && (
        <View style={[s.textWrapper, { marginTop: 10 }]}>
          <Text style={[s.text]}>{label}</Text>
        </View>
      )}
    </View>
  </Touchable>
);

TimerIntroButton.propTypes = {
  label: PropTypes.string.isRequired,
  labelPosition: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  iconName: PropTypes.string,
  imagePath: PropTypes.any // eslint-disable-line react/forbid-prop-types
};

export default TimerIntroButton;
