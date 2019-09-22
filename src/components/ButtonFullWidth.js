import React from "react";
import T from "prop-types";
import { Text, View } from "react-native";
import Touchable from "react-native-platform-touchable";

import { btnFullWidth } from "./styles/ButtonStyles";
import { colors, fonts } from "../themes";

const ButtonFullWidth = (props) => (
  <Touchable
    style={
      ([btnFullWidth.shadow, props.style], { marginBottom: 50, marginTop: 15 })
    }
    onPress={props.onPress}
  >
    <View style={btnFullWidth.container}>
      <Text style={[{ color: props.textColor }, fonts.style.cta]}>
        {props.label}
      </Text>
    </View>
  </Touchable>
);

ButtonFullWidth.defaultProps = {
  textColor: colors.white
};

ButtonFullWidth.propTypes = {
  containerStyles: T.any, // eslint-disable-line
  textColor: T.string,
  textStyles: T.any, // eslint-disable-line
  label: T.string,
  onPress: T.func,
  style: T.any // eslint-disable-line
};

export default ButtonFullWidth;
