import React from "react";
import T from "prop-types";
import { Text } from "react-native";

import s from "./styles/FieldLabelStyles";

const FieldLabel = ({ children, style }) => (
  <Text style={[s.text, style]}>{children}</Text>
);

FieldLabel.propTypes = {
  children: T.node,
  style: T.any // eslint-disable-line react/forbid-prop-types
};

export default FieldLabel;
