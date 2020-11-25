/* eslint-disable react/no-multi-comp */
import React, { Component, PureComponent } from "react";
import { HeaderBackButton } from "react-navigation-stack";
import { Alert, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { __, all, equals, has, compose, pick, not } from "ramda";
import { connect } from "react-redux";
import { hoistStatics } from "recompose";
import Touchable from "react-native-platform-touchable";

import ProgressBar from "../components/ProgressBar";

import { colors, fonts } from "../themes";
import TitleBar from "../components/TitleBar";
import RadioSection from "../components/RadioSection";

class PainMeasurementObservationFull extends PureComponent {
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
    const observationTranslationPath =
      "painMeasurement.full.observation.donkey";
    const interactionTranslationPath =
      "painMeasurement.full.interaction.donkey";

    return [
      {
        name: "layingDownRollingScore",
        title: t(`${observationTranslationPath}.layingDownRolling`),
        category: "observation",
        labels: t(`${observationTranslationPath}.layingDownRollingOptions`, {
          returnObjects: true
        })
      },
      {
        name: "overallAppearanceScore",
        title: t(`${observationTranslationPath}.overallAppearance`),
        category: "observation",
        labels: t(`${observationTranslationPath}.overallAppearanceOptions`, {
          returnObjects: true
        })
      },
      {
        name: "earPositionScore",
        title: t(`${observationTranslationPath}.earPosition`),
        category: "observation",
        labels: t(`${observationTranslationPath}.earPositionOptions`, {
          returnObjects: true
        })
      },
      {
        name: "postureScore",
        title: t(`${observationTranslationPath}.posture`),
        category: "observation",
        labels: t(`${observationTranslationPath}.postureOptions`, {
          returnObjects: true
        })
      },
      {
        name: "weightDistributionScore",
        category: "observation",
        title: t(`${observationTranslationPath}.weightDistribution`),
        labels: t(`${observationTranslationPath}.weightDistributionOptions`, {
          returnObjects: true
        })
      },
      {
        name: "headCarriageScore",
        category: "observation",
        title: t(`${observationTranslationPath}.headCarriage`),
        labels: t(`${observationTranslationPath}.headCarriageOptions`, {
          returnObjects: true
        })
      },
      {
        name: "sweatingScore",
        category: "observation",
        title: t(`${observationTranslationPath}.sweating`),
        labels: t(`${observationTranslationPath}.sweatingOptions`, {
          returnObjects: true
        })
      },
      {
        name: "eatingScore",
        category: "observation",
        title: t(`${observationTranslationPath}.eating`),
        labels: t(`${observationTranslationPath}.eatingOptions`, {
          returnObjects: true
        })
      },
      {
        name: "changesInBehaviourScore",
        category: "observation",
        title: t(`${observationTranslationPath}.changesInBehaviour`),
        labels: t(`${observationTranslationPath}.changesInBehaviourOptions`, {
          returnObjects: true
        })
      },
      {
        name: "reactionToObserverScore",
        category: "observation",
        title: t(`${observationTranslationPath}.reactionToObserver`),
        labels: t(`${observationTranslationPath}.reactionToObserverOptions`, {
          returnObjects: true
        })
      },
      {
        name: "reactionToPalpationScore",
        category: "interaction",
        title: t(`${interactionTranslationPath}.reactionToPalpation`),
        labels: t(`${interactionTranslationPath}.reactionToPalpationOptions`, {
          returnObjects: true
        })
      },
      {
        name: "movementScore",
        category: "interaction",
        title: t(`${interactionTranslationPath}.movement`),
        labels: t(`${interactionTranslationPath}.movementOptions`, {
          returnObjects: true
        })
      }
    ];
  };

  getHorseFields = () => {
    const { t } = this.props;
    const observationTranslationPath = "painMeasurement.full.observation";
    const interactionTranslationPath = "painMeasurement.full.interaction";

    return [
      {
        name: "behaviourPostureScore",
        title: t(`${observationTranslationPath}.behaviour`),
        category: "observation",
        labels: t(`${observationTranslationPath}.behaviourOptions`, {
          returnObjects: true
        })
      },
      {
        name: "overallAppearanceScore",
        title: t(`${observationTranslationPath}.overallAppearance`),
        category: "observation",
        labels: t(`${observationTranslationPath}.overallAppearanceOptions`, {
          returnObjects: true
        })
      },
      {
        name: "sweatingScore",
        title: t(`${observationTranslationPath}.sweating`),
        category: "observation",
        labels: t(`${observationTranslationPath}.sweatingOptions`, {
          returnObjects: true
        })
      },
      {
        name: "reactionToPalpationScore",
        title: t(`${interactionTranslationPath}.reactionToPalpation`),
        category: "interaction",
        labels: t(`${interactionTranslationPath}.reactionToPalpationOptions`, {
          returnObjects: true
        })
      }
    ];
  };

  areRequiredFieldsFilled = () => {
    const formHas = has(__, this.values);

    if (this.values.animalType === "donkey") {
      const standardSet = [
        formHas("layingDownRollingScore"),
        formHas("overallAppearanceScore"),
        formHas("earPositionScore"),
        formHas("postureScore"),
        formHas("weightDistributionScore"),
        formHas("headCarriageScore"),
        formHas("sweatingScore"),
        formHas("eatingScore"),
        formHas("changesInBehaviourScore"),
        formHas("reactionToObserverScore"),
        formHas("reactionToPalpationScore"),
        formHas("movementScore")
      ];

      return all(equals(true))(standardSet);
    }

    const standardSet = [
      formHas("behaviourPostureScore"),
      formHas("overallAppearanceScore"),
      formHas("sweatingScore"),
      formHas("reactionToPalpationScore")
    ];

    return all(equals(true))(standardSet);
  };

  onSubmit = () => {
    const editId = this.props.navigation.getParam("editId");
    const editType = this.props.navigation.getParam("editType");
    if (this.values.isVet) {
      this.props.navigate("PainMeasurementObservationVet", {
        editId,
        editType
      });
    } else {
      this.props.navigate("PainMeasurementScore", {
        editId,
        editType
      });
    }
  };

  renderFields = ({ name, category, labels, title }) => {
    if (!this.values.isVet && category === "vet") {
      return null;
    }

    return (
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
            active={this.values[name] === index}
            onPress={() => this.props.setFieldValue(name, index)}
            label={label}
          />
        ))}
      </View>
    );
  };

  render() {
    const { t } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <ProgressBar percent={75} />
        <ScrollView>
          <TitleBar>{t("painMeasurement.misc.selectAnswer")}</TitleBar>
          {this.fields.map(this.renderFields)}
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
                {this.values.isVet
                  ? t("painMeasurement.misc.nextStep")
                  : t("painMeasurement.misc.seeResult")}
              </Text>
            </Touchable>
          </View>
        </ScrollView>
      </View>
    );
  }
}

class PainMeasurementObservationFullContainer extends Component {
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
    "layingDownRollingScore",
    "overallAppearanceScore",
    "earPositionScore",
    "postureScore",
    "weightDistributionScore",
    "headCarriageScore",
    "sweatingScore",
    "eatingScore",
    "changesInBehaviourScore",
    "reactionToObserverScore",
    "reactionToPalpationScore",
    "movementScore",
    "behaviourPostureScore",
    "overallAppearanceScore",
    "sweatingScore",
    "reactionToPalpationScore",
    "isVet",
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
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const { setFieldValue } = this.form;

    return (
      <PainMeasurementObservationFull
        values={this.state.values}
        setFieldValue={setFieldValue}
        t={t}
        navigate={navigate}
        navigation={navigation}
      />
    );
  }
}

export default hoistStatics(compose(connect()))(
  PainMeasurementObservationFullContainer
);
