/* eslint-disable react/no-multi-comp */
import React, {Component, PureComponent} from 'react';
import {HeaderBackButton} from 'react-navigation-stack';
import {Alert, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import {__, all, equals, compose, has, pick, not} from 'ramda';
import {connect} from 'react-redux';
import {hoistStatics} from 'recompose';
import Touchable from 'react-native-platform-touchable';

import ProgressBar from '../components/ProgressBar';
import TitleBar from '../components/TitleBar';
import RadioSection from '../components/RadioSection';

import horseEarPhoto0 from '../images/facialExpression/horse/earScore0.jpeg';
import horseEarPhoto1 from '../images/facialExpression/horse/earScore1.jpeg';
import horseEarPhoto2 from '../images/facialExpression/horse/earScore2.jpeg';

import horseNostrilPhoto0 from '../images/facialExpression/horse/nostrilScore0.jpeg';
import horseNostrilPhoto1 from '../images/facialExpression/horse/nostrilScore1.jpeg';
import horseNostrilPhoto2 from '../images/facialExpression/horse/nostrilScore2.jpeg';

import horseCornerMouthPhoto0 from '../images/facialExpression/horse/cornerMouthScore0.jpeg';
import horseCornerMouthPhoto1 from '../images/facialExpression/horse/cornerMouthScore1.jpeg';
import horseCornerMouthPhoto2 from '../images/facialExpression/horse/cornerMouthScore2.jpeg';

import horseEyelidPhoto0 from '../images/facialExpression/horse/eyelidScore0.jpeg';
import horseEyelidPhoto1 from '../images/facialExpression/horse/eyelidScore1.jpeg';
import horseEyelidPhoto2 from '../images/facialExpression/horse/eyelidScore2.jpeg';

import horseFocusPhoto0 from '../images/facialExpression/horse/focusScore0.jpeg';
import horseFocusPhoto1 from '../images/facialExpression/horse/focusScore1.jpeg';
import horseFocusPhoto2 from '../images/facialExpression/horse/focusScore2.jpeg';

import horseHeadPhoto0 from '../images/facialExpression/horse/headScore0.jpeg';
import horseHeadPhoto1 from '../images/facialExpression/horse/headScore1.jpeg';
import horseHeadPhoto2 from '../images/facialExpression/horse/headScore2.jpeg';

import horseMuscleToneHeadPhoto0 from '../images/facialExpression/horse/muscleToneHeadScore0.jpeg';
import horseMuscleToneHeadPhoto1 from '../images/facialExpression/horse/muscleToneHeadScore1.jpeg';
import horseMuscleToneHeadPhoto2 from '../images/facialExpression/horse/muscleToneHeadScore2.jpeg';

import donkeyEarPositionPhoto0 from '../images/facialExpression/donkey/earPosition0.png';
import donkeyEarPositionPhoto1 from '../images/facialExpression/donkey/earPosition2a.png';
import donkeyEarPositionPhoto2 from '../images/facialExpression/donkey/earPosition2b.png';

import donkeyEyelidsPhoto0 from '../images/facialExpression/donkey/eyelids0.png';
import donkeyEyelidsPhoto1 from '../images/facialExpression/donkey/eyelids1.png';
import donkeyEyelidsPhoto2 from '../images/facialExpression/donkey/eyelids2.png';

import donkeyFocusPhoto0 from '../images/facialExpression/donkey/focus0.png';
import donkeyFocusPhoto1 from '../images/facialExpression/donkey/focus1.png';
import donkeyFocusPhoto2 from '../images/facialExpression/donkey/focus2.png';

import donkeyHeadPhoto0 from '../images/facialExpression/donkey/head0.png';
import donkeyHeadPhoto1 from '../images/facialExpression/donkey/head2a.png';
import donkeyHeadPhoto2 from '../images/facialExpression/donkey/head2b.png';

import donkeyMouthCornersPhoto0 from '../images/facialExpression/donkey/mouthCorners0.png';
import donkeyMouthCornersPhoto1 from '../images/facialExpression/donkey/mouthCorners2.png';

import donkeyMuscleToneHeadPhoto0 from '../images/facialExpression/donkey/muscleToneHead0.png';
import donkeyMuscleToneHeadPhoto1 from '../images/facialExpression/donkey/muscleToneHead1.png';
import donkeyMuscleToneHeadPhoto2 from '../images/facialExpression/donkey/muscleToneHead2.png';

import donkeyNostrilsPhoto0 from '../images/facialExpression/donkey/nostrils0.png';
import donkeyNostrilsPhoto1 from '../images/facialExpression/donkey/nostrils1.png';
import donkeyNostrilsPhoto2 from '../images/facialExpression/donkey/nostrils2.png';

import donkeySoundResponsePhoto0 from '../images/facialExpression/donkey/responseToAuditoryStimulus0.png';
import donkeySoundResponsePhoto1 from '../images/facialExpression/donkey/responseToAuditoryStimulus1.png';
import donkeySoundResponsePhoto2 from '../images/facialExpression/donkey/responseToAuditoryStimulus2.png';

import donkeySweatingPhoto0 from '../images/facialExpression/donkey/sweatingBehindTheEars0.png';
import donkeySweatingPhoto1 from '../images/facialExpression/donkey/sweatingBehindTheEars2.png';

import {colors, fonts} from '../themes';

class PainMeasurementObservationHead extends PureComponent {
  constructor(props) {
    super(props);

    const isDonkey = props.values.animalType === 'donkey';

    this.fields = isDonkey ? this.getDonkeyFields() : this.getHorseFields();
  }

  get values() {
    return this.props.values;
  }

  getDonkeyFields = () => {
    const {t} = this.props;
    const path = 'painMeasurement.head.observation.donkey';

    return [
      {
        name: 'headScore',
        title: t(`${path}.head`),
        labels: t(`${path}.headOptions`, {
          returnObjects: true,
        }),
        photos: [donkeyHeadPhoto0, donkeyHeadPhoto1, donkeyHeadPhoto2],
      },
      {
        name: 'eyelidsScore',
        title: t(`${path}.eyelids`),
        labels: t(`${path}.eyelidsOptions`, {
          returnObjects: true,
        }),
        photos: [donkeyEyelidsPhoto0, donkeyEyelidsPhoto1, donkeyEyelidsPhoto2],
      },
      {
        name: 'focusScore',
        title: t(`${path}.focus`),
        labels: t(`${path}.focusOptions`, {
          returnObjects: true,
        }),
        photos: [donkeyFocusPhoto0, donkeyFocusPhoto1, donkeyFocusPhoto2],
      },
      {
        name: 'nostrilsScore',
        title: t(`${path}.nostrils`),
        labels: t(`${path}.nostrilsOptions`, {
          returnObjects: true,
        }),
        photos: [
          donkeyNostrilsPhoto0,
          donkeyNostrilsPhoto1,
          donkeyNostrilsPhoto2,
        ],
      },
      {
        name: 'mouthCornersScore',
        title: t(`${path}.mouthCorners`),
        labels: t(`${path}.mouthCornersOptions`, {
          returnObjects: true,
        }),
        photos: [donkeyMouthCornersPhoto0, donkeyMouthCornersPhoto1],
      },
      {
        name: 'muscleToneHeadScore',
        title: t(`${path}.muscleToneHead`),
        labels: t(`${path}.muscleToneHeadOptions`, {
          returnObjects: true,
        }),
        photos: [
          donkeyMuscleToneHeadPhoto0,
          donkeyMuscleToneHeadPhoto1,
          donkeyMuscleToneHeadPhoto2,
        ],
      },
      {
        name: 'sweatingBehindTheEarsScore',
        title: t(`${path}.sweatingBehindTheEars`),
        labels: t(`${path}.sweatingBehindTheEarsOptions`, {
          returnObjects: true,
        }),
        photos: [donkeySweatingPhoto0, donkeySweatingPhoto1],
      },
      {
        name: 'earPositionScore',
        title: t(`${path}.earPosition`),
        labels: t(`${path}.earPositionOptions`, {
          returnObjects: true,
        }),
        photos: [
          donkeyEarPositionPhoto0,
          donkeyEarPositionPhoto1,
          donkeyEarPositionPhoto2,
        ],
      },
      {
        name: 'responseToAuditoryStimulusScore',
        title: t(`${path}.responseToAuditoryStimulus`),
        labels: t(`${path}.responseToAuditoryStimulusOptions`, {
          returnObjects: true,
        }),
        photos: [
          donkeySoundResponsePhoto0,
          donkeySoundResponsePhoto1,
          donkeySoundResponsePhoto2,
        ],
      },
    ];
  };

  getHorseFields = () => {
    const {t} = this.props;
    const path = 'painMeasurement.head.observation';

    return [
      {
        name: 'focusScore',
        title: t(`${path}.focus`),
        labels: t(`${path}.focusOptions`, {
          returnObjects: true,
        }),
        photos: [horseFocusPhoto0, horseFocusPhoto1, horseFocusPhoto2],
      },
      {
        name: 'headScore',
        title: t(`${path}.head`),
        labels: t(`${path}.headOptions`, {
          returnObjects: true,
        }),
        photos: [horseHeadPhoto0, horseHeadPhoto1, horseHeadPhoto2],
      },
      {
        name: 'muscleToneHeadScore',
        title: t(`${path}.muscleToneHead`),
        labels: t(`${path}.muscleToneHeadOptions`, {
          returnObjects: true,
        }),
        photos: [
          horseMuscleToneHeadPhoto0,
          horseMuscleToneHeadPhoto1,
          horseMuscleToneHeadPhoto2,
        ],
      },
      {
        name: 'eyelidScore',
        title: t(`${path}.eyelids`),
        labels: t(`${path}.eyelidsOptions`, {
          returnObjects: true,
        }),
        photos: [horseEyelidPhoto0, horseEyelidPhoto1, horseEyelidPhoto2],
      },
      {
        name: 'nostrilScore',
        title: t(`${path}.nostrils`),
        labels: t(`${path}.nostrilsOptions`, {
          returnObjects: true,
        }),
        photos: [horseNostrilPhoto0, horseNostrilPhoto1, horseNostrilPhoto2],
      },
      {
        name: 'cornerMouthScore',
        title: t(`${path}.mouthCorners`),
        labels: t(`${path}.mouthCornersOptions`, {
          returnObjects: true,
        }),
        photos: [
          horseCornerMouthPhoto0,
          horseCornerMouthPhoto1,
          horseCornerMouthPhoto2,
        ],
      },
      {
        name: 'earScore',
        title: t(`${path}.ears`),
        labels: t(`${path}.earsOptions`, {
          returnObjects: true,
        }),
        photos: [horseEarPhoto0, horseEarPhoto1, horseEarPhoto2],
      },
    ];
  };

  areRequiredFieldsFilled = () => {
    const formHas = has(__, this.values);

    if (this.values.animalType === 'donkey') {
      const standardSet = [
        formHas('headScore'),
        formHas('eyelidsScore'),
        formHas('focusScore'),
        formHas('nostrilsScore'),
        formHas('mouthCornersScore'),
        formHas('muscleToneHeadScore'),
        formHas('sweatingBehindTheEarsScore'),
        formHas('earPositionScore'),
        formHas('responseToAuditoryStimulusScore'),
      ];

      return all(equals(true))(standardSet);
    }

    const standardSet = [
      formHas('focusScore'),
      formHas('headScore'),
      formHas('muscleToneHeadScore'),
      formHas('eyelidScore'),
      formHas('nostrilScore'),
      formHas('cornerMouthScore'),
      formHas('earScore'),
    ];

    return all(equals(true))(standardSet);
  };

  onSubmit = () => {
    this.props.navigate('PainMeasurementScore');
  };

  render() {
    const {values, setFieldValue, t} = this.props;

    return (
      <View style={{flex: 1}}>
        <ProgressBar percent={75} />
        <ScrollView>
          <TitleBar>{t('painMeasurement.misc.selectAnswer')}</TitleBar>
          {this.fields.map(({name, labels, title, photos}) => (
            <View key={name} style={{backgroundColor: colors.white}}>
              <TitleBar
                borderBottomWidth={1}
                backgroundColor={colors.white}
                textAlign="left"
                color={colors.nero}
                paddingHorizontal={20}>
                {title}
              </TitleBar>
              {labels.map((label, index) => (
                <RadioSection
                  key={label}
                  active={values[name] === index}
                  onPress={() => setFieldValue(name, index)}
                  label={label}
                  imageSource={photos[index]}
                />
              ))}
            </View>
          ))}
          <View style={{width: '100%'}}>
            <Touchable
              disabled={!this.areRequiredFieldsFilled()}
              onPress={this.onSubmit}
              style={{
                flex: 1,
                minHeight: 60,
                backgroundColor: this.areRequiredFieldsFilled()
                  ? colors.lima
                  : colors.lightGrey,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{...fonts.style.cta, color: colors.white}}>
                {t('painMeasurement.misc.seeResult')}
              </Text>
            </Touchable>
          </View>
        </ScrollView>
      </View>
    );
  }
}

class PainMeasurementObservationHeadContainer extends Component {
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
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            hitSlop={{top: 10, bottom: 10, left: 30, right: 30}}
            style={{marginRight: 30}}
            onPress={() => {
              const {t} = screenProps;
              Alert.alert(
                t('painMeasurementQuitTitle'),
                t('painMeasurementQuitMessage'),
                [
                  {text: t('cancel'), style: 'cancel'},
                  {
                    text: t('quit'),
                    onPress: () => navigation.navigate('Diary'),
                  },
                ],
              );
            }}>
            <Text>{screenProps.t('quit')}</Text>
          </TouchableOpacity>
        </View>
      ),
    };
  };

  fields = [
    'headScore',
    'eyelidsScore',
    'focusScore',
    'nostrilsScore',
    'mouthCornersScore',
    'muscleToneHeadScore',
    'sweatingBehindTheEarsScore',
    'earPositionScore',
    'responseToAuditoryStimulusScore',
    'focusScore',
    'headScore',
    'muscleToneHeadScore',
    'eyelidScore',
    'nostrilScore',
    'cornerMouthScore',
    'earScore',
    'animalType',
  ];

  get form() {
    return this.props.screenProps.form;
  }

  constructor(props) {
    super(props);

    this.state = {
      values: pick(this.fields)(this.form.values),
    };
  }

  // Cache derived data so that reference to props will be kept and PureComponent will not rerender
  componentWillReceiveProps(nextProps) {
    const oldValues = pick(this.fields, this.form.values);
    const newValues = pick(this.fields, nextProps.screenProps.form.values);

    const shouldUpdate = not(equals(oldValues, newValues));
    if (shouldUpdate) {
      this.setValues(newValues);
    }
  }

  setValues = values => {
    const valuesToSave = pick(this.fields)(values);

    this.setState({
      values: valuesToSave,
    });
  };

  render() {
    const {t} = this.props.screenProps;
    const {navigate} = this.props.navigation;
    const {setFieldValue} = this.form;

    return (
      <PainMeasurementObservationHead
        values={this.state.values}
        setFieldValue={setFieldValue}
        t={t}
        navigate={navigate}
      />
    );
  }
}

export default hoistStatics(compose(connect()))(
  PainMeasurementObservationHeadContainer,
);
