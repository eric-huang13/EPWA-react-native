import React, { Component } from "react";
import T from "prop-types";
import { ScrollView, TouchableOpacity, View, Alert } from "react-native";
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
import { __, compose, flatten, isNil } from "ramda";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import s from "./styles/DiaryHousingFormStyles";

import Button from "../components/Button";
import MultiLineTextField from "../components/MultiLineTextField";
import DatePicker from "../components/DatePicker";
import Field from "../components/Field";
import FieldSectionHeader from "../components/FieldSectionHeader";
import FieldLabel from "../components/FieldLabel";
import Icon from "../components/Icon";
import PlusSection from "../components/PlusSection";
import Select from "../components/Select";
import SelectButton from "../components/SelectButton";
import SubmitHeaderButton from "../components/SubmitHeaderButton";
import withAlert from "../components/withAlert";
import withExitPrompt from "../components/withExitPrompt";
import withAlertDropdown from "../components/withAlertDropdown";
import RecurringForm from "../components/RecurringForm";

import { addEvent, editEvent, deleteEvent } from "../actions/events";
import { eventCategories, eventTypes, eventTypeIconNames } from "../constants";
import {
  dateEventProps,
  dateEventValidation
} from "../constants/validationTypes";
import getId from "../services/idGenerator";

import { colors } from "../themes";

import {
  setHours,
  setMinutes,
  setSecondsToZero,
  setMillisecondsToZero
} from "../services/date";
import iconMap from "../constants/iconMap";

const validationSchema = yup.object().shape({
  paddock: yup.array().of(dateEventValidation),
  pasture: yup.array().of(dateEventValidation),
  stable: yup.array().of(dateEventValidation)
});

class DiaryHousingForm extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t.t("headerBar.diaryHousing"),
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
            navigation.navigate("DiaryHousingFormInfo", {
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

  // eslint-disable-next-line react/sort-comp
  static getInitialValue(animalId, type) {
    return {
      localId: getId(),
      completed: false,
      category: eventCategories.housing,
      type,
      animalId,
      data: {
        sharedAreaWithOtherAnimals: false
      }
    };
  }

  submitForm = () => {
    if (!this.props.dirty) {
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

  renderField = ({ entry, fieldName, index, label, namespace }) => {
    const { i18n, t, errors, setFieldValue } = this.props;
    const fieldPath = `${namespace}[${index}].${fieldName}`;
    const hasErrors = get(errors, fieldPath);
    const currentDate = this.props.navigation.getParam("currentDate");
    let ref;

    return (
      <View style={{ flex: 1 }}>
        <DatePicker
          locale={i18n.language}
          t={t}
          mode="datetime"
          date={new Date()}
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
    const { navigation, t } = this.props;
    const animalType = navigation.getParam("animalType");
    const shareOptions = [];

    if (animalType === "donkey") {
      shareOptions.push({
        label: t("turnout.sharedWithDonkeys"),
        value: "sharedWithDonkeys"
      });
    }

    if (animalType === "horse") {
      shareOptions.push({
        label: t("turnout.sharedWithHorses"),
        value: "sharedWithHorses"
      });
    }

    shareOptions.push({
      label: t("turnout.sharedWithOtherAnimals"),
      value: "sharedWithOtherAnimals"
    });

    shareOptions.push({ label: t("turnout.alone"), value: "alone" });

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
          <View style={{ flex: 1, flexDirection: "row" }}>
            {this.renderField({
              fieldName: "startDate",
              label: this.props.t("startTime"),
              ...props
            })}
            {this.renderField({
              fieldName: "endDate",
              label: this.props.t("endTime"),
              ...props
            })}
          </View>
          <View>
            <Field
              labelContainerStyle={{ paddingHorizontal: 0 }}
              label={this.props.t("turnout.sharedAreaWithOtherAnimals")}
            >
              <Select
                showBorder
                placeholder={{}}
                items={shareOptions}
                onValueChange={value =>
                  this.props.setFieldValue(
                    `${props.namespace}[${
                      props.index
                    }].data.sharedAreaWithOtherAnimals`,
                    value
                  )
                }
                value={get(
                  this.props.values,
                  `${props.namespace}[${
                    props.index
                  }].data.sharedAreaWithOtherAnimals`
                )}
              />
            </Field>
          </View>
          <MultiLineTextField
            label={this.props.t("notes")}
            value={get(
              this.props.values,
              `${props.namespace}[${props.index}].data.note`
            )}
            onChangeText={value =>
              this.props.setFieldValue(
                `${props.namespace}[${props.index}].data.note`,
                value
              )
            }
            maxLength={280}
          />
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

  renderFieldArray = name => {
    const { navigation, values, t } = this.props;
    const animalId = navigation.getParam("animalId");
    const pushValue = DiaryHousingForm.getInitialValue(animalId, name);

    const shouldRender =
      !this.state.isEditing ||
      (this.state.isEditing &&
        eventTypes[name] ===
          this.props.navigation.getParam("initialValue").type);

    if (!shouldRender) {
      return null;
    }

    return (
      <FieldArray
        name={eventTypes[name]}
        render={arrayHelpers => (
          <View>
            <FieldSectionHeader
              title={t(eventTypes[name])}
              icon={
                <Icon
                  name={eventTypeIconNames[name]}
                  size={24}
                  color={colors.nero}
                />
              }
            />
            {values[name] &&
              values[name].map((entry, index) =>
                this.renderRow({
                  arrayHelpers,
                  entry,
                  index,
                  namespace: eventTypes[name]
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
          <View>
            {this.renderFieldArray(eventTypes.paddock)}
            {this.renderFieldArray(eventTypes.pasture)}
            {this.renderFieldArray(eventTypes.stable)}
          </View>
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

DiaryHousingForm.propTypes = {
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
    paddock: T.arrayOf(dateEventProps),
    pasture: T.arrayOf(dateEventProps)
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

const onSubmit = (values, formikBag) => {
  const flattenValues = compose(
    flatten,
    Object.values
  )(values);

  const initialValue = formikBag.props.navigation.getParam("initialValue");
  let isEditing = Boolean(initialValue);

  const localDate = formikBag.props.navigation.getParam("localDate");
  if (!isNil(localDate) && !isNil(flattenValues[0].recurring)) {
    Alert.alert(t("editRecurringEventWarning"), t("selectAnOption"), [
      { text: t("editRecurring"), onPress: () => (isEditing = true) },
      { text: t("newRecurring"), onPress: () => (isEditing = false) }
    ]);
  }

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
};

const formikOptions = {
  handleSubmit: onSubmit,
  mapPropsToValues: props => {
    const initialValue = props.navigation.getParam("initialValue");

    if (!initialValue) {
      return {};
    }

    const result = {};
    result[initialValue.type] = [initialValue];

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
    // Has to be below withFormik
    withExitPrompt
  )
)(DiaryHousingForm);
