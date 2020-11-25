/* eslint-disable react/no-multi-comp */
import React, { Component, PureComponent } from "react";
import { HeaderBackButton } from "react-navigation-stack";
import { Text, View, ScrollView } from "react-native";
import { __, all, equals, has, compose, pick, not } from "ramda";
import { connect } from "react-redux";
import { hoistStatics } from "recompose";
import Touchable from "react-native-platform-touchable";

import ProgressBar from "../components/ProgressBar";

import { colors, fonts } from "../themes";
import TitleBar from "../components/TitleBar";
import RadioSection from "../components/RadioSection";

class PainMeasurementObservationVet extends PureComponent {
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
    const vetTranslationPath = "painMeasurement.full.vet.donkey";

    return [
      {
        name: "respiratoryRateScore",
        category: "vet",
        title: t(`${vetTranslationPath}.respiratoryRate`),
        labels: t(`${vetTranslationPath}.respiratoryRateOptions`, {
          returnObjects: true
        })
      },
      {
        name: "heartRateScore",
        category: "vet",
        title: t(`${vetTranslationPath}.heartRate`),
        labels: t(`${vetTranslationPath}.heartRateOptions`, {
          returnObjects: true
        })
      },
      {
        name: "digestiveSoundsScore",
        category: "vet",
        title: t(`${vetTranslationPath}.digestiveSounds`),
        labels: t(`${vetTranslationPath}.digestiveSoundsOptions`, {
          returnObjects: true
        })
      },
      {
        name: "rectalTemperatureScore",
        category: "vet",
        title: t(`${vetTranslationPath}.rectalTemperature`),
        labels: t(`${vetTranslationPath}.rectalTemperatureOptions`, {
          returnObjects: true
        })
      }
    ];
  };

  getHorseFields = () => {
    const { t } = this.props;
    const vetTranslationPath = "painMeasurement.full.vet";

    return [
      {
        name: "respiratoryRateScore",
        category: "vet",
        title: t(`${vetTranslationPath}.respiratoryRate`),
        labels: t(`${vetTranslationPath}.respiratoryRateOptions`, {
          returnObjects: true
        })
      },
      {
        name: "heartRateScore",
        category: "vet",
        title: t(`${vetTranslationPath}.heartRate`),
        labels: t(`${vetTranslationPath}.heartRateOptions`, {
          returnObjects: true
        })
      },
      {
        name: "digestiveSoundsScore",
        category: "vet",
        title: t(`${vetTranslationPath}.digestiveSounds`),
        labels: t(`${vetTranslationPath}.digestiveSoundsOptions`, {
          returnObjects: true
        })
      },
      {
        name: "rectalTemperatureScore",
        category: "vet",
        title: t(`${vetTranslationPath}.rectalTemperature`),
        labels: t(`${vetTranslationPath}.rectalTemperatureOptions`, {
          returnObjects: true
        })
      }
    ];
  };

  areRequiredFieldsFilled = () => {
    const formHas = has(__, this.values);

    if (this.values.animalType === "donkey") {
      const vetSet = [
        formHas("respiratoryRateScore"),
        formHas("heartRateScore"),
        formHas("digestiveSoundsScore"),
        formHas("rectalTemperatureScore")
      ];

      return all(equals(true))(vetSet);
    }

    const vetSet = [
      formHas("respiratoryRateScore"),
      formHas("heartRateScore"),
      formHas("digestiveSoundsScore"),
      formHas("rectalTemperatureScore")
    ];

    return all(equals(true))(vetSet);
  };

  onSubmit = () => {
    const editId = this.props.navigation.getParam("editId");
    const editType = this.props.navigation.getParam("editType");
    this.props.navigate("PainMeasurementScore", {
      editId,
      editType
    });
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
        <ProgressBar percent={90} />
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
                {t("painMeasurement.misc.seeResult")}
              </Text>
            </Touchable>
          </View>
        </ScrollView>
      </View>
    );
  }
}

class PainMeasurementObservationVetContainer extends Component {
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

  fields = [
    "respiratoryRateScore",
    "heartRateScore",
    "digestiveSoundsScore",
    "rectalTemperatureScore",
    "respiratoryRateScore",
    "heartRateScore",
    "digestiveSoundsScore",
    "rectalTemperatureScore",
    "animalType",
    "isVet"
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
    const { navigation } = this.props;
    const { setFieldValue } = this.form;

    return (
      <PainMeasurementObservationVet
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
  PainMeasurementObservationVetContainer
);
