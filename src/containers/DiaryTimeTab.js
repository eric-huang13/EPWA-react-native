import React, { Component } from "react";
import { Text, View, StyleSheet, Switch, TouchableOpacity } from "react-native";
import SegmentedControlTab from "react-native-segmented-control-tab";
import T from "prop-types";
import { isSameDay, format } from "date-fns";
import nl from "date-fns/locale/nl";
import en from "date-fns/locale/en";

import { colors, fonts } from "../themes";
import ButtonFullWidth from "../components/ButtonFullWidth";

const styles = StyleSheet.create({
  tabStyle: {
    height: 70,
    backgroundColor: colors.whiteSmoke,
    borderColor: colors.whiteSmoke,
    borderLeftColor: "#AAAAAA",
    borderRightColor: "#AAAAAA"
  },
  tabTextStyle: {
    color: colors.black,
    ...fonts.style.bold
  },
  activeTabStyle: {
    backgroundColor: colors.white,
    borderBottomColor: colors.white,
    borderLeftColor: colors.white,
    borderRightColor: colors.white
  },
  activeTabTextStyle: {
    color: colors.black
  },
  tabContent: {
    color: "#444444",
    fontSize: 18,
    margin: 24
  },
  tabContentTitle: {
    ...fonts.style.titleFont,
    textAlign: "center",
    marginVertical: 40
  },
  switchContainerStyle: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginHorizontal: 20,
    paddingHorizontal: 12,
    marginBottom: 15
  }
});

const DiaryTimeTab = ({ tabIndex, handleIndexChange, t, currentDate, loc }) => {
  const locale = loc === "nl" ? nl : en;
  const sameDay = isSameDay(new Date(currentDate), new Date());
  return (
    <View>
      <SegmentedControlTab
        values={[
          t("lookBack"),
          sameDay ? t("today") : format(currentDate, "D MMM", { locale }),
          t("lookAhead")
        ]}
        selectedIndex={tabIndex}
        onTabPress={handleIndexChange}
        borderRadius={0}
        tabTextStyle={styles.tabTextStyle}
        tabStyle={styles.tabStyle}
        activeTabStyle={styles.activeTabStyle}
        activeTabTextStyle={styles.activeTabTextStyle}
      />
    </View>
  );
};

export default DiaryTimeTab;
