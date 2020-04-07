import React, {Component} from 'react';
import T from "prop-types";
import {HeaderBackButton} from 'react-navigation-stack';
import { View, Image, Alert, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import {translate} from 'react-i18next';
import { compose } from "redux";
import { connect } from "react-redux";
import { hoistStatics } from "recompose";
import { getToken } from "../selectors/auth";
import { addAnimalCaregiver } from "../actions/caregiver";

import Icon from "../components/Icon";
import Field from "../components/Field";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import withDismissKeyboard from "../components/DismissKeyboard";

import iconMap from "../constants/iconMap";

import s from "./styles/AnimalProfileStyles";

import {colors, fonts} from '../themes';

const DismissKeyboardView = withDismissKeyboard(View);

class AnimalCaregiver extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.getParam("name"),
        headerTitleStyle: {
            ...fonts.style.h4,
            fontWeight: '400',
        },
        headerLeft: (
            <HeaderBackButton
                title={screenProps.t.t('headerBar.back')}
                tintColor={colors.nero}
                onPress={() => navigation.goBack()}
            />
        ),
    });

    constructor(props) {
        super(props);

        this.state = {
            email_validataion: false,
            email_address: '',
            isKeyboardActive: false
        }

        this.isAndroid = Platform.OS === "android";
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            this.isAndroid ? "keyboardDidShow" : "keyboardWillShow",
            this.onKeyboardDidShow
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            this.isAndroid ? "keyboardDidHide" : "keyboardWillHide",
            this.onKeyboardDidHide
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    componentDidUpdate(prevProps, prevState) {
        const{caregiver, t} = this.props;
        if (prevProps.caregiver.loading && !caregiver.loading) {
            if(!caregiver.message.success){
                const errorMessage = caregiver.message;
                if(errorMessage.error == "user_unknown") {
                    Alert.alert(t("caregiverAlertTitle"), t("caregiverAlertUserUnknown"), [
                            { text: t("OK"), onPress: () => {this.setFocusTextInput()} },
                        ],
                        { cancelable: false }
                    );
                } else if(errorMessage.error == "cant_invite_yourself") {
                    Alert.alert(t("caregiverAlertTitle"), t("caregiverAlertSelf"), [
                            { text: t("OK"), onPress: () => {this.setFocusTextInput()} },
                        ],
                        { cancelable: false }
                    );
                } else if(errorMessage.error == "invite_exists") {
                    Alert.alert(t("caregiverAlertTitle"), t("caregiverAlertDuplicate"), [
                            { text: t("OK"), onPress: () => {this.setFocusTextInput()} },
                        ],
                        { cancelable: false }
                    );
                } else if(errorMessage.error == "maximum_shares") {
                    Alert.alert(t("caregiverAlertTitle"), t("caregiverAlertMaximum"), [
                            { text: t("OK"), onPress: () => {this.setFocusTextInput()} },
                        ],
                        { cancelable: false }
                    );
                } else {
                    Alert.alert(t("caregiverAlertTitle"), t("caregiverAlertNotAllowed"), [
                            { text: t("OK"), onPress: () => {this.setFocusTextInput()} },
                        ],
                        { cancelable: false }
                    );
                }
            } else {
                this.props.navigation.navigate("AnimalProfile");
            }
        }
    }

    onKeyboardDidShow = () => this.setState({ isKeyboardActive: true });

    onKeyboardDidHide = () => this.setState({ isKeyboardActive: false });

    onValidation = (e) => {
        const email_pattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

        this.setState({email_address: e});
        if(e.match(email_pattern)) {
            this.setState({email_validataion: true});
        } else {
            this.setState({email_validataion: false});
        }
    };

    sendInvitation = () => {
        const{alertDropdown, navigation, t} = this.props;

        this.props.dispatch(
            addAnimalCaregiver({
                email_address: this.state.email_address,
                animal_id: navigation.getParam("id"),
                showNotification: alertDropdown,
                translate: t
            })
        );
    };

    setFocusTextInput = () => {
        this.setState({email_address: ""});
    }

    render() {
        const {authToken, navigation, t} = this.props;

        const pictureUrl = navigation.getParam("pictureUrl");
        const animalType = navigation.getParam("type");

        return (
            <DismissKeyboardView style={s.screenContainer}>
                <KeyboardAvoidingView
                    keyboardVerticalOffset={this.isAndroid ? 0 : 50}
                    behavior={this.isAndroid ? null : "padding"}
                    enabled
                >
                    <View contentContainerStyle={s.screenContainer}>
                        { pictureUrl ? (
                            <View style={s.photoContainer}>
                            <Image
                                source={{
                                    uri: pictureUrl,
                                    headers: { Authorization: `Bearer ${authToken}` }
                                }}
                                style={s.imageContainer}
                            />
                            </View>
                        ) : (
                            <View style={s.photoContainer}>
                            <Icon
                                name={animalType === "horse" ? iconMap.horse3 : "donkey"}
                                size={50}
                                color={colors.white}
                            />
                            </View>
                        )}
                        <Field label={t("addCaregiverDesc")}>
                            <TextInput
                                style={s.caregiver_textinput_style}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                returnKeyType="send"
                                placeholder={"E-mailaddres"}
                                value={this.state.email_address}
                                onChangeText={this.onValidation}
                            />
                        </Field>
                        <View style={s.caregiver_sendbutton_style}>
                            <Button
                                disabled={!this.state.email_validataion? true: false}
                                style={s.caregiver_invite_button_style}
                                label={t("caregiverInviteBtnText")}
                                onPress={this.sendInvitation}
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </DismissKeyboardView>
        );
    }
}

AnimalCaregiver.propTypes = {
    authToken: T.string,
    t: T.func,
    dispatch: T.func
};

const mapStateToProps = state => ({
    authToken: getToken(state),
    caregiver: state.caregiver
});

export default hoistStatics(
compose(
    connect(mapStateToProps),
    translate("root"),
)
)(AnimalCaregiver);
