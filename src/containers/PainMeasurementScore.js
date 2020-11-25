import React, { Component } from "react";
import { Text, View, ScrollView, KeyboardAvoidingView } from "react-native";
import { assoc, compose, isNil, omit, pickAll } from "ramda";
import { connect } from "react-redux";
import { hoistStatics } from "recompose";
import Touchable from "react-native-platform-touchable";

import Icon from "../components/Icon";
import TitleBar from "../components/TitleBar";
import ProgressBar from "../components/ProgressBar";
import MultiLineTextField from "../components/MultiLineTextField";

import { colors, fonts } from "../themes";

import { calculateScore } from "../services/painMeasurement";
import iconMap from "../constants/iconMap";

import {
  completeEventWithDataUpdate,
  completeRecurringEventWithData,
  addEvent,
} from "../actions/events";
import getId from "../services/idGenerator";

class PainMeasurementScore extends Component {
  static navigationOptions = ({ screenProps }) => {
    return {
      title: screenProps.t("painMeasurement.misc.headerTitle"),
      headerTitleStyle: {
        ...fonts.style.h4,
        fontWeight: "400",
      },
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

          const topLevelFields = [
            "animalId",
            "startDate",
            "category",
            "completed",
          ];
          const droppedRedundantFields = omit([
            "redirectPath",
            "animals",
            "forceAnimalSelection",
          ])(this.values);

          const data = compose(
            assoc("finalScore", calculateScore(droppedRedundantFields)),
            omit(topLevelFields)
          )(droppedRedundantFields);

          this.props.dispatch(
            completeRecurringEventWithData({
              payload: {
                eventId: +localId,
                startDate: +timeStamp,
                completed: true,
                endDate: this.props.navigation.state.params.endDate
                  ? this.props.navigation.state.params.endDate
                  : "",
                data,
              },
            })
          );
        } else {
          const topLevelFields = [
            "animalId",
            "startDate",
            "category",
            "completed",
          ];
          const droppedRedundantFields = omit([
            "redirectPath",
            "animals",
            "forceAnimalSelection",
          ])(this.values);

          const data = compose(
            assoc("finalScore", calculateScore(droppedRedundantFields)),
            omit(topLevelFields)
          )(droppedRedundantFields);

          this.props.dispatch(
            completeEventWithDataUpdate({
              payload: {
                eventId: editId,
                completed: true,
                type: editType,
                data,
              },
            })
          );
        }
      } else {
        const { alertDropdown, dispatch, t } = this.props.screenProps.form;
        const topLevelFields = [
          "animalId",
          "startDate",
          "category",
          "completed",
        ];

        if (this.values.animalId) {
          const droppedRedundantFields = omit([
            "redirectPath",
            "animals",
            "forceAnimalSelection",
          ])(this.values);
          let payload = pickAll(topLevelFields)(droppedRedundantFields);
          payload = {
            ...payload,
            localId: getId(),
            type: this.values.measurementType,
            data: compose(
              assoc("finalScore", calculateScore(droppedRedundantFields)),
              omit(topLevelFields)
            )(droppedRedundantFields),
          };

          alertDropdown("success", t("alertSuccess"), t("eventAddSuccessMsg"));

          let finalPayload = {
            ...payload,
            startDate: Date.now(),
            completed: true,
            category: "painMeasurement",
          };
          dispatch(
            addEvent({
              payload: [finalPayload],
              formHelpers: this.props.screenProps.form,
            })
          );
        }
        // this.form.submitForm();
      }
      return;
    }
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
        : t("painMeasurement.misc.donkey").toLowerCase();
    const isDonkey = values.animalType === "donkey";
    const thresholdScoreCompositeScale = 5;
    const thresholdScoreFacialScale = isDonkey ? 2 : 3;

    const score = calculateScore(values);

    let advice;

    if (values.measurementType === "composite") {
      if (score > thresholdScoreCompositeScale) {
        advice = t("painMeasurement.misc.adviceCompositeMeasurementPain", {
          animalType: translatedAnimalType,
          thresholdScore: thresholdScoreCompositeScale,
        });
      } else {
        advice = t("painMeasurement.misc.adviceCompositeMeasurementNoPain", {
          animalType: translatedAnimalType,
        });
      }
    }

    if (values.measurementType === "facialExpression") {
      if (score > thresholdScoreFacialScale) {
        advice = t(
          "painMeasurement.misc.adviceFacialExpressionMeasurementPain",
          {
            animalType: translatedAnimalType,
            thresholdScore: thresholdScoreFacialScale,
          }
        );
      } else {
        advice = t(
          "painMeasurement.misc.adviceFacialExpressionMeasurementNoPain",
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
