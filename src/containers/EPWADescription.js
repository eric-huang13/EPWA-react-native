import React, { Component } from "react";
import { ScrollView, View, Text, Image } from "react-native";
import { translate } from "react-i18next";

import Button from "../components/Button";
import HamburgerButton from "../components/HamburgerButton";

import grouphorsephoto from "../images/epwa/epwa_horse.png";

import s from "./styles/EPWAStyles";

import { fonts } from "../themes";

class EPWADescription extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t("headerBar.epwaphotoupload"),
    headerTitleStyle: {
      ...fonts.style.h4,
      fontWeight: "400"
    },
    headerLeft: <HamburgerButton onPress={navigation.openDrawer} />
  });

  images = {
    grouphorse: grouphorsephoto,
  };

  get navigation() {
    return this.props.navigation;
  }

  render() {
    const { t } = this.props.screenProps;

    const desc_content = t("info.epwaphotoupload.firstpage", { returnObjects: true });

    return (
      <View style={s.mainContainer}>
        <ScrollView
          contentContainerStyle={s.scrollViewContainerStyle}
        >
          <View key={desc_content.title}>
            <Text style={s.titleStyle}>{desc_content.title}</Text>
            <Text style={s.desc_text}>{desc_content.content}</Text>
            <Text style={s.titleStyle}>{desc_content.exphotoTitle}</Text>
            <View style={s.photoContainer}>
              <Image
                source={this.images[desc_content.imageTitle]}
                style={s.cropDescImg}
              />
            </View>
          </View>
          <View style={s.buttonContainer}>
            <Button
              style={s.button}
              label={desc_content.buttonText}
              onPress={() => this.navigation.navigate("EPWACropImageDesc")}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default translate("root")(EPWADescription);
