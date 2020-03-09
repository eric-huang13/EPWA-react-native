import React, {Component} from 'react';
import {HeaderBackButton} from 'react-navigation-stack';
import {ScrollView, View, Text, Image } from 'react-native';
import {translate} from 'react-i18next';
import Icon from "../components/Icon";
import s from "./styles/AnimalProfileStyles";
import iconMap from "../constants/iconMap";

import {colors, fonts} from '../themes';

class AnimalCaregiver extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.getParam("title", ""),
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
    }

    render() {
        const {authToken, navigation, t} = this.props;

        const textStyle = {
            ...fonts.style.normal,
            color: colors.nero,
            lineHeight: 20,
            marginBottom: 20,
        };

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
                <Text>
                    {pictureUrl}
                </Text>
                <Text>
                    {animalType}
                </Text>
            </ScrollView>
        </View>
        );
    }
}

export default translate('root')(AnimalCaregiver);
