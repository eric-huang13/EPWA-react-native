import React, {Component} from 'react';
import {HeaderBackButton} from 'react-navigation-stack';
import {ScrollView, View, Text} from 'react-native';
import {translate} from 'react-i18next';

import {colors, fonts} from '../themes';

class AnimalFormInfo extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: screenProps.t.t('headerBar.animalForm'),
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

  render() {
    const {t} = this.props;

    const textStyle = {
      ...fonts.style.normal,
      color: colors.nero,
      lineHeight: 20,
      marginBottom: 20,
    };

    const titleStyle = {
      ...fonts.style.cta,
      color: colors.nero,
      lineHeight: 20,
      marginBottom: 10,
    };

    const animalType = this.props.navigation.getParam('animalType');

    const translatedAnimalType =
      animalType === 'horse'
        ? t('horse').toLowerCase()
        : t('donkey').toLowerCase();

    let content = t('info.animalForm.sections', {
      animalType: translatedAnimalType,
      returnObjects: true,
    });

    if (animalType === 'donkey') {
      content = content.filter(entry => !entry.hideForDonkey);
    }

    return (
      <View style={{flex: 1, backgroundColor: colors.white}}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: colors.white,
            paddingTop: 20,
            paddingHorizontal: 20,
          }}>
          {content.map(({title, content}) => (
            <View key={title}>
              <Text style={titleStyle}>{title}</Text>
              <Text style={textStyle}>{content}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

export default translate('root')(AnimalFormInfo);
