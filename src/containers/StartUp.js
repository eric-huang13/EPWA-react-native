import React, { Component } from "react";
import T from "prop-types";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { StatusBar, Text, View } from "react-native";

import s from "./styles/StartUpStyles";

import Button from "../components/Button";
import Icon from "../components/Icon";
import HorseImageBackground from "../components/HorseImageBackground";

import { colors } from "../themes";
import iconMap from "../constants/iconMap";

class StartUpScreen extends Component {
  static navigationOptions = {
    header: null
  };

  onMeasurementBtnPress = () =>
    this.props.navigation.navigate("painMeasurement", {
      redirectPath: "SignUp"
    });
  onLoginBtnPress = () => this.props.navigation.navigate("SignIn");
  onRegistrationBtnPress = () => this.props.navigation.navigate("SignUp");

  render() {
    const { t } = this.props;

    return (
      <HorseImageBackground style={s.imageBackground}>
        <StatusBar
          barStyle="light-content"
          translucent={true}
          backgroundColor={"transparent"}
        />
        <View style={[s.screenContainer, s.screen]}>
          <View style={[s.wrapper]}>
            <Icon
              style={s.logo}
              name={iconMap.logo}
              size={100}
              color={colors.white}
            />
            <Icon
              style={s.logoText}
              name={iconMap.logoText}
              size={70}
              color={colors.white}
            />
            <Text style={s.description}>{t("appName")}</Text>
            <Button
              style={s.painMeasurementBtn}
              label={t("startPainMeasurement")}
              onPress={this.onMeasurementBtnPress}
              iconName={iconMap.arrowRight}
            />
            <Button
              style={s.loginBtn}
              label={t("auth.login")}
              onPress={this.onLoginBtnPress}
              iconName={iconMap.arrowRight}
            />
            <Button
              style={s.loginBtn}
              label={t("auth.register")}
              onPress={this.onRegistrationBtnPress}
              iconName={iconMap.arrowRight}
            />
          </View>
        </View>
      </HorseImageBackground>
    );
  }
}

StartUpScreen.propTypes = {
  t: T.func
};

export default connect()(translate("root")(StartUpScreen));
