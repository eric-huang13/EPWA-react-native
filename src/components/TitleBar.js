import React from "react";
import T from "prop-types";
import { Text, View } from "react-native";

import s from "./styles/TitleBarStyles";
import { colors } from "../themes";

const TitleBar = ({
  backgroundColor,
  children,
  color,
  paddingHorizontal,
  borderBottomWidth,
  textAlign
}) => (
  <View
    style={[
      s.container,
      {
        backgroundColor,
        paddingHorizontal,
        borderBottomColor: colors.darkFilter,
        borderBottomWidth
      }
    ]}
  >
    <Text style={[s.text, { textAlign, color }]}>{children}</Text>
  </View>
);

TitleBar.defaultProps = {
  paddingHorizontal: 0,
  backgroundColor: colors.egyptianBlue,
  borderBottomWidth: 0,
  color: colors.white,
  textAlign: "center"
};

TitleBar.propTypes = {
  paddingHorizontal: T.number,
  backgroundColor: T.string,
  borderBottomWidth: T.number,
  color: T.string,
  children: T.node,
  textAlign: T.string
};

export default TitleBar;
