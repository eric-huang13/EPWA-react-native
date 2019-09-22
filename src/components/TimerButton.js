import React from "react";
import { Platform, View, Text, Image } from "react-native";
import PropTypes from "prop-types";
import Touchable from "react-native-platform-touchable";

import Icon from "./Icon";
import s from "./styles/TimerButtonStyles";
import { colors } from "../themes";

const TimerButton = ({
  count,
  disabled,
  label,
  labelPosition,
  iconName,
  imagePath,
  onPress
}) => (
  <Touchable disabled={disabled} onPress={onPress}>
    <View style={[s.wrapper]}>
      {labelPosition === "top" && (
        <View
          style={[
            s.textWrapper,
            { marginBottom: Platform.OS === "android" ? 10 : 15 }
          ]}
        >
          <Text style={[s.text]}>{label}</Text>
        </View>
      )}
      <View style={{ padding: Platform.OS === "android" ? 5 : 0 }}>
        <View style={[s.iconWrapper, count > 0 ? s.activeIconWrapper : {}]}>
          {imagePath && (
            <Image
              source={imagePath}
              resizeMode="contain"
              style={{ width: 40, height: 40 }}
            />
          )}
          {iconName && <Icon name={iconName} size={30} color={colors.black} />}
        </View>
        {count > 0 && (
          <View style={s.countWrapper}>
            <Text style={s.countLabel}>{count}</Text>
          </View>
        )}
      </View>
      {labelPosition === "bottom" && (
        <View
          style={[
            s.textWrapper,
            { marginTop: Platform.OS === "android" ? 10 : 15 }
          ]}
        >
          <Text style={[s.text]}>{label}</Text>
        </View>
      )}
    </View>
  </Touchable>
);

TimerButton.propTypes = {
  count: PropTypes.number,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  labelPosition: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  iconName: PropTypes.string,
  imagePath: PropTypes.any // eslint-disable-line react/forbid-prop-types
};

export default TimerButton;
