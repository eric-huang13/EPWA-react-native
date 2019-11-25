/* eslint-disable react/no-multi-comp */
import React, { Component, PureComponent } from "react";
import { HeaderBackButton } from "react-navigation-stack";
import { Alert, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { __, all, equals, compose, has, pick, not } from "ramda";
import { connect } from "react-redux";
import { hoistStatics } from "recompose";
import Touchable from "react-native-platform-touchable";
// import Reactotron from "reactotron-react-native";

import ProgressBar from "../components/ProgressBar";
import TitleBar from "../components/TitleBar";
import RadioSection from "../components/RadioSection";

const horseEarPhoto0 = "earScore0";
const horseEarPhoto1 = "earScore1";
const horseEarPhoto2 = "PAARD-gezichtsuitdrukking-oren-reactie-geluid-2";

const horseNostrilPhoto0 = "nostrilScore0";
const horseNostrilPhoto1 = "nostrilScore1";
const horseNostrilPhoto2 = "nostrilScore2";

const horseCornerMouthPhoto0 = "cornerMouthScore0";
const horseCornerMouthPhoto1 = "cornerMouthScore1";
const horseCornerMouthPhoto2 = "cornerMouthScore2";

const horseEyelidPhoto0 = "eyelidScore0";
const horseEyelidPhoto1 = "eyelidScore1";
const horseEyelidPhoto2 = "eyelidScore2";

const horseFocusPhoto0 = "focusScore0";
const horseFocusPhoto1 = "focusScore1";
const horseFocusPhoto2 = "focusScore2";

const horseHeadPhoto0 = "PAARD-gezichtsuitdrukking-beweging-hoofd-0";
const horseHeadPhoto1 = "PAARD-gezichtsuitdrukking-beweging-hoofd-1";
const horseHeadPhoto2 = "PAARD-gezichtsuitdrukking-beweging-hoofd-2";

const horseMuscleToneHeadPhoto0 = "muscleToneHeadScore0";
const horseMuscleToneHeadPhoto1 = "muscleToneHeadScore1";
const horseMuscleToneHeadPhoto2 = "muscleToneHeadScore2";

const donkeyEarPositionPhoto0 = "earPosition0";
const donkeyEarPositionPhoto1 = "earPosition2a";
const donkeyEarPositionPhoto2 = "earPosition2b";

const donkeyEyelidsPhoto0 = "eyelids0";
const donkeyEyelidsPhoto1 = "eyelids1";
const donkeyEyelidsPhoto2 = "eyelids2";

const donkeyFocusPhoto0 = "focus0";
const donkeyFocusPhoto1 = "focus1";
const donkeyFocusPhoto2 = "focus2";

const donkeyHeadPhoto0 = "head0";
const donkeyHeadPhoto1 = "head2a";
const donkeyHeadPhoto2 = "head2b";

const donkeyMouthCornersPhoto0 = "mouthCorners0";
const donkeyMouthCornersPhoto1 = "mouthCorners2";

const donkeyMuscleToneHeadPhoto0 = "muscleToneHead0";
const donkeyMuscleToneHeadPhoto1 = "muscleToneHead1";
const donkeyMuscleToneHeadPhoto2 = "muscleToneHead2";

const donkeyNostrilsPhoto0 = "nostrils0";
const donkeyNostrilsPhoto1 = "nostrils1";
const donkeyNostrilsPhoto2 = "nostrils2";

const donkeySoundResponsePhoto0 = "responseToAuditoryStimulus0";
const donkeySoundResponsePhoto1 = "responseToAuditoryStimulus1";
const donkeySoundResponsePhoto2 = "responseToAuditoryStimulus2";

const donkeySweatingPhoto0 = "sweatingBehindTheEars0";
const donkeySweatingPhoto1 = "sweatingBehindTheEars2";

import { colors, fonts } from "../themes";

class PainMeasurementObservationHead extends PureComponent {
  constructor(props) {
    super(props);

    const isDonkey = props.values.animalType === "donkey";

    this.fields = isDonkey ? this.getDonkeyFields() : this.getHorseFields();
  }

  get values() {
    return this.props.values;
  }

  getDonkeyFields = () => {
    const { t } = this.props;
    const path = "painMeasurement.head.observation.donkey";

    return [
      {
        name: "headScore",
        title: t(`${path}.head`),
        labels: t(`${path}.headOptions`, {
          returnObjects: true
        }),
        photos: [donkeyHeadPhoto0, donkeyHeadPhoto1, donkeyHeadPhoto2]
      },
      {
        name: "eyelidsScore",
        title: t(`${path}.eyelids`),
        labels: t(`${path}.eyelidsOptions`, {
          returnObjects: true
        }),
        photos: [donkeyEyelidsPhoto0, donkeyEyelidsPhoto1, donkeyEyelidsPhoto2]
      },
      {
        name: "focusScore",
        title: t(`${path}.focus`),
        labels: t(`${path}.focusOptions`, {
          returnObjects: true
        }),
        photos: [donkeyFocusPhoto0, donkeyFocusPhoto1, donkeyFocusPhoto2]
      },
      {
        name: "nostrilsScore",
        title: t(`${path}.nostrils`),
        labels: t(`${path}.nostrilsOptions`, {
          returnObjects: true
        }),
        photos: [
          donkeyNostrilsPhoto0,
          donkeyNostrilsPhoto1,
          donkeyNostrilsPhoto2
        ]
      },
      {
        name: "mouthCornersScore",
        title: t(`${path}.mouthCorners`),
        labels: t(`${path}.mouthCornersOptions`, {
          returnObjects: true
        }),
        photos: [donkeyMouthCornersPhoto0, donkeyMouthCornersPhoto1]
      },
      {
        name: "muscleToneHeadScore",
        title: t(`${path}.muscleToneHead`),
        labels: t(`${path}.muscleToneHeadOptions`, {
          returnObjects: true
        }),
        photos: [
          donkeyMuscleToneHeadPhoto0,
          donkeyMuscleToneHeadPhoto1,
          donkeyMuscleToneHeadPhoto2
        ]
      },
      {
        name: "sweatingBehindTheEarsScore",
        title: t(`${path}.sweatingBehindTheEars`),
        labels: t(`${path}.sweatingBehindTheEarsOptions`, {
          returnObjects: true
        }),
        photos: [donkeySweatingPhoto0, donkeySweatingPhoto1]
      },
      {
        name: "earPositionScore",
        title: t(`${path}.earPosition`),
        labels: t(`${path}.earPositionOptions`, {
          returnObjects: true
        }),
        photos: [
          donkeyEarPositionPhoto0,
          donkeyEarPositionPhoto1,
          donkeyEarPositionPhoto2
        ]
      },
      {
        name: "responseToAuditoryStimulusScore",
        title: t(`${path}.responseToAuditoryStimulus`),
        labels: t(`${path}.responseToAuditoryStimulusOptions`, {
          returnObjects: true
        }),
        photos: [
          donkeySoundResponsePhoto0,
          donkeySoundResponsePhoto1,
          donkeySoundResponsePhoto2
        ]
      }
    ];
  };

  getHorseFields = () => {
    const { t } = this.props;
    const path = "painMeasurement.head.observation";

    return [
      {
        name: "focusScore",
        title: t(`${path}.focus`),
        labels: t(`${path}.focusOptions`, {
          returnObjects: true
        }),
        photos: [horseFocusPhoto0, horseFocusPhoto1, horseFocusPhoto2]
      },
      {
        name: "headScore",
        title: t(`${path}.head`),
        labels: t(`${path}.headOptions`, {
          returnObjects: true
        }),
        photos: [horseHeadPhoto0, horseHeadPhoto1, horseHeadPhoto2]
      },
      {
        name: "muscleToneHeadScore",
        title: t(`${path}.muscleToneHead`),
        labels: t(`${path}.muscleToneHeadOptions`, {
          returnObjects: true
        }),
        photos: [
          horseMuscleToneHeadPhoto0,
          horseMuscleToneHeadPhoto1,
          horseMuscleToneHeadPhoto2
        ]
      },
      {
        name: "eyelidScore",
        title: t(`${path}.eyelids`),
        labels: t(`${path}.eyelidsOptions`, {
          returnObjects: true
        }),
        photos: [horseEyelidPhoto0, horseEyelidPhoto1, horseEyelidPhoto2]
      },
      {
        name: "nostrilScore",
        title: t(`${path}.nostrils`),
        labels: t(`${path}.nostrilsOptions`, {
          returnObjects: true
        }),
        photos: [horseNostrilPhoto0, horseNostrilPhoto1, horseNostrilPhoto2]
      },
      {
        name: "cornerMouthScore",
        title: t(`${path}.mouthCorners`),
        labels: t(`${path}.mouthCornersOptions`, {
          returnObjects: true
        }),
        photos: [
          horseCornerMouthPhoto0,
          horseCornerMouthPhoto1,
          horseCornerMouthPhoto2
        ]
      },
      {
        name: "earScore",
        title: t(`${path}.ears`),
        labels: t(`${path}.earsOptions`, {
          returnObjects: true
        }),
        photos: [horseEarPhoto0, horseEarPhoto1, horseEarPhoto2]
      }
    ];
  };

  areRequiredFieldsFilled = () => {
    const formHas = has(__, this.values);

    if (this.values.animalType === "donkey") {
      const standardSet = [
        formHas("headScore"),
        formHas("eyelidsScore"),
        formHas("focusScore"),
        formHas("nostrilsScore"),
        formHas("mouthCornersScore"),
        formHas("muscleToneHeadScore"),
        formHas("sweatingBehindTheEarsScore"),
        formHas("earPositionScore"),
        formHas("responseToAuditoryStimulusScore")
      ];

      return all(equals(true))(standardSet);
    }

    const standardSet = [
      formHas("focusScore"),
      formHas("headScore"),
      formHas("muscleToneHeadScore"),
      formHas("eyelidScore"),
      formHas("nostrilScore"),
      formHas("cornerMouthScore"),
      formHas("earScore")
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
          {this.fields.map(({ name, labels, title, photos }) => (
            <View key={name} style={{ backgroundColor: colors.white }}>
              <TitleBar
                borderBottomWidth={1}
                backgroundColor={colors.white}
                textAlign="left"
                color={colors.nero}
                paddingHorizontal={20}
              >
                {title}
              </TitleBar>
              {labels.map((label, index) => (
                <RadioSection
                  key={label}
                  active={values[name] === index}
                  onPress={() => setFieldValue(name, index)}
                  label={label}
                  imageSource={photos[index]}
                />
              ))}
            </View>
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
                alignItems: "center"
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
                    onPress: () => navigation.navigate("Diary")
                  }
                ]
              );
            }}
          >
            <Text>{screenProps.t("quit")}</Text>
          </TouchableOpacity>
        </View>
      )
    };
  };

  fields = [
    "headScore",
    "eyelidsScore",
    "focusScore",
    "nostrilsScore",
    "mouthCornersScore",
    "muscleToneHeadScore",
    "sweatingBehindTheEarsScore",
    "earPositionScore",
    "responseToAuditoryStimulusScore",
    "focusScore",
    "headScore",
    "muscleToneHeadScore",
    "eyelidScore",
    "nostrilScore",
    "cornerMouthScore",
    "earScore",
    "animalType"
  ];

  get form() {
    return this.props.screenProps.form;
  }

  constructor(props) {
    super(props);

    this.state = {
      values: pick(this.fields)(this.form.values)
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

  setValues = values => {
    const valuesToSave = pick(this.fields)(values);

    this.setState({
      values: valuesToSave
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
