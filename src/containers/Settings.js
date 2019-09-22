import React from "react";
import T from "prop-types";
import { connect } from "react-redux";
import {
  ImageBackground,
  ScrollView,
  View,
  Text,
  TouchableHighlight,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { translate } from "react-i18next";
import { compose } from "redux";
import { hoistStatics } from "recompose";
import Touchable from "react-native-platform-touchable";

import s from "./styles/SettingsStyles";

import i18n from "../config/i18n";
import Button from "../components/Button";
import Icon from "../components/Icon";
import HamburgerButton from "../components/HamburgerButton";
import Select from "../components/Select";
import TextInput from "../components/TextInput";
import withDismissKeyboard from "../components/DismissKeyboard";
import withAlert from "../components/withAlert";
import withImagePicker from "../components/withImagePicker";

import { colors, fonts } from "../themes";
import iconMap from "../constants/iconMap";
import { getLanguageSelectItems } from "../services/language";

import {
  changeProfileForm,
  clearProfileFormError
} from "../actions/profileForm";
import { updateProfileRequest } from "../actions/profile";
import { setLanguage } from "../actions/language";
import { getToken } from "../selectors/auth";

const DismissKeyboardView = withDismissKeyboard(ScrollView);

class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: navigation.getParam("title", screenProps.t.t("headerBar.settings")),
    headerLeft: <HamburgerButton onPress={navigation.openDrawer} />
  });

  componentDidMount() {
    if (this.props.initialValue) {
      const {
        firstName,
        lastName,
        email,
        pictureUrl
      } = this.props.initialValue;

      this.props.dispatch(
        changeProfileForm({ firstName, lastName, email, pictureUrl })
      );
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.data.error && this.props.data.error) {
      this.showAlert();
    }
  }

  isAndroid = Platform.OS === "android";

  showAlert = () => {
    const { t, showAlert, data } = this.props;

    // TODO: Clean up the labels
    if (data.error === "profileUpdateSuccess") {
      showAlert({
        title: t("auth.forgotEmailSuccededAlertTitle"),
        message: t(`profileUpdateSuccess`),
        buttonLabel: t("auth.forgotEmailSuccededAlertButtonLabel"),
        onDismiss: () => {
          this.props.dispatch(clearProfileFormError());
          if (this.props.initialValue) {
            const { firstName, lastName, pictureUrl } = this.props.initialValue;

            this.props.dispatch(
              changeProfileForm({ firstName, lastName, pictureUrl })
            );
          }
        }
      });
      return;
    }

    showAlert({
      title: t("errors.alertTitleGeneric"),
      message: t(`errors.${data.error}`),
      buttonLabel: t("errors.alertButtonLabelGeneric"),
      onDismiss: this.props.dispatch(clearProfileFormError())
    });
  };

  handleSubmit = () => {
    const {
      firstName,
      lastName,
      pictureUrl,
      email
    } = this.props.data.formState;

    const payload = { firstName, lastName, email };
    if (this.props.initialValue.pictureUrl !== pictureUrl) {
      payload.pictureUrl = pictureUrl;
    }

    this.props.dispatch(updateProfileRequest(payload));
  };

  changeFirstName = (firstName) => {
    this.props.dispatch(changeProfileForm({ firstName }));
  };

  changeLastName = (lastName) => {
    this.props.dispatch(changeProfileForm({ lastName }));
  };

  changeEmail = (email) => {
    this.props.dispatch(changeProfileForm({ email }));
  };

  handleLanguangeChangeRequest = (langCode) => {
    this.props.dispatch(setLanguage(langCode));

    // Force header to be rerendered when lang changes
    this.props.navigation.setParams({
      title: this.props.t("headerBar.settings")
    });
  };

  render() {
    const { authToken, t } = this.props;
    const { formState, currentlySending } = this.props.data;

    // TODO: Add DismissKeyboardView and ScrollView, make fields more accessible - type "email" and click next to focus next field
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <KeyboardAvoidingView
          behavior={this.isAndroid ? null : "padding"}
          enabled
          style={{ flex: 1 }}
          keyboardVerticalOffset={this.isAndroid ? 64 : 80}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              backgroundColor: colors.white
            }}
          >
            <TouchableHighlight
              onPress={() =>
                this.props.showImagePicker((url) => {
                  // If user cancels picker, url will be undefined
                  if (url)
                    this.props.dispatch(changeProfileForm({ pictureUrl: url }));
                })
              }
            >
              {formState.pictureUrl ? (
                <ImageBackground
                  source={{
                    uri: formState.pictureUrl,
                    headers: { Authorization: `Bearer ${authToken}` }
                  }}
                  style={s.photoContainer}
                >
                  <View style={s.photoContainer}>
                    {/* Using third, hidden element to align icon to the buttom
                      and text to the center (justify-content: space-between)
                  */}
                    <View style={{ height: 32 }} />
                    <Text style={{ ...fonts.style.h4, color: colors.white }}>
                      {t("clickToChangePhoto")}
                    </Text>
                    <Icon
                      name={iconMap.camera}
                      size={32}
                      color={colors.white}
                    />
                  </View>
                </ImageBackground>
              ) : (
                <View style={s.photoContainer}>
                  <View
                    style={[
                      s.photoContainer,
                      { backgroundColor: colors.mediumPurple }
                    ]}
                  >
                    {/* Using third, hidden element to align icon to the buttom
                      and text to the center (justify-content: space-between)
                  */}
                    <View style={{ height: 32 }} />
                    <Text style={{ ...fonts.style.h4, color: colors.white }}>
                      {t("clickToAddPhoto")}
                    </Text>
                    <Icon
                      name={iconMap.camera}
                      size={32}
                      color={colors.white}
                    />
                  </View>
                </View>
              )}
            </TouchableHighlight>
            {!this.props.isSocialUser && (
              <Touchable
                onPress={() => {
                  this.props.navigation.navigate("SettingsUpdatePassword");
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minHeight: 70,
                    paddingLeft: 20,
                    paddingRight: 30,
                    borderBottomColor: colors.darkFilter,
                    borderBottomWidth: 1
                  }}
                >
                  <Text style={{ ...fonts.style.h4 }}>
                    {this.props.t("updatePasswordLink")}
                  </Text>
                  <Icon
                    name={iconMap.arrowRight}
                    size={20}
                    color={colors.nero}
                  />
                </View>
              </Touchable>
            )}
            <View style={s.langContainer}>
              <Select
                showBorder
                placeholder={{}}
                items={getLanguageSelectItems(i18n.language, t)}
                onValueChange={this.handleLanguangeChangeRequest}
                value={i18n.language}
              />
            </View>
            <View style={s.field}>
              <Text>{t("firstName")}</Text>
              <TextInput
                autoCapitalize="none"
                returnKeyType="next"
                placeholder={t("firstName")}
                value={formState.firstName}
                onChangeText={this.changeFirstName}
              />
            </View>
            <View style={s.field}>
              <Text>{t("lastName")}</Text>
              <TextInput
                autoCapitalize="none"
                returnKeyType="next"
                placeholder={t("lastName")}
                value={formState.lastName}
                onChangeText={this.changeLastName}
              />
            </View>
            <View style={s.field}>
              <Text>{t("email")}</Text>
              <TextInput
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                placeholder={t("email")}
                value={formState.email}
                onChangeText={this.changeEmail}
              />
            </View>
            {/* TODO: Make the button disabled when there were no changes in form */}
            <View style={s.buttonContainer}>
              <Button
                style={s.button}
                disabled={currentlySending}
                label={
                  currentlySending
                    ? t("auth.sendingRequest")
                    : t("updateProfileSubmitBtn")
                }
                onPress={this.handleSubmit}
                iconName={iconMap.arrowRight}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

SettingsScreen.propTypes = {
  authToken: T.string,
  data: T.shape({
    formState: T.shape({
      firstName: T.string,
      lastName: T.string,
      pictureUrl: T.string,
      email: T.string
    }),
    currentlySending: T.bool,
    error: T.string
  }),
  dispatch: T.func,
  showAlert: T.func,
  showImagePicker: T.func,
  t: T.func
};

const mapStateToProps = (state) => ({
  authToken: getToken(state),
  data: state.profileForm,
  initialValue: state.profile,
  // Provider is defined only when user logged in with social account
  isSocialUser: state.auth.provider
});

export default hoistStatics(
  compose(
    connect(mapStateToProps),
    translate("root"),
    withAlert,
    withImagePicker
  )
)(SettingsScreen);
