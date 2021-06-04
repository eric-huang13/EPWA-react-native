import React from "react";
import T from "prop-types";
import { connect } from "react-redux";
import { StackActions, NavigationActions } from "react-navigation";
import { compose } from "redux";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { translate } from "react-i18next";
import { hoistStatics } from "recompose";

import googleLogo from "../images/google.png";
import appleLogo from "../images/apple.png";
import s from "./styles/SignInStyles";
import { colors, fonts } from "../themes";

import i18n from "../config/i18n";
import SignInForm from "../components/Form";
import Button from "../components/Button";
import Select from "../components/Select";
import HorseImageBackground from "../components/HorseImageBackground";
import withDismissKeyboard from "../components/DismissKeyboard";
import withAlert from "../components/withAlert";

import {
  loginRequest,
  googleLoginRequest,
  facebookLoginRequest,
  appleLoginRequest
} from "../actions/auth";
import { setLanguage } from "../actions/language";
import { clearError } from "../actions/authForm";
import iconMap from "../constants/iconMap";
import { getLanguageSelectItems } from "../services/language";

const DismissKeyboardView = withDismissKeyboard(View);

class SignInScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.getParam("headerTitle", i18n.t("headerBar.login"))
  });

  constructor(props) {
    super(props);

    this.state = {
      isKeyboardActive: false
    };

    this.isAndroid = Platform.OS === "android";
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      this.isAndroid ? "keyboardDidShow" : "keyboardWillShow",
      this.onKeyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      this.isAndroid ? "keyboardDidHide" : "keyboardWillHide",
      this.onKeyboardDidHide
    );
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.data.error && this.props.data.error) {
      const { error } = this.props.data;
      if (
        error === "forgotEmailGeneric" ||
        error === "forgotEmailSuccededAlertMessage"
      ) {
        return;
      }
      this.showAlert();
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  onKeyboardDidShow = () => this.setState({ isKeyboardActive: true });

  onKeyboardDidHide = () => this.setState({ isKeyboardActive: false });

  // TODO: Disable button until all of the required fields are filled in
  // TODO: Rename it to "handleError" and depending on type of error, style input fields accordingly or show error Alert
  showAlert = () => {
    const { t, showAlert, data } = this.props;

    showAlert({
      title: t("errors.alertTitleGeneric"),
      message: t(`errors.${data.error}`),
      buttonLabel: t("errors.alertButtonLabelGeneric"),
      onDismiss: () => this.props.dispatch(clearError())
    });
  };

  handleAppleLoginRequest = () => {
    this.props.dispatch(appleLoginRequest());
  };

  handleEmailLoginRequest = (username, password) => {
    this.props.dispatch(loginRequest({ username, password }));
  };

  handleGoogleLoginRequest = () => this.props.dispatch(googleLoginRequest());

  handleFacebookLoginRequest = () => {
    this.props.dispatch(facebookLoginRequest());
  };

  handleLanguangeChangeRequest = langCode => {
    this.props.dispatch(setLanguage(langCode));

    // We have to manually trigger update of header title as it's static property of a class and is not updated automatically
    this.props.navigation.setParams({
      headerTitle: this.props.t("headerBar.login")
    });
  };

  handleForgotPasswordRequest = () => {
    this.props.navigation.navigate("ForgotPassword");
  };

  handleRegistrationRequest = () => {
    const actionToDispatch = StackActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: "StartUp" }),
        NavigationActions.navigate({ routeName: "SignUp" })
      ]
    });
    this.props.navigation.dispatch(actionToDispatch);
  };

  render() {
    const { dispatch, t } = this.props;
    const { formState, currentlySending } = this.props.data;
    const renderGoogleLogo = () => <Image source={googleLogo} />;
    const renderAppleLogo = () => <Image source={appleLogo} />;
    const renderRegisterLink = () => (
      <TouchableOpacity onPress={this.handleRegistrationRequest}>
        <Text style={[s.register, { ...fonts.style.cta }]}>
          {t("auth.noAccountRegister")}
        </Text>
      </TouchableOpacity>
    );

    return (
      <HorseImageBackground style={s.imageBackground}>
        <DismissKeyboardView style={s.screenContainer}>
          <KeyboardAvoidingView
            keyboardVerticalOffset={this.isAndroid ? 0 : 50}
            behavior={this.isAndroid ? null : "padding"}
            style={s.screenContainer}
            enabled
          >
            <View style={s.contentWrapper}>
              <Select
                placeholder={{}}
                items={getLanguageSelectItems(i18n.language, t)}
                onValueChange={this.handleLanguangeChangeRequest}
                value={i18n.language}
              />
              <View style={s.socialWrapper}>
                <Button
                  style={s.googleBtn}
                  backgroundColor={colors.egyptianBlue}
                  label={t("auth.loginGoogle")}
                  onPress={this.handleGoogleLoginRequest}
                  icon={renderGoogleLogo()}
                  containerStyles={{
                    paddingHorizontal: 18,
                    alignItems: "center"
                  }}
                  textStyles={{ textAlign: "left" }}
                />
                <Button
                  style={s.facebookBtn}
                  backgroundColor={colors.egyptianBlue}
                  label={t("auth.loginFB")}
                  onPress={this.handleFacebookLoginRequest}
                  iconName={iconMap.facebook}
                  containerStyles={{ paddingHorizontal: 18, alignItems: "center" }}
                  textStyles={{ textAlign: "left" }}
                />
                {Platform.OS == "ios" &&
                  <Button
                    style={s.appleBtn}
                    backgroundColor={colors.egyptianBlue}
                    label={t("auth.loginApple")}
                    onPress={this.handleAppleLoginRequest}
                    icon={renderAppleLogo()}
                    containerStyles={{ paddingHorizontal: 18, alignItems: "center" }}
                    textStyles={{ textAlign: "left" }}
                  />
                }
              </View>
              <SignInForm
                data={formState}
                dispatch={dispatch}
                label={t("auth.login")}
                onSubmit={this.handleEmailLoginRequest}
                currentlySending={currentlySending}
              />
              <TouchableOpacity onPress={this.handleForgotPasswordRequest}>
                <Text style={[s.forgottenPassword, { ...fonts.style.cta }]}>
                  {t("auth.forgottenPassword")}
                </Text>
              </TouchableOpacity>
            </View>
            {!this.state.isKeyboardActive ? renderRegisterLink() : null}
          </KeyboardAvoidingView>
        </DismissKeyboardView>
      </HorseImageBackground>
    );
  }
}

SignInScreen.propTypes = {
  data: T.shape({
    formState: T.shape({
      username: T.string,
      password: T.string
    }),
    currentlySending: T.bool,
    error: T.string
  }),
  dispatch: T.func,
  showAlert: T.func,
  t: T.func
};

const mapStateToProps = state => ({
  data: state.authForm
});

export default hoistStatics(
  compose(
    connect(mapStateToProps),
    translate("root"),
    withAlert
  )
)(SignInScreen);
