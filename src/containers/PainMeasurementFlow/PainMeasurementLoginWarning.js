import React, { Component } from "react";
import { ScrollView, View, Text, Platform } from "react-native";
import { onlyUpdateForKeys, hoistStatics } from "recompose";
import { HeaderBackButton } from "react-navigation-stack";

import ActionButtonNext from "../../components/ActionButtonNext";
import Button from "../../components/Button";

import iconMap from "../../constants/iconMap";
import { colors, fonts } from "../../themes";

class PainMeasurementLoginWarning extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t("painMeasurement.misc.headerTitle"),
    headerTitleStyle: {
      ...fonts.style.h4,
      fontWeight: "400",
    },
    headerStyle: Platform.OS === 'ios'? {
      marginTop: 20,
      paddingBottom: 10,
    } : {},
    headerLeft: (
      <HeaderBackButton
        tintColor={colors.nero}
        onPress={() => navigation.goBack()}
      />
    ),
  });

  render() {
    const { t } = this.props.screenProps;

    return (
      <View style={{ flex: 1, backgroundColor: colors.egyptianBlue }}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            backgroundColor: colors.egyptianBlue,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              paddingHorizontal: 30,
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  ...fonts.style.h4,
                  color: colors.white,
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                {t("painMeasurementLoginWarning")}
              </Text>
              <Button
                style={{
                  width: 240,
                  marginBottom: 20,
                  shadowOpacity: 0.5,
                  shadowRadius: 5,
                  shadowColor: colors.black,
                  shadowOffset: { height: 3, width: 0 },
                  elevation: 1,
                }}
                backgroundColor={colors.mediumPurple}
                label={t("auth.login")}
                onPress={() => this.props.navigation.navigate("SignIn")}
                iconName={iconMap.arrowRight}
              />
              <Button
                style={{
                  width: 240,
                  marginBottom: 20,
                  shadowOpacity: 0.5,
                  shadowRadius: 5,
                  shadowColor: colors.black,
                  shadowOffset: { height: 3, width: 0 },
                  elevation: 1,
                }}
                backgroundColor={colors.mediumPurple}
                label={t("auth.register")}
                onPress={() => this.props.navigation.navigate("SignUp")}
                iconName={iconMap.arrowRight}
              />
            </View>
          </View>
        </ScrollView>
        <ActionButtonNext
          onPress={() => this.props.navigation.navigate("PainMeasurementStart")}
        />
      </View>
    );
  }
}

// As it is static content, do not rerender it when any of the props changes.
export default hoistStatics(onlyUpdateForKeys([]))(PainMeasurementLoginWarning);
