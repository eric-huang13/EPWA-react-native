import React, { Component } from "react";
import {
  Alert,
  Image,
  View,
  ScrollView,
  Text,
} from "react-native";
import HamburgerButton from "../components/HamburgerButton";
import { last } from "ramda";

import Button from "../components/Button";

import { colors, fonts } from "../themes";

import horsecropphoto from "../images/epwa/horse_crop_1.png";

import s from "./styles/EPWAStyles";
import {getImageScaleSize} from '../transforms';

class EPWACropImage extends Component {
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

  get setFieldValue() {
    return this.props.screenProps.form.setFieldValue;
  }

  getContent = (routeName) => {
    const { t } = this.props.screenProps;
    const { state } = this.props.navigation;
    const image = state && state.params && state.params.image;
    const lastLetterInRoute = last(routeName).toLowerCase();

    const images = {
      horsecrop: horsecropphoto,
    };

    let desc_content= {};
 
    switch(lastLetterInRoute) {
      case "a":
        desc_content = t("info.epwaphotoupload.forthpage", { returnObjects: true });

        break;
      case "b":
        desc_content = t("info.epwaphotoupload.fifthpage", { returnObjects: true });

        break;
      case "c":
        desc_content = t("info.epwaphotoupload.sixthpage", { returnObjects: true });

        break;
      case "d":
        desc_content = t("info.epwaphotoupload.seventhpage", { returnObjects: true });

        break;
      default:
        desc_content = t("info.epwaphotoupload.forthpage", { returnObjects: true });

        break;
    }

    return {
      fieldName: lastLetterInRoute,
      image: image,
      title: desc_content.question,
      lbuttonText: desc_content.lbuttonText,
      rbuttonText: desc_content.rbuttonText
    };
  };

  onHandleCrop = (fieldName, hasCropedYes) => {
    this.setFieldValue(fieldName, hasCropedYes);

    if (fieldName === "a") {
      this.navigation.navigate("EPWACropImageB");
      return;
    }

    if (fieldName === "b") {
      this.navigation.navigate("EPWACropImageC");
      return;
    }

    if (fieldName === "c") {
      this.navigation.navigate("EPWACropImageD");
      return;
    }

    if (fieldName === "d") {
      if(hasCropedYes) {
        this.navigation.navigate("EPWACropImageResult");
      } else {
        this.navigation.navigate("EPWACropImageA")
      }
      return;
    }
  };

  render() {
    const { t } = this.props.screenProps;
    const content = this.getContent(this.navigation.state.routeName);
    const { imageWidth, imageHeight } = getImageScaleSize(content.image.width, content.image.height);
    console.log('content', content)

    return (
      <View style={s.mainContainer}>
        <ScrollView
          contentContainerStyle={s.scrollViewContainerStyle}
        >
          <View key={content.title}>
            <Text style={s.titleStyle}>{content.title}</Text>
            <View style={s.cropPhotoContainer}>
              <Image
                source={content.image}
                style={s.cropImg}
                width={imageWidth}
                height={imageHeight}
              />
            </View>
          </View>
          {content.rbuttonText &&
            <View style={s.photoIsGoodButtonContainer}>
              <Button
                style={s.cropImgLButton}
                label={content.lbuttonText}
                onPress={() => this.onHandleCrop(content.fieldName, false)}
              />
              <Button
                style={s.cropImgRButton}
                label={content.rbuttonText}
                onPress={() => this.onHandleCrop(content.fieldName, true)}
              />
            </View>
          }
          {!content.rbuttonText &&
            <View style={s.cropImgButtonContainer}>
              <Button
                style={s.button}
                label={content.lbuttonText}
                onPress={() => this.onHandleCrop(content.fieldName, true)}
              />
            </View>
          }
        </ScrollView>
      </View>
    );
  }
}

export default EPWACropImage;
