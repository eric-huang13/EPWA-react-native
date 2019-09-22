import React from "react";
import T from "prop-types";
import { Text, View } from "react-native";

import s from "./styles/FieldSectionHeaderStyles";

const FieldSectionHeader = ({ icon, title }) => (
  <View style={s.container}>
    <View style={s.iconContainer}>{icon}</View>
    <Text style={s.text}>{title}</Text>
  </View>
);

FieldSectionHeader.propTypes = {
  icon: T.node,
  title: T.string
};

export default FieldSectionHeader;
