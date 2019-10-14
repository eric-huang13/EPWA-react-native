import React, { Component } from "react";
import T from "prop-types";
import {
  ScrollView,
  TouchableOpacity,
  View,
  TextInput,
  Alert
} from "react-native";
import { HeaderBackButton } from "react-navigation-stack";
import { FieldArray, withFormik } from "formik";
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

import s from "./styles/DiaryAppointmentFormStyles";

import Button from "../components/Button";
import DatePicker from "../components/DatePicker";
import Field from "../components/Field";
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
  noteEventValidation
} from "../constants/validationTypes";

import { colors } from "../themes";

import {
  setHours,
  setMinutes,
  setSecondsToZero,
  setMillisecondsToZero
} from "../services/date";
import iconMap from "../constants/iconMap";
import MultiLineTextField from "../components/MultiLineTextField";

import Reactotron from "reactotron-react-native";

const validationSchema = yup.object().shape({
  payload: yup.array().of(noteEventValidation)
});

class diaryAppointmentForm extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t.t("headerBar.diaryAppointment"),
    headerLeft: (
      <HeaderBackButton
        title={screenProps.t.t("headerBar.diary")}
        tintColor={colors.nero}
        onPress={navigation.getParam("onBackPress")}
      />
    ),
    headerRight: (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 15, right: 5 }}
          style={{ marginRight: 30 }}
          onPress={() =>
            navigation.navigate("diaryAppointmentFormInfo", {
              animalType: navigation.getParam("animalType")
            })
          }
        >
          <Icon
            name={iconMap.info2}
            size={30}
            color={colors.egyptianBlueDark}
          />
        </TouchableOpacity>
        {/* <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 15, right: 30 }}
          onPress={navigation.getParam("onSubmitButtonPress")}
        >
          <MaterialIcons
            style={{ marginRight: 10 }}
            name={iconMap.send}
            size={24}
            color={colors.mediumPurple}
          />
        </TouchableOpacity> */}
      </View>
    )
  });

  constructor(props) {
    super(props);

    const isEditing = Boolean(props.navigation.getParam("initialValue"));
    const localDate = +props.navigation.getParam("localDate") || null;

    this.state = {
      isEditing,
      localDate
    };
  }

  static getInitialEventValue(animalId) {
    return {
      localId: getId(),
      completed: false,
      category: eventCategories.appointment,
      type: eventTypes.appointment,
      animalId
    };
  }

  submitForm = () => {
    if (!this.props.dirty) {
      return;
    }
    if (
      !this.state.isEditing &&
      (!this.props.values.payload || !this.props.values.payload.length)
    ) {
      return;
    }

    this.props.submitForm();
  };

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

  renderField = ({ entry, fieldName, index, label, date }) => {
    const { i18n, t, errors, setFieldValue } = this.props;
    const fieldPath = `payload[${index}].${fieldName}`;
    const hasErrors = get(errors, fieldPath);
    const currentDate = this.props.navigation.getParam("currentDate");
    let ref;

    return (
      <View style={{ flex: 1 }}>
        <DatePicker
          locale={i18n.language}
          t={t}
          mode="datetime"
          date={date}
          ref={el => (ref = el)} // eslint-disable-line no-return-assign
          onPick={dateArg =>
            setFieldValue(fieldPath, this.parseDateField(dateArg))
          }
        />
        <FieldLabel style={s.fieldLabel}>{label}</FieldLabel>
        <SelectButton
          containerStyle={[
            s.dateInput,
            this.props.submitCount > 0 && hasErrors && s.dateInputWithError
          ]}
          onPress={() => ref.show()}
        >
          {this.formatDateField(entry[fieldName])}
        </SelectButton>
      </View>
    );
  };

  renderRow = props => {
    const { errors, submitCount } = this.props;

    const startDatePath = `payload[${props.index}].startDate`;
    const typePath = `payload[${props.index}].type`;
    const notePath = `payload[${props.index}].data.note`;
    const titlePath = `payload[${props.index}].data.noteTitle`;
    const hasErrors = submitCount > 0 && get(errors, typePath);
    const typeStyle = hasErrors ? { backgroundColor: colors.tomato } : {};

    return (
      <View
        // REMEMBER: In order to not lose focus of fields, the key between rerenders should stay the same!
        // REMEMBER: The key should not be based on array index:
        // if user has two entries, removes the top one,
        // the second one will get values from the top one!
        key={props.entry.id || props.entry.localId}
        style={s.fieldSectionContainer}
      >
        <View style={{ flex: 1 }}>
          <MultiLineTextField
            label={this.props.t("kindOfAppointment")}
            value={get(this.props.values, titlePath)}
            onChangeText={value => this.props.setFieldValue(titlePath, value)}
            maxLength={100}
          />
          {/*<View>
            <Field
              labelContainerStyle={{ paddingHorizontal: 0 }}
              label={this.props.t("exerciseType")}
            >
              <Select
                showBorder
                placeholder={{ label: "", value: null }}
                items={typeOfTrainingsOptions}
                onValueChange={value =>
                  this.props.setFieldValue(typePath, value)
                }
                value={get(this.props.values, typePath)}
                style={{
                  inputIOS: typeStyle,
                  inputAndroid: typeStyle
                }}
              />
            </Field>
              </View> */}
          <MultiLineTextField
            label={this.props.t("notes")}
            value={get(this.props.values, notePath)}
            onChangeText={value => this.props.setFieldValue(notePath, value)}
            maxLength={280}
          />
          <View style={{ flex: 1, flexDirection: "row" }}>
            {this.renderField({
              fieldName: "startDate",
              label: this.props.t("timeAndDay"),
              date: new Date(),
              ...props
            })}
          </View>
        </View>
        <View style={s.removeIconContainer}>
          <TouchableOpacity
            hitSlop={{ left: 20, right: 20, top: 10, bottom: 5 }}
            onPress={() => props.arrayHelpers.remove(props.index)}
          >
            <View>
              <Icon
                name={iconMap.close}
                size={16}
                color={colors.harleyDavidsonOrange}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderFieldArray = () => {
    const { navigation, values } = this.props;
    const animalId = navigation.getParam("animalId");
    const pushValue = diaryAppointmentForm.getInitialEventValue(animalId);
    Reactotron.log(values);
    return (
      <FieldArray
        name="payload"
        render={arrayHelpers => (
          <View>
            {values.payload &&
              values.payload.map((entry, index) =>
                this.renderRow({
                  arrayHelpers,
                  entry,
                  index
                })
              )}
            {this.state.isEditing ? null : (
              <PlusSection onPress={() => arrayHelpers.push(pushValue)} />
            )}
          </View>
        )}
      />
    );
  };

  renderRecurring = () => {
    const { t, setFieldValue, values, i18n } = this.props;
    const currentDate = this.props.navigation.getParam("currentDate");

    // Reactotron.log('recurring', values);
    return (
      <RecurringForm
        t={t}
        setFieldValue={setFieldValue}
        values={values}
        currentDate={currentDate}
        i18n={i18n}
      />
    );
  };

  render() {
    return (
      <View style={s.screenContainer}>
        <ScrollView contentContainerStyle={s.scrollContainer}>
          <View>{this.renderFieldArray()}</View>
          {this.renderRecurring()}
          <View style={{ padding: 20 }}>
            <Button
              style={{
                minWidth: 200,
                marginBottom: 20
              }}
              label={this.props.t("save")}
              onPress={this.submitForm}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

diaryAppointmentForm.propTypes = {
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
    note: T.string,
    noteTitle: T.string
  })
};

const showSuccess = (alertDropdown, title, msg) => {
  alertDropdown("success", title, msg);
};

const triggerSubmitType = (
  payload,
  { formikBag, actionCreator, initialValue, alertTitle, alertMsg }
) => {
  const { dispatch, t } = formikBag.props;

  showSuccess(formikBag.props.alertDropdown, t(alertTitle), t(alertMsg));

  dispatch(
    actionCreator({
      payload,
      formHelpers: formikBag,
      initialValue
    })
  );
};

const onSubmit = ({ payload }, formikBag) => {
  const initialValue = formikBag.props.navigation.getParam("initialValue");
  const t = formikBag.props.t;
  let isEditing = Boolean(initialValue);

  const localDate = formikBag.props.navigation.getParam("localDate");
  Reactotron.log("Payload", payload, formikBag);
  return;
  if (!isNil(localDate) && !isNil(payload[0].recurring)) {
    Alert.alert(t("editRecurringEventWarning"), t("selectAnOption"), [
      { text: t("editRecurring"), onPress: () => (isEditing = true) },
      { text: t("newRecurring"), onPress: () => (isEditing = false) }
    ]);
  }

  if (!isEditing) {
    return triggerSubmitType(payload, {
      formikBag,
      alertTitle: "alertSuccess",
      alertMsg: "eventAddSuccessMsg",
      actionCreator: addEvent
    });
  } else if (isEditing && payload.length > 0) {
    return triggerSubmitType(payload[0], {
      formikBag,
      alertTitle: "alertSuccess",
      alertMsg: "eventEditSuccessMsg",
      actionCreator: editEvent,
      initialValue
    });
  }

  return triggerSubmitType(initialValue, {
    formikBag,
    alertTitle: "alertSuccess",
    alertMsg: "eventDeleteSuccessMsg",
    actionCreator: deleteEvent
  });
};

const formikOptions = {
  handleSubmit: onSubmit,
  mapPropsToValues: props => {
    const initialValue = props.navigation.getParam("initialValue");
    const animalId = props.navigation.getParam("animalId");

    if (!initialValue) {
      return {
        payload: [diaryAppointmentForm.getInitialEventValue(animalId)]
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
)(diaryAppointmentForm);
