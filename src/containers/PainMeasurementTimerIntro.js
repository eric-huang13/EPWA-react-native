import React, { Component } from "react";
import { HeaderBackButton } from "react-navigation-stack";
import { ScrollView, View, Text } from "react-native";
import { compose } from "ramda";
import { connect } from "react-redux";
import { hoistStatics, onlyUpdateForKeys } from "recompose";
import Touchable from "react-native-platform-touchable";

import TimerIntroButton from "../components/TimerIntroButton";
import ProgressBar from "../components/ProgressBar";
import CountdownCircle from "../components/CountdownCircle";

import { isCompositeMeasurement } from "../services/painMeasurement";

import { colors, fonts } from "../themes";
import iconMap from "../constants/iconMap";
import imageMap from "../constants/imageMap";

class PainMeasurementTimerIntro extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      title: screenProps.t("painMeasurement.misc.headerTitle"),
      headerTitleStyle: {
        ...fonts.style.h4,
        fontWeight: "400"
      },
      headerLeft: (
        <HeaderBackButton
          tintColor={colors.nero}
          onPress={() => navigation.goBack()}
        />
      )
    };
  };

  get values() {
    return this.props.screenProps.form.values;
  }

  navigateToInfoScreen = fieldName => {
    this.props.navigation.navigate("PainMeasurementTimerInfo", { fieldName });
  };

  renderCompositeMeasurementTimer = () => {
    const { t } = this.props.screenProps;

    if (this.values.animalType === "donkey") {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center"
          }}
        >
          <View style={{ justifyContent: "center", marginRight: 20 }}>
            <View style={{ marginBottom: 10 }}>
              <TimerIntroButton
                imagePath={imageMap.donkey.tailFlicking}
                onPress={() => this.navigateToInfoScreen("tailFlicking")}
                label={t("painMeasurement.full.timer.tailFlicking")}
                labelPosition="top"
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <TimerIntroButton
                imagePath={imageMap.donkey.pawing}
                onPress={() => this.navigateToInfoScreen("pawing")}
                label={t("painMeasurement.full.timer.pawing")}
                labelPosition="bottom"
              />
            </View>
          </View>
          <View style={{ alignSelf: "center", justifyContent: "center" }}>
            <View style={{ marginBottom: 20 }}>
              <TimerIntroButton
                iconName={iconMap.sound}
                onPress={() => this.navigateToInfoScreen("painSounds")}
                label={t("painMeasurement.full.timer.painSounds")}
                labelPosition="top"
              />
            </View>
            <CountdownCircle
              timeLeftInSeconds={300}
              onPress={() => this.navigateToInfoScreen("fullCountdown")}
            />
            <View style={{ marginTop: 20 }}>
              <TimerIntroButton
                imagePath={imageMap.donkey.pointingTowardsTheFloor}
                onPress={() =>
                  this.navigateToInfoScreen("pointingTowardsTheFloor")
                }
                label={t("painMeasurement.full.timer.pointingTowardsTheFloor")}
                labelPosition="bottom"
              />
            </View>
          </View>
          <View style={{ justifyContent: "center", marginLeft: 10 }}>
            <View style={{ marginTop: 20 }}>
              <TimerIntroButton
                imagePath={imageMap.donkey.lookingAtAbdomen}
                onPress={() => this.navigateToInfoScreen("lookingAtAbdomen")}
                label={t("painMeasurement.full.timer.lookingAtAbdomen")}
                labelPosition="top"
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <TimerIntroButton
                imagePath={imageMap.donkey.kickingAtAbdomen}
                onPress={() => this.navigateToInfoScreen("kickingAtAbdomen")}
                label={t("painMeasurement.full.timer.kickingAtAbdomen")}
                labelPosition="bottom"
              />
            </View>
          </View>
        </View>
      );
    }

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center"
        }}
      >
        <View style={{ justifyContent: "center", marginRight: 20 }}>
          <View style={{ marginBottom: 10 }}>
            <TimerIntroButton
              imagePath={imageMap.horse.tailFlicking}
              onPress={() => this.navigateToInfoScreen("tailFlicking")}
              label={t("painMeasurement.full.timer.tailFlicking")}
              labelPosition="top"
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <TimerIntroButton
              imagePath={imageMap.horse.pawing}
              onPress={() => this.navigateToInfoScreen("pawing")}
              label={t("painMeasurement.full.timer.pawing")}
              labelPosition="bottom"
            />
          </View>
        </View>
        <View style={{ alignSelf: "center", justifyContent: "center" }}>
          <View style={{ marginBottom: 20 }}>
            <TimerIntroButton
              imagePath={imageMap.horse.layingDownRolling}
              onPress={() => this.navigateToInfoScreen("layingDownRolling")}
              label={t("painMeasurement.full.timer.layingDownRolling")}
              labelPosition="top"
            />
          </View>
          <CountdownCircle
            timeLeftInSeconds={300}
            onPress={() => this.navigateToInfoScreen("fullCountdown")}
          />
          <View style={{ marginTop: 20 }}>
            <TimerIntroButton
              imagePath={imageMap.horse.headMovements}
              onPress={() => this.navigateToInfoScreen("headMovements")}
              label={t("painMeasurement.full.timer.headMovements")}
              labelPosition="bottom"
            />
          </View>
        </View>
        <View style={{ justifyContent: "center", marginLeft: 10 }}>
          <View style={{ marginTop: 20 }}>
            <TimerIntroButton
              imagePath={imageMap.horse.kickingAtAbdomen}
              onPress={() => this.navigateToInfoScreen("kickingAtAbdomen")}
              label={t("painMeasurement.full.timer.kickingAtAbdomen")}
              labelPosition="top"
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <TimerIntroButton
              iconName={iconMap.sound}
              onPress={() => this.navigateToInfoScreen("painSounds")}
              label={t("painMeasurement.full.timer.painSounds")}
              labelPosition="bottom"
            />
          </View>
        </View>
      </View>
    );
  };

  renderFacialExpressionTimer = () => {
    const { t } = this.props.screenProps;

    if (this.values.animalType === "donkey") {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center"
          }}
        >
          <View style={{ justifyContent: "center", marginRight: 20 }}>
            <View style={{ marginBottom: 10 }}>
              <TimerIntroButton
                imagePath={imageMap.donkey.flehming}
                onPress={() => this.navigateToInfoScreen("flehming")}
                label={t("painMeasurement.head.timer.flehming")}
                labelPosition="top"
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <TimerIntroButton
                imagePath={imageMap.donkey.yawning}
                onPress={() => this.navigateToInfoScreen("yawning")}
                label={t("painMeasurement.head.timer.yawning")}
                labelPosition="bottom"
              />
            </View>
          </View>
          <View style={{ alignSelf: "center", justifyContent: "center" }}>
            <View style={{ marginBottom: 20 }}>
              <TimerIntroButton
                imagePath={imageMap.donkey.teethGrinding}
                onPress={() => this.navigateToInfoScreen("teethGrinding")}
                label={t("painMeasurement.head.timer.teethGrinding")}
                labelPosition="top"
              />
            </View>
            <CountdownCircle
              timeLeftInSeconds={120}
              onPress={() => this.navigateToInfoScreen("headCountdown")}
            />
            <View style={{ marginTop: 20 }}>
              <TimerIntroButton
                iconName={iconMap.sound}
                onPress={() => this.navigateToInfoScreen("moaning")}
                label={t("painMeasurement.head.timer.moaning")}
                labelPosition="bottom"
              />
            </View>
          </View>
          <View style={{ justifyContent: "center", marginLeft: 10 }}>
            <View style={{ marginTop: 20 }}>
              <TimerIntroButton
                imagePath={imageMap.donkey.smacking}
                onPress={() => this.navigateToInfoScreen("smacking")}
                label={t("painMeasurement.head.timer.smacking")}
                labelPosition="top"
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <TimerIntroButton
                imagePath={imageMap.donkey.headShaking}
                onPress={() => this.navigateToInfoScreen("headShaking")}
                label={t("painMeasurement.head.timer.headShaking")}
                labelPosition="bottom"
              />
            </View>
          </View>
        </View>
      );
    }

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center"
        }}
      >
        <View style={{ justifyContent: "center", marginRight: 20 }}>
          <View>
            <TimerIntroButton
              imagePath={imageMap.horse.flehming}
              onPress={() => this.navigateToInfoScreen("flehming")}
              label={t("painMeasurement.head.timer.flehming")}
              labelPosition="bottom"
            />
          </View>
        </View>
        <View style={{ alignSelf: "center", justifyContent: "center" }}>
          <View style={{ marginBottom: 20 }}>
            <TimerIntroButton
              imagePath={imageMap.horse.yawning}
              onPress={() => this.navigateToInfoScreen("yawning")}
              label={t("painMeasurement.head.timer.yawning")}
              labelPosition="top"
            />
          </View>
          <CountdownCircle
            timeLeftInSeconds={120}
            onPress={() => this.navigateToInfoScreen("headCountdown")}
          />
          <View style={{ marginTop: 20 }}>
            <TimerIntroButton
              imagePath={imageMap.horse.teethGrinding}
              onPress={() => this.navigateToInfoScreen("teethGrinding")}
              label={t("painMeasurement.head.timer.teethGrinding")}
              labelPosition="bottom"
            />
          </View>
        </View>
        <View style={{ justifyContent: "center", marginLeft: 20 }}>
          <View>
            <TimerIntroButton
              iconName={iconMap.sound}
              onPress={() => this.navigateToInfoScreen("moaning")}
              label={t("painMeasurement.head.timer.moaning")}
              labelPosition="bottom"
            />
          </View>
        </View>
      </View>
    );
  };

  render() {
    const { t } = this.props.screenProps;
    const editId = this.props.navigation.getParam("editId");
    const editType = this.props.navigation.getParam("editType");

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          backgroundColor: colors.egyptianBlue
        }}
      >
        <View style={{ flexGrow: 1 }}>
          <ProgressBar percent={25} />
          <View
            style={{
              minHeight: 70,
              paddingHorizontal: 10,
              paddingTop: 20,
              paddingBottom: 10,
              justifyContent: "center",
              backgroundColor: colors.egyptianBlue
            }}
          >
            <Text
              style={{
                ...fonts.style.h4,
                paddingBottom: 10,
                textAlign: "center",
                color: colors.white
              }}
            >
              {t("painMeasurement.misc.prepareCommand")}
            </Text>
            <Text
              style={{
                ...fonts.style.normal,
                textAlign: "center",
                color: colors.white
              }}
            >
              {t("painMeasurement.misc.clickTheIconToKnowMore")}
            </Text>
          </View>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              backgroundColor: colors.egyptianBlue
            }}
          >
            {isCompositeMeasurement(this.values)
              ? this.renderCompositeMeasurementTimer()
              : this.renderFacialExpressionTimer()}
          </ScrollView>
        </View>
        <Touchable
          onPress={() =>
            this.props.navigation.navigate("PainMeasurementTimer", {
              editId,
              editType
            })
          }
          style={{
            minHeight: 60,
            backgroundColor: colors.lima,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={{ ...fonts.style.cta, color: colors.white }}>
            {t("painMeasurement.misc.startMeasurement")}
          </Text>
        </Touchable>
      </View>
    );
  }
}

// The content is static so prevent any rerenders when it's not needed
// with onlyUpdateForKeys function
export default hoistStatics(
  compose(
    connect(),
    onlyUpdateForKeys([])
  )
)(PainMeasurementTimerIntro);
