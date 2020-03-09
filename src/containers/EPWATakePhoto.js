import React, {Component} from 'react';
import { StyleSheet, Text, TouchableOpacity, Button, Image, View, SafeAreaView, NativeModules, Platform, ImageBackground } from 'react-native';
import { translate } from "react-i18next";
import { RNCamera } from 'react-native-camera';

import HamburgerButton from "../components/HamburgerButton";

import horsemaskImg from '../images/epwa/horse_mask.png';
import flippedhorsemaskImg from '../images/epwa/flipped_horse_mask.png';
import flipbtnImg from '../images/epwa/flip_btn.png';
import cameraBtnImg from '../images/epwa/cameraButton.png';
import cameraFlipIconImg from '../images/epwa/cameraFlipIcon.png';
import flashAutoImg from '../images/epwa/flashAuto.png';
import flashOffImg from '../images/epwa/flashOff.png';
import flashOnImg from '../images/epwa/flashOn.png';

import { colors, fonts } from "../themes";

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

    componentDidMount() {

    }

    render() {
        const { t } = this.props.screenProps;

        const desc_content = t("info.epwaphotoupload.takephotopage", { returnObjects: true });

        return (
            <View style={styles.container}>
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
                            title: 'Permission to use camera',
                            message: 'We need your permission to use your camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                        androidRecordAudioPermissionOptions={{
                            title: 'Permission to use audio recording',
                            message: 'We need your permission to use your audio',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                    >
                        <Image source={this.state.horsemaskImg} style={{ width: "100%", height: "100%", opacity: 5, resizeMode: 'stretch' }} />
                        <TouchableOpacity
                            onPress={() => this.filpImage()}
                        >
                            <View
                                style={styles.flipButtonContainer}
                            >
                                <Image
                                    style={{ flex: 1, justifyContent: 'flex-start', width: 20, height: 30, resizeMode: 'stretch' }}
                                    source={this.state.flipbtnImg}
                                />
                                <Text
                                    style={{flex: 1, color: 'white', fontSize: 20, paddingTop: 4, paddingLeft: 10}}
                                >
                                    {desc_content.flipbtnText}
                                </Text>
                            </View>
                        </TouchableOpacity>
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
                style={{ paddingHorizontal: 15 }}
                onPress={() => this.onSetFlash(FLASH_MODE_AUTO)}
            >
                <Image
                    style={{ flex: 1, justifyContent: 'center' }}
                    source={this.state.flashData.image}
                    resizeMode={"contain"}
                />
            </TouchableOpacity>
        );
    }

    renderTopButtons = () => {
        return (
            <SafeAreaView
                style={styles.topButtons}
            >
                {this.renderFlashButton()}
            </SafeAreaView>
        );
    }

    renderBottomButtons = () => {
        return (
            <SafeAreaView
                style={styles.bottomButtons}
            >
                {this.renderBottomButton()}
                {this.renderCaptureButton()}
                {this.renderSwitchCameraButton()}
            </SafeAreaView>
        );
    }

    filpImage = () => {
        this.setState({isflipped: !this.state.isflipped});
        
        if(this.state.isflipped) {
            this.setState({horsemaskImg: horsemaskImg});
        } else {
            this.setState({horsemaskImg: flippedhorsemaskImg});
        }
    }

    // takePicture = async() => {
    //     if (this.camera) {
    //         // const options = { quality: 0.5, base64: true };
    //         // const data = await this.camera.takePictureAsync(options);
    //         const data = await this.camera.takePictureAsync();
    //         console.log(data);
    //     }
    // }

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
            const options = { quality: 0.5, base64: true, fixOrientation: true };
            const image = await this.camera.takePictureAsync(options);

            if (image) {
                this.setState({ captured: true, imageCaptured: image });
                this.navigation.navigate('EPWAPhotoIsGood', { image });
            }

        }

        // const image = this.camera && await this.camera.capture();


    }

    async capture(saveToCameraRoll = true) {
      console.log('capture', saveToCameraRoll, GalleryManager)
        return GalleryManager && await GalleryManager.capture(saveToCameraRoll);
    }
    
    async changeCamera() {
        console.log('changeCamera', GalleryManager)
        return GalleryManager && await GalleryManager.changeCamera();
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlayImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2
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
        justifyContent: 'space-between'
    },
    cameraContainer: {
        flex: 10,
        flexDirection: 'row',
    },
    captureButtonContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    switchButtonContainer: {
        paddingTop: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    flipButtonContainer: {
        position: 'absolute',
        bottom: 375,
        right: 90,
        width: 80,
        height: 40,
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: 'flex-start'
    },
    bottomButton: {
        paddingTop: 20,
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

export default translate("root")(EPWATakePhoto);