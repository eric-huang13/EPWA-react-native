import React, { Component, Fragment } from "react";
import T from "prop-types";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Text,
  Alert
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
import { get, toNumber } from "lodash";
import { __, compose, flatten, isNil } from "ramda";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import s from "./styles/DiaryFeedingFormStyles";

import Button from "../components/Button";
import MultiLineTextField from "../components/MultiLineTextField";
import DatePicker from "../components/DatePicker";
import FieldSectionHeader from "../components/FieldSectionHeader";
import FieldLabel from "../components/FieldLabel";
import Icon from "../components/Icon";
import PlusSection from "../components/PlusSection";
import Select from "../components/Select";
import SelectButton from "../components/SelectButton";
import SubmitHeaderButton from "../components/SubmitHeaderButton";
import TextInput from "../components/TextInput";
import withAlert from "../components/withAlert";
import withExitPrompt from "../components/withExitPrompt";
import withAlertDropdown from "../components/withAlertDropdown";

import { addEvent, editEvent, deleteEvent } from "../actions/events";
import { eventCategories, eventTypes, eventTypeIconNames } from "../constants";
import {
  quantityEventProps,
  quantityEventValidation
} from "../constants/validationTypes";

import { colors, fonts } from "../themes";

import getId from "../services/idGenerator";
import {
  setHours,
  setMinutes,
  setSecondsToZero,
  setMillisecondsToZero
} from "../services/date";
import iconMap from "../constants/iconMap";
import RecurringForm from "../components/RecurringForm";

import Reactotron from "reactotron-react-native";

const validationSchema = yup.object().shape({
  roughage: yup.array().of(quantityEventValidation),
  concentrate: yup.array().of(quantityEventValidation),
  supplement: yup.array().of(quantityEventValidation)
});

class DiaryFeedingForm extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t.t("headerBar.diaryFeeding"),
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
            navigation.navigate("DiaryFeedingFormInfo", {
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

    // Reactotron.log("localDate in Form", format(localDate));

    this.state = {
      isEditing,
      localDate
    };

    this.isAndroid = Platform.OS === "android";
  }

  submitForm = () => {
    if (!this.props.dirty) {
      return;
    }

    this.props.submitForm();
  };

  getInitialEventValue = eventType => {
    const animalId = this.props.navigation.getParam("animalId");

    return {
      localId: getId(),
      category: eventCategories.feeding,
      completed: false,
      type: eventType,
      animalId,
      data: {
        unit: "kg"
      }
    };
  };

  formatDateField = timestamp =>
    isValid(parse(timestamp)) ? format(timestamp, "DD MMM HH:mm") : "";

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

  renderFieldSectionHeader = fieldName => (
    <FieldSectionHeader
      title={this.props.t(eventTypes[fieldName])}
      icon={
        <Icon
          name={eventTypeIconNames[fieldName]}
          size={24}
          color={colors.nero}
        />
      }
    />
  );

  renderField = ({ entry, fieldName, index, label, namespace }) => {
    const { i18n, t, errors, setFieldValue } = this.props;
    const fieldPath = `${namespace}[${index}].${fieldName}`;
    const hasErrors = get(errors, fieldPath);
    const currentDate = this.props.navigation.getParam("currentDate");
    // Reactotron.log("currentDate in Form", currentDate);

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
          {isNil(this.state.localDate)
            ? this.formatDateField(entry[fieldName])
            : this.formatDateField(this.state.localDate)}
        </SelectButton>
      </View>
    );
  };

  renderRow = props => {
    const { errors, setFieldValue, t, values } = this.props;

    const fieldPaths = {
      name: `${props.namespace}[${props.index}].data.name`,
      quantity: `${props.namespace}[${props.index}].data.quantity`,
      unit: `${props.namespace}[${props.index}].data.unit`,
      note: `${props.namespace}[${props.index}].data.note`
    };

    const fieldValues = {
      name: get(values, fieldPaths.name) || "",
      quantity: get(values, fieldPaths.quantity) || "",
      unit: get(values, fieldPaths.unit) || "",
      note: get(values, fieldPaths.note) || ""
    };

    const fieldErrors = {
      name: get(errors, fieldPaths.name),
      quantity: get(errors, fieldPaths.quantity),
      unit: get(errors, fieldPaths.unit),
      note: get(values, fieldPaths.note)
    };

    const nameFieldLabel = t(`${props.namespace}NameLabel`);

    const shouldRenderUnlimitedField = props.namespace === eventTypes.roughage;

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
          <View style={{ marginBottom: 20 }}>
            {this.renderField({
              fieldName: "startDate",
              label: t("timeAndDay"),
              ...props
            })}
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            {fieldValues.unit !== "unlimited" && (
              <Fragment>
                <View
                  style={{
                    flex: 1
                  }}
                >
                  <FieldLabel style={s.fieldLabel}>{t("quantity")}</FieldLabel>
                  <View
                    style={[
                      {
                        flexDirection: "row",
                        alignItems: "center",
                        minWidth: 40,
                        minHeight: 52,
                        borderRadius: 28,
                        borderWidth: 1,
                        borderColor: colors.mediumPurple,
                        marginRight: 5
                      },
                      this.props.submitCount > 0 && fieldErrors.quantity
                        ? { backgroundColor: colors.tomato }
                        : {}
                    ]}
                  >
                    <TextInput
                      keyboardType="numeric"
                      placeholder="10"
                      maxLength={5}
                      onChangeText={text =>
                        setFieldValue(
                          fieldPaths.quantity,
                          // Convert comma to a dot - otherwise validation will reject it
                          toNumber(text.replace(/,/g, "."))
                        )
                      }
                      value={`${fieldValues.quantity}`}
                      style={
                        this.props.submitCount > 0 && fieldErrors.quantity
                          ? { backgroundColor: colors.tomato }
                          : {}
                      }
                    />
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <FieldLabel style={s.fieldLabel}>{t("unit")}</FieldLabel>
                  <Select
                    showBorder
                    placeholder={{}}
                    items={[
                      { label: t("kilogram"), value: "kg" },
                      { label: t("gram"), value: "g" }
                    ]}
                    onValueChange={value =>
                      setFieldValue(fieldPaths.unit, value)
                    }
                  />
                </View>
              </Fragment>
            )}
          </View>
          {shouldRenderUnlimitedField && (
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginRight: 5
              }}
            >
              <Text style={{ ...fonts.style.label, paddingRight: 5 }}>
                {t("animalHasUnlimitedAmountOf", {
                  feedType: t(props.namespace).toLowerCase()
                })}
              </Text>
              <Switch
                trackColor={colors.lima}
                {...(Platform.OS === "ios"
                  ? {}
                  : { thumbTintColor: colors.white })}
                onValueChange={value => {
                  if (value) {
                    setFieldValue(fieldPaths.unit, "unlimited");
                    setFieldValue(fieldPaths.quantity, 1);
                  } else {
                    setFieldValue(fieldPaths.unit, "kg");
                    setFieldValue(fieldPaths.quantity, null);
                  }
                }}
                value={fieldValues.unit === "unlimited"}
              />
            </View>
          )}
          <View style={{ marginTop: 10, marginBottom: 10 }}>
            <FieldLabel style={[s.fieldLabel]}>{t(nameFieldLabel)}</FieldLabel>
            <View
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                  minWidth: 40,
                  minHeight: 52,
                  borderRadius: 28,
                  borderWidth: 1,
                  borderColor: colors.mediumPurple,
                  marginRight: 5
                },
                this.props.submitCount > 0 && fieldErrors.name
                  ? { backgroundColor: colors.tomato }
                  : {}
              ]}
            >
              <TextInput
                onChangeText={value => setFieldValue(fieldPaths.name, value)}
                value={fieldValues.name}
                style={
                  this.props.submitCount > 0 && fieldErrors.name
                    ? { backgroundColor: colors.tomato }
                    : {}
                }
              />
            </View>
          </View>
          <MultiLineTextField
            label={this.props.t("notes")}
            value={fieldValues.note}
            onChangeText={value =>
              this.props.setFieldValue(fieldPaths.note, value)
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
    const { values } = this.props;
    // Reactotron.log(values);
    const pushValue = this.getInitialEventValue(eventTypes[name]);

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
            {this.renderFieldSectionHeader(name)}
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
    const { setFieldValue, values } = this.props;
    // Reactotron.log("values", values);
    return (
      <View style={s.screenContainer}>
        <KeyboardAvoidingView
          behavior={this.isAndroid ? null : "padding"}
          enabled
          keyboardVerticalOffset={this.isAndroid ? 64 : 80}
        >
          <ScrollView contentContainerStyle={s.scrollContainer}>
            <View>
              {this.renderFieldArray(eventTypes.roughage)}
              {this.renderFieldArray(eventTypes.concentrate)}
              {this.renderFieldArray(eventTypes.supplement)}
            </View>
            {values[Object.keys(values)[0]] &&
              values[Object.keys(values)[0]].length > 0 &&
              this.renderRecurring()}
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
        </KeyboardAvoidingView>
      </View>
    );
  }
}

DiaryFeedingForm.propTypes = {
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
    roughage: T.arrayOf(quantityEventProps),
    concentrate: T.arrayOf(quantityEventProps),
    supplement: T.arrayOf(quantityEventProps)
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
  // Reactotron.log("Wat text", values, formikBag);

  const t = formikBag.props.t;

  const flattenValues = compose(
    flatten,
    Object.values
  )(values);

  const initialValue = formikBag.props.navigation.getParam("initialValue");
  let isEditing = Boolean(initialValue);

  const localDate = formikBag.props.navigation.getParam("localDate");

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
)(DiaryFeedingForm);
