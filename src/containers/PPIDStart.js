import React, { Component } from "react";
import { Image, ScrollView, View, Text } from "react-native";
import Touchable from "react-native-platform-touchable";

import HamburgerButton from "../components/HamburgerButton";

import { colors, fonts } from "../themes";

import photo from "../images/ppid.jpg";

class PPIDStart extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t("headerBar.syndromes"),
    headerTitleStyle: {
      ...fonts.style.h4,
      fontWeight: "400"
    },
    headerLeft: <HamburgerButton onPress={navigation.openDrawer} />
  });

  get navigation() {
    return this.props.navigation;
  }

  render() {
    const { t } = this.props.screenProps;

    return (
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
          <Text style={{ ...fonts.style.h4, marginBottom: 20 }}>
            {t("ppidCheck.startTitle")}
          </Text>
          <Text style={{ marginBottom: 20 }}>
            {t("ppidCheck.startContent")}
          </Text>
        </View>

        <View style={{ flexDirection: "row", width: "100%" }}>
          <Touchable
            onPress={() => this.navigation.navigate("PPIDQuestionA")}
            style={{
              minHeight: 60,
              backgroundColor: colors.egyptianBlueDark,
              justifyContent: "center",
              alignItems: "center",
              width: "100%"
            }}
          >
            <Text style={{ ...fonts.style.cta, color: colors.white }}>
              {t("ppidCheck.startButton")}
            </Text>
          </Touchable>
        </View>
      </ScrollView>
    );
  }
}

export default PPIDStart;
