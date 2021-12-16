/* eslint-disable react/no-multi-comp */
import React, { Component } from "react";
import { HeaderBackButton } from "react-navigation-stack";
import { ScrollView, View } from "react-native";
import { curry } from "ramda";

import { colors, fonts } from "../../themes";
import { translate } from "react-i18next";
import { hoistStatics } from "recompose";
import { compose } from "redux";
import ButtonFullWidth from "../../components/ButtonFullWidth";
import { Dimensions } from "react-native";

class ChoosePainMeasurementType extends Component {
  static navigationOptions = (allProps) => {
    const { navigation, screenProps } = allProps;
    return {
      title: screenProps.t.t("painMeasurement.misc.chooseMeasurementType"),
      headerTitleStyle: {
        ...fonts.style.h4,
        fontWeight: "400",
      },
      headerLeft: (
        <HeaderBackButton
          tintColor={colors.nero}
          onPress={() =>
            navigation.getParam("redirectPath")
              ? navigation.navigate(navigation.getParam("redirectPath"))
              : navigation.navigate("StartUp")
          }
        />
      ),
    };
  };

  routes = {
    startPainMeasurement: "painMeasurement",
    startChronicPainMeasurement: "ChronicPainMeasurement",
  };

  navigateTo = curry((path, params = {}) => {
    const { navigation } = this.props;
    const {
      state: { params: stateParams },
    } = navigation;
    navigation.navigate(path, {
      ...stateParams,
      ...params,
      redirectPath: "DiaryChooseMeasurement",
    });
  });

  render() {
    const { width: deivceWidth } = Dimensions.get("window");
    const { t } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: colors.egyptianBlue }}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            backgroundColor: colors.egyptianBlue,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              paddingHorizontal: 30,
            }}
          >
            <ButtonFullWidth
              style={{ width: deivceWidth, marginBottom: 25 }}
              onPress={() => this.navigateTo(this.routes.startPainMeasurement, {redirectPath: "Diary"})}
              label={t("painMeasurement.misc.acutePMTitle")}
            />
            <ButtonFullWidth
              style={{ width: deivceWidth, marginBottom: 25 }}
              onPress={() =>
                this.navigateTo(this.routes.startChronicPainMeasurement)
              }
              label={t("painMeasurement.misc.chronicPMTitle")}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default hoistStatics(compose(translate("root")))(
  ChoosePainMeasurementType
);
