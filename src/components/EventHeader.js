import React from "react";
import T from "prop-types";
import { Text, View } from "react-native";

import s from "./styles/EventHeaderStyles";

import Icon from "./Icon";
import iconMap from "../constants/iconMap";

const TypeHeader = ({ iconColor, labelsRight, startDate, title, note }) => (
  <View style={s.container}>
    <View style={s.row}>
      <Icon name={iconMap.time} size={16} color={iconColor} style={s.icon} />
      {startDate && <Text style={s.time}>{startDate}</Text>}
      <Text style={s.title} numberOfLines={1}>
        {title}
      </Text>
      {labelsRight &&
        labelsRight.map((labelEntry) => [
          <Text key={labelEntry[0]} style={[s.label]}>
            {labelEntry[0]}
          </Text>,
          labelEntry[1] && (
            <Text key={labelEntry[1]} style={s.label}>
              {labelEntry[1]}
            </Text>
          )
        ])}
    </View>
    {note ? (
      <View style={s.row}>
        <Text style={s.note}>{note}</Text>
      </View>
    ) : null}
  </View>
);

TypeHeader.propTypes = {
  iconColor: T.string,
  labelsRight: T.arrayOf(T.arrayOf(T.string)),
  startDate: T.string,
  title: T.string,
  note: T.string
};

export default TypeHeader;
