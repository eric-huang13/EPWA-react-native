import React from 'react';
import T from 'prop-types';
import {Text, View, TouchableOpacity} from 'react-native';
import {format} from 'date-fns';
import nl from 'date-fns/locale/nl';
import en from 'date-fns/locale/en';

import Icon from './Icon';

import s from './styles/DateSliderStyles';
import {colors} from '../themes';
import iconMap from '../constants/iconMap';

const DateSlider = props => {
  const locale = props.lang === 'nl' ? nl : en;
  const date = format(props.date, 'dd D MMM', {locale});

  return (
    <View style={s.container}>
      <TouchableOpacity
        onPress={props.onLeftIconPress}
        hitSlop={{left: 30, right: 30, top: 25, bottom: 25}}
        style={s.arrowLeft}>
        <Icon name={iconMap.arrowLeft} size={24} color={colors.nero} />
      </TouchableOpacity>
      <TouchableOpacity onPress={props.onTextPress}>
        <Text style={s.date}>{`${date}`}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={props.onRightIconPress}
        hitSlop={{left: 30, right: 30, top: 25, bottom: 25}}
        style={s.arrowRight}>
        <Icon name={iconMap.arrowRight} size={24} color={colors.nero} />
      </TouchableOpacity>
    </View>
  );
};

DateSlider.propTypes = {
  date: T.instanceOf(Date),
  lang: T.string,
  onLeftIconPress: T.func,
  onTextPress: T.func,
  onRightIconPress: T.func,
};

export default DateSlider;
