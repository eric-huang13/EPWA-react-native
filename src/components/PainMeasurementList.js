import React from "react";
import T from "prop-types";
import { Text, View } from "react-native";
import { format } from "date-fns";
import Touchable from "react-native-platform-touchable";

import Icon from "../components/Icon";
import iconMap from "../constants/iconMap";

import s from "./styles/PainMeasurementListStyles";

import { colors } from "../themes";

const PainMeasurementList = ({ items, locale, onClick }) => {
  const formatDate = (timestamp) =>
    format(timestamp, "dd D MMM YYYY HH:mm", { locale });

  return items.map((item) => {
    const { id, localId, data, startDate, type } = item;

    return (
      <Touchable key={id || localId} onPress={() => onClick(item)}>
        <View style={s.container}>
          <View style={s.iconContainer}>
            <Icon
              name={type === "composite" ? iconMap.horse1 : iconMap.horseHead}
              size={28}
              color={colors.nero}
            />
          </View>
          <Text style={s.date}>{formatDate(startDate)}</Text>
          <Text
            style={[
              s.score,
              {
                color: type === "composite" ? colors.lima : colors.egyptianBlue
              }
            ]}
          >
            {data.finalScore}
          </Text>
        </View>
      </Touchable>
    );
  });
};

PainMeasurementList.propTypes = {
  items: T.arrayOf(
    T.shape({
      score: T.number,
      timestamp: T.number,
      type: T.oneOf(["composite", "facialExpression"])
    })
  ).isRequired,
  locale: T.object, // eslint-disable-line react/forbid-prop-types
  onClick: T.func
};

export default PainMeasurementList;
