import React from "react";
import T from "prop-types";
import { translate } from "react-i18next";
import { Text, View } from "react-native";

import s from "./styles/TabBarStyles";

const TabBar = ({ activeIndex, t }) => (
  <View style={s.container}>
    <View style={[s.tabWrapper, activeIndex >= 0 ? s.activeBorder : {}]}>
      <View style={[s.tab, activeIndex === 0 ? s.activeTab : {}]}>
        <Text style={s.text}>{t("painMeasurement.misc.frequency")}</Text>
      </View>
    </View>

    <View style={[s.tabWrapper, activeIndex >= 1 ? s.activeBorder : {}]}>
      <View style={[s.tab, activeIndex === 1 ? s.activeTab : {}]}>
        <Text style={s.text}>{t("painMeasurement.misc.observation")}</Text>
      </View>
    </View>

    <View style={[s.tabWrapper, activeIndex >= 2 ? s.activeBorder : {}]}>
      <View style={[s.tab, activeIndex === 2 ? s.activeTab : {}]}>
        <Text style={s.text}>{t("painMeasurement.misc.reaction")}</Text>
      </View>
    </View>
  </View>
);

TabBar.propTypes = {
  activeIndex: T.number,
  t: T.func
};

export default translate("root")(TabBar);
