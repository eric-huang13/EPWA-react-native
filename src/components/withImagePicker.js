import React, { Component } from "react";
import T from "prop-types";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { translate } from "react-i18next";
import ImagePicker from "react-native-image-picker";

const withImagePicker = WrappedComponent => {
  class ImagePickerHOC extends Component {
    static IMAGE_BYTE_SIZE_THRESHOLD = 1024 * 1024 * 10; // 10MB

    checkPermission = async permission => {
      const { t } = this.props;

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

    showImagePicker = async callback => {
      const { t } = this.props;

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
            // path: "images",
            cameraRoll: true,
            waitUntilSaved: true
          }
        },
        response => {
          // console.log("response", response);

          if (response.cancelled) {
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

          if (response.fileSize > ImagePickerHOC.IMAGE_BYTE_SIZE_THRESHOLD) {
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

          const uri =
            Platform.OS === "android"
              ? response.uri
              : "~" +
                response.uri.substring(response.uri.indexOf("/Documents"));

          callback(uri);
        }
      );
    };

    showCamera = async callback => {
      const { t } = this.props;
      if (Platform.OS === "android") {
        const cameraPermission = await this.checkPermission(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );

        if (!cameraPermission) {
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

      ImagePicker.launchCamera(
        {
          mediaType: "photo",
          // Resolves issue on some Android devices where image would be rotated by 90deg for no apparent reason
          // See more at: https://github.com/react-community/react-native-image-picker/issues/655#issuecomment-417738511
          quality: 0.99,
          rotation: 360,
          noData: true
        },
        response => {
          const { t } = this.props;

          if (response.cancelled) {
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

          if (response.fileSize > ImagePickerHOC.IMAGE_BYTE_SIZE_THRESHOLD) {
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

          callback(response.uri);
        }
      );
    };

    showCameraOrLibraryPicker = callback => {
      const { t } = this.props;

      Alert.alert(
        t("cameraOrGalleryPopupTitle"),
        null,
        [
          {
            text: t("cancel"),
            onPress: () => {},
            style: "cancel"
          },
          {
            text: t("takeAPhoto"),
            onPress: () => this.showCamera(callback)
          },
          {
            text: t("chooseFromLibrary"),
            onPress: () => this.showImagePicker(callback)
          }
        ],
        { cancelable: false }
      );
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          showImagePicker={this.showCameraOrLibraryPicker}
        />
      );
    }
  }

  ImagePickerHOC.propTypes = {
    t: T.func
  };

  return translate("root")(ImagePickerHOC);
};

export default withImagePicker;
