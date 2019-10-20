import React, { Component } from "react";
import T from "prop-types";
import {
  ScrollView,
  TouchableOpacity,
  View,
  TextInput,
  Text
} from "react-native";
import AlertAsync from "react-native-alert-async";
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
  isNil,
  flatten,
  values as ramdaValues
} from "ramda";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import getId from "../services/idGenerator";

import s from "./styles/DiaryExerciseFormStyles";

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
import { eventTypes } from "../constants";

import { addEvent, editEvent, deleteEvent } from "../actions/events";
import { eventCategories } from "../constants";
import {
  dateEventProps,
  dateEventValidation,
  painEventRegistration
} from "../constants/validationTypes";

import { colors } from "../themes";

import {
  setHours,
  setMinutes,
  setSecondsToZero,
  setMillisecondsToZero
} from "../services/date";
import iconMap from "../constants/iconMap";
import nlLocale from "date-fns/locale/nl";

import Reactotron from "reactotron-react-native";

const validationSchema = yup.object().shape({
  payload: yup.array().of(painEventRegistration)
});

class DiaryPainMeasurementForm extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t.t("headerBar.diaryPainMeasurement"),
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
            navigation.navigate("PainMeasurementInfo", {
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
    const { completed = false } =
      isEditing && props.navigation.getParam("initialValue");

    this.state = {
      isEditing,
      completed: Boolean(completed)
    };
  }

  static getInitialEventValue(animalId) {
    return {
      localId: getId(),
      completed: false,
      category: eventCategories.painMeasurement,
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
    isValid(parse(timestamp)) ? format(timestamp, "HH:mm") : "";

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
          mode="time"
          date={currentDate || new Date()}
          ref={el => (ref = el)} // eslint-disable-line no-return-assign
          onPick={date => setFieldValue(fieldPath, this.parseDateField(date))}
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
    const { errors, submitCount, values, t } = this.props;

    const startDatePath = `payload[${props.index}].startDate`;
    const typePath = `payload[${props.index}].type`;
    const hasErrors = submitCount > 0 && get(errors, typePath);
    const typeStyle = hasErrors ? { backgroundColor: colors.tomato } : {};
    // const { completed } = this.props.navigation.getParam("initialValue");

    // Reactotron.log('props', this.props);
    return (
      <View
        // REMEMBER: In order to not lose focus of fields, the key between rerenders should stay the same!
        // REMEMBER: The key should not be based on array index:
        // if user has two entries, removes the top one,
        // the second one will get values from the top one!
        key={props.entry.id || props.entry.localId}
        style={s.fieldSectionContainer}
      >
        <View
          style={{ flex: 1, opacity: this.state.completed ? 0.4 : 1 }}
          pointerEvents={this.state.completed ? "none" : "auto"}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            {this.renderField({
              fieldName: "startDate",
              label: t("datePicker.titleTime"),
              date: new Date(),
              ...props
            })}
          </View>
          <View>
            <Field
              labelContainerStyle={{ paddingHorizontal: 0 }}
              label={this.props.t("typePainMeasurement")}
            >
              <Select
                showBorder
                placeholder={{ label: "", value: null }}
                items={[
                  {
                    label: t("painMeasurements.composite"),
                    value: eventTypes.composite
                  },
                  {
                    label: t("painMeasurements.facialExpression"),
                    value: eventTypes.facialExpression
                  }
                ]}
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
    const pushValue = DiaryPainMeasurementForm.getInitialEventValue(animalId);

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
    // Reactotron.log(values);
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
    // Reactotron.log("painform", this.props, this.state);
    const currentDate = this.props.navigation.getParam("currentDate");
    const lang = this.props.i18n.language;

    // const { completed = 0 } = this.props.navigation.getParam("initialValue");
    // Reactotron.log("painform completed", completed);
    return (
      <View style={s.screenContainer}>
        <ScrollView contentContainerStyle={s.scrollContainer}>
          <Text
            style={{
              fontWeight: "400",
              fontSize: 22,
              textAlign: "center",
              marginVertical: 20
            }}
          >
            {lang === "nl"
              ? format(currentDate, "dddd MM D", { locale: nlLocale })
              : format(currentDate, "dddd MMM D")}
          </Text>
          <View>{this.renderFieldArray()}</View>
          {!this.state.completed && this.renderRecurring()}
          <View style={{ padding: 20 }}>
            {this.state.completed && this.props.values.payload.length === 0 ? (
              <Button
                style={{
                  minWidth: 200,
                  marginBottom: 20,
                  backgroundColor: colors.tomato
                }}
                label={this.props.t("delete")}
                onPress={this.submitForm}
              />
            ) : null}
            {!this.state.completed && this.props.values.payload.length > 0 ? (
              <Button
                style={{
                  minWidth: 200,
                  marginBottom: 20
                }}
                label={this.props.t("save")}
                onPress={this.submitForm}
              />
            ) : null}
          </View>
        </ScrollView>
      </View>
    );
  }
}

DiaryPainMeasurementForm.propTypes = {
  dirty: T.bool,
  errors: T.shape({}),
  setFieldValue: T.func,
  submitCount: T.number,
  submitForm: T.func,
  i18n: T.shape({
    language: T.string
  }),
  t: T.func,
  type: T.oneOf([eventTypes.composite, eventTypes.facialExpression])
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
const onSubmit = (values, formikBag) => {
  // Reactotron.log("Wat text", values, formikBag);

  const t = formikBag.props.t;

  const flattenValues = compose(
    flatten,
    Object.values
  )(values);

  const initialValue = formikBag.props.navigation.getParam("initialValue");
  let isEditing = Boolean(initialValue);

  const localDate = formikBag.props.navigation.getParam("localDate");

  if (!isNil(localDate) && isNil(flattenValues[0].recurring)) {
    delete flattenValues[0].id;
    delete flattenValues[0].recurring;
    delete flattenValues[0].recurring_untill;
    flattenValues[0].localId = getId();

    return triggerSubmitType(flattenValues, {
      formikBag,
      alertTitle: "alertSuccess",
      alertMsg: "eventAddSuccessMsg",
      actionCreator: addEvent
    });
  }

  if (!isNil(localDate) && !isNil(flattenValues[0].recurring)) {
    const myAction = async () => {
      const choice = await AlertAsync(
        t("editRecurringEventWarning"),
        t("selectAnOption"),
        [
          { text: t("editRecurring"), onPress: () => "yes" },
          { text: t("newRecurring"), onPress: () => "no" },
          { text: t("cancel"), onPress: () => "cancel" }
        ],
        {
          cancelable: true,
          onDismiss: () => "cancel"
        }
      );

      if (choice === "yes") {
        if (isEditing && flattenValues.length > 0) {
          return await triggerSubmitType(flattenValues[0], {
            formikBag,
            alertTitle: "alertSuccess",
            alertMsg: "eventEditSuccessMsg",
            actionCreator: editEvent,
            initialValue
          });
        }
      } else if (choice === "no") {
        // Reactotron.log("voor", flattenValues);
        delete flattenValues[0].id;
        // delete flattenValues[0].recurring;
        // delete flattenValues[0].recurring_untill;
        flattenValues[0].localId = getId();
        // Reactotron.log("na", flattenValues);
        // return;
        return await triggerSubmitType(flattenValues, {
          formikBag,
          alertTitle: "alertSuccess",
          alertMsg: "eventAddSuccessMsg",
          actionCreator: addEvent
        });
      } else {
        return;
      }
    };
    myAction();
  } else {
    if (!isEditing) {
      return triggerSubmitType(flattenValues, {
        formikBag,
        alertTitle: "alertSuccess",
        alertMsg: "eventAddSuccessMsg",
        actionCreator: addEvent
      });
    } else if (isEditing && flattenValues.length > 0) {
      return triggerSubmitType(flattenValues[0], {
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
  }
};

const formikOptions = {
  handleSubmit: onSubmit,
  mapPropsToValues: props => {
    const initialValue = props.navigation.getParam("initialValue");
    const animalId = props.navigation.getParam("animalId");

    if (!initialValue) {
      return {
        payload: [DiaryPainMeasurementForm.getInitialEventValue(animalId)]
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
)(DiaryPainMeasurementForm);
