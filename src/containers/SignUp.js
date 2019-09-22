import React from "react";
import T from "prop-types";
import { connect } from "react-redux";
import { StackActions, NavigationActions } from "react-navigation";
import {
  Image,
  Text,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Platform
} from "react-native";
import Touchable from "react-native-platform-touchable";
import { translate } from "react-i18next";
import { hoistStatics } from "recompose";
import { compose } from "redux";

import googleLogo from "../images/google.png";
import s from "./styles/SignInStyles";
import { colors, fonts } from "../themes";

import i18n from "../config/i18n";
import SignInForm from "../components/Form";
import Button from "../components/Button";
import Select from "../components/Select";
import HorseImageBackground from "../components/HorseImageBackground";
import withDismissKeyboard from "../components/DismissKeyboard";
import withAlert from "../components/withAlert";
import { getLanguageSelectItems } from "../services/language";

import {
  registerRequest,
  googleLoginRequest,
  facebookLoginRequest
} from "../actions/auth";
import { setLanguage } from "../actions/language";
import { clearError } from "../actions/authForm";
import iconMap from "../constants/iconMap";

const DismissKeyboardView = withDismissKeyboard(View);

class SignUpScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: navigation.getParam(
      "headerTitle",
      screenProps.t.t("headerBar.register")
    )
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
      "keyboardDidShow",
      this.onKeyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this.onKeyboardDidHide
    );
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.data.error && this.props.data.error) {
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

  handleEmailLoginRequest = (username, password) => {
    this.props.dispatch(registerRequest({ username, password }));
  };

  handleGoogleLoginRequest = () => this.props.dispatch(googleLoginRequest());

  handleFacebookLoginRequest = () => {
    this.props.dispatch(facebookLoginRequest());
  };

  handleLanguangeChangeRequest = (langCode) => {
    this.props.dispatch(setLanguage(langCode));

    // We have to manually trigger update of header title as it's static property of a class and is not updated automatically
    this.props.navigation.setParams({
      headerTitle: i18n.t("headerBar.register")
    });
  };

  handleLoginRequest = () => {
    const actionToDispatch = StackActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: "StartUp" }),
        NavigationActions.navigate({ routeName: "SignIn" })
      ]
    });
    this.props.navigation.dispatch(actionToDispatch);
  };

  render() {
    const { dispatch, t } = this.props;
    const { formState, currentlySending } = this.props.data;

    const renderGoogleLogo = () => <Image source={googleLogo} />;
    const renderLoginLink = () => (
      <Touchable onPress={this.handleLoginRequest}>
        <Text style={[s.forgottenPassword, { ...fonts.style.cta }]}>
          {t("auth.alreadyHaveAccount")}
        </Text>
      </Touchable>
    );

    return (
      <HorseImageBackground style={s.imageBackground}>
        <DismissKeyboardView style={s.screenContainer}>
          <KeyboardAvoidingView
            style={s.screenContainer}
            keyboardVerticalOffset={this.isAndroid ? 0 : 50}
            behavior={this.isAndroid ? null : "padding"}
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
                {/* TODO: Align items properly, it's not aligned with the other button */}
                <Button
                  style={s.googleBtn}
                  backgroundColor={colors.egyptianBlue}
                  label={t("auth.login")}
                  onPress={this.handleGoogleLoginRequest}
                  icon={renderGoogleLogo()}
                  containerStyles={{ paddingHorizontal: 18 }}
                  textStyles={{ textAlign: "left" }}
                />
                <Button
                  style={s.facebookBtn}
                  backgroundColor={colors.egyptianBlue}
                  label={t("auth.login")}
                  onPress={this.handleFacebookLoginRequest}
                  iconName={iconMap.facebook}
                  containerStyles={{ paddingHorizontal: 18 }}
                  textStyles={{ textAlign: "left" }}
                />
              </View>
              <SignInForm
                data={formState}
                dispatch={dispatch}
                label={t("auth.registerSubmitBtn")}
                onSubmit={this.handleEmailLoginRequest}
                currentlySending={currentlySending}
              />
              {renderLoginLink()}
            </View>
          </KeyboardAvoidingView>
        </DismissKeyboardView>
      </HorseImageBackground>
    );
  }
}

SignUpScreen.propTypes = {
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

const mapStateToProps = (state) => ({
  data: state.authForm
});

export default hoistStatics(
  compose(
    connect(mapStateToProps),
    translate("root"),
    withAlert
  )
)(SignUpScreen);
