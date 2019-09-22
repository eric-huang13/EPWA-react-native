import React from "react";
import T from "prop-types";
import { Text } from "react-native";

import s from "./styles/FieldTextStyles";

const FieldText = ({ children, style, lines }) => (
  <Text numberOfLines={lines} style={[s.text, style]}>
    {children}
  </Text>
);

FieldText.propTypes = {
  children: T.node,
  style: T.any // eslint-disable-line react/forbid-prop-types
};

export default FieldText;
