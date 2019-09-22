import React from "react";
import T from "prop-types";
import { Text, TouchableHighlight, View } from "react-native";

import { formatCountdown } from "../services/painMeasurement";

import s from "./styles/CountdownCircleStyles";
import { colors } from "../themes";

const CountdownCircle = ({ timeLeftInSeconds, onPress }) => (
  <View style={s.container}>
    <TouchableHighlight underlayColor={colors.transparent} onPress={onPress}>
      <Text style={s.text}>{formatCountdown(timeLeftInSeconds)}</Text>
    </TouchableHighlight>
  </View>
);

CountdownCircle.propTypes = {
  timeLeftInSeconds: T.number
};

export default CountdownCircle;
