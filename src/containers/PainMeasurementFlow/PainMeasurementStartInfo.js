import React, { Component } from "react";
import { HeaderBackButton } from "react-navigation-stack";
import { ScrollView, View, Text, Platform } from "react-native";
import { __, curry, path, isNil } from "ramda";

import { colors, fonts } from "../../themes";

// import Reactotron from "reactotron-react-native";

class PainMeasurementStartInfo extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const t = isNil(screenProps.t.t) ? screenProps.t : screenProps.t.t;

    return {
      title: t("painMeasurement.misc.chronicHeaderTitle"),
      headerTitleStyle: {
        ...fonts.style.h4,
        fontWeight: "400",
      },
      headerStyle: Platform.OS === 'ios'? {
        marginTop: 20,
        paddingBottom: 10,
      } : {},
      headerLeft: (
        <HeaderBackButton
          tintColor={colors.nero}
          onPress={() => navigation.goBack()}
        />
      ),
    };
  };

  render() {
    const t = isNil(this.props.screenProps.t.t)
      ? this.props.screenProps.t
      : this.props.screenProps.t.t;

    const animalType = path(["screenProps", "form", "values", "animalType"])(
      this.props
    );
    const animalTypeTranslatePath = animalType
      ? t(`painMeasurement.misc.${animalType}`)
      : t("painMeasurement.misc.horse");
    const pluralAnimalTypeTranslatePath = animalType
      ? t(`painMeasurement.misc.${animalType}_plural`)
      : t("painMeasurement.misc.horse_plural");
    const facialMeasurementThresholdScore = animalType === "donkey" ? 2 : 3;
    const compositeMeasurementScoreThreshold = 5;

    // Fallback to horse
    const translatedAnimalType = t(animalTypeTranslatePath).toLowerCase();
    const translatedPluralAnimalType = t(
      pluralAnimalTypeTranslatePath
    ).toLowerCase();

    const tCurry = curry(t);
    const tWithAnimalType = tCurry(__, {
      animalType: translatedAnimalType,
      pluralAnimalType: translatedPluralAnimalType,
      facialMeasurementThresholdScore,
      compositeMeasurementScoreThreshold,
    });

    const textStyle = {
      ...fonts.style.normal,
      color: colors.nero,
      lineHeight: 20,
      marginBottom: 20,
    };

    const titleStyle = {
      ...fonts.style.cta,
      color: colors.nero,
      lineHeight: 20,
      marginBottom: 10,
    };

    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: colors.white,
            paddingTop: 20,
            paddingHorizontal: 20,
          }}
        >
          <Text style={titleStyle}>
            {tWithAnimalType("painMeasurement.misc.adviceTitle")}
          </Text>
          <Text style={textStyle}>
            {tWithAnimalType("painMeasurement.misc.chronicAdviceText")}
          </Text>
          <Text style={titleStyle}>
            {tWithAnimalType("painMeasurement.misc.facialExpressionsTitle")}
          </Text>
          <Text style={textStyle}>
            {tWithAnimalType(
              "painMeasurement.misc.facialExpressionExplanation"
            )}
          </Text>
        </ScrollView>
      </View>
    );
  }
}

export default PainMeasurementStartInfo;
