import React, {Component} from 'react';
import T from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';
import {HeaderBackButton} from 'react-navigation-stack';
import {
  format,
  parse,
  isValid,
  subDays,
  getHours,
  getMinutes,
  getSeconds,
  setHours,
  setMinutes,
  setSeconds,
  getTime,
  setMilliseconds,
  getMilliseconds,
} from 'date-fns';
import {
  filter,
  groupBy,
  prop,
  compose,
  mapObjIndexed,
  values,
  flatten,
  assoc,
  omit,
  map,
} from 'ramda';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {hoistStatics} from 'recompose';

import Button from '../components/Button';
import DatePicker from '../components/DatePicker';
import DateSlider from '../components/DateSlider';
import FieldLabel from '../components/FieldLabel';
import SelectButton from '../components/SelectButton';
import withAlertDropdown from '../components/withAlertDropdown';

import {isDuringCurrentDate} from '../services/eventService';

import {colors, fonts} from '../themes';
import {eventCategories} from '../constants';
import getId from '../services/idGenerator';
import {addEvent} from '../actions/events';
import iconMap from '../constants/iconMap';

class DiaryCopy extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: screenProps.t.t('headerBar.copyEvents'),
    headerLeft: (
      <HeaderBackButton
        title={screenProps.t.t('headerBar.back')}
        tintColor={colors.nero}
        onPress={() => navigation.navigate('Diary')}
      />
    ),
  });

  get events() {
    return this.props.navigation.getParam('events');
  }

  get copyToDate() {
    return this.props.navigation.getParam('copyToDate');
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedDate: subDays(this.copyToDate, 1),
      checkboxValues: {
        [eventCategories.exercise]: false,
        [eventCategories.housing]: false,
        [eventCategories.feeding]: false,
        [eventCategories.medication]: false,
      },
    };
  }

  getEventsFromSelectedDate = events =>
    filter(isDuringCurrentDate(this.state.selectedDate))(events);

  getGroupedEventsByCategory = events => groupBy(prop('category'), events);

  onCheckboxChange = (key, value) => {
    const checkboxValues = {...this.state.checkboxValues};
    checkboxValues[key] = value;
    this.setState({checkboxValues});
  };

  replaceEventIdWithLocalId = event =>
    compose(
      assoc('localId', getId()),
      omit(['localId']),
      omit(['id'])
    )(event);

  replaceEventDateWithSelectedDate = event => {
    const clonedEvent = {...event};

    const transformDate = (currentDate, targetDate) => {
      let newDate = targetDate;
      newDate = setMilliseconds(newDate, getMilliseconds(currentDate));
      newDate = setSeconds(newDate, getSeconds(currentDate));
      newDate = setMinutes(newDate, getMinutes(currentDate));
      newDate = setHours(newDate, getHours(currentDate));
      return getTime(newDate);
    };

    clonedEvent.startDate = transformDate(
      clonedEvent.startDate,
      this.copyToDate,
    );

    if (clonedEvent.endDate) {
      clonedEvent.endDate = transformDate(clonedEvent.endDate, this.copyToDate);
    }

    return clonedEvent;
  };

  onSubmit = () => {
    const {dispatch, alertDropdown, t} = this.props;
    const events = this.events;

    if (this.state.isSubmitting) {return;}

    this.setState({isSubmitting: true});

    const groupedEvents = compose(
      this.getGroupedEventsByCategory,
      this.getEventsFromSelectedDate,
    )(events);

    const {checkboxValues} = this.state;

    const eventsToCopy = compose(
      map(this.replaceEventDateWithSelectedDate),
      map(this.replaceEventIdWithLocalId),
      flatten,
      values,
      mapObjIndexed((value, key) => (value ? groupedEvents[key] : [])),
    )(checkboxValues);

    alertDropdown('success', t('alertSuccess'), t('eventAddSuccessMsg'));

    dispatch(addEvent({payload: eventsToCopy, formHelpers: null}));

    this.setState({isSubmitting: false});
  };

  formatDateField = timestamp =>
    isValid(parse(timestamp))
      ? format(timestamp, this.props.t('dateFormat'))
      : '';

  hasEventsOnGivenDay = () =>
    Boolean(this.getEventsFromSelectedDate(this.events).length);

  renderDatePicker = () => {
    const {t} = this.props;
    let ref;
    return (
      <View>
        {/* TODO: add this component instead:
        <DateSlider
          date={this.state.selectedDate}
          lang={this.props.i18n.language}
          onLeftIconPress={this.moveCurrentDateBack}
          onTextPress={() => this.datePicker.show()}
          onRightIconPress={this.moveCurrentDateForward}
        /> */}
        <DatePicker
          locale={this.props.i18n.language}
          t={this.props.t}
          ref={element => (ref = element)} // eslint-disable-line no-return-assign
          onPick={date => this.setState({selectedDate: date})}
          date={this.state.selectedDate}
        />
        <FieldLabel style={{marginBottom: 5}}>{t('copyFromDate')}</FieldLabel>
        <View style={{height: 50}}>
          <SelectButton
            containerStyle={{height: 50}}
            onPress={() => ref.show()}>
            {this.formatDateField(this.state.selectedDate)}
          </SelectButton>
        </View>
      </View>
    );
  };

  renderCheckboxSection = () => {
    const {t} = this.props;
    const groupedEvents = compose(
      this.getGroupedEventsByCategory,
      this.getEventsFromSelectedDate,
    )(this.events);

    const fields = [
      {
        key: eventCategories.exercise,
        name: t(eventCategories.exercise),
        events: groupedEvents[eventCategories.exercise] || [],
      },
      {
        key: eventCategories.housing,
        name: t(eventCategories.housing),
        events: groupedEvents[eventCategories.housing] || [],
      },
      {
        key: eventCategories.feeding,
        name: t(eventCategories.feeding),
        events: groupedEvents[eventCategories.feeding] || [],
      },
      {
        key: eventCategories.medication,
        name: t(eventCategories.medication),
        events: groupedEvents[eventCategories.medication] || [],
      },
    ];

    return (
      <View>
        <Text style={styles.headerText}>{t('copyChoice')}</Text>
        {fields.map(field => (
          <View
            key={field.key}
            style={{flexDirection: 'row', marginBottom: 10}}>
            <Text
              style={{
                ...fonts.style.bold,
                paddingRight: 10,
                flex: 1,
                color: field.events.length ? colors.black : colors.grey,
              }}>
              {field.name}
            </Text>
            <Switch
              disabled={!field.events.length}
              value={this.state.checkboxValues[field.key]}
              onValueChange={value => this.onCheckboxChange(field.key, value)}
            />
          </View>
        ))}
      </View>
    );
  };

  renderNoEventsWarning = () => {
    const {t} = this.props;
    return (
      <Text style={[styles.headerText, {color: colors.tomato}]}>
        {t('copyNoEventsAvailable')}
      </Text>
    );
  };

  renderSubmitButton = () => {
    return (
      <Button
        style={{
          marginVertical: 20,
        }}
        label={this.props.t('copy')}
        onPress={this.onSubmit}
      />
    );
  };

  render() {
    const hasEventsOnCurrentDate = this.hasEventsOnGivenDay();

    return (
      <View style={styles.screenContainer}>
        {this.renderDatePicker()}
        <View style={{padding: 20}}>
          {hasEventsOnCurrentDate
            ? this.renderCheckboxSection()
            : this.renderNoEventsWarning()}
          {hasEventsOnCurrentDate ? this.renderSubmitButton() : null}
        </View>
      </View>
    );
  }
}

DiaryCopy.propTypes = {
  t: T.func,
  i18n: T.shape({
    language: T.string,
  }),
};

export default hoistStatics(
  compose(
    connect(),
    translate('root'),
    withAlertDropdown,
  ),
)(DiaryCopy);

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    ...fonts.style.h6,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    flex: 1,
  },
});
