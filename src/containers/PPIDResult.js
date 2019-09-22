import React, { Component } from "react";
import { Image, ScrollView, View, Text } from "react-native";
import { HeaderBackButton } from "react-navigation-stack";
import Touchable from "react-native-platform-touchable";
import { any, pick, equals, compose, values, pickBy, omit } from "ramda";

import { colors, fonts } from "../themes";

import photo from "../images/ppid.jpg";

class PPIDResult extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t("headerBar.syndromes"),
    headerTitleStyle: {
      ...fonts.style.h4,
      fontWeight: "400"
    },
    headerLeft: (
      <HeaderBackButton
        tintColor={colors.nero}
        onPress={() => navigation.goBack()}
      />
    )
  });

  get form() {
    return this.props.screenProps.form;
  }

  get values() {
    return this.form.values;
  }

  get navigation() {
    return this.props.navigation;
  }

  isSick = (answers) => {
    const alphabeticFields = pick(["a", "b", "c", "d"])(answers);

    if (any(equals(true))(values(alphabeticFields))) {
      return true;
    }

    const yesAnsweresForNumberFields = compose(
      values,
      pickBy(equals(true)),
      omit(["a", "b", "c", "d"])
    )(answers);

    if (yesAnsweresForNumberFields.length > 3) {
      return true;
    }

    return false;
  };

  render() {
    const { t } = this.props.screenProps;

    const isSick = this.isSick(this.values);

    const title = isSick
      ? t("ppidCheck.resultTitlePositive")
      : t("ppidCheck.resultTitleNegative");
    const content = isSick
      ? t("ppidCheck.resultContentPositive")
      : t("ppidCheck.resultContentNegative");

    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
            backgroundColor: colors.white
          }}
        >
          <Image
            source={photo}
            style={{
              height: 245,
              width: "100%",
              backgroundColor: colors.mediumPurple
            }}
          />
          <View style={{ padding: 20, flexGrow: 1 }}>
            <Text style={{ ...fonts.style.h4, marginBottom: 20 }}>{title}</Text>
            <Text style={{ marginBottom: 20 }}>{content}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Touchable
              onPress={() => {
                this.navigation.popToTop();
              }}
              style={{
                flex: 1,
                minHeight: 60,
                backgroundColor: colors.egyptianBlueDark,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={{ ...fonts.style.cta, color: colors.white }}>
                {t("ppidCheck.resultExitButton")}
              </Text>
            </Touchable>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default PPIDResult;
