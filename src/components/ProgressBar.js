import React from "react";
import T from "prop-types";
import { View } from "react-native";

import { colors } from "../themes";

const ProgressBar = ({ percent }) => (
  <View style={{ width: "100%", backgroundColor: colors.egyptianBlue }}>
    <View
      style={{
        width: `${percent}%`,
        borderBottomWidth: 4,
        borderBottomColor: colors.lima
      }}
    />
  </View>
);

ProgressBar.propTypes = {
  percent: T.number
};

export default ProgressBar;
