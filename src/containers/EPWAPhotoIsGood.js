import React, { Component } from "react";
import { ScrollView, View, Text } from "react-native";
import { translate } from "react-i18next";
import HamburgerButton from "../components/HamburgerButton";
import FastImage from "react-native-fast-image";

import Button from "../components/Button";

import s from "./styles/EPWAStyles";

import { colors, fonts } from "../themes";
import {getImageScaleSize} from '../transforms';



class EPWAPhotoIsGood extends Component {
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

  render() {
    const { t } = this.props.screenProps;
    const { state } = this.props.navigation;
    const image = state && state.params && state.params.image;

    const { imageWidth, imageHeight } = getImageScaleSize(image.width, image.height);

    const desc_content = t("info.epwaphotoupload.thirdpage", { returnObjects: true });
    return (
      <View style={s.mainContainer}>
        <ScrollView
          contentContainerStyle={s.scrollViewContainerStyle}
        >
          <View key={desc_content.question}>
            <Text style={s.titleStyle}>{desc_content.question}</Text>
            <View style={s.cropPhotoContainer}>
              <FastImage
                style={[s.cropImg, {width: imageWidth * 0.9, height: imageHeight * 0.9}]}
                source={image}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          </View>
          <View style={s.photoIsGoodButtonContainer}>
            <Button
              style={s.photoIsGoodLButton}
              label={desc_content.lbuttonText}
              onPress={() => this.navigation.navigate("EPWACropImageDesc")}
            />
            <Button
              style={s.photoIsGoodRButton}
              label={desc_content.rbuttonText}
              onPress={() => this.navigation.navigate("EPWACropImageA", {"image": image})}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default translate("root")(EPWAPhotoIsGood);
