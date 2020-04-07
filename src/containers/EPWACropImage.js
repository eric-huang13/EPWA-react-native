import React, { Component } from "react";
import {
  Image,
  View,
  ScrollView,
  Text
} from "react-native";
import T from "prop-types";
import { last, compose } from "ramda";
import { map, forEach } from 'lodash';
import { translate } from "react-i18next";
import ImageEditor from "@react-native-community/image-editor";
import { hoistStatics } from "recompose";

import HamburgerButton from "../components/HamburgerButton";
import withAlertDropdown from "../components/withAlertDropdown";
import Button from "../components/Button";

import { colors, fonts } from "../themes";

import s from "./styles/EPWAStyles";
import {getImageScaleSize} from '../transforms';
import Cropper from '../components/Cropper';
import { cropImages } from '../constants/index';
import {connect} from 'react-redux';
import { setCropPosition, saveCropImage } from '../actions/crop';

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
    const { t } = this.props;
    // const { state } = this.props.navigation;
    const lastLetterInRoute = last(routeName).toLowerCase();

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
        this.finalCrop();
      } else {
        this.navigation.navigate("EPWACropImageA")
      }
      return;
    }
  };

  finalCrop = async () => {
    const { alertDropdown, t, crops, image = {} } = this.props;
    const images = {};

    for (const index in crops) {
      const item = crops[index];
      if (!!cropImages[index]) {
        const cropData = {
          offset: {x: item.x, y: item.y},
          size: {width: item.w, height: item.h},
          displaySize: {width: item.w, height: item.h},
          resizeMode: 'contain',
        };
        const cropRes = await this._crop(image.uri, cropData);
        images[index] = cropRes;
      }
    }
    this.props.dispatch(
      saveCropImage({
        original: image.uri,
        crop_images: images,
        showNotification: alertDropdown,
        translate: t
      })
    );
  };

   _crop = async (uri, cropData) => {
    try {
      const croppedImageURI = await ImageEditor.cropImage(
        uri,
        cropData
      );
      return croppedImageURI;
    } catch (cropError) {
      return cropError;
    }
  };

  setPosition = (data) => {
    const { dispatch } = this.props;
    const content = this.getContent(this.navigation.state.routeName);

    if (!!cropImages[content.fieldName]) {
      dispatch(setCropPosition({id: content.fieldName, data}))
    }
  };

  render() {
    const { crops, image = {} } = this.props;
    const content = this.getContent(this.navigation.state.routeName);
    const { imageWidth, imageHeight } = getImageScaleSize(image.width, image.height);
    const coord = cropImages[content.fieldName] || {};
    const coordStore = crops[content.fieldName] || {};

    return (
      <View style={s.mainContainer}>
        <ScrollView
          contentContainerStyle={s.scrollViewContainerStyle}
        >
          <View key={content.title}>
            <Text style={s.titleStyle}>{content.title}</Text>
            <View style={s.cropPhotoContainer}>
              <Image
                source={image}
                style={s.cropImg}
                width={imageWidth * 0.9}
                height={imageHeight * 0.9}
              />
              {!!cropImages[content.fieldName]
                ? (<Cropper
                    x={coordStore.x || coord.x || 5}
                    y={coordStore.y || coord.y * imageHeight || 5}
                    w={coordStore.w || coord.w || imageWidth - 90}
                    h={coordStore.h || coord.h || imageHeight / 4  }
                    maxWidth={imageWidth}
                    maxHeight={imageHeight * 0.9}
                    onChange={this.setPosition}
                />)
                : (map(crops, (item, index) => (
                  <Cropper
                    key={index}
                    x={item.x || 5}
                    y={item.y || 5}
                    w={item.w || imageWidth - 90}
                    h={item.h || imageHeight / 4  }
                    maxWidth={imageWidth}
                    maxHeight={imageHeight * 0.9}
                  />
                )))
              }
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

EPWACropImage.propTypes = {
  alertDropdown: T.func,
  dispatch: T.func,
  t: T.func
};

const mapStateToProps = state => ({
  crops: state.crop.crops,
  image: state.crop.image
});

export default hoistStatics(
  compose(
    connect(mapStateToProps),
    withAlertDropdown,
    translate("root"),
  )
)(EPWACropImage);
