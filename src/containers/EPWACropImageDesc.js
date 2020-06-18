import React, { Component } from "react";
import { ScrollView, View, Text, Image, Platform, Alert, PermissionsAndroid, Dimensions } from "react-native";
import { CheckBox } from 'react-native-elements'
import { translate } from "react-i18next";
import ImagePicker from "react-native-image-picker";
import ImgToBase64 from "react-native-image-base64";

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
  
  static IMAGE_BYTE_SIZE_THRESHOLD = 1024 * 1024 * 10; // 10MB

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

  checkPermission = async permission => {
    const { t } = this.props.screenProps;

    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(permission, {
          title: t("permissionReadWriteTitle"),
          message: t("permissionReadWriteMessage"),
          buttonPositive: "ok"
        });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
  };
  
  showImagePicker = async () => {
    const { t } = this.props.screenProps;

    if (Platform.OS === "android") {
      const galeryPermission = await this.checkPermission(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );

      if (!galeryPermission) {
        Alert.alert(
          t("errors.alertTitleGeneric"),
          t("errors.imagePickerFailed"),
          [
            {
              text: t("ok")
            }
          ]
        );
        return;
      }
    }

    ImagePicker.launchImageLibrary(
    {
      mediaType: "photo",
      // Resolves issue on some Android devices where image would be rotated by 90deg for no apparent reason
      // See more at: https://github.com/react-community/react-native-image-picker/issues/655#issuecomment-417738511
      quality: 0.99,
      rotation: 360,
      noData: true,
      storageOptions: {
        skipBackup: true,
        cameraRoll: true,
        waitUntilSaved: true
      }
    },
    response => {
      if (response.didCancel) {
        this.navigation.navigate("EPWACropImageDesc");
        return;
      }

      if (response.error) {
        Alert.alert(
          t("errors.alertTitleGeneric"),
          t("errors.imagePickerFailed"),
          [
            {
              text: t("ok")
            }
          ]
        );
        return;
      }

      if (response.fileSize > this.IMAGE_BYTE_SIZE_THRESHOLD) {
        Alert.alert(
          t("errors.alertTitleWarning"),
          t("errors.imageOverSizeThreshold"),
          [
            {
              text: t("ok")
            }
          ]
        );
      }
      
      var image = {};

      image["height"] = Dimensions.get("window").width;
      image["width"] = Dimensions.get("window").width;
      image["uri"] = response.uri;
      
      ImgToBase64.getBase64String(response.uri)
        .then(base64String => {
          image["base64"] = base64String;
          this.navigation.navigate('EPWAPhotoIsGood', { image });
        })
        .catch(err => {
          console.log(err);
        });
    });
  };

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
              label={desc_content.lbuttonText}
              style={this.state.checked? s.lbutton: s.disabledbutton}
              disabled={!this.state.checked? true: false}
              onPress={() => this.navigation.navigate("EPWATakePhoto")}
            />
            <Button
              label={desc_content.rbuttonText}
              style={this.state.checked? s.rbutton: s.disabledbutton}
              disabled={!this.state.checked? true: false}
              onPress={() => this.showImagePicker()}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default translate("root")(EPWACropImageDesc);
