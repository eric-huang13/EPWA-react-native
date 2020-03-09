import React, { Component } from "react";
import { ScrollView, View, Text, Image } from "react-native";
import { translate } from "react-i18next";
import HamburgerButton from "../components/HamburgerButton";

import Button from "../components/Button";

import takenphoto from "../images/epwa/horse_crop_1.png";

import s from "./styles/EPWAStyles";

import { colors, fonts } from "../themes";

class EPWAPhotoIsGood extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t("headerBar.epwaphotoupload"),
    headerTitleStyle: {
      ...fonts.style.h4,
      fontWeight: "400"
    },
    headerLeft: <HamburgerButton onPress={navigation.openDrawer} />
  });

  images = {
    horsecrop: takenphoto,
  };

  get navigation() {
    return this.props.navigation;
  }

  render() {
    const { t } = this.props.screenProps;

    const desc_content = t("info.epwaphotoupload.thirdpage", { returnObjects: true });

    return (
      <View style={s.mainContainer}>
        <ScrollView
          contentContainerStyle={s.scrollViewContainerStyle}
        >
          <View key={desc_content.question}>
            <Text style={s.titleStyle}>{desc_content.question}</Text>
            <View style={s.cropPhotoContainer}>
              <Image
                source={this.images[desc_content.imageTitle]}
                style={s.cropImg}
              />
            </View>
          </View>
          <View style={s.photoIsGoodButtonContainer}>
            <Button
              style={s.photoIsGoodLButton}
              label={desc_content.lbuttonText}
              onPress={() => this.navigation.navigate("EPWATakePhoto")}
            />
            <Button
              style={s.photoIsGoodRButton}
              label={desc_content.rbuttonText}
              onPress={() => this.navigation.navigate("EPWACropImageA")}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default translate("root")(EPWAPhotoIsGood);
