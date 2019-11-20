import React from "react";
import { Platform } from "react-native";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";

import icoMoonConfig from "../icons/selection.json";

const Icomoon = createIconSetFromIcoMoon(
  icoMoonConfig,
  "icomoon",
  "Icomoon.ttf"
);

const IconAndroid = ({ style, ...props }) => (
  <Icomoon {...props} style={[style, { includeFontPadding: false }]} />
);

const Icon = Platform.select({
  ios: Icomoon,
  android: IconAndroid
});

export default Icon;
