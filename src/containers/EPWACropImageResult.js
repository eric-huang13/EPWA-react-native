import React, { Component } from "react";
import { ScrollView, View, Text } from "react-native";
import { translate } from "react-i18next";

import Button from "../components/Button";
import HamburgerButton from "../components/HamburgerButton";

import s from "./styles/EPWAStyles";

import { fonts } from "../themes";

class EPWACropImageResult extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t("headerBar.epwaphotoupload"),
    headerTitleStyle: {
      ...fonts.style.h4,
      fontWeight: "400"
    },
    headerLeft: <HamburgerButton onPress={navigation.openDrawer} />
  });
 
  get navigation() {
    return this.props.navigation;
  }

  go_to_stable = () => {
    const {t} = this.props.screenProps;

    this.props.screenProps.t.t = t;
    this.navigation.navigate("Stable");
  }

  render() {
    const { t } = this.props;

    const desc_content = t("info.epwaphotoupload.lastpage", { returnObjects: true });

    return (
      <View style={s.mainContainer}>
        <ScrollView
          contentContainerStyle={s.scrollViewContainerStyle}
        >
          <View key={desc_content.title}>
            <Text style={s.titleStyle}>{desc_content.title}</Text>
            <Text style={s.desc_text}>{desc_content.content}</Text>
          </View>
          <View style={s.buttonContainer}>
            <Button
              style={s.button}
              label={desc_content.buttonText}
              onPress={() => {this.go_to_stable()}}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default translate("root")(EPWACropImageResult);
