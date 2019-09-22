import React from "react";
import T from "prop-types";
import * as yup from "yup";
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { compose } from "ramda";
import { withFormik } from "formik";
import { translate } from "react-i18next";
import { hoistStatics } from "recompose";
import { HeaderBackButton } from "react-navigation-stack";
import { connect } from "react-redux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import Button from "../components/Button";
import Field from "../components/Field";
import withAlertDropdown from "../components/withAlertDropdown";
import withExitPrompt from "../components/withExitPrompt";

import { changePasswordRequest } from "../actions/auth";
import iconMap from "../constants/iconMap";

import { colors } from "../themes";

class SettingsUpdatePassword extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t.t("headerBar.changePassword"),
    headerLeft: (
      <HeaderBackButton
        title={screenProps.t.t("headerBar.back")}
        tintColor={colors.nero}
        onPress={navigation.getParam("onBackPress")}
      />
    )
    // headerRight: (
    //   <TouchableOpacity
    //     hitSlop={{ top: 10, bottom: 10, left: 15, right: 30 }}
    //     onPress={navigation.getParam("onSubmitButtonPress")}
    //   >
    //     <MaterialIcons
    //       style={{ marginRight: 10 }}
    //       name={iconMap.send}
    //       size={24}t
    //       color={colors.mediumPurple}
    //     />
    //   </TouchableOpacity>
    // )
  });

  isAndroid = Platform.OS === "android";

  setPasswordFieldRef = (element) => {
    this.passwordField = element;
  };

  setPasswordConfirmationRef = (element) => {
    this.passwordConfirmationField = element;
  };

  submitForm = () => {
    this.props.submitForm();
  };

  render() {
    const { setFieldValue, t } = this.props;
    // When you reset the form values are not passed through props and you get undefined is not an object error
    // We make an empty check to prevent it
    const values = this.props.values || {};

    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <KeyboardAvoidingView
          behavior={this.isAndroid ? null : "padding"}
          enabled
          style={{ flex: 1 }}
          keyboardVerticalOffset={64}
        >
          <Field showBorder label={t("currentPassword")}>
            <TextInput
              secureTextEntry
              value={values.currentPassword}
              placeholder={t("currentPassword")}
              style={{ width: "100%" }}
              onChangeText={(value) => setFieldValue("currentPassword", value)}
              onSubmitEditing={() => this.passwordField.focus()}
              returnKeyType="next"
            />
          </Field>
          <Field showBorder label={t("newPassword")}>
            <TextInput
              ref={this.setPasswordFieldRef}
              secureTextEntry
              placeholder={t("newPassword")}
              value={values.password}
              style={{ width: "100%" }}
              onChangeText={(value) => setFieldValue("password", value)}
              onSubmitEditing={() => this.passwordConfirmationField.focus()}
              returnKeyType="next"
            />
          </Field>
          <Field showBorder label={t("newPasswordConfirmation")}>
            <TextInput
              ref={this.setPasswordConfirmationRef}
              secureTextEntry
              placeholder={t("newPasswordConfirmation")}
              value={values.passwordConfirmation}
              style={{ width: "100%" }}
              onChangeText={(value) =>
                setFieldValue("passwordConfirmation", value)
              }
              onSubmitEditing={this.submitForm}
              returnKeyType="send"
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
        </KeyboardAvoidingView>
      </View>
    );
  }
}

SettingsUpdatePassword.propTypes = {
  values: T.shape({
    currentPassword: T.string,
    password: T.string,
    passwordConfirmation: T.string
  }),
  setFieldValue: T.func,
  submitForm: T.func,
  t: T.func
};

const validationSchema = yup.object().shape({
  currentPassword: yup.string().required(),
  password: yup.string().required(),
  passwordConfirmation: yup.string().required()
});

const onSubmit = (values, formikBag) => {
  const { alertDropdown, dispatch, t } = formikBag.props;

  if (values.password !== values.passwordConfirmation) {
    alertDropdown(
      "error",
      t("errors.alertTitleGeneric"),
      t("changePasswordPasswordConfirmDoesNotMatchErrorMsg")
    );
    return false;
  }

  dispatch(
    changePasswordRequest({
      payload: values,
      formHelpers: formikBag,
      showNotification: alertDropdown,
      translate: t
    })
  );
};

const formikOptions = {
  handleSubmit: onSubmit,
  mapPropsToValues: () => {},
  validationSchema
};

export default hoistStatics(
  compose(
    connect(),
    withAlertDropdown,
    translate("root"),
    withFormik(formikOptions),
    // Has to be below withFormik
    withExitPrompt
  )
)(SettingsUpdatePassword);
