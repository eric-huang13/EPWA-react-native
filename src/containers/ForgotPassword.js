import React from "react";
import T from "prop-types";
import { connect } from "react-redux";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { translate } from "react-i18next";
import { compose } from "redux";
import { hoistStatics } from "recompose";
import { HeaderBackButton } from "react-navigation-stack";

import s from "./styles/ForgotPasswordStyles";

import Button from "../components/Button";
import HorseImageBackground from "../components/HorseImageBackground";
import TextInput from "../components/TextInput";
import withDismissKeyboard from "../components/DismissKeyboard";
import withAlert from "../components/withAlert";

import { forgotPasswordRequest } from "../actions/auth";
import { changeForm, clearError } from "../actions/authForm";

import iconMap from "../constants/iconMap";
import { colors } from "../themes";

const DismissKeyboardView = withDismissKeyboard(View);

class ForgotPasswordScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: navigation.getParam(
      "headerTitle",
      screenProps.t.t("headerBar.forgottenPassword")
    ),
    headerLeft: (
      <HeaderBackButton
        title={screenProps.t.t("headerBar.back")}
        tintColor={colors.nero}
        onPress={() => navigation.goBack()}
      />
    )
  });

  isAndroid = Platform.OS === "android";

  componentDidUpdate(prevProps) {
    if (!prevProps.data.error && this.props.data.error) {
      this.showAlert();
    }
  }

  showAlert = () => {
    const { t, showAlert, data } = this.props;

    if (data.error === "forgotEmailSuccededAlertMessage") {
      showAlert({
        title: t("auth.forgotEmailSuccededAlertTitle"),
        message: t(`auth.${data.error}`),
        buttonLabel: t("auth.forgotEmailSuccededAlertButtonLabel"),
        onDismiss: () => {
          this.props.dispatch(clearError());
          this.props.navigation.navigate("SignIn");
        }
      });
      return;
    }

    showAlert({
      title: t("errors.alertTitleGeneric"),
      message: t(`errors.${data.error}`),
      buttonLabel: t("errors.alertButtonLabelGeneric"),
      onDismiss: () => this.props.dispatch(clearError())
    });
  };

  handleSubmit = () => {
    this.props.dispatch(
      forgotPasswordRequest({ username: this.props.data.formState.username })
    );
  };

  emitChange = (username) => {
    this.props.dispatch(changeForm({ username, password: "" }));
  };

  render() {
    const { t } = this.props;
    const { formState, currentlySending } = this.props.data;

    return (
      <HorseImageBackground style={s.imageBackground}>
        <KeyboardAvoidingView
          style={[s.screenContainer, { paddingTop: 0 }]}
          behavior={this.isAndroid ? null : "padding"}
          enabled
        >
          <DismissKeyboardView style={s.screenContainer}>
            <TextInput
              style={{
                marginBottom: 10,
                width: 240
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="done"
              placeholder={t("auth.email")}
              value={formState.username}
              onChangeText={this.emitChange}
              onSubmitEditing={this.handleSubmit}
            />
            <Button
              style={s.button}
              disabled={currentlySending}
              label={
                currentlySending
                  ? t("auth.sendingRequest")
                  : t("auth.forgotPasswordSubmitBtn")
              }
              onPress={this.handleSubmit}
              iconName={iconMap.arrowRight}
            />
          </DismissKeyboardView>
        </KeyboardAvoidingView>
      </HorseImageBackground>
    );
  }
}

ForgotPasswordScreen.propTypes = {
  data: T.shape({
    formState: T.shape({
      username: T.string
    }),
    currentlySending: T.bool,
    error: T.string
  }),
  dispatch: T.func,
  showAlert: T.func,
  t: T.func
};

const mapStateToProps = (state) => ({
  data: state.authForm
});

export default hoistStatics(
  compose(
    connect(mapStateToProps),
    translate("root"),
    withAlert
  )
)(ForgotPasswordScreen);
