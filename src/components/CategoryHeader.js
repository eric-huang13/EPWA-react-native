import React from "react";
import T from "prop-types";
import { Text, View } from "react-native";

import s from "./styles/CategoryHeaderStyles";

const CategoryHeader = ({
  children,
  boxStyles = {},
  textStyles = {},
  textProps = {}
}) => (
  <View style={[s.container, boxStyles]}>
    <Text style={[s.text, textStyles]} {...textProps}>
      {children}
    </Text>
  </View>
);

CategoryHeader.propTypes = {
  boxStyles: T.any, // eslint-disable-line react/forbid-prop-types
  children: T.node,
  textStyles: T.any, // eslint-disable-line react/forbid-prop-types,
  textProps: T.any // eslint-disable-line react/forbid-prop-types
};

export default CategoryHeader;
