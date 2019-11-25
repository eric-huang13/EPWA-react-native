import React, { Component } from "react";
import { createStackNavigator } from "react-navigation-stack";
import { connect } from "react-redux";
import { assoc, compose, map, omit, pickAll, toPairs, isNil } from "ramda";
import { translate } from "react-i18next";
import { withFormik } from "formik";
import { getTime } from "date-fns";
import { hoistStatics } from "recompose";

import { calculateScore } from "../services/painMeasurement";
import { addEvent, editEvent } from "../actions/events";
import getId from "../services/idGenerator";

import { defaultHeaderStyling } from "../navigation";
import PainMeasurementStartScreen from "./PainMeasurementStart";
import PainMeasurementStartInfoScreen from "./PainMeasurementStartInfo";
import PainMeasurementIntroScreen from "./PainMeasurementIntro";
import PainMeasurementScoreScreen from "./PainMeasurementScore";
import PainMeasurementTimerIntroScreen from "./PainMeasurementTimerIntro";
import PainMeasurementTimerInfoScreen from "./PainMeasurementTimerInfo";
import PainMeasurementTimerScreen from "./PainMeasurementTimer";
import PainMeasurementObservationFullScreen from "./PainMeasurementObservationFull";
import PainMeasurementObservationVetScreen from "./PainMeasurementVet";
import PainMeasurementObservationHeadScreen from "./PainMeasurementObservationHead";
import PainMeasurementLoginWarningScreen from "./PainMeasurementLoginWarning";
import withAlertDropdown from "../components/withAlertDropdown";

// import Reactotron from "reactotron-react-native";

const PainMeasurementNavigator = createStackNavigator(
  {
    PainMeasurementIntro: PainMeasurementIntroScreen,
    PainMeasurementLoginWarning: PainMeasurementLoginWarningScreen,
    PainMeasurementStart: PainMeasurementStartScreen,
    PainMeasurementStartInfo: PainMeasurementStartInfoScreen,
    PainMeasurementTimerIntro: PainMeasurementTimerIntroScreen,
    PainMeasurementTimerInfo: PainMeasurementTimerInfoScreen,
    PainMeasurementTimer: PainMeasurementTimerScreen,
    PainMeasurementObservationFull: PainMeasurementObservationFullScreen,
    PainMeasurementObservationVet: PainMeasurementObservationVetScreen,
    PainMeasurementObservationHead: PainMeasurementObservationHeadScreen,
    PainMeasurementScore: PainMeasurementScoreScreen
  },
  {
    initialRouteName: "PainMeasurementIntro",
    defautNavigationOptions: {
      ...defaultHeaderStyling
    }
  }
);

class painMeasurement extends Component {
  static router = PainMeasurementNavigator.router;
  static navigationOptions = {
    header: null
  };

  setupEvent = () => {
    const { navigation } = this.props;
    const result = {};

    const redirectPath = navigation.getParam("redirectPath");
    const animal = navigation.getParam("animal");
    // const editId = this.props.navigation.getParam("editId");
    // const editType = this.props.navigation.getParam("editType");

    if (redirectPath) {
      result.redirectPath = redirectPath;
    }

    if (animal) {
      result.animalId = animal.id;
    }
    if (animal) {
      result.animalType = animal.type;
    }

    result.completed = true;
    result.startDate = getTime(new Date());
    result.category = "painMeasurement";
    result.isVet = false;

    return result;
  };

  componentDidMount() {
    const initialValues = this.setupEvent();
    const { navigation, setFieldValue } = this.props;
    const animals = navigation.getParam("animals") || [];

    if (animals.length) {
      setFieldValue("animalId", animals[0].id);
      setFieldValue("animalType", animals[0].type);
    }

    compose(
      map(pair => setFieldValue(pair[0], pair[1])),
      toPairs
    )(initialValues);

    setFieldValue(
      "forceAnimalSelection",
      navigation.getParam("forceAnimalSelection") || false
    );
    setFieldValue("animals", animals);
  }

  render() {
    const { i18n, t } = this.props;
    const formProps = pickAll([
      "setFieldValue",
      "setValues",
      "values",
      "resetForm",
      "submitForm"
    ])(this.props);

    // After resetting the form, for some reason values are undefined
    // Have a fallback for it so that mounted screens that depend on values being an object will not crash
    if (!formProps.values) {
      formProps.values = {};
    }

    const screenProps = {
      form: {
        ...formProps
      },
      isUserLoggedIn: this.props.isUserLoggedIn,
      t,
      i18n
    };

    return (
      <PainMeasurementNavigator
        navigation={this.props.navigation}
        screenProps={screenProps}
      />
    );
  }
}

const onSubmit = (values, formikBag) => {
  const { alertDropdown, dispatch, t } = formikBag.props;
  const editId = formikBag.props.navigation.getParam("editId");

  const topLevelFields = ["animalId", "startDate", "category", "completed"];

  /*
    We check if the user is logged in.
    We do it by checking animalID.
    Which will be defined only when user is logged in and
    navigate to painMeasurement from Diary screen.
  */
  if (values.animalId) {
    const droppedRedundantFields = omit([
      "redirectPath",
      "animals",
      "forceAnimalSelection"
    ])(values);
    let payload = pickAll(topLevelFields)(droppedRedundantFields);
    payload = {
      ...payload,
      localId: getId(),
      type: values.measurementType,
      data: compose(
        assoc("finalScore", calculateScore(droppedRedundantFields)),
        omit(topLevelFields)
      )(droppedRedundantFields)
    };

    alertDropdown("success", t("alertSuccess"), t("eventAddSuccessMsg"));

    if (isNil(editId)) {
      dispatch(
        addEvent({
          payload: [payload],
          formHelpers: formikBag
        })
      );
    } else {
      delete payload.localId;
      payload.id = editId;
      dispatch(
        editEvent({
          payload: payload,
          formHelpers: formikBag
        })
      );
    }
  }
};

const formikOptions = {
  handleSubmit: onSubmit,
  mapPropsToValues: () => {}
};

const mapStateToProps = state => ({
  isUserLoggedIn: Boolean(state.auth.accessToken)
});

export default hoistStatics(
  compose(
    connect(mapStateToProps),
    translate("root"),
    withAlertDropdown,
    withFormik(formikOptions)
  )
)(painMeasurement);
