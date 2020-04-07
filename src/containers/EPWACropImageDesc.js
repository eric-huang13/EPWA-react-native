import React, { Component } from "react";
import { ScrollView, View, Text, Image } from "react-native";
import { CheckBox } from 'react-native-elements'
import { translate } from "react-i18next";

import Button from "../components/Button";
import HamburgerButton from "../components/HamburgerButton";

import exhorsecropphoto from "../images/epwa/horse_crop_2.png";
import checkedbtnImg from "../images/epwa/epwa_checkbox_checked.png";
import uncheckedbtnImg from "../images/epwa/epwa_checkbox_unchecked.png";

import s from "./styles/EPWAStyles";

import { colors, fonts } from "../themes";

class EPWACropImageDesc extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t("headerBar.epwaphotoupload"),
    headerTitleStyle: {
      ...fonts.style.h4,
      fontWeight: "400"
    },
    headerLeft: <HamburgerButton onPress={navigation.openDrawer} />
  });

  state = {
    checked: false,
  };

  images = {
    exhorsecrop: exhorsecropphoto,
    checkedbtnImg: checkedbtnImg,
    uncheckedbtnImg: uncheckedbtnImg
  };

  get navigation() {
    return this.props.navigation;
  }

  render() {
    const { t } = this.props.screenProps;

    const desc_content = t("info.epwaphotoupload.secondpage", { returnObjects: true });

    return (
      <View style={s.mainContainer}>
        <ScrollView
          contentContainerStyle={s.scrollViewContainerStyle}
        >
          <View key={desc_content.title}>
            <Text style={s.titleStyle}>{desc_content.title}</Text>
            <Text style={s.desc_text}>{desc_content.content1}</Text>
            <Text style={s.desc_text}>{desc_content.content2}</Text>
            <Text style={s.desc_text}>{desc_content.content3}</Text>
            <View style={s.cropImageDescPhotoContainer}>
              <Image
                source={this.images[desc_content.imageTitle]}
                style={s.cropImageDescImg}
              />
            </View>
          </View>
          <View>
            <CheckBox
              title={desc_content.chk_text}
              checkedIcon={<Image style={s.checkedbtnStyle} source={this.images[desc_content.checkedbtnImg]} />}
              uncheckedIcon={<Image source={this.images[desc_content.uncheckedbtnImg]} />}
              checked={this.state.checked}
              onPress={() => this.setState({checked: !this.state.checked})}
            />
          </View>
          <View style={s.cropImageDescButtonContainer}>
            <Button
              label={desc_content.buttonText}
              style={this.state.checked? s.button: s.disabledbutton}
              disabled={!this.state.checked? true: false}
              onPress={() => this.navigation.navigate("EPWATakePhoto")}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default translate("root")(EPWACropImageDesc);
