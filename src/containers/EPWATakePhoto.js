import React, {Component} from 'react';
import { StyleSheet, Text, TouchableOpacity, Button, Image, View, SafeAreaView, NativeModules, Platform, ImageBackground } from 'react-native';
import { translate } from "react-i18next";
import { RNCamera } from 'react-native-camera';
import { compose } from "redux";

import HamburgerButton from "../components/HamburgerButton";
import Spinner from 'react-native-loading-spinner-overlay';

import horsemaskImg from '../images/epwa/horse_mask.png';
import flippedhorsemaskImg from '../images/epwa/flipped_horse_mask.png';
import flipbtnImg from '../images/epwa/flip_btn.png';
import cameraBtnImg from '../images/epwa/cameraButton.png';
import cameraFlipIconImg from '../images/epwa/cameraFlipIcon.png';
import flashAutoImg from '../images/epwa/flashAuto.png';
import flashOffImg from '../images/epwa/flashOff.png';
import flashOnImg from '../images/epwa/flashOn.png';

import { colors, fonts } from "../themes";
import {connect} from 'react-redux';
import {setCropImage} from '../actions/crop';

const IsIOS = Platform.OS === 'ios';
const GalleryManager = IsIOS ? NativeModules.CKGalleryManager : NativeModules.NativeGalleryModule;

const FLASH_MODE_AUTO = 'auto';
const FLASH_MODE_ON = 'on';
const FLASH_MODE_OFF = 'off';

class EPWATakePhoto extends Component {
    constructor(props){
        super(props)

        this.currentFlashArrayPosition = 0;
        this.flashArray = [
            {
                mode: FLASH_MODE_AUTO,
                image: flashAutoImg
            },
            {
                mode: FLASH_MODE_ON,
                image: flashOnImg
            },
            {
                mode: FLASH_MODE_OFF,
                image: flashOffImg
            }
        ];

        this.state = {
            isLoading: false,
            data: null,
            flashMode: false,
            backCamera: true,
            imageCaptured: undefined,
            captured: false,
            horsemaskImg: horsemaskImg,
            flipbtnImg: flipbtnImg,
            cameraBtnImg: cameraBtnImg,
            cameraFlipIconImg: cameraFlipIconImg,
            flashData: this.flashArray[this.currentFlashArrayPosition],
            isflipped: false
        }
        this.onSetFlash = this.onSetFlash.bind(this);
        this.changeCamera = this.changeCamera.bind(this);
    }

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

        const desc_content = t("info.epwaphotoupload.takephotopage", { returnObjects: true });

        return (
            <View style={styles.container}>
                <Spinner
                    visible={this.state.isLoading}
                    textContent={desc_content.loadingText}
                    textStyle={{color: colors.mediumPurple}}
                />
                {this.renderTopButtons()}
                <View style={styles.cameraContainer}>
                    <RNCamera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={styles.preview}
                        type={this.state.backCamera? RNCamera.Constants.Type.back: RNCamera.Constants.Type.front}
                        flashMode={this.state.flashMode? RNCamera.Constants.FlashMode.on: RNCamera.Constants.FlashMode.off}
                        androidCameraPermissionOptions={{
                            title: desc_content.cameraPermissionTitle,
                            message: desc_content.cameraPermissionMessage,
                            buttonPositive: desc_content.cameraPermissionPositiveButtonText,
                            buttonNegative: desc_content.cameraPermissionNegativeButtonText,
                        }}
                        androidRecordAudioPermissionOptions={{
                            title: desc_content.audioiPermissonTitle,
                            message: desc_content.audioPermissionMessage,
                            buttonPositive: desc_content.cameraPermissionPositiveButtonText,
                            buttonNegative: desc_content.cameraPermissionNegativeButtonText,
                        }}
                    >
                        <Image source={this.state.horsemaskImg} style={{ width: "100%", height: "100%", opacity: 5, resizeMode: 'stretch' }} />

                        <View style={styles.flipButtonContainer}>
                            <TouchableOpacity
                                onPress={() => this.flipImage()}
                                style={styles.flipButton}
                            >
                                <Image
                                    style={{ flex: 1, justifyContent: 'flex-start', width: 20, height: 30, resizeMode: 'stretch' }}
                                    source={this.state.flipbtnImg}
                                />
                                <Text
                                    style={{flex: 3, color: 'white', fontSize: 20, paddingTop: 4, paddingLeft: 10}}
                                >
                                    {desc_content.flipbtnText}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </RNCamera>
                </View>

                {this.renderBottomButtons()}
            </View>
        );
    }
    
    renderBottomButton = () => {
        const { t } = this.props.screenProps;

        const desc_content = t("info.epwaphotoupload.takephotopage", { returnObjects: true });

        return (
            <View
                style={styles.bottomButton}
            >
                <TouchableOpacity
                    onPress={() => this.onButtonPressed()}
                >
                    <Text
                        style={styles.textStyle}
                    >
                        {desc_content.cancelbutton}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderSwitchCameraButton = () => {
        return (
            <View
                style={styles.switchButtonContainer}
            >
                <TouchableOpacity
                    onPress={() => this.changeCamera()}
                >
                    <Image
                        style={{ flex: 1, justifyContent: 'center' }}
                        source={this.state.cameraFlipIconImg}
                        resizeMode={"contain"}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    renderCaptureButton = () => {
        const { t } = this.props.screenProps;

        const desc_content = t("info.epwaphotoupload.takephotopage", { returnObjects: true });

        return (
            <View
                style={styles.captureButtonContainer}
            >
                <Text
                    style={styles.photoTextStyle}
                >
                    {desc_content.photobutton}
                </Text>
                <TouchableOpacity
                    onPress={() => this.onCaptureImagePressed()}
                >
                <Image
                    source={this.state.cameraBtnImg}
                    resizeMode={'contain'}
                />
                </TouchableOpacity>
            </View >
        );
    }

    renderFlashButton = () => {
        return (
            <TouchableOpacity
                style={{ paddingHorizontal: 15, paddingVertical: 10 }}
                onPress={() => this.onSetFlash(FLASH_MODE_AUTO)}
            >
                <Image
                    style={{ height: '80%', justifyContent: 'center' }}
                    source={this.state.flashData.image}
                    resizeMode={"contain"}
                />
            </TouchableOpacity>
        );
    }

    renderTopButtons = () => {
        return (
            <SafeAreaView
                style={IsIOS? styles.topButtons: [styles.topButtons, {backgroundColor: colors.black, zIndex: 2}]}
            >
                {this.renderFlashButton()}
            </SafeAreaView>
        );
    }

    renderBottomButtons = () => {
        return (
            <SafeAreaView
                style={IsIOS? styles.bottomButtons: [styles.bottomButtons, {backgroundColor: colors.black}]}
            >
                {this.renderBottomButton()}
                {this.renderCaptureButton()}
                {this.renderSwitchCameraButton()}
            </SafeAreaView>
        );
    }

    flipImage = () => {
        this.setState({
          isflipped: !this.state.isflipped,
          horsemaskImg: this.state.isflipped ? horsemaskImg : flippedhorsemaskImg
        });
    }

    async onSetFlash() {
        this.currentFlashArrayPosition = (this.currentFlashArrayPosition + 1) % 3;
        const newFlashData = this.flashArray[this.currentFlashArrayPosition];
        this.setState({ flashData: newFlashData });
        this.setFlashMode(newFlashData.mode);
    }

    async onButtonPressed() {
        GalleryManager && GalleryManager.deleteTempImage(this.state.imageCaptured.uri);
        this.setState({ imageCaptured: undefined });
        this.navigation.navigate("EPWACropImageDesc")
    }

    async onCaptureImagePressed() {
        if (this.camera) {
            this.setState({isLoading: true})
            const options = { quality: 0.5, base64: true, fixOrientation: true, pauseAfterCapture: true };
            const image = await this.camera.takePictureAsync(options);
            
            if (image) {
                this.setState({ captured: true, imageCaptured: image });
                const taken_image = {}
                taken_image.width = image.width;
                taken_image.height = image.height;
                taken_image.uri = image.uri;
                this.props.dispatch(setCropImage(taken_image))
                this.setState({isLoading: false})
                this.navigation.navigate('EPWAPhotoIsGood', { image });
            }

        }
    }

    async capture(saveToCameraRoll = true) {
        console.log('capture', saveToCameraRoll, GalleryManager)
        return GalleryManager && await GalleryManager.capture(saveToCameraRoll);
    }
    
    async changeCamera() {
        console.log('changeCamera', GalleryManager, RNCamera.Constants.Type.back, this.state.backCamera)
        // return GalleryManager && await GalleryManager.changeCamera();
        this.setState({backCamera: !this.state.backCamera});
    }

    async setFlashMode(flashMode = 'auto') {
        console.log('setFlashMode', flashMode, GalleryManager)
        return GalleryManager && await GalleryManager.setFlashMode(flashMode);
    }
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'black'
    },
    preview: {
        position: 'relative',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    textStyle: {
        color: 'white',
        fontSize: 20
    },
    photoTextStyle: {
        color: '#E87A20',
        fontWeight: "500",
        fontSize: 14,
        paddingBottom: 10
    },
    topButtons: {
        flex: 1.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cameraContainer: {
        flex: 13,
        flexDirection: 'row',
    },
    captureButtonContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    switchButtonContainer: {
        paddingTop: 0,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    flipButtonContainer: {
        position: 'absolute',
        top: 11,
        left: 10,
        width: 150,
        height: 40,
    },
    flipButton: {
      flexDirection: 'row',
      justifyContent: "flex-start",
      alignItems: 'flex-start'
    },
    bottomButton: {
        paddingTop: 0,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomButtons: {
        flex: 2.5,
        flexDirection: 'row',
        alignItems: 'center'
    }
});

const mapStateToProps = state => ({
    isLoading: state.crop.loading,
});

export default compose(
  connect(mapStateToProps),
  translate("root")
)(EPWATakePhoto);