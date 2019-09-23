import React from 'react';
import T from 'prop-types';
import {
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Text,
  Switch,
  StyleSheet,
} from 'react-native';
import {Svg, Rect, Text as SVGText, Line} from 'react-native-svg';
import {
  VictoryAxis,
  VictoryScatter,
  VictoryChart,
  VictoryLabel,
} from 'victory-native';
import {format, isTuesday} from 'date-fns';
import {dropRight} from 'lodash';

import {getMaximalScore} from '../services/painMeasurement';
import s from './styles/PainMeasurementGraphStyles';
import {colors, fonts} from '../themes';
import Icon from './Icon';
import iconMap from '../constants/iconMap';
import {isNil} from 'ramda'

class PainMeasurementGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.items,
      compositeLine: [],
      facialExpressionLine: [],
      showComposite: true,
      showFacial: true,
    };
  }

  setLineXY = (xCoor, yCoor, type, dataLenght1, dataLenght2) => {
    if (type === 'composite' && this.state.compositeLine <= dataLenght1) {
      this.setState(prevState => ({
        compositeLine: [...prevState.compositeLine, {xCoor, yCoor}],
      }));
    }
    if (
      type === 'facialExpression' &&
      this.state.facialExpressionLine <= dataLenght2
    ) {
      this.setState(prevState => ({
        facialExpressionLine: [
          ...prevState.facialExpressionLine,
          {xCoor, yCoor},
        ],
      }));
    }
  };

  toggleShowComposite = () => {
    this.setState(prevState => ({
      showComposite: !prevState.showComposite,
    }));
  };

  toggleShowFacial = () => {
    this.setState(prevState => ({
      showFacial: !prevState.showFacial,
    }));
  };

  render() {
    const formatDate = timestamp =>
      format(timestamp, 'D MMM-HH:mm', {locale: this.props.locale});
    const {t} = this.props;
    const maxScore = 55;
    const ticks = [];
    const tickStrings = [];

    const end = this.state.data.length;
    const start = end > 15 ? end - 15 : 0;

    const isPainScore = value => isNil(value.data) === false

    const data = this.state.data.slice(start, end).filter(isPainScore).map((item, index) => {
      // maxScore = Math.max(maxScore, getMaximalScore(item));
      ticks.push(index);
      tickStrings.push(formatDate(item.startDate).replace('-', '\n'));
      return {
        index,
        date: item.startDate,
        score: (item.data && item.data.finalScore) ? item.data.finalScore : 0,
        type: (item.data && item.data.measurementType) ? item.data.measurementType : '',
      };
    });

    const facialExpressionLenght = data.filter(
      a => a.type === 'facialExpression',
    ).length;

    const compositeLenght = data.filter(a => a.type === 'composite').length;

    return (
      <View>
        <Text
          style={{
            ...fonts.style.dateFont,
            textAlign: 'center',
            paddingTop: 50,
            paddingBottom: 20,
          }}>
          {t('graphTitle')}
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 35,
            paddingBottom: 20,
          }}>
          <ScrollView
            horizontal
            persistentScrollbar
            style={{width: '100%', paddingBottom: 35}}
            ref={ref => (this.scrollView = ref)}
            onContentSizeChange={(contentWidth, contentHeight) => {
              this.scrollView.scrollToEnd({animated: true});
            }}>
            <VictoryChart
              domain={{y: [0, 30 || maxScore]}}
              domainPadding={{x: 20}}
              padding={{top: 0, right: 10, bottom: 40, left: 10}}
              width={ticks.length * 44}
              height={120}>
              <VictoryAxis
                style={{
                  axis: {stroke: '#EDE8E8', strokeWidth: 2},
                  grid: {stroke: ''},
                  tickLabels: {fontSize: 10, fontWeight: '300'},
                }}
                tickValues={ticks}
                tickFormat={tickStrings}
                tickLabelComponent={<VictoryLabel dx={0} />}
              />
              {this.state.showComposite &&
                this.state.compositeLine.map((line, index) => {
                  if (this.state.compositeLine[index + 1]) {
                    return (
                      <Line
                        key={index}
                        x1={line.xCoor}
                        y1={line.yCoor + 8}
                        x2={this.state.compositeLine[index + 1].xCoor}
                        y2={this.state.compositeLine[index + 1].yCoor + 8}
                        strokeWidth="2"
                        stroke={colors.lima}
                      />
                    );
                  }
                })}

              {this.state.showFacial &&
                this.state.facialExpressionLine.map((line, index) => {
                  if (this.state.facialExpressionLine[index + 1]) {
                    return (
                      <Line
                        key={index}
                        x1={line.xCoor}
                        y1={line.yCoor + 8}
                        x2={this.state.facialExpressionLine[index + 1].xCoor}
                        y2={
                          this.state.facialExpressionLine[index + 1].yCoor + 8
                        }
                        strokeWidth="2"
                        stroke={colors.lightBlue}
                      />
                    );
                  }
                })}

              <VictoryScatter
                data={data}
                alignment="start"
                style={{data: {fill: 'none'}}}
                labels={i => {}}
                labelComponent={
                  <Box
                    showExpression={this.state.showFacial}
                    showComposite={this.state.showComposite}
                    lineXY={this.setLineXY}
                    lenght1={compositeLenght}
                    lenght2={facialExpressionLenght}
                  />
                }
                y="score"
              />
            </VictoryChart>
          </ScrollView>
        </View>
        <Switches
          toggleComposite={this.toggleShowComposite}
          toggleFacial={this.toggleShowFacial}
          valueComposite={this.state.showComposite}
          valueFacial={this.state.showFacial}
          t={t}
        />
      </View>
    );
  }
}

function Box({
  x,
  y,
  datum,
  color,
  data,
  lineXY,
  lenght1,
  lenght2,
  showComposite,
  showExpression,
}) {
  lineXY(x, y, datum.type, lenght1, lenght2);

  if (datum.type === 'facialExpression' && showExpression === false) {
    return null;
  }
  if (datum.type === 'composite' && showComposite === false) {
    return null;
  }

  return (
    <React.Fragment>
      <Rect
        x={x - 10}
        y={y}
        rx="3"
        ry="3"
        fill={
          datum.type === 'facialExpression' ? colors.lightBlue : colors.lima
        }
        height={15}
        width={17}
      />
      <SVGText
        x={x - 1}
        y={y + 11}
        fill="#FFF"
        fontSize="9"
        fontWeight="bold"
        textAnchor="middle">
        {datum.score}
      </SVGText>
    </React.Fragment>
  );
}

function Switches({
  toggleComposite,
  toggleFacial,
  valueFacial,
  valueComposite,
  t,
}) {
  return (
    <React.Fragment>
      <View style={styles.switchContainerStyle}>
        <Text style={fonts.style.normal}>{t('compositeMeasure')}</Text>
        <Switch
          style={{marginLeft: 20}}
          value={valueComposite}
          trackColor={{true: colors.lima}}
          onValueChange={toggleComposite}
        />
      </View>
      <View style={styles.switchContainerStyle}>
        <Text style={fonts.style.normal}>{t('facialMeasure')}</Text>
        <Switch
          style={{
            marginLeft: 20,
          }}
          value={valueFacial}
          trackColor={{true: colors.lightBlue}}
          onValueChange={toggleFacial}
          // ios_backgroundColor={colors.lightBlue}
        />
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  switchContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
});

PainMeasurementGraph.propTypes = {
  items: T.arrayOf(
    T.shape({
      score: T.number,
      timestamp: T.number,
      type: T.oneOf(['composite', 'facialExpression']),
    }),
  ).isRequired,
  locale: T.string,
};

export default PainMeasurementGraph;
