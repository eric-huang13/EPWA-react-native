import React, { Component } from "react";
import T from "prop-types";
import * as yup from "yup";
import {
  Image,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { HeaderBackButton } from "react-navigation-stack";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { getTime, format } from "date-fns";
import { hoistStatics } from "recompose";
import {
  compose,
  evolve,
  isNil,
  isEmpty,
  mapObjIndexed,
  reject,
  values as ramdaValues
} from "ramda";
import { get, toNumber } from "lodash";
import { FieldArray, withFormik } from "formik";
import Touchable from "react-native-platform-touchable";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import s from "./styles/AnimalFormStyles";

import Button from "../components/Button";
import Field from "../components/Field";
import TextInput from "../components/TextInput";
import Icon from "../components/Icon";
import Select from "../components/Select";
import DatePicker from "../components/DatePicker";
import PlusSection from "../components/PlusSection";
import SubmitHeaderButton from "../components/SubmitHeaderButton";
import withAlertDropdown from "../components/withAlertDropdown";
import withExitPrompt from "../components/withExitPrompt";
import withImagePicker from "../components/withImagePicker";

import { addAnimal, editAnimal } from "../actions/animals";

import { isEmptyIgnoreNil } from "../transforms";

import { colors, fonts } from "../themes";
import { getToken } from "../selectors/auth";
import iconMap from "../constants/iconMap";

// import Reactotron from "reactotron-react-native";

class AnimalForm extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title:
      navigation.getParam("title") || screenProps.t.t("headerBar.animalForm"),
    headerLeft: (
      <HeaderBackButton
        title={screenProps.t.t("headerBar.back")}
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
            navigation.navigate("AnimalFormInfo", {
              animalType:
                navigation.getParam("type") ||
                navigation.getParam("initialValue").type
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

    const animalType = props.navigation.getParam("type");
    const initialValue = props.navigation.getParam("initialValue");
    const animalName = get(initialValue, "name");

    if (!initialValue && !animalType) {
      props.navigation.navigate("Stable");
    }

    if (animalType) {
      setTimeout(() => {
        props.setFieldValue("type", animalType);
      }, 1500);
    }

    const customTitle = animalType || animalName;

    if (customTitle) {
      this.props.navigation.setParams({
        title: props.t(customTitle)
      });
    }

    this.isAndroid = Platform.OS === "android";
  }

  setScrollRef = element => {
    this.scroll = element;
  };

  submitForm = () => {
    if (!this.props.dirty) {
      return;
    }
    if (this.props.isSubmitting) {
      return;
    }

    this.props.submitForm();
  };

  setDatePickerRef = element => {
    this.datePicker = element;
  };

  shouldShowCloseIcon = (values, index) => {
    // If is last item and if has value with exception of every item apart first one
    const lastIndex = values.length - 1;

    if (index === lastIndex) {
      if (index !== 0) {
        return true;
      } else if (index === 0 && values[0]) {
        return true;
      }
      return false;
    }
    return false;
  };

  shouldShowPlusIcon = (values, index) =>
    values &&
    values.length > 0 &&
    values.length - 1 === index &&
    Boolean(values[index]);

  renderBreedMultiSelect = ({ name, values, selectItems }) => {
    const { setFieldValue, t } = this.props;
    const otherBreedSelectItemValue = "other";

    const allowCustomBreed = this.props.values.type === "horse";

    const isCustomBreed = value => {
      if (isNil(value) || isEmpty(value)) {
        return false;
      }
      return !selectItems.find(item => item.value === value);
    };

    const getValueForSelect = value =>
      isCustomBreed(value) ? otherBreedSelectItemValue : value;

    const getValueForCustomBreedField = value =>
      `${value === otherBreedSelectItemValue ? "" : value}`;

    const shouldDisplayCustomBreedField = value =>
      allowCustomBreed &&
      (value === otherBreedSelectItemValue || isCustomBreed(value));

    return (
      <FieldArray
        name={name}
        render={arrayHelpers => (
          <View>
            {values.map((value, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <View key={index}>
                <Field
                  showBorder
                  innerWrapperStyle={{ flexDirection: "row" }}
                  label={t(name)}
                >
                  <View style={{ flex: 1 }}>
                    <Select
                      showBorder
                      placeholder={{ label: t(`select${name}`), value: null }}
                      items={selectItems}
                      onValueChange={selectedValue =>
                        setFieldValue(`${name}[${index}]`, selectedValue)
                      }
                      value={
                        allowCustomBreed ? getValueForSelect(value) : value
                      }
                      style={{
                        viewContainer: { flexGrow: 1 }
                      }}
                    />
                    {shouldDisplayCustomBreedField(value) && (
                      <Field innerWrapperStyle={{ width: "100%", flex: 1 }}>
                        <TextInput
                          style={{
                            /* fixme: ref to s.roundedBorderInput */
                            borderWidth: 1,
                            borderRadius: 28,
                            borderColor: colors.mediumPurple
                          }}
                          placeholder={t("customBreedPlaceholder")}
                          value={getValueForCustomBreedField(value)}
                          onChangeText={newValue =>
                            newValue
                              ? setFieldValue(`${name}[${index}]`, newValue)
                              : setFieldValue(
                                  `${name}[${index}]`,
                                  otherBreedSelectItemValue
                                )
                          }
                        />
                      </Field>
                    )}
                  </View>
                  {this.shouldShowCloseIcon(values, index) ? (
                    <Touchable
                      onPress={() =>
                        index === 0
                          ? setFieldValue(`${name}[0]`, null)
                          : arrayHelpers.remove(index)
                      }
                      hitSlop={{ top: 15, bottom: 15, left: 5, right: 20 }}
                    >
                      <View style={{ marginLeft: 15 }}>
                        <Icon
                          name={iconMap.close}
                          size={16}
                          color={colors.harleyDavidsonOrange}
                        />
                      </View>
                    </Touchable>
                  ) : null}
                </Field>

                {this.shouldShowPlusIcon(values, index) ? (
                  <PlusSection onPress={() => arrayHelpers.push("")} />
                ) : null}
              </View>
            ))}
          </View>
        )}
      />
    );
  };

  renderMultiSelect = ({ name, values, selectItems }) => {
    const { setFieldValue, t } = this.props;
    return (
      <FieldArray
        name={name}
        render={arrayHelpers => (
          <View>
            {values.map((value, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <View key={index}>
                <Field
                  showBorder
                  innerWrapperStyle={{ flexDirection: "row" }}
                  label={t(name)}
                >
                  <View style={{ flex: 1 }}>
                    <Select
                      showBorder
                      placeholder={{ label: t(`select${name}`), value: null }}
                      items={selectItems}
                      onValueChange={selectedValue =>
                        setFieldValue(`${name}[${index}]`, selectedValue)
                      }
                      value={value}
                      style={{
                        viewContainer: { flexGrow: 1 }
                      }}
                    />
                  </View>
                  {this.shouldShowCloseIcon(values, index) && (
                    <Touchable
                      onPress={() =>
                        index === 0
                          ? setFieldValue(`${name}[0]`, null)
                          : arrayHelpers.remove(index)
                      }
                      hitSlop={{ top: 15, bottom: 15, left: 5, right: 20 }}
                    >
                      <View style={{ marginLeft: 15 }}>
                        <Icon
                          name={iconMap.close}
                          size={16}
                          color={colors.harleyDavidsonOrange}
                        />
                      </View>
                    </Touchable>
                  )}
                </Field>

                {this.shouldShowPlusIcon(values, index) && (
                  <PlusSection onPress={() => arrayHelpers.push("")} />
                )}
              </View>
            ))}
          </View>
        )}
      />
    );
  };

  render() {
    const { authToken, setFieldValue, showImagePicker, i18n, t } = this.props;

    // When you call props.resetForm(), props.values is undefined.
    // Because of that, destructuring of undefined will throw an error.
    // Fallback to empty object to prevent that.
    const {
      // type,
      birthdate,
      competitionLevel,
      disciplines,
      height,
      name,
      pictureUrl,
      roles,
      breed,
      sex,
      notes,
      weight
    } = this.props.values || {};

    const type =
      this.props.navigation.getParam("type") ||
      this.props.navigation.getParam("initialValue").type;

    const selectItems = {
      breed: ramdaValues(
        mapObjIndexed(
          (val, key) => ({ label: val, value: key }),
          t(`animalBreeds.${type}`, { returnObjects: true })
        )
      ),
      roles: ramdaValues(
        mapObjIndexed(
          (val, key) => ({ label: val, value: key }),
          t(`animalRoles.${type}`, { returnObjects: true })
        )
      ),
      disciplines: ramdaValues(
        mapObjIndexed(
          (val, key) => ({ label: val, value: key }),
          t(`animalDisciplines.${type}`, { returnObjects: true })
        )
      ),
      competitionLevels: ramdaValues(
        mapObjIndexed(
          (val, key) => ({ label: val, value: key }),
          t(`animalCompetitionLevels.${type}`, { returnObjects: true })
        )
      ),
      sex: ramdaValues(
        mapObjIndexed(
          (val, key) => ({ label: val, value: key }),
          t(`animalGenders.${type}`, { returnObjects: true })
        )
      )
    };

    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={this.isAndroid ? 0 : 80}
          behavior={this.isAndroid ? null : "padding"}
          enabled
        >
          <ScrollView
            contentContainerStyle={s.screenContainer}
            ref={this.setScrollRef}
          >
            <TouchableOpacity
              onPress={() =>
                showImagePicker(url => setFieldValue("pictureUrl", url))
              }
            >
              {pictureUrl ? (
                <View style={s.photoContainer}>
                  <Image
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      position: "absolute",
                      top: 10
                    }}
                    source={{
                      uri: pictureUrl,
                      headers: { Authorization: `Bearer ${authToken}` }
                    }}
                  />
                  {/* Using third, hidden element to align icon to the buttom
                      and text to the center (justify-content: space-between)
                  */}
                  <Icon
                    name={iconMap.camera}
                    size={32}
                    color={colors.black}
                    style={{ position: "absolute", top: 51 }}
                  />
                  <Icon
                    name={iconMap.camera}
                    size={32}
                    color={colors.white}
                    style={{ position: "absolute", top: 50 }}
                  />
                  <Text
                    style={{
                      ...fonts.style.h5,
                      color: colors.white,
                      position: "absolute",
                      bottom: 5
                    }}
                  >
                    {t("clickToChangePhoto")}
                  </Text>
                </View>
              ) : (
                <View style={s.photoContainer}>
                  {/* Using third, hidden element to align icon to the buttom
                      and text to the center (justify-content: space-between)
                  */}
                  <View style={{ height: 32 }} />
                  <Text style={{ ...fonts.style.h4, color: colors.white }}>
                    {t("clickToAddPhoto")}
                  </Text>
                  <Icon name={iconMap.camera} size={32} color={colors.white} />
                </View>
              )}
            </TouchableOpacity>
            <Field showBorder required label={t("name")}>
              <TextInput
                returnKeyType="done"
                placeholder={t("fillInName")}
                value={name}
                onChangeText={value => setFieldValue("name", value)}
              />
            </Field>
            {this.renderBreedMultiSelect({
              name: "breed",
              values: breed,
              selectItems: selectItems.breed
            })}
            <Field showBorder label={t("birthdate")}>
              <DatePicker
                locale={i18n.language}
                t={t}
                ref={this.setDatePickerRef}
                onPick={date => setFieldValue("birthdate", getTime(date))}
                maximumDate={new Date()}
              />
              <TouchableOpacity onPress={() => this.datePicker.show()}>
                <View style={s.datePickerBox}>
                  <Text
                    style={[
                      s.datePickerText,
                      birthdate ? s.datePickerTextActive : {}
                    ]}
                  >
                    {/* Convert timestamp to a number */}
                    {birthdate
                      ? format(+birthdate, t("dateFormat"))
                      : t("selectDate")}
                  </Text>
                </View>
              </TouchableOpacity>
            </Field>
            <Field showBorder label={t("sex")}>
              <Select
                showBorder
                placeholder={{ label: t("selectSex"), value: null }}
                items={selectItems.sex}
                onValueChange={value => setFieldValue("sex", value)}
                value={sex || null}
              />
            </Field>
            <Field showBorder label={t("animalHeight")}>
              <TextInput
                style={{
                  /* fixme: ref to s.roundedBorderInput */
                  borderWidth: 1,
                  borderRadius: 28,
                  borderColor: colors.mediumPurple
                }}
                maxLength={3}
                keyboardType="number-pad"
                placeholder={t("fillInAnimalHeight")}
                value={`${height || ""}`}
                onChangeText={value => setFieldValue("height", toNumber(value))}
              />
            </Field>
            <Field showBorder label={t("animalWeight")}>
              <TextInput
                style={{
                  /* fixme: ref to s.roundedBorderInput */
                  borderWidth: 1,
                  borderRadius: 28,
                  borderColor: colors.mediumPurple
                }}
                maxLength={3}
                keyboardType="number-pad"
                placeholder={t("fillInAnimalWeight")}
                value={`${weight || ""}`}
                onChangeText={value => setFieldValue("weight", toNumber(value))}
              />
            </Field>
            {this.renderMultiSelect({
              name: "roles",
              values: roles,
              selectItems: selectItems.roles
            })}
            {type === "donkey"
              ? null
              : this.renderMultiSelect({
                  name: "disciplines",
                  values: disciplines,
                  selectItems: selectItems.disciplines
                })}
            {type === "donkey" ? null : (
              <Field showBorder label={t("horseCompetitionLevel")}>
                <Select
                  showBorder
                  placeholder={{
                    label: t("selectHorseCompetitionLevel"),
                    value: null
                  }}
                  items={selectItems.competitionLevels}
                  onValueChange={value =>
                    setFieldValue("competitionLevel", value)
                  }
                  value={competitionLevel || null}
                />
              </Field>
            )}
            <Field showBorder label={t("particularities")}>
              <TextInput
                placeholder={t("fillInParticularities")}
                multiline
                numberOfLines={4}
                style={{ height: 60 }}
                value={notes}
                onFocus={() =>
                  !this.isAndroid ? this.scroll.scrollToEnd() : null
                }
                onChangeText={value => setFieldValue("notes", value)}
              />
            </Field>
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

const triggerSubmitType = (
  payload,
  { formikBag, actionCreator, initialValue }
) => {
  const { alertDropdown, dispatch, t } = formikBag.props;

  dispatch(
    actionCreator({
      payload,
      formHelpers: formikBag,
      showNotification: alertDropdown,
      translate: t,
      initialValue
    })
  );
};

const onSubmit = (values, formikBag) => {
  const isEditing = Boolean(
    formikBag.props.navigation.getParam("initialValue")
  );

  const rejectEmptyStrings = arr => reject(item => item === "", arr);
  const emptyArrayToNil = arr => (isEmptyIgnoreNil(arr) ? null : arr);

  const payload = compose(
    evolve({
      breed: emptyArrayToNil,
      disciplines: emptyArrayToNil,
      roles: emptyArrayToNil
    }),
    evolve({
      breed: rejectEmptyStrings,
      disciplines: rejectEmptyStrings,
      roles: rejectEmptyStrings
    })
  )(values);

  return triggerSubmitType(payload, {
    formikBag,
    actionCreator: isEditing ? editAnimal : addAnimal
  });
};

const validationSchema = yup.object().shape({
  birthdate: yup
    .number()
    .nullable()
    .notRequired(),
  competitionLevel: yup
    .string()
    .nullable()
    .notRequired(),
  disciplines: yup
    .array()
    .nullable()
    .notRequired(),
  height: yup
    .number()
    .nullable()
    .notRequired(),
  weight: yup
    .number()
    .nullable()
    .notRequired(),
  name: yup.string().required("Required"),
  pictureUrl: yup
    .string()
    .nullable()
    .notRequired(),
  breed: yup
    .array()
    .nullable()
    .notRequired(),
  sex: yup
    .string()
    .nullable()
    .notRequired(),
  type: yup.string().required("Required")
});

const formikOptions = {
  handleSubmit: onSubmit,
  mapPropsToValues: props => {
    const initialValue = props.navigation.getParam("initialValue");

    const ifEmptyReturnArray = value => value || [null];

    if (!initialValue) {
      return { breed: [null], disciplines: [null], roles: [null] };
    }

    return evolve({
      breed: ifEmptyReturnArray,
      disciplines: ifEmptyReturnArray,
      roles: ifEmptyReturnArray
    })(initialValue);
  },
  enableReinitialize: true,
  validationSchema
};

AnimalForm.propTypes = {
  authToken: T.string,
  dirty: T.bool,
  errors: T.shape({}),
  showImagePicker: T.func,
  setFieldValue: T.func,
  submitAttemptCount: T.number,
  isSubmitting: T.bool,
  submitForm: T.func,
  i18n: T.shape({
    language: T.string
  }),
  t: T.func,
  values: T.shape({
    birthdate: T.number,
    competitionLevel: T.string,
    height: T.number,
    weight: T.number,
    name: T.string,
    pictureUrl: T.string,
    breed: T.arrayOf(T.string),
    sex: T.string,
    notes: T.string
  })
};

const mapStateToProps = state => ({
  authToken: getToken(state)
});

export default hoistStatics(
  compose(
    connect(mapStateToProps),
    translate("root"),
    withAlertDropdown,
    withImagePicker,
    withFormik(formikOptions),
    // Has to be below withFormik
    withExitPrompt
  )
)(AnimalForm);
