import React, {Component} from 'react';
import {HeaderBackButton} from 'react-navigation-stack';
import {
  Alert,
  Button,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {append, compose, dropLast, has, last} from 'ramda';
import {connect} from 'react-redux';
import {hoistStatics} from 'recompose';
import {withSafeInterval} from '@hocs/safe-timers';
import Touchable from 'react-native-platform-touchable';

import {isCompositeMeasurement} from '../services/painMeasurement';

import CountdownCircle from '../components/CountdownCircle';
import TimerButton from '../components/TimerButton';
import ProgressBar from '../components/ProgressBar';
import TitleBar from '../components/TitleBar';
import UndoButton from '../components/UndoButton';
import RadioButton from '../components/RadioButton';

import {colors, fonts} from '../themes';
import iconMap from '../constants/iconMap';
import imageMap from '../constants/imageMap';

class PainMeasurementTimer extends Component {
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
              const {t, isUserLoggedIn} = screenProps;
              Alert.alert(
                t('painMeasurementQuitTitle'),
                t('painMeasurementQuitMessage'),
                [
                  {text: t('cancel'), style: 'cancel'},
                  {
                    text: t('quit'),
                    onPress: () =>
                      navigation.navigate(isUserLoggedIn ? 'Diary' : 'StartUp'),
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

  constructor(props) {
    super(props);

    this.interval = null;

    if (this.hasCompletedInThePast()) {
      this.state = {
        seconds: 0,
        fieldChangeHistory: [],
        isRunning: false,
      };
    } else {
      this.state = {
        seconds: this.timerInitialValue,
        fieldChangeHistory: [],
        isRunning: false,
      };
    }

    this.clearSafeInterval = null;
  }

  componentDidMount() {
    if (!this.hasCompletedInThePast()) {
      this.initCountdown();
    }
  }

  get form() {
    return this.props.screenProps.form;
  }

  get values() {
    return this.form.values;
  }

  get measurementType() {
    return this.values.measurementType;
  }

  get timerInitialValue() {
    return this.measurementType === 'composite' ? 300 : 120;
    // return this.measurementType === "composite" ? 3 : 1;
  }

  get fields() {
    if (this.measurementType === 'composite') {
      return [
        'rollCount',
        'tailFlickCount',
        'kickAtAbdomenCount',
        'pawCount',
        'headMovementCount',
        'painSoundCount',
      ];
    }

    if (this.measurementType === 'facialExpression') {
      return [
        'flehmingCount',
        'yawningCount',
        'teethGrindingCount',
        'moaningCount',
      ];
    }
  }

  hasCompletedInThePast = () => {
    const {values} = this.form;

    if (this.measurementType === 'composite') {
      return has('rollCount')(values);
    }

    if (this.measurementType === 'facialExpression') {
      return has('flehmingCount')(values);
    }
  };

  initCountValues = () => {
    if (this.measurementType === 'composite') {
      if (this.values.animalType === 'horse') {
        this.form.setFieldValue('rollCount', 0);
        this.form.setFieldValue('tailFlickCount', 0);
        this.form.setFieldValue('kickAtAbdomenCount', 0);
        this.form.setFieldValue('pawCount', 0);
        this.form.setFieldValue('headMovementCount', 0);
        this.form.setFieldValue('painSoundCount', 0);
      }

      if (this.values.animalType === 'donkey') {
        this.form.setFieldValue('tailFlickCount', 0);
        this.form.setFieldValue('lookAtAbdomenCount', 0);
        this.form.setFieldValue('kickAtAbdomenCount', 0);
        this.form.setFieldValue('pawCount', 0);
        this.form.setFieldValue('pointingTowardsTheFloorCount', 0);
        this.form.setFieldValue('painSoundCount', 0);
      }
    }

    if (this.measurementType === 'facialExpression') {
      if (this.values.animalType === 'horse') {
        this.form.setFieldValue('flehmingCount', 0);
        this.form.setFieldValue('yawningCount', 0);
        this.form.setFieldValue('teethGrindingCount', 0);
        this.form.setFieldValue('moaningCount', 0);
      }

      if (this.values.animalType === 'donkey') {
        this.form.setFieldValue('smackingCount', 0);
        this.form.setFieldValue('headShakingCount', 0);
        this.form.setFieldValue('flehmingCount', 0);
        this.form.setFieldValue('yawningCount', 0);
        this.form.setFieldValue('teethGrindingCount', 0);
        this.form.setFieldValue('moaningCount', 0);
      }
    }
  };

  initCountdown = () => {
    if (this.clearSafeInterval) {
      return;
    }

    this.initCountValues();
    this.setState({isRunning: true});

    this.setState(state => ({seconds: state.seconds - 1}));
    this.clearSafeInterval = this.props.setSafeInterval(() => {
      this.setState(state => ({seconds: state.seconds - 1}));

      if (this.state.seconds === 0) {
        this.clearSafeInterval();
        this.setState({isRunning: false});
      }
    }, 1000);
  };

  resetTimerAndCount = () => {
    if (this.clearSafeInterval) {
      this.clearSafeInterval();
    }
    this.clearSafeInterval = null;
    this.setState({
      seconds: this.timerInitialValue,
      fieldChangeHistory: [],
      isRunning: true,
    });
    this.initCountdown();
  };

  undoLastAction = () => {
    const lastChangedField = last(this.state.fieldChangeHistory);
    const {values, setFieldValue} = this.form;

    if (!lastChangedField || !this.state.isRunning) {
      return;
    }

    setFieldValue(lastChangedField, values[lastChangedField] - 1);
    this.setState({
      fieldChangeHistory: dropLast(1, this.state.fieldChangeHistory),
    });
  };

  incrementCountValue = fieldName => {
    const {values, setFieldValue} = this.form;
    setFieldValue(fieldName, values[fieldName] + 1);
    this.setState({
      fieldChangeHistory: append(fieldName, this.state.fieldChangeHistory),
    });
  };

  renderButtons = () => {
    const {values} = this.form;

    return (
      <View>
        {this.fields.map(fieldName => (
          <View key={fieldName} style={{flexDirection: 'row'}}>
            <Button
              disabled={!this.state.isRunning}
              title={fieldName}
              color="#000"
              onPress={() => this.incrementCountValue(fieldName)}
            />
            <Text>{values[fieldName]}</Text>
          </View>
        ))}
      </View>
    );
  };

  onSubmit = () => {
    if (this.measurementType === 'composite') {
      this.props.navigation.navigate('PainMeasurementObservationFull');
    }

    if (this.measurementType === 'facialExpression') {
      this.props.navigation.navigate('PainMeasurementObservationHead');
    }
  };

  renderCompositeMeasurementTimer = () => {
    const {t} = this.props.screenProps;

    if (this.values.animalType === 'donkey') {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <View style={{justifyContent: 'center', marginRight: 10}}>
            <View style={{marginBottom: 10}}>
              <TimerButton
                count={this.values.tailFlickCount}
                disabled={!this.state.isRunning}
                imagePath={imageMap.donkey.tailFlicking}
                onPress={() => this.incrementCountValue('tailFlickCount')}
                label={t('painMeasurement.full.timer.tailFlicking')}
                labelPosition="top"
              />
            </View>
            <View style={{marginTop: 10}}>
              <TimerButton
                count={this.values.pawCount}
                disabled={!this.state.isRunning}
                imagePath={imageMap.donkey.pawing}
                onPress={() => this.incrementCountValue('pawCount')}
                label={t('painMeasurement.full.timer.pawing')}
                labelPosition="bottom"
              />
            </View>
          </View>
          <View style={{alignSelf: 'center', justifyContent: 'center'}}>
            <View style={{marginBottom: 20}}>
              <TimerButton
                count={this.values.painSoundCount}
                disabled={!this.state.isRunning}
                iconName={iconMap.sound}
                onPress={() => this.incrementCountValue('painSoundCount')}
                label={t('painMeasurement.full.timer.painSounds')}
                labelPosition="top"
              />
            </View>
            <CountdownCircle timeLeftInSeconds={this.state.seconds} />
            <View style={{marginTop: 20}}>
              <TimerButton
                count={this.values.pointingTowardsTheFloorCount}
                disabled={!this.state.isRunning}
                imagePath={imageMap.donkey.pointingTowardsTheFloor}
                onPress={() =>
                  this.incrementCountValue('pointingTowardsTheFloorCount')
                }
                label={t('painMeasurement.full.timer.pointingTowardsTheFloor')}
                labelPosition="bottom"
              />
            </View>
          </View>
          <View style={{justifyContent: 'center', marginLeft: 10}}>
            <View style={{marginTop: 20}}>
              <TimerButton
                count={this.values.lookAtAbdomenCount}
                disabled={!this.state.isRunning}
                imagePath={imageMap.donkey.lookingAtAbdomen}
                onPress={() => this.incrementCountValue('lookAtAbdomenCount')}
                label={t('painMeasurement.full.timer.lookingAtAbdomen')}
                labelPosition="top"
              />
            </View>
            <View style={{marginTop: 20}}>
              <TimerButton
                count={this.values.kickAtAbdomenCount}
                disabled={!this.state.isRunning}
                imagePath={imageMap.donkey.kickingAtAbdomen}
                onPress={() => this.incrementCountValue('kickAtAbdomenCount')}
                label={t('painMeasurement.full.timer.kickingAtAbdomen')}
                labelPosition="bottom"
              />
            </View>
          </View>
        </View>
      );
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <View style={{justifyContent: 'center', marginRight: 10}}>
          <View style={{marginBottom: 10}}>
            <TimerButton
              count={this.values.tailFlickCount}
              disabled={!this.state.isRunning}
              imagePath={imageMap.horse.tailFlicking}
              onPress={() => this.incrementCountValue('tailFlickCount')}
              label={t('painMeasurement.full.timer.tailFlicking')}
              labelPosition="top"
            />
          </View>
          <View style={{marginTop: 10}}>
            <TimerButton
              count={this.values.pawCount}
              disabled={!this.state.isRunning}
              imagePath={imageMap.horse.pawing}
              onPress={() => this.incrementCountValue('pawCount')}
              label={t('painMeasurement.full.timer.pawing')}
              labelPosition="bottom"
            />
          </View>
        </View>
        <View style={{alignSelf: 'center', justifyContent: 'center'}}>
          <View style={{marginBottom: 20}}>
            <TimerButton
              count={this.values.rollCount}
              disabled={!this.state.isRunning}
              imagePath={imageMap.horse.layingDownRolling}
              onPress={() => this.incrementCountValue('rollCount')}
              label={t('painMeasurement.full.timer.layingDownRolling')}
              labelPosition="top"
            />
          </View>
          <CountdownCircle timeLeftInSeconds={this.state.seconds} />
          <View style={{marginTop: 20}}>
            <TimerButton
              count={this.values.headMovementCount}
              disabled={!this.state.isRunning}
              imagePath={imageMap.horse.headMovements}
              onPress={() => this.incrementCountValue('headMovementCount')}
              label={t('painMeasurement.full.timer.headMovements')}
              labelPosition="bottom"
            />
          </View>
        </View>
        <View style={{justifyContent: 'center', marginLeft: 10}}>
          <View style={{marginTop: 20}}>
            <TimerButton
              count={this.values.kickAtAbdomenCount}
              disabled={!this.state.isRunning}
              imagePath={imageMap.horse.kickingAtAbdomen}
              onPress={() => this.incrementCountValue('kickAtAbdomenCount')}
              label={t('painMeasurement.full.timer.kickingAtAbdomen')}
              labelPosition="top"
            />
          </View>
          <View style={{marginTop: 20}}>
            <TimerButton
              count={this.values.painSoundCount}
              disabled={!this.state.isRunning}
              iconName={iconMap.sound}
              onPress={() => this.incrementCountValue('painSoundCount')}
              label={t('painMeasurement.full.timer.painSounds')}
              labelPosition="bottom"
            />
          </View>
        </View>
      </View>
    );
  };

  renderFacialExpressionTimer = () => {
    const {t} = this.props.screenProps;

    if (this.values.animalType === 'donkey') {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <View style={{justifyContent: 'center', marginRight: 10}}>
            <View style={{marginBottom: 10}}>
              <TimerButton
                count={this.values.flehmingCount}
                disabled={!this.state.isRunning}
                imagePath={imageMap.donkey.flehming}
                onPress={() => this.incrementCountValue('flehmingCount')}
                label={t('painMeasurement.head.timer.flehming')}
                labelPosition="top"
              />
            </View>
            <View style={{marginTop: 10}}>
              <TimerButton
                count={this.values.yawningCount}
                disabled={!this.state.isRunning}
                imagePath={imageMap.donkey.yawning}
                onPress={() => this.incrementCountValue('yawningCount')}
                label={t('painMeasurement.head.timer.yawning')}
                labelPosition="bottom"
              />
            </View>
          </View>
          <View style={{alignSelf: 'center', justifyContent: 'center'}}>
            <View style={{marginBottom: 20}}>
              <TimerButton
                count={this.values.teethGrindingCount}
                disabled={!this.state.isRunning}
                imagePath={imageMap.donkey.teethGrinding}
                onPress={() => this.incrementCountValue('teethGrindingCount')}
                label={t('painMeasurement.head.timer.teethGrinding')}
                labelPosition="top"
              />
            </View>
            <CountdownCircle timeLeftInSeconds={this.state.seconds} />
            <View style={{marginTop: 20}}>
              <TimerButton
                count={this.values.moaningCount}
                disabled={!this.state.isRunning}
                iconName={iconMap.sound}
                onPress={() => this.incrementCountValue('moaningCount')}
                label={t('painMeasurement.head.timer.moaning')}
                labelPosition="bottom"
              />
            </View>
          </View>
          <View style={{justifyContent: 'center', marginLeft: 10}}>
            <View style={{marginTop: 20}}>
              <TimerButton
                count={this.values.smackingCount}
                disabled={!this.state.isRunning}
                imagePath={imageMap.donkey.smacking}
                onPress={() => this.incrementCountValue('smackingCount')}
                label={t('painMeasurement.head.timer.smacking')}
                labelPosition="top"
              />
            </View>
            <View style={{marginTop: 20}}>
              <TimerButton
                count={this.values.headShakingCount}
                disabled={!this.state.isRunning}
                imagePath={imageMap.donkey.headShaking}
                onPress={() => this.incrementCountValue('headShakingCount')}
                label={t('painMeasurement.head.timer.headShaking')}
                labelPosition="bottom"
              />
            </View>
          </View>
        </View>
      );
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <View style={{justifyContent: 'center', marginRight: 20}}>
          <View>
            <TimerButton
              count={this.values.flehmingCount}
              disabled={!this.state.isRunning}
              imagePath={imageMap.horse.flehming}
              onPress={() => this.incrementCountValue('flehmingCount')}
              label={t('painMeasurement.head.timer.flehming')}
              labelPosition="bottom"
            />
          </View>
        </View>
        <View style={{alignSelf: 'center', justifyContent: 'center'}}>
          <View style={{marginBottom: 20}}>
            <TimerButton
              count={this.values.yawningCount}
              disabled={!this.state.isRunning}
              imagePath={imageMap.horse.yawning}
              onPress={() => this.incrementCountValue('yawningCount')}
              label={t('painMeasurement.head.timer.yawning')}
              labelPosition="top"
            />
          </View>
          <CountdownCircle timeLeftInSeconds={this.state.seconds} />
          <View style={{marginTop: 20}}>
            <TimerButton
              count={this.values.teethGrindingCount}
              disabled={!this.state.isRunning}
              imagePath={imageMap.horse.teethGrinding}
              onPress={() => this.incrementCountValue('teethGrindingCount')}
              label={t('painMeasurement.head.timer.teethGrinding')}
              labelPosition="bottom"
            />
          </View>
        </View>
        <View style={{justifyContent: 'center', marginLeft: 20}}>
          <View>
            <TimerButton
              count={this.values.moaningCount}
              disabled={!this.state.isRunning}
              iconName={iconMap.sound}
              onPress={() => this.incrementCountValue('moaningCount')}
              label={t('painMeasurement.head.timer.moaning')}
              labelPosition="bottom"
            />
          </View>
        </View>
      </View>
    );
  };

  render() {
    const {t} = this.props.screenProps;

    return (
      <View style={{flex: 1, backgroundColor: colors.egyptianBlue}}>
        <ProgressBar percent={50} />
        <TitleBar>
          {t('painMeasurement.misc.countMovementsCommand', {
            minutes: this.measurementType === 'composite' ? 5 : 2,
          })}
        </TitleBar>
        <View style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              backgroundColor: colors.egyptianBlue,
            }}>
            {isCompositeMeasurement(this.values)
              ? this.renderCompositeMeasurementTimer()
              : this.renderFacialExpressionTimer()}
          </ScrollView>
          <View style={{backgroundColor: colors.egyptianBlue}}>
            {this.state.isRunning ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginHorizontal: 20,
                  marginBottom: 20,
                }}>
                <UndoButton
                  disabled={Boolean(!this.state.fieldChangeHistory.length)}
                  onPress={this.undoLastAction}
                />
                {isCompositeMeasurement(this.values) &&
                this.values.animalType === 'horse' ? (
                  <RadioButton
                    active={this.values.isLyingInUnnaturalPosition}
                    label={t('painMeasurement.misc.liesInUnnaturalPosition')}
                    onPress={() =>
                      this.form.setFieldValue(
                        'isLyingInUnnaturalPosition',
                        !this.values.isLyingInUnnaturalPosition,
                      )
                    }
                  />
                ) : null}
              </View>
            ) : null}
            {this.state.seconds === 0 ? (
              <View style={{flexDirection: 'row', width: '100%'}}>
                <Touchable
                  onPress={this.resetTimerAndCount}
                  style={{
                    flex: 1,
                    minHeight: 60,
                    backgroundColor: colors.egyptianBlueDark,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{...fonts.style.cta, color: colors.white}}>
                    {t('painMeasurement.misc.resetForm')}
                  </Text>
                </Touchable>
                <Touchable
                  onPress={this.onSubmit}
                  style={{
                    flex: 1,
                    minHeight: 60,
                    backgroundColor: colors.lima,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{...fonts.style.cta, color: colors.white}}>
                    {t('painMeasurement.misc.nextStep')}
                  </Text>
                </Touchable>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

export default hoistStatics(
  compose(
    connect(),
    withSafeInterval,
  ),
)(PainMeasurementTimer);
