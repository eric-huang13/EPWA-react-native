import React, {Fragment} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {
  __,
  compose,
  curry,
  find,
  map,
  pick,
  prop,
  propEq,
  toPairs,
} from 'ramda';
import {translate} from 'react-i18next';

import CategoryHeader from '../components/CategoryHeader';
import Icon from '../components/Icon';

import iconMap from '../constants/iconMap';
import {colors, fonts} from '../themes';

const Row = (
  { iconName, children, paddingVertical } // eslint-disable-line
) => (
  <View
    style={[
      {
        minHeight: 70,
        alignItems: 'center',
        paddingHorizontal: 20,
        borderBottomColor: colors.darkFilter,
        borderBottomWidth: 1,
        paddingVertical: paddingVertical || 0,
        flexDirection: 'row',
      },
    ]}>
    {iconName && <Icon name={iconName} size={30} color={colors.nero} />}
    <View style={{marginLeft: iconName ? 20 : 0, flexGrow: 1}}>
      {children[0]}
    </View>
    <View>{children[1]}</View>
  </View>
);

class PainMeasurementDetails extends React.Component {
  getCompositeMeasurementTimerFields = () => {
    const { t } = this.props; // eslint-disable-line
    const basePath = 'painMeasurement.full.timer';

    return [
      {
        fieldPath: 'rollCount',
        translationPath: `${basePath}.layingDownRolling`,
      },
      {
        fieldPath: 'tailFlickCount',
        translationPath: `${basePath}.tailFlicking`,
      },
      {
        fieldPath: 'kickAtAbdomenCount',
        translationPath: `${basePath}.kickingAtAbdomen`,
      },
      {
        fieldPath: 'pawCount',
        translationPath: `${basePath}.pawing`,
      },
      {
        fieldPath: 'headMovementCount',
        translationPath: `${basePath}.headMovements`,
      },
      {
        fieldPath: 'painSoundCount',
        translationPath: `${basePath}.painSounds`,
      },
      {
        fieldPath: 'pointingTowardsTheFloorCount',
        translationPath: `${basePath}.pointingTowardsTheFloor`,
      },
      {
        fieldPath: 'lookAtAbdomenCount',
        translationPath: `${basePath}.lookingAtAbdomen`,
      },
    ];
  };

  getFacialMeasurementTimerFields = () => {
    const {t} = this.props;
    const basePath = 'painMeasurement.head.timer';

    return [
      {
        fieldPath: 'flehmingCount',
        translationPath: `${basePath}.flehming`,
      },
      {
        fieldPath: 'yawningCount',
        translationPath: `${basePath}.yawning`,
      },
      {
        fieldPath: 'teethGrindingCount',
        translationPath: `${basePath}.teethGrinding`,
      },
      {
        fieldPath: 'moaningCount',
        translationPath: `${basePath}.moaning`,
      },
      {
        fieldPath: 'smackingCount',
        translationPath: `${basePath}.smacking`,
      },
      {
        fieldPath: 'headShakingCount',
        translationPath: `${basePath}.headShaking`,
      },
    ];
  };

  getHorseFullQuestionFields = () => {
    const basePath = 'painMeasurement';

    return [
      {
        fieldPath: 'behaviourPostureScore',
        translationPath: `${basePath}.full.observation.behaviourOptions`,
      },
      {
        fieldPath: 'overallAppearanceScore',
        translationPath: `${basePath}.full.observation.overallAppearanceOptions`,
      },
      {
        fieldPath: 'sweatingScore',
        translationPath: `${basePath}.full.observation.sweatingOptions`,
      },
      {
        fieldPath: 'respiratoryRateScore',
        translationPath: `${basePath}.full.vet.respiratoryRateOptions`,
      },
      {
        fieldPath: 'heartRateScore',
        translationPath: `${basePath}.full.vet.heartRateOptions`,
      },
      {
        fieldPath: 'digestiveSoundsScore',
        translationPath: `${basePath}.full.vet.digestiveSoundsOptions`,
      },
      {
        fieldPath: 'rectalTemperatureScore',
        translationPath: `${basePath}.full.vet.rectalTemperatureOptions`,
      },
      {
        fieldPath: 'reactionToPalpationScore',
        translationPath: `${basePath}.full.interaction.reactionToPalpationOptions`,
      },
    ];
  };

  getHorseHeadQuestionFields = () => {
    const basePath = 'painMeasurement';

    return [
      {
        fieldPath: 'headScore',
        translationPath: `${basePath}.head.observation.headOptions`,
      },
      {
        fieldPath: 'eyelidScore',
        translationPath: `${basePath}.head.observation.eyelidsOptions`,
      },
      {
        fieldPath: 'focusScore',
        translationPath: `${basePath}.head.observation.focusOptions`,
      },
      {
        fieldPath: 'nostrilScore',
        translationPath: `${basePath}.head.observation.nostrilsOptions`,
      },
      {
        fieldPath: 'cornerMouthScore',
        translationPath: `${basePath}.head.observation.mouthCornersOptions`,
      },
      {
        fieldPath: 'muscleToneHeadScore',
        translationPath: `${basePath}.head.observation.muscleToneHeadOptions`,
      },
      {
        fieldPath: 'earScore',
        translationPath: `${basePath}.head.observation.earsOptions`,
      },
    ];
  };

  getDonkeyFullQuestionFields = () => {
    const basePath = 'painMeasurement';

    return [
      {
        fieldPath: 'layingDownRollingScore',
        translationPath: `${basePath}.full.observation.donkey.layingDownRollingOptions`,
      },
      {
        fieldPath: 'overallAppearanceScore',
        translationPath: `${basePath}.full.observation.donkey.overallAppearanceOptions`,
      },
      {
        fieldPath: 'earPositionScore',
        translationPath: `${basePath}.full.observation.donkey.earPositionOptions`,
      },
      {
        fieldPath: 'postureScore',
        translationPath: `${basePath}.full.observation.donkey.postureOptions`,
      },
      {
        fieldPath: 'weightDistributionScore',
        translationPath: `${basePath}.full.observation.donkey.weightDistributionOptions`,
      },
      {
        fieldPath: 'headCarriageScore',
        translationPath: `${basePath}.full.observation.donkey.headCarriageOptions`,
      },
      {
        fieldPath: 'sweatingScore',
        translationPath: `${basePath}.full.observation.donkey.sweatingOptions`,
      },
      {
        fieldPath: 'eatingScore',
        translationPath: `${basePath}.full.observation.donkey.eatingOptions`,
      },
      {
        fieldPath: 'changesInBehaviourScore',
        translationPath: `${basePath}.full.observation.donkey.changesInBehaviourOptions`,
      },
      {
        fieldPath: 'reactionToObserverScore',
        translationPath: `${basePath}.full.observation.donkey.reactionToObserverOptions`,
      },
      {
        fieldPath: 'reactionToPalpationScore',
        translationPath: `${basePath}.full.interaction.donkey.reactionToPalpationOptions`,
      },
      {
        fieldPath: 'movementScore',
        translationPath: `${basePath}.full.interaction.donkey.movementOptions`,
      },
      {
        fieldPath: 'respiratoryRateScore',
        translationPath: `${basePath}.full.vet.donkey.respiratoryRateOptions`,
      },
      {
        fieldPath: 'heartRateScore',
        translationPath: `${basePath}.full.vet.donkey.heartRateOptions`,
      },
      {
        fieldPath: 'digestiveSoundsScore',
        translationPath: `${basePath}.full.vet.donkey.digestiveSoundsOptions`,
      },
      {
        fieldPath: 'rectalTemperatureScore',
        translationPath: `${basePath}.full.vet.donkey.rectalTemperatureOptions`,
      },
      {
        fieldPath: 'reactionToPalpationScore',
        translationPath: `${basePath}.full.vet.donkey.reactionToPalpationOptions`,
      },
    ];
  };

  getDonkeyHeadQuestionFields = () => {
    const basePath = 'painMeasurement';

    return [
      {
        fieldPath: 'headScore',
        translationPath: `${basePath}.head.observation.donkey.headOptions`,
      },
      {
        fieldPath: 'eyelidsScore',
        translationPath: `${basePath}.head.observation.donkey.eyelidsOptions`,
      },
      {
        fieldPath: 'focusScore',
        translationPath: `${basePath}.head.observation.donkey.focusOptions`,
      },
      {
        fieldPath: 'nostrilsScore',
        translationPath: `${basePath}.head.observation.donkey.nostrilsOptions`,
      },
      {
        fieldPath: 'mouthCornersScore',
        translationPath: `${basePath}.head.observation.donkey.mouthCornersOptions`,
      },
      {
        fieldPath: 'muscleToneHeadScore',
        translationPath: `${basePath}.head.observation.donkey.muscleToneHeadOptions`,
      },
      {
        fieldPath: 'sweatingBehindTheEarsScore',
        translationPath: `${basePath}.head.observation.donkey.sweatingBehindTheEarsOptions`,
      },
      {
        fieldPath: 'earPositionScore',
        translationPath: `${basePath}.head.observation.donkey.earPositionOptions`,
      },
      {
        fieldPath: 'responseToAuditoryStimulusScore',
        translationPath: `${basePath}.head.observation.donkey.responseToAuditoryStimulusOptions`,
      },
    ];
  };

  render() {
    const {navigation, t} = this.props;
    const measurement = navigation.getParam('measurement');
    const translatedAnimalType = t(measurement.data.animalType).toLowerCase();
    const fieldTranslationMap =
      measurement.type === 'composite'
        ? this.getCompositeMeasurementTimerFields()
        : this.getFacialMeasurementTimerFields();
    const tObj = curry(t)(__, {
      returnObjects: true,
      animalType: translatedAnimalType,
    });
    const advicePaths = {
      composite: {
        pain: 'painMeasurement.misc.adviceCompositeMeasurementPain',
        noPain: 'painMeasurement.misc.adviceCompositeMeasurementNoPain',
      },
      head: {
        pain: 'painMeasurement.misc.adviceFacialExpressionMeasurementPain',
        noPain: 'painMeasurement.misc.adviceFacialExpressionMeasurementNoPain',
      },
    };

    let questionfFeldTranslationMap;
    let advice;

    if (measurement.data.animalType === 'horse') {
      if (measurement.type === 'composite') {
        questionfFeldTranslationMap = this.getHorseFullQuestionFields();
      }
      advice =
        measurement.data.finalScore > 5
          ? tObj(advicePaths.composite.pain)
          : tObj(advicePaths.composite.noPain);
      if (measurement.type === 'facialExpression') {
        questionfFeldTranslationMap = this.getHorseHeadQuestionFields();
      }
      advice =
        measurement.data.finalScore > 3
          ? tObj(advicePaths.head.pain)
          : tObj(advicePaths.head.noPain);
    }

    if (measurement.data.animalType === 'donkey') {
      if (measurement.type === 'composite') {
        questionfFeldTranslationMap = this.getDonkeyFullQuestionFields();
      }
      advice =
        measurement.data.finalScore > 5
          ? tObj(advicePaths.composite.pain)
          : tObj(advicePaths.composite.noPain);
      if (measurement.type === 'facialExpression') {
        questionfFeldTranslationMap = this.getDonkeyHeadQuestionFields();
      }
      advice =
        measurement.data.finalScore > 2
          ? tObj(advicePaths.head.pain)
          : tObj(advicePaths.head.noPain);
    }

    const timerAnswers = compose(
      map(pair => {
        const foundMapItem = find(propEq('fieldPath', pair[0]))(
          fieldTranslationMap,
        );
        return [t(foundMapItem.translationPath), pair[1]];
      }),
      toPairs,
      pick(map(prop('fieldPath'))(fieldTranslationMap)),
    )(measurement.data);

    const questionAnswers = compose(
      map(pair => {
        const foundMapItem = find(propEq('fieldPath', pair[0]))(
          questionfFeldTranslationMap,
        );
        return {
          answer: tObj(foundMapItem.translationPath)[pair[1]],
          title: tObj(foundMapItem.translationPath.replace('Options', '')),
        };
      }),
      toPairs,
      pick(map(prop('fieldPath'))(questionfFeldTranslationMap)),
    )(measurement.data);

    return (
      <View style={{flex: 1, backgroundColor: colors.white}}>
        <ScrollView enabled>
          <CategoryHeader
            boxStyles={{
              paddingLeft: 20,
              backgroundColor: colors.egyptianBlue,
            }}
            textStyles={{fontWeight: '700', color: colors.white}}>
            {measurement.type === 'composite'
              ? t('painMeasurement.misc.compositePainScaleTitle')
              : t('painMeasurement.misc.facialExpressionsTitle')}
          </CategoryHeader>
          <Row iconName={iconMap.measurement}>
            <Text style={{...fonts.style.h4}}>
              {t('painMeasurement.misc.score')}
            </Text>
            <Text style={{...fonts.style.h1, color: colors.egyptianBlue}}>
              {`${measurement.data.finalScore}`}
            </Text>
          </Row>
          <CategoryHeader boxStyles={{paddingLeft: 20}}>
            {t('painMeasurement.misc.ourAdvice')}
          </CategoryHeader>
          <Row paddingVertical={20}>
            <Text style={{...fonts.style.normal}}>{advice}</Text>
            <View />
          </Row>
          <CategoryHeader
            boxStyles={{
              paddingLeft: 20,
              backgroundColor: colors.egyptianBlue,
            }}
            textStyles={{fontWeight: '700', color: colors.white}}>
            {t('counting')}
          </CategoryHeader>
          <View>
            {timerAnswers.map(pair => (
              <Row key={pair[0]}>
                <Text style={{...fonts.style.normal}}>{pair[0]}</Text>
                <View
                  style={{
                    height: 30,
                    width: 30,
                    backgroundColor: colors.egyptianBlue,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{...fonts.style.bold, color: colors.white}}>
                    {pair[1]}
                  </Text>
                </View>
              </Row>
            ))}
          </View>
          <CategoryHeader
            boxStyles={{
              paddingLeft: 20,
              backgroundColor: colors.egyptianBlue,
            }}
            textStyles={{fontWeight: '700', color: colors.white}}>
            {t('answers')}
          </CategoryHeader>
          <View>
            {questionAnswers.map(({title, answer}) => (
              <View key={title}>
                <CategoryHeader boxStyles={{paddingLeft: 20}}>
                  {title}
                </CategoryHeader>
                <Row>
                  <Text style={{...fonts.style.normal}}>{answer}</Text>
                  <View />
                </Row>
              </View>
            ))}
          </View>
          {measurement.data.note && (
            <Fragment>
              <CategoryHeader
                boxStyles={{
                  paddingLeft: 20,
                  backgroundColor: colors.egyptianBlue,
                }}
                textStyles={{fontWeight: '700', color: colors.white}}>
                {t('notes')}
              </CategoryHeader>
              <Row>
                <Text style={{...fonts.style.normal}}>
                  {measurement.data.note}
                </Text>
                <View />
              </Row>
            </Fragment>
          )}
        </ScrollView>
      </View>
    );
  }
}

export default translate('root')(PainMeasurementDetails);
