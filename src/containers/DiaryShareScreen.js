import React, { Component } from "react";
import T from "prop-types";
import {
  ScrollView,
  TouchableOpacity,
  View,
  TextInput,
  Text,
  Alert,
  Share
} from "react-native";
import { HeaderBackButton } from "react-navigation-stack";
import { FieldArray, withFormik, Field } from "formik";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { hoistStatics } from "recompose";
import * as yup from "yup";
import {
  format,
  parse,
  getHours,
  getMinutes,
  getTime,
  isValid
} from "date-fns";
import { get } from "lodash";
import {
  __,
  compose,
  mapObjIndexed,
  values as ramdaValues,
  isNil
} from "ramda";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import getId from "../services/idGenerator";

import s from "./styles/DiaryExerciseFormStyles";

import Button from "../components/Button";
import DatePicker from "../components/DatePicker";
import RadioSection from "../components/RadioSection";
// import Field from "../components/Field";
import FieldLabel from "../components/FieldLabel";
import Icon from "../components/Icon";
import PlusSection from "../components/PlusSection";
import Select from "../components/Select";
import SelectButton from "../components/SelectButton";
import SubmitHeaderButton from "../components/SubmitHeaderButton";
import withAlert from "../components/withAlert";
import withAlertDropdown from "../components/withAlertDropdown";
import withExitPrompt from "../components/withExitPrompt";
import RecurringForm from "../components/RecurringForm";

import { addEvent, editEvent, deleteEvent } from "../actions/events";
import { eventCategories, eventTypes } from "../constants";
import {
  dateEventProps,
  dateEventValidation
} from "../constants/validationTypes";

import { colors, fonts } from "../themes";

import {
  setHours,
  setMinutes,
  setSecondsToZero,
  setMillisecondsToZero
} from "../services/date";

import Reactotron from "reactotron-react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import iconMap from "../constants/iconMap";
import nlLocale from "date-fns/locale/nl";

const validationSchema = yup.object().shape({
  startDate: yup
    .number()
    .min(9)
    .max(11)
    .required(),
  endDate: yup
    .number()
    .min(9)
    .max(11)
    .required(),
  animalId: yup.number().required(),
  pain: yup.bool(),
  exercise: yup.bool(),
  feeding: yup.bool(),
  housing: yup.bool(),
  medical: yup.bool()
});

const CheckBoxField = ({ label, formikKey, values, setFieldValue }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setFieldValue(formikKey, !values[formikKey]);
      }}
    >
      <View
        style={{
          backgroundColor: values[formikKey] ? colors.lima : colors.white,
          minHeight: 55,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          borderBottomColor: colors.whiteSmoke,
          borderBottomWidth: 1
        }}
      >
        <View
          style={{
            width: 50,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {values[formikKey] ? <ActiveIcon /> : <InactiveIcon />}
        </View>
        <Text>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const ActiveIcon = () => (
  <View
    style={{
      width: 36,
      height: 36,
      borderWidth: 1,
      borderRadius: 36 / 2,
      borderColor: colors.white,
      marginRight: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.white
    }}
  >
    <Icon name={iconMap.check} size={16} color={colors.lima} />
  </View>
);

const InactiveIcon = () => (
  <View
    style={{
      width: 22,
      height: 22,
      borderWidth: 1,
      borderRadius: 11,
      borderColor: colors.nero,
      marginRight: 20,
      backgroundColor: colors.transparent
    }}
  />
);

class DiaryShareEventsForm extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t.t("headerBar.diary"),
    headerLeft: (
      <HeaderBackButton
        title={screenProps.t.t("headerBar.diary")}
        tintColor={colors.nero}
        onPress={navigation.getParam("onBackPress")}
      />
    )
  });

  static getInitialEventValue(animalId) {
    return {
      animalId,
      pain: false,
      exercise: false,
      feeding: false,
      housing: false,
      medical: false,
      startDate: null,
      endDate: null
    };
  }

  formatDateField = timestamp => {
    return isValid(parse(timestamp)) && this.props.i18n.language === "nl"
      ? format(timestamp, "DD MMMM, YYYY", { locale: nlLocale })
      : format(timestamp, "MMMM DD, YYYY");
  };

  parseDateField = dateInstance => {
    // We have to combine picked time with date picked in Diary Screen
    // const currentDate = this.props.navigation.getParam("currentDate");
    const pickedTime = {
      hours: getHours(dateInstance),
      minutes: getMinutes(dateInstance)
    };

    return compose(
      getTime,
      setMillisecondsToZero,
      setSecondsToZero,
      setMinutes(__, pickedTime.minutes),
      setHours(__, pickedTime.hours),
      parse
    )(dateInstance);
  };

  onShare = async () => {
    const { t } = this.props;
    const uri = "www.epwa.com";
    try {
      const result = await Share.share({
        message: t("shareAppContentAnimalProfile"),
        url: uri
      });

      // if (result.action === Share.sharedAction) {
      //   if (result.activityType) {
      //     // shared with activity type of result.activityType
      //   } else {
      //     // shared
      //   }
      // } else if (result.action === Share.dismissedAction) {
      //   // dismissed
      // }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  render() {
    const { t, i18n, setFieldValue, values, currentDate } = this.props;
    Reactotron.log("render", values);
    let ref1;
    let ref2;
    return (
      <View style={s.screenContainer}>
        <ScrollView contentContainerStyle={s.scrollContainer}>
          <View style={{ marginTop: 20 }}>
            <CheckBoxField
              label={t("categories.painMeasurement")}
              formikKey={"pain"}
              values={values}
              setFieldValue={setFieldValue}
            />
            <CheckBoxField
              label={t("categories.exercise")}
              values={values}
              formikKey={"exercise"}
              setFieldValue={setFieldValue}
            />
            <CheckBoxField
              label={t("categories.feeding")}
              values={values}
              formikKey={"feeding"}
              setFieldValue={setFieldValue}
            />
            <CheckBoxField
              label={t("categories.housing")}
              values={values}
              formikKey={"housing"}
              setFieldValue={setFieldValue}
            />
            <CheckBoxField
              label={t("categories.medication")}
              values={values}
              formikKey={"medication"}
              setFieldValue={setFieldValue}
            />
          </View>
          <View style={{ padding: 20 }}>
            <View style={{ height: 120 }}>
              <View style={{ height: 50 }}>
                <Text style={{ ...fonts.style.h4, marginBottom: 20 }}>
                  {t("start")}
                </Text>
                <DatePicker
                  locale={i18n.language}
                  t={t}
                  mode="date"
                  date={currentDate}
                  ref={el => (ref1 = el)} // eslint-disable-line no-return-assign
                  onPick={date =>
                    setFieldValue("startDate", this.parseDateField(date))
                  }
                />

                <SelectButton
                  containerStyle={
                    [
                      // f.dateInput,
                      // this.props.submitCount > 0 && hasErrors && f.dateInputWithError,
                    ]
                  }
                  onPress={() => ref1.show()}
                >
                  {isNil(values.startDate)
                    ? t("selectDate")
                    : this.formatDateField(values.startDate)}
                </SelectButton>
              </View>
            </View>
            <View style={{ height: 150 }}>
              <View style={{ height: 50 }}>
                <Text style={{ ...fonts.style.h4, marginBottom: 20 }}>
                  {t("end")}
                </Text>
                <DatePicker
                  locale={i18n.language}
                  t={t}
                  mode="date"
                  date={currentDate}
                  ref={el => (ref2 = el)} // eslint-disable-line no-return-assign
                  onPick={date =>
                    setFieldValue("endDate", this.parseDateField(date))
                  }
                />
                <SelectButton
                  containerStyle={
                    [
                      // f.dateInput,
                      // this.props.submitCount > 0 && hasErrors && f.dateInputWithError,
                    ]
                  }
                  onPress={() => ref2.show()}
                >
                  {isNil(values.endDate)
                    ? t("selectDate")
                    : this.formatDateField(values.endDate)}
                </SelectButton>
              </View>
            </View>

            <Button
              style={{
                minWidth: 200,
                marginBottom: 20
              }}
              label={this.props.t("share")}
              onPress={this.onShare}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

DiaryShareEventsForm.propTypes = {
  dirty: T.bool,
  errors: T.shape({}),
  setFieldValue: T.func,
  submitCount: T.number,
  submitForm: T.func,
  i18n: T.shape({
    language: T.string
  }),
  t: T.func,
  values: T.shape({
    // groundWork: T.arrayOf(dateEventProps),
    // riding: T.arrayOf(dateEventProps)
  })
};

// const showSuccess = (alertDropdown, title, msg) => {
//   alertDropdown("success", title, msg);
// };

const onSubmit = ({ payload }, formikBag) => {
  const initialValue = formikBag.props.navigation.getParam("initialValue");
  const t = formikBag.props.t;
  let isEditing = Boolean(initialValue);

  const localDate = formikBag.props.navigation.getParam("localDate");
  Reactotron.log("Payload", payload, formikBag);

  const onShare = async () => {
    const { t } = this.props;
    const uri = "www.epwa.com";
    try {
      const result = await Share.share({
        message: t("shareAppContentAnimalProfile"),
        url: uri
      });

      // if (result.action === Share.sharedAction) {
      //   if (result.activityType) {
      //     // shared with activity type of result.activityType
      //   } else {
      //     // shared
      //   }
      // } else if (result.action === Share.dismissedAction) {
      //   // dismissed
      // }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  onShare();
};

const formikOptions = {
  handleSubmit: onSubmit,
  mapPropsToValues: props => {
    const initialValue = props.navigation.getParam("initialValue");
    const animalId = props.navigation.getParam("animalId");

    if (!initialValue) {
      return {
        ...DiaryShareEventsForm.getInitialEventValue(animalId)
      };
    }

    const result = { ...initialValue };

    return result;
  },
  validationSchema
};

export default hoistStatics(
  compose(
    connect(),
    translate("root"),
    withAlert,
    withAlertDropdown,
    withFormik(formikOptions),
    // Has to below withFormik
    withExitPrompt
  )
)(DiaryShareEventsForm);
