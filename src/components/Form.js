import React, { Component } from "react";
import T from "prop-types";
import { View } from "react-native";
import { translate } from "react-i18next";
import { compose } from "redux";

import s from "./styles/FormStyles";

import Button from "./Button";
import TextInput from "./TextInput";
import PasswordTextInput from "./PasswordTextInput";

import { changeForm } from "../actions/authForm";
import iconMap from "../constants/iconMap";

class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secure: true
    };
  }

  onSubmit = () => {
    this.props.onSubmit(this.props.data.username, this.props.data.password);
  };

  setPasswordFieldRef = (element) => {
    this.passwordField = element;
  };

  setEmailFieldRef = (element) => {
    this.emailField = element;
  };

  setFocusToPasswordField = () => {
    this.passwordField.focus();
  };

  changeUsername = (username) => {
    this.emitChange({ ...this.props.data, username });
  };

  changePassword = (password) => {
    this.emitChange({ ...this.props.data, password });
  };

  togglePasswordSecurity = () => {
    this.state.secure = !this.state.secure;
  };

  emitChange = (newFormState) => {
    this.props.dispatch(changeForm(newFormState));
  };

  render() {
    const { data, label, currentlySending, style, t } = this.props;

    return (
      <View style={[s.formContainer, style]}>
        <View style={s.fieldContainer}>
          <TextInput
            style={{
              marginRight: 10,
              marginBottom: 10
            }}
            ref={this.setEmailFieldRef}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            placeholder={t("auth.email")}
            value={data.username}
            onChangeText={this.changeUsername}
            onSubmitEditing={this.setFocusToPasswordField}
            blurOnSubmit={false}
          />
          <PasswordTextInput
            style={{ marginBottom: 10, width: 240 }}
            ref={this.setPasswordFieldRef}
            autoCapitalize="none"
            secureTextEntry={this.state.secure}
            placeholder={t("auth.password")}
            returnKeyType="send"
            value={data.password}
            onChangeText={this.changePassword}
            onSubmitEditing={this.onSubmit}
          />
        </View>
        <Button
          style={s.button}
          disabled={currentlySending}
          label={currentlySending ? t("auth.sendingRequest") : label}
          onPress={this.onSubmit}
          iconName={iconMap.arrowRight}
        />
      </View>
    );
  }
}

SignInForm.propTypes = {
  currentlySending: T.bool,
  dispatch: T.func,
  error: T.string,
  data: T.shape({
    username: T.string,
    password: T.string
  }),
  label: T.string,
  onSubmit: T.func,
  t: T.func,
  style: T.any // eslint-disable-line
};

export default compose(translate("root"))(SignInForm);
