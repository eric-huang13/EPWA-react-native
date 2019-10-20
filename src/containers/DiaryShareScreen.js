import React, { Component } from "react";
import T from "prop-types";
import {
  ScrollView,
  TouchableOpacity,
  View,
  TextInput,
  Text,
  Alert
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

import { colors } from "../themes";

import {
  setHours,
  setMinutes,
  setSecondsToZero,
  setMillisecondsToZero
} from "../services/date";

import Reactotron from "reactotron-react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import iconMap from "../constants/iconMap";

const validationSchema = yup.object().shape({
  payload: yup.array().of(dateEventValidation)
});

// const InputFeedback = ({ error }) =>
//   error ? <View className={"input-feedback"}>{error}</View> : null;

// const Checkbox = ({
//   field: { name, value, onChange, onBlur },
//   form: { errors, touched, setFieldValue },
//   id,
//   label,
//   className,
//   ...props
// }) => {
//   return (
//     <View>
//       <View
//         name={name}
//         id={id}
//         type="checkbox"
//         value={value}
//         checked={value}
//         onChange={onChange}
//         onBlur={onBlur}
//         className={"radio-button"}
//       />
//       <label htmlFor={id}>
//         <Text>{label}</Text>
//       </label>
//       {touched[name] && <InputFeedback error={errors[name]} />}
//     </View>
//   );
// };

const CheckBoxField = ({
  title = "Title",
  checked = false,
  onPress,
  categorie
}) => {
  return (
    <TouchableOpacity onPress={() => onPress(categorie)}>
      <View
        style={{
          backgroundColor: checked ? colors.lima : colors.white,
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
          {checked ? <ActiveIcon /> : <InactiveIcon />}
        </View>
        <Text>{title}</Text>
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

  constructor(props) {
    super(props);
    this.state = {};
  }

  static getInitialEventValue(animalId) {
    return {
      animalId,
      startDate: "",
      endDate: "",
      feeding: false,
      pain: false,
      exersise: false,
      housing: true,
      medical: false
    };
  }

  formatDateField = timestamp =>
    isValid(parse(timestamp)) ? format(timestamp, "DD MMM HH:mm") : "";

  parseDateField = dateInstance => {
    // We have to combine picked time with date picked in Diary Screen
    const currentDate = this.props.navigation.getParam("currentDate");
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
    )(currentDate);
  };

  handleDateChange = date => {
    const { setFieldValue, values } = this.props;

    Reactotron.log(values, date);
  };

  handleSelection = categorie => {
    const { setFieldValue, values } = this.props;
    // values.payload[0][categorie] = !values.payload[0][categorie];
    // Reactotron.log(values, categorie, values.payload[0][categorie]);
    // Reactotron.log("HANDLE");
    // Reactotron.log("HANDLE", values.payload[0][categorie]);
    setFieldValue(values[categorie], !values.payload[0][categorie]);
  };

  render() {
    const { t, i18n, setFieldValue, values, currentDate } = this.props;
    Reactotron.log("render", values);
    let ref;
    return (
      <View style={s.screenContainer}>
        <ScrollView contentContainerStyle={s.scrollContainer}>
          <View style={{ marginTop: 20 }}>
            <CheckBoxField
              title={t("categories.painMeasurement")}
              categorie={"pain"}
              checked={values.payload[0].pain}
              onPress={this.handleSelection}
            />
            <CheckBoxField
              title={t("categories.exercise")}
              checked={values.payload[0].exercise}
            />
            <CheckBoxField
              title={t("categories.feeding")}
              checked={values.payload[0].feeding}
            />
            <CheckBoxField
              title={t("categories.housing")}
              checked={values.payload[0].housing}
            />
            <CheckBoxField
              title={t("categories.medication")}
              checked={values.payload[0].medication}
            />
          </View>
          <View style={{ padding: 20 }}>
            <View>
              <Text>Hier selectie</Text>
            </View>

            <View style={{ height: 80 }}>
              <View style={{ height: 50 }}>
                <Text>{t("start")}</Text>
                <DatePicker
                  locale={i18n.language}
                  t={t}
                  mode="date"
                  date={currentDate}
                  ref={el => (ref = el)} // eslint-disable-line no-return-assign
                  onPick={date =>
                    this.handleDateChange(this.parseDateField(date))
                  }
                />

                <SelectButton
                  containerStyle={
                    [
                      // f.dateInput,
                      // this.props.submitCount > 0 && hasErrors && f.dateInputWithError,
                    ]
                  }
                  onPress={() => ref.show()}
                >
                  {t("selectDate")}
                </SelectButton>
              </View>
            </View>
            <View style={{ height: 80 }}>
              <View style={{ height: 50 }}>
                <Text>{t("end")}</Text>
                <DatePicker
                  locale={i18n.language}
                  t={t}
                  mode="date"
                  date={currentDate}
                  ref={el => (ref = el)} // eslint-disable-line no-return-assign
                  onPick={date =>
                    this.handleDateChange(this.parseDateField(date))
                  }
                />
                <SelectButton
                  containerStyle={
                    [
                      // f.dateInput,
                      // this.props.submitCount > 0 && hasErrors && f.dateInputWithError,
                    ]
                  }
                  onPress={() => ref.show()}
                >
                  {this.state.recurring_untill
                    ? this.formatDateField(this.state.recurring_untill)
                    : t("selectDate")}
                </SelectButton>
              </View>
            </View>

            <Button
              style={{
                minWidth: 200,
                marginBottom: 20
              }}
              label={this.props.t("share")}
              onPress={this.submitForm}
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

const showSuccess = (alertDropdown, title, msg) => {
  alertDropdown("success", title, msg);
};

// const triggerSubmitType = (
//   payload,
//   { formikBag, actionCreator, initialValue, alertTitle, alertMsg }
// ) => {
//   const { dispatch, t } = formikBag.props;

//   showSuccess(formikBag.props.alertDropdown, t(alertTitle), t(alertMsg));

//   dispatch(
//     actionCreator({
//       payload,
//       formHelpers: formikBag,
//       initialValue
//     })
//   );
// };

const onSubmit = ({ payload }, formikBag) => {
  const initialValue = formikBag.props.navigation.getParam("initialValue");
  const t = formikBag.props.t;
  let isEditing = Boolean(initialValue);

  const localDate = formikBag.props.navigation.getParam("localDate");
  Reactotron.log("Payload", payload, formikBag);
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

    const result = {};
    result.payload = [initialValue];

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
