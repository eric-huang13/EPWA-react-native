/* eslint-disable react/no-multi-comp */
import React, { Component, PureComponent } from "react";
import { HeaderBackButton } from "react-navigation-stack";
import { Alert, Text, View, ScrollView, TouchableOpacity, Platform } from "react-native";
import { __, all, equals, compose, has, pick, not } from "ramda";
import { connect } from "react-redux";
import { hoistStatics } from "recompose";
import Touchable from "react-native-platform-touchable";

import ProgressBar from "../../components/ProgressBar";
import TitleBar from "../../components/TitleBar";
import RadioSection from "../../components/RadioSection";

import { colors, fonts } from "../../themes";
import { getObservationFields } from "../../helpers/getObservationFields";
class PainMeasurementObservationHead extends PureComponent {
  constructor(props) {
    super(props);

    const isDonkey =
      props.values.animalType === "donkey" ||
      props.values.animalType === "mule";
    const path = isDonkey
      ? "painMeasurement.head.observation.donkey"
      : "painMeasurement.head.observation";
    this.fields = getObservationFields(isDonkey, props.t, path);
  }

  get values() {
    return this.props.values;
  }

  areRequiredFieldsFilled = () => {
    const formHas = has(__, this.values);

    if (
      this.values.animalType === "donkey" ||
      this.values.animalType === "mule"
    ) {
      const standardSet = [
        formHas("headScore"),
        formHas("eyelidsScore"),
        formHas("focusScore"),
        formHas("nostrilsScore"),
        formHas("chronicMouthCornersScore"),
        formHas("generalAppearanceScore"),
        formHas("bodyPostureScore"),
        formHas("weightDistributionScore"),
        formHas("weightShiftingOfFrontAndHindLimbsScore"),
        formHas("headCarriageScore"),
        formHas("musclesScore"),
        formHas("painReactionToPalpationOfTheBackScore"),
        formHas("painReactionToStandardizedFlexionOfFrontAndHindLimbsScore"),
        formHas("carrotappleTestScore"),
        formHas("movementScore"),
        formHas("responseToAuditoryStimulusScore"),
      ];

      return all(equals(true))(standardSet);
    }

    const standardSet = [
      formHas("focusScore"),
      formHas("headScore"),
      formHas("generalAppearanceScore"),
      formHas("bodyPostureScore"),
      formHas("weightDistributionScore"),
      formHas("weightShiftingOfFrontAndHindLimbsScore"),
      formHas("headCarriageScore"),
      formHas("musclesScore"),
      formHas("painReactionToPalpationOfTheBackScore"),
      formHas("painReactionToStandardizedFlexionOfFrontAndHindLimbsScore"),
      formHas("carrotappleTestScore"),
      formHas("movementScore"),
      formHas("eyelidScore"),
      formHas("nostrilScore"),
      formHas("chronicMouthCornersScore"),
      formHas("earScore"),
    ];

    return all(equals(true))(standardSet);
  };

  onSubmit = () => {
    const editId = this.props.navigation.getParam("editId");
    const editType = this.props.navigation.getParam("editType");
    this.props.navigate("PainMeasurementScore", { editId, editType });
  };

  render() {
    const { values, setFieldValue, t } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <ProgressBar percent={75} />
        <ScrollView>
          <TitleBar>{t("painMeasurement.misc.selectAnswer")}</TitleBar>
          {this.fields.map(({ name, labels, title, photos, showDivision }) => (
            <>
              {showDivision && (
                <TitleBar>{t("painMeasurement.misc.selectAnswer")}</TitleBar>
              )}
              <View key={name} style={{ backgroundColor: colors.white }}>
                <TitleBar
                  borderBottomWidth={1}
                  backgroundColor={colors.white}
                  textAlign='left'
                  color={colors.nero}
                  paddingHorizontal={20}
                >
                  {title}
                </TitleBar>
                {Array.from(labels).map((label, index) => (
                  <RadioSection
                    key={index}
                    active={values[name] === index}
                    onPress={() => setFieldValue(name, index)}
                    label={label}
                    imageSource={photos[index]}
                  />
                ))}
              </View>
            </>
          ))}
          <View style={{ width: "100%" }}>
            <Touchable
              disabled={!this.areRequiredFieldsFilled()}
              onPress={this.onSubmit}
              style={{
                flex: 1,
                minHeight: 60,
                backgroundColor: this.areRequiredFieldsFilled()
                  ? colors.lima
                  : colors.lightGrey,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ ...fonts.style.cta, color: colors.white }}>
                {t("painMeasurement.misc.seeResult")}
              </Text>
            </Touchable>
          </View>
        </ScrollView>
      </View>
    );
  }
}

class PainMeasurementObservationHeadContainer extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      title: screenProps.t("painMeasurement.misc.chronicHeaderTitle"),
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
      headerRight: (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 30, right: 30 }}
            style={{ marginRight: 30 }}
            onPress={() => {
              const { t } = screenProps;
              Alert.alert(
                t("painMeasurementQuitTitle"),
                t("painMeasurementQuitMessage"),
                [
                  { text: t("cancel"), style: "cancel" },
                  {
                    text: t("quit"),
                    onPress: () => navigation.navigate("Diary"),
                  },
                ]
              );
            }}
          >
            <Text>{screenProps.t("quit")}</Text>
          </TouchableOpacity>
        </View>
      ),
    };
  };

  fields = [
    "headScore",
    "eyelidsScore",
    "focusScore",
    "nostrilsScore",
    "chronicMouthCornersScore",
    "generalAppearanceScore",
    "bodyPostureScore",
    "weightDistributionScore",
    "weightShiftingOfFrontAndHindLimbsScore",
    "headCarriageScore",
    "musclesScore",
    "painReactionToPalpationOfTheBackScore",
    "painReactionToStandardizedFlexionOfFrontAndHindLimbsScore",
    "carrotappleTestScore",
    "movementScore",
    "responseToAuditoryStimulusScore",
    "focusScore",
    "headScore",
    "eyelidScore",
    "nostrilScore",
    "earScore",
    "animalType",
  ];

  get form() {
    return this.props.screenProps.form;
  }

  constructor(props) {
    super(props);

    this.state = {
      values: pick(this.fields)(this.form.values),
    };
  }

  // Cache derived data so that reference to props will be kept and PureComponent will not rerender
  componentWillReceiveProps(nextProps) {
    const oldValues = pick(this.fields, this.form.values);
    const newValues = pick(this.fields, nextProps.screenProps.form.values);

    const shouldUpdate = not(equals(oldValues, newValues));
    if (shouldUpdate) {
      this.setValues(newValues);
    }
  }

  setValues = (values) => {
    const valuesToSave = pick(this.fields)(values);

    this.setState({
      values: valuesToSave,
    });
  };

  render() {
    const { t } = this.props.screenProps;
    const { navigate } = this.props.navigation;
    const { setFieldValue } = this.form;

    return (
      <PainMeasurementObservationHead
        values={this.state.values}
        setFieldValue={setFieldValue}
        t={t}
        navigate={navigate}
        {...this.props}
      />
    );
  }
}

export default hoistStatics(compose(connect()))(
  PainMeasurementObservationHeadContainer
);
