import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { assoc, compose, isNil, omit } from "ramda";
import { connect } from "react-redux";
import { hoistStatics } from "recompose";
import Touchable from "react-native-platform-touchable";

import Icon from "../../components/Icon";
import TitleBar from "../../components/TitleBar";
import ProgressBar from "../../components/ProgressBar";
import MultiLineTextField from "../../components/MultiLineTextField";

import { colors, fonts } from "../../themes";

import { calculateScore } from "../../services/chronicPainMeasurement";
import iconMap from "../../constants/iconMap";

import { completeEvent, completeRecurringEvent } from "../../actions/events";
class PainMeasurementScore extends Component {
  static navigationOptions = ({ screenProps }) => {
    return {
      title: screenProps.t("painMeasurement.misc.chronicHeaderTitle"),
      headerTitleStyle: {
        ...fonts.style.h4,
        fontWeight: "400",
      },
      headerStyle:
        Platform.OS === "ios"
          ? {
              marginTop: 20,
              paddingBottom: 10,
            }
          : {},
      headerLeft: null,
    };
  };

  state = {
    note: null,
  };

  get form() {
    return this.props.screenProps.form;
  }

  get values() {
    return this.form.values;
  }

  onExitButtonPressed = () => {
    const isLoggedIn = this.values.animalId;

    if (this.state.note) {
      this.form.setFieldValue("note", this.state.note);
    }

    if (isLoggedIn) {
      if (
        this.props.navigation.state.params &&
        this.props.navigation.state.params.editId
      ) {
        const { editId, editType } = this.props.navigation.state.params;
        if (typeof editId === "string" && editId.includes("_")) {
          const [localId, timeStamp] = editId.split("_");
          this.props.dispatch(
            completeRecurringEvent({
              payload: {
                eventId: +localId,
                startDate: +timeStamp,
                endDate: this.props.navigation.state.params.endDate
                  ? this.props.navigation.state.params.endDate
                  : "",
              },
            })
          );
        } else {
          this.props.dispatch(
            completeEvent({
              payload: { eventId: editId, completed: true, type: editType },
            })
          );
        }
      }
      this.form.submitForm();
      return;
    }

    this.props.navigation.navigate("Diary");
  };

  renderExitButton = () => (
    <View style={{ width: "100%" }}>
      <Touchable
        onPress={this.onExitButtonPressed}
        style={{
          flex: 1,
          minHeight: 60,
          backgroundColor: colors.lima,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ ...fonts.style.cta, color: colors.white }}>
          {this.props.screenProps.form.values.animalId
            ? this.props.screenProps.t("painMeasurement.misc.goToDiary")
            : this.props.screenProps.t("finish")}
        </Text>
      </Touchable>
    </View>
  );

  render() {
    const { t } = this.props.screenProps;
    const { values } = this.form;
    const translatedAnimalType =
      values.animalType === "horse"
        ? t("painMeasurement.misc.horse").toLowerCase()
        : values.animalType === "donkey"
        ? t("painMeasurement.misc.donkey").toLowerCase()
        : t("painMeasurement.misc.mule").toLowerCase();
    const isDonkey =
      values.animalType === "donkey" || values.animalType === "mule";
    const thresholdScoreFacialScale = isDonkey ? 2 : 3;

    const score = calculateScore(values);

    let advice;

    if (values.measurementType === "facialExpression") {
      if (score > thresholdScoreFacialScale) {
        advice = t(
          "painMeasurement.misc.adviceCompositeChronicMeasurementPain",
          {
            animalType: translatedAnimalType,
            thresholdScore: thresholdScoreFacialScale,
          }
        );
      } else {
        advice = t(
          "painMeasurement.misc.adviceCompositeChronicMeasurementNoPain",
          { animalType: translatedAnimalType }
        );
      }
    }

    return (
      <KeyboardAvoidingView behavior='position'>
        <View style={{ backgroundColor: colors.white }}>
          <ProgressBar percent={100} />
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
            }}
          >
            <View
              style={[
                {
                  minHeight: 70,
                  alignItems: "center",
                  paddingHorizontal: 20,
                  borderBottomColor: colors.darkFilter,
                  borderBottomWidth: 1,
                  flexDirection: "row",
                },
              ]}
            >
              <Icon name={iconMap.measurement} size={30} color={colors.nero} />
              <Text style={{ marginLeft: 20, ...fonts.style.h4, flexGrow: 1 }}>
                {t("painMeasurement.misc.score")}
              </Text>
              <Text style={{ ...fonts.style.h1, color: colors.egyptianBlue }}>
                {score}
              </Text>
            </View>
            <TitleBar
              borderBottomWidth={1}
              backgroundColor={colors.white}
              textAlign='left'
              color={colors.nero}
              paddingHorizontal={20}
            >
              {t("painMeasurement.misc.ourAdvice")}
            </TitleBar>
            <View
              style={{
                borderBottomColor: colors.darkFilter,
                borderBottomWidth: 1,
              }}
            >
              <Text
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                  ...fonts.style.normal,
                  lineHeight: 20,
                }}
              >
                {advice}
              </Text>
            </View>
            <TitleBar
              borderBottomWidth={1}
              backgroundColor={colors.white}
              textAlign='left'
              color={colors.nero}
              paddingHorizontal={20}
            >
              {t("notes")}
            </TitleBar>
            <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
              <MultiLineTextField
                label=''
                value={values.note}
                onChangeText={(value) => this.setState({ note: value })}
                maxLength={280}
              />
            </View>
            {this.renderExitButton()}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default hoistStatics(compose(connect()))(PainMeasurementScore);
