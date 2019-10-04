/* eslint-disable react/no-multi-comp */
import React, { Component, PureComponent } from "react";
import { HeaderBackButton } from "react-navigation-stack";
import { ScrollView, View, Text } from "react-native";
import { isNil, isEmpty } from "ramda";

import ActionButtonNext from "../components/ActionButtonNext";
import Button from "../components/Button";

import iconMap from "../constants/iconMap";
import { colors, fonts } from "../themes";

import Reactotron from "reactotron-react-native";

// Extending PureComponent to prevent unnecessary rerenders
// while interacting with other screens in a stack
class PainMeasurementIntro extends PureComponent {
  renderNoAnimalsWarning = () => (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Text
        style={{
          ...fonts.style.h4,
          color: colors.white,
          textAlign: "center",
          marginBottom: 20
        }}
      >
        {this.props.t("noAnimalsInStableWarning")}
      </Text>
      <Button
        style={{
          width: 240,
          marginBottom: 20,
          shadowOpacity: 0.5,
          shadowRadius: 5,
          shadowColor: colors.black,
          shadowOffset: { height: 3, width: 0 },
          elevation: 1
        }}
        backgroundColor={colors.mediumPurple}
        label={this.props.t("addHorse")}
        onPress={() => this.props.onNavigateToAnimalForm("horse")}
        iconName={iconMap.arrowRight}
      />
      <Button
        style={{
          width: 240,
          marginBottom: 20,
          shadowOpacity: 0.5,
          shadowRadius: 5,
          shadowColor: colors.black,
          shadowOffset: { height: 3, width: 0 },
          elevation: 1
        }}
        backgroundColor={colors.mediumPurple}
        label={this.props.t("addDonkey")}
        onPress={() => this.props.onNavigateToAnimalForm("donkey")}
        iconName={iconMap.arrowRight}
      />
    </View>
  );

  renderEnglishWarning = () =>
    this.props
      .t("painMeasurement.misc.safetyInfo", { returnObjects: true })
      .map(sentence => (
        <Text
          key={sentence}
          style={{
            ...fonts.style.h4,
            color: colors.white,
            textAlign: "center",
            marginBottom: 20
          }}
        >
          {sentence}
        </Text>
      ));

  renderDutchWarning = () =>
    this.props
      .t("painMeasurement.misc.safetyInfo", { returnObjects: true })
      .map((sentence, index) => {
        if (index === 0) {
          return (
            <Text
              key={sentence}
              style={{
                ...fonts.style.h4,
                color: colors.white,
                textAlign: "center",
                marginBottom: 20
              }}
            >
              {sentence}
            </Text>
          );
        }

        if (index === 1) {
          return (
            <Text
              key={sentence}
              style={{
                ...fonts.style.normal,
                color: colors.white,
                textAlign: "center",
                marginBottom: 40
              }}
            >
              {sentence}
            </Text>
          );
        }

        return (
          <Text
            key={sentence}
            style={{
              ...fonts.style.normal,
              color: colors.white,
              textAlign: "center",
              marginBottom: 20
            }}
          >
            - {sentence}
          </Text>
        );
      });

  renderSafetyWarning = () => {
    return this.props.locale === "nl"
      ? this.renderDutchWarning()
      : this.renderEnglishWarning();
  };

  render() {
    const { shouldAllowUserToContinue } = this.props;
    Reactotron.log("renderd wel");

    return (
      <View style={{ flex: 1, backgroundColor: colors.egyptianBlue }}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            backgroundColor: colors.egyptianBlue,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <View
            style={{
              paddingHorizontal: 30
            }}
          >
            {shouldAllowUserToContinue
              ? this.renderSafetyWarning()
              : this.renderNoAnimalsWarning()}
          </View>
        </ScrollView>
        {shouldAllowUserToContinue && (
          <ActionButtonNext onPress={() => this.props.onNavigateToNextStep()} />
        )}
      </View>
    );
  }
}

class PainMeasurementIntroContainer extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t("painMeasurement.misc.headerTitle"),
    headerTitleStyle: {
      ...fonts.style.h4,
      fontWeight: "400"
    },
    headerLeft: (
      <HeaderBackButton
        tintColor={colors.nero}
        onPress={() =>
          navigation.getParam("redirectPath") === "Diary"
            ? navigation.navigate("Diary")
            : navigation.navigate("StartUp")
        }
      />
    )
  });

  get form() {
    return this.props.screenProps.form;
  }

  shouldAllowUserToContinue = () => {
    const { animals, forceAnimalSelection } = this.form.values;
    const noAnimalsPassed =
      isNil(animals) || (Array.isArray(animals) && isEmpty(animals));

    return !(forceAnimalSelection && noAnimalsPassed);
  };

  onNavigateToNextStep = () => {
    const { isUserLoggedIn } = this.props.screenProps;
    if (isUserLoggedIn) {
      this.props.navigation.navigate("PainMeasurementStart");
    } else {
      this.props.navigation.navigate("PainMeasurementLoginWarning");
    }
  };

  onNavigateToAnimalForm = type => {
    this.props.navigation.navigate("AnimalForm", { type });
  };

  render() {
    const shouldAllowUserToContinue = this.shouldAllowUserToContinue();
    const locale = this.props.screenProps.i18n.language;
    const { t } = this.props.screenProps;
    return (
      <PainMeasurementIntro
        locale={locale}
        onNavigateToAnimalForm={this.onNavigateToAnimalForm}
        onNavigateToNextStep={this.onNavigateToNextStep}
        shouldAllowUserToContinue={shouldAllowUserToContinue}
        t={t}
      />
    );
  }
}

export default PainMeasurementIntroContainer;
