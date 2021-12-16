import React from "react";
import T from "prop-types";
import { Text, View } from "react-native";
import Touchable from "react-native-platform-touchable";

import Icon from "./Icon";
import s from "./styles/ButtonStyles";
import { colors, fonts } from "../themes";

const Button = (props) => (
  <Touchable
    disabled={props.disabled}
    style={[
      s.touchable,
      { backgroundColor: props.disabled ? 'grey' : props.backgroundColor },
      // Put incoming styles last so that they can override defaults
      props.style
    ]}
    onPress={props.onPress}
  >
    <View style={[s.container, props.containerStyles]}>
      {props.socialIcon ? (
        props.socialIcon
      ) : (
        props.socialIconName && 
        <Icon
          name={props.socialIconName}
          size={props.iconSize}
          color={props.iconColor}
        />
      )}
      <Text
        style={[
          s.label,
          { ...fonts.style.cta },
          props.textStyles,
          { color: props.textColor }
        ]}
      >
        {props.label}
      </Text>
      {props.icon ? (
        props.icon
      ) : (
        props.iconName && 
        <Icon
          name={props.iconName}
          size={props.iconSize}
          color={props.iconColor}
        />
      )}
    </View>
  </Touchable>
);

Button.defaultProps = {
  backgroundColor: colors.nero,
  textColor: colors.white,
  iconColor: colors.white,
  iconSize: 22,
  disabled: false
};

Button.propTypes = {
  disabled: T.bool,
  backgroundColor: T.string,
  containerStyles: T.any, // eslint-disable-line
  textColor: T.string,
  textStyles: T.any, // eslint-disable-line
  label: T.string,
  icon: T.element,
  iconName: T.string,
  iconSize: T.number,
  iconColor: T.string,
  onPress: T.func,
  style: T.any // eslint-disable-line
};

export default Button;
