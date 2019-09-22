import React from "react";
import T from "prop-types";
import { Text, View } from "react-native";

import s from "./styles/TypeHeaderStyles";

const TypeHeader = ({
  highlightColor,
  icon,
  labelsRight,
  showBorder,
  title,
  titleStyles
}) => (
  <View style={[s.container, showBorder ? s.containerBorder : {}]}>
    <View style={s.iconContainer}>{icon}</View>
    <Text style={[s.title, titleStyles || {}]}>{title}</Text>
    {labelsRight.map((labelEntry) => [
      labelsRight[0] && (
        <Text
          key={labelEntry[0]}
          style={[s.highlightedLabel, { color: highlightColor }]}
        >
          {labelEntry[0]}
        </Text>
      ),
      labelsRight[1] && (
        <Text key={labelEntry[1]} style={s.label}>
          {labelEntry[1]}
        </Text>
      )
    ])}
  </View>
);

TypeHeader.defaultProps = {
  showBorder: true
};

TypeHeader.propTypes = {
  icon: T.node,
  highlightColor: T.string,
  labelsRight: T.arrayOf(T.arrayOf(T.oneOfType([T.string, T.number]))),
  showBorder: T.bool,
  title: T.string,
  titleStyles: T.any // eslint-disable-line react/forbid-prop-types
};

export default TypeHeader;
