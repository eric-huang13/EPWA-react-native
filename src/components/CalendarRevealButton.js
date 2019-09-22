import React from 'react';
import {TouchableHighlight, View} from 'react-native';
import PropTypes from 'prop-types';
import Arrow from '../images/svg/arrow-down.svg';

import Icon from './Icon';
// import s from "./styles/HamburgerButtonStyles";
import {colors} from '../themes';

import iconMap from '../constants/iconMap';

const CalendarRevealButton = ({onPress, hitSlop, open}) => (
  <TouchableHighlight
    hitSlop={hitSlop || {}}
    onPress={onPress}
    underlayColor="#fff"
    style={{
      shadowColor: colors.black,
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.2,
      shadowRadius: 7,
      marginVertical: 20,
    }}>
    <View
      style={{
        width: 78,
        height: 43,
        paddingHorizontal: 14,
        backgroundColor: colors.mediumPurple,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
      <Icon name={iconMap.calendar} size={18} color={colors.white} />
      <Arrow style={open ? {transform: [{rotate: '180deg'}]} : ''} />
    </View>
  </TouchableHighlight>
);

CalendarRevealButton.propTypes = {
  hitSlop: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onPress: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

export default CalendarRevealButton;
