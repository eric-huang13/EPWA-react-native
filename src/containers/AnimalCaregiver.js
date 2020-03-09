import React, {Component} from 'react';
import T from "prop-types";
import {HeaderBackButton} from 'react-navigation-stack';
import {ScrollView, View, Image, Alert } from 'react-native';
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

import iconMap from "../constants/iconMap";

import s from "./styles/AnimalProfileStyles";

import {colors, fonts} from '../themes';

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
            email_address: ''
        }
    }

    onValidation = (e) => {
        const email_pattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

        if(e.match(email_pattern)) {
            this.setState({email_validataion: true});
            this.setState({email_address: e});
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

    render() {
        const {authToken, navigation, t} = this.props;

        const pictureUrl = navigation.getParam("pictureUrl");
        const animalType = navigation.getParam("type");

        return (
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <ScrollView contentContainerStyle={s.screenContainer}>
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
                        returnKeyType="next"
                        placeholder={"E-mailaddres"}
                        onChangeText={this.onValidation}
                    />
                </Field>
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Button
                        disabled={!this.state.email_validataion? true: false}
                        style={s.caregiver_invite_button_style}
                        label={t("caregiverInviteBtnText")}
                        onPress={() => {this.sendInvitation()}}
                    />
                </View>
            </ScrollView>
        </View>
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
});

export default hoistStatics(
compose(
    connect(mapStateToProps),
    translate("root"),
)
)(AnimalCaregiver);
