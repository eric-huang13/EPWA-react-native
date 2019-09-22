/* eslint-disable react/no-multi-comp */
import React, {Component, PureComponent} from 'react';
import {HeaderBackButton} from 'react-navigation-stack';
import {
  Platform,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {compose, pick, isNil} from 'ramda';
import {connect} from 'react-redux';
import {hoistStatics} from 'recompose';

import {colors, fonts} from '../themes';
import Icon from '../components/Icon';
import TitleBar from '../components/TitleBar';
import ActionButtonNext from '../components/ActionButtonNext';
import IconButton from '../components/IconButton';
import AnimalSelect from '../components/AnimalSelect';

import iconMap from '../constants/iconMap';
import imageMap from '../constants/imageMap';

class PainMeasurementStart extends PureComponent {
  areRequiredFieldsFilled = values => {
    if (isNil(values.animalType)) {return false;}
    if (isNil(values.isVet)) {return false;}
    if (isNil(values.measurementType)) {return false;}
    return true;
  };

  renderAnimalTypeSelection = (setFieldValue, t, values) => (
    <View>
      <TitleBar>{t('painMeasurement.misc.animalTypeQuestion')}</TitleBar>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <IconButton
          active={values.animalType === 'horse'}
          imagePath={imageMap.misc.horse}
          onPress={() => setFieldValue('animalType', 'horse')}
          label={t('painMeasurement.misc.horse')}
        />
        <IconButton
          active={values.animalType === 'donkey'}
          imagePath={imageMap.misc.donkey}
          onPress={() => setFieldValue('animalType', 'donkey')}
          label={t('painMeasurement.misc.donkey')}
        />
      </View>
    </View>
  );

  renderAnimalSelection = ({setFieldValue, t, values}) => {
    const {animals} = values;

    return (
      <AnimalSelect
        animals={animals}
        selectedAnimalId={values.animalId}
        t={t}
        setFieldValue={setFieldValue}
      />
    );
  };

  render() {
    const {showAnimalSelect, setFieldValue, t} = this.props;
    const values = pick([
      'animalId',
      'animalType',
      'animals',
      'isVet',
      'measurementType',
    ])(this.props);

    return (
      <View style={{flex: 1, backgroundColor: colors.egyptianBlue}}>
        <ScrollView contentContainerStyle={{flex: 1}}>
          {showAnimalSelect // eslint-disable-line no-nested-ternary
            ? this.renderAnimalSelection({setFieldValue, t, values})
            : values.animalId
            ? null
            : this.renderAnimalTypeSelection(setFieldValue, t, values)}

          <TitleBar>
            {t('painMeasurement.misc.measurementTypeQuestion')}
          </TitleBar>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}>
            <IconButton
              active={values.measurementType === 'composite'}
              imagePath={imageMap.misc.compositeScale}
              onPress={() => setFieldValue('measurementType', 'composite')}
              label={t('painMeasurement.misc.compositePainScale')}
            />
            <IconButton
              active={values.measurementType === 'facialExpression'}
              imagePath={imageMap.misc.facialExpressionScale}
              onPress={() =>
                setFieldValue('measurementType', 'facialExpression')
              }
              label={t('painMeasurement.misc.facialExpressions')}
            />
          </View>

          <View
            style={{
              minHeight: 70,
              flexDirection: 'row',
              alignItems: 'center',
              paddingRight: 50,
              marginTop: 20,
            }}>
            <Text
              style={{
                flexGrow: 1,
                color: colors.white,
                paddingRight: 10,
                textAlign: 'right',
              }}>
              {t('painMeasurement.misc.areYouVet')}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Switch
                trackColor={{true: colors.lima}}
                {...(Platform.OS === 'ios'
                  ? {}
                  : {thumbTintColor: colors.white})}
                onValueChange={value => setFieldValue('isVet', value)}
                value={values.isVet}
              />
            </View>
          </View>
        </ScrollView>

        {this.areRequiredFieldsFilled(values) && (
          <ActionButtonNext onPress={this.props.onNavigateToNextStep} />
        )}
      </View>
    );
  }
}

class PainMeasurementStartContainer extends Component {
  static navigationOptions = ({navigation, screenProps}) => {
    return {
      title: screenProps.t('painMeasurement.misc.headerTitle'),
      headerTitleStyle: {
        ...fonts.style.h4,
        fontWeight: '400',
      },
      headerLeft: (
        <HeaderBackButton
          tintColor={colors.nero}
          onPress={() => navigation.goBack()}
        />
      ),
      headerRight: (
        <TouchableOpacity
          hitSlop={{top: 10, bottom: 10, left: 30, right: 30}}
          style={{marginRight: 30}}
          onPress={() => navigation.navigate('PainMeasurementStartInfo')}
        >
          <Icon name={iconMap.info} size={20} color={colors.nero} />
        </TouchableOpacity>
      ),
    };
  };

  onNavigateToNextStep = () =>
    this.props.navigation.navigate('PainMeasurementTimerIntro');

  render() {
    const {t} = this.props.screenProps;
    const {setFieldValue, values} = this.props.screenProps.form;

    return (
      <PainMeasurementStart
        animalId={values.animalId}
        animalType={values.animalType}
        animals={values.animals}
        isVet={values.isVet}
        measurementType={values.measurementType}
        onNavigateToNextStep={this.onNavigateToNextStep}
        showAnimalSelect={values.forceAnimalSelection}
        t={t}
        setFieldValue={setFieldValue}
      />
    );
  }
}

export default hoistStatics(compose(connect()))(PainMeasurementStartContainer);
