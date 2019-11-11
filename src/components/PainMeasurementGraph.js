import React from "react";
import T from "prop-types";
import {
  View,
  // TouchableOpacity,
  // Dimensions,
  ScrollView,
  Text,
  Switch,
  StyleSheet
} from "react-native";
import { Rect, Text as SVGText, Line } from "react-native-svg";
import {
  VictoryAxis,
  VictoryScatter,
  VictoryChart,
  VictoryLabel
} from "victory-native";
import { format, isWithinRange, addDays } from "date-fns";
// import { dropRight } from "lodash";

// import { getMaximalScore } from "../services/painMeasurement";
// import s from "./styles/PainMeasurementGraphStyles";
import { colors, fonts } from "../themes";
// import Icon from "./Icon";
// import iconMap from "../constants/iconMap";
import { isNil } from "ramda";
import { eventTypes } from "../constants";
// import Reactotron from "reactotron-react-native";

class PainMeasurementGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      maxScore: 55,
      ticks: [],
      tickStrings: [],
      data: [],
      compositeLine: [],
      facialExpressionLine: [],
      showComposite: true,
      showFacial: true
    };
  }

  componentDidMount() {
    this.setGraphData();
  }

  componentDidUpdate(prevProps, prevState) {
    const prev = prevProps.items.filter(event => event.completed === true);
    const curr = this.props.items.filter(event => event.completed === true);
    if (prev.length !== curr.length) {
      this.setGraphData();
    }
    if (prevProps.currentAnimal !== this.props.currentAnimal) {
      this.setGraphData();
    }
    if (prevProps.currentDate !== this.props.currentDate) {
      this.setGraphData();
    }
  }

  setLineXY = (xCoor, yCoor, type, dataLenght1, dataLenght2) => {
    if (
      type === eventTypes.composite &&
      this.state.compositeLine.length < dataLenght1
    ) {
      this.setState(prevState => ({
        compositeLine: [...prevState.compositeLine, { xCoor, yCoor }]
      }));
    }
    if (
      type === eventTypes.facialExpression &&
      this.state.facialExpressionLine.length < dataLenght2
    ) {
      this.setState(prevState => ({
        facialExpressionLine: [
          ...prevState.facialExpressionLine,
          { xCoor, yCoor }
        ]
      }));
    }
  };

  toggleShowComposite = () => {
    this.setState(prevState => ({
      showComposite: !prevState.showComposite
    }));
  };

  toggleShowFacial = () => {
    this.setState(prevState => ({
      showFacial: !prevState.showFacial
    }));
  };

  setGraphData = () => {
    const formatDate = timestamp =>
      format(timestamp, "D MMM-HH:mm", { locale: this.props.locale });
    const { t } = this.props;
    // const maxScore = 55;
    const ticks = [];
    const tickStrings = [];

    const end = this.props.items.length;
    const start = end > 15 ? end - 15 : 0;

    const isPainScore = value => isNil(value.data) === false;

    const data = this.props.items
      // .slice(start, end)
      .filter(isPainScore)
      .filter(item => {
        return isWithinRange(
          format(this.props.currentDate),
          addDays(format(item.startDate), -15),
          addDays(format(item.startDate), 5)
        );
      })
      .map((item, index) => {
        // maxScore = Math.max(maxScore, getMaximalScore(item));
        ticks.push(index);
        tickStrings.push(formatDate(item.startDate).replace("-", "\n"));
        return {
          index,
          date: item.startDate,
          score: item.data && item.data.finalScore ? item.data.finalScore : 0,
          type:
            item.data && item.data.measurementType
              ? item.data.measurementType
              : ""
        };
      });

    const facialExpressionLength = data.filter(
      a => a.type === eventTypes.facialExpression
    ).length;

    const compositeLength = data.filter(a => a.type === eventTypes.composite)
      .length;

    this.setState({
      // maxScore,
      ticks,
      tickStrings,
      data,
      facialExpressionLength,
      compositeLength,
      facialExpressionLine: [],
      compositeLine: []
    });
  };

  render() {
    // Reactotron.log("RENDER GRAPH");
    const { t } = this.props;
    const {
      // maxScore,
      ticks,
      tickStrings,
      data,
      facialExpressionLength,
      compositeLength
    } = this.state;

    if (facialExpressionLength + compositeLength === 0) {
      return (
        <View style={{ marginTop: 40, marginBottom: 20, alignItems: "center" }}>
          <Text>{t("noRecentPainMeasurements")}</Text>
        </View>
      );
    }

    return (
      <View>
        <Text
          style={{
            ...fonts.style.dateFont,
            textAlign: "center",
            paddingTop: 50,
            paddingBottom: 20
          }}
        >
          {t("graphTitle")}
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 35,
            paddingBottom: 20
          }}
        >
          <ScrollView
            horizontal
            persistentScrollbar
            style={{
              width: "100%",
              paddingBottom: 35
            }}
            ref={ref => (this.scrollView = ref)}
            onContentSizeChange={(contentWidth, contentHeight) => {
              this.scrollView.scrollToEnd({ animated: true });
            }}
          >
            {this.state.compositeLine.length > 0 ||
              (this.state.facialExpressionLine.length > 0 && (
                <View
                  style={{
                    height: 120,
                    width: 20,
                    position: "relative",
                    left: 15,
                    bottom: 39,
                    borderBottomWidth: 2,
                    borderColor: "#EDE8E8"
                  }}
                />
              ))}
            <VictoryChart
              domain={{ y: [0, 30 || this.state.maxScore] }}
              domainPadding={{ x: 20 }}
              padding={{ top: 0, right: 15, bottom: 40, left: 15 }}
              width={ticks.length * 44}
              height={120}
            >
              <VictoryAxis
                style={{
                  axis: { stroke: "#EDE8E8", strokeWidth: 2 },
                  grid: { stroke: "" },
                  tickLabels: { fontSize: 10, fontWeight: "300" }
                }}
                tickValues={ticks}
                tickFormat={tickStrings}
                tickLabelComponent={<VictoryLabel dx={0} />}
              />
              {this.state.showComposite &&
                this.state.compositeLine.length > 0 &&
                this.state.compositeLine.map((line, index) => {
                  if (this.state.compositeLine[index + 1]) {
                    return (
                      <Line
                        key={index}
                        x1={line.xCoor}
                        y1={line.yCoor - 5}
                        x2={this.state.compositeLine[index + 1].xCoor}
                        y2={this.state.compositeLine[index + 1].yCoor - 5}
                        strokeWidth="2"
                        stroke={colors.lima}
                      />
                    );
                  } else {
                    return;
                  }
                })}

              {this.state.showFacial &&
                this.state.facialExpressionLine.length > 0 &&
                this.state.facialExpressionLine.map((line, index) => {
                  if (this.state.facialExpressionLine[index + 1]) {
                    return (
                      <Line
                        key={index}
                        x1={line.xCoor}
                        y1={line.yCoor - 5}
                        x2={this.state.facialExpressionLine[index + 1].xCoor}
                        y2={
                          this.state.facialExpressionLine[index + 1].yCoor - 5
                        }
                        strokeWidth="2"
                        stroke={colors.lightBlue}
                      />
                    );
                  } else {
                    return;
                  }
                })}

              <VictoryScatter
                data={data}
                alignment="start"
                style={{ data: { fill: "none" } }}
                labels={i => {}}
                labelComponent={
                  <Box
                    showExpression={this.state.showFacial}
                    showComposite={this.state.showComposite}
                    lineXY={this.setLineXY}
                    length1={compositeLength}
                    length2={facialExpressionLength}
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
  length1,
  length2,
  showComposite,
  showExpression
}) {
  lineXY(x, y, datum.type, length1, length2);

  if (datum.type === eventTypes.facialExpression && showExpression === false) {
    return null;
  }
  if (datum.type === eventTypes.composite && showComposite === false) {
    return null;
  }

  return (
    <React.Fragment>
      <Rect
        x={x - 10}
        y={y - 15}
        rx="3"
        ry="3"
        fill={
          datum.type === eventTypes.facialExpression
            ? colors.lightBlue
            : colors.lima
        }
        height={15}
        width={17}
        shadow
      />
      <SVGText
        x={x - 1}
        y={y - 4}
        fill="#FFFF"
        fontSize="9"
        fontWeight="bold"
        textAnchor="middle"
      >
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
  t
}) {
  return (
    <React.Fragment>
      <View style={styles.switchContainerStyle}>
        <Text style={fonts.style.normal}>{t("compositeMeasure")}</Text>
        <Switch
          style={{ marginLeft: 20 }}
          value={valueComposite}
          trackColor={{ true: colors.lima }}
          onValueChange={toggleComposite}
        />
      </View>
      <View style={styles.switchContainerStyle}>
        <Text style={fonts.style.normal}>{t("facialMeasure")}</Text>
        <Switch
          style={{
            marginLeft: 20
          }}
          value={valueFacial}
          trackColor={{ true: colors.lightBlue }}
          onValueChange={toggleFacial}
          // ios_backgroundColor={colors.lightBlue}
        />
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  switchContainerStyle: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginHorizontal: 20,
    paddingHorizontal: 12,
    marginBottom: 15
  }
});

PainMeasurementGraph.propTypes = {
  items: T.arrayOf(
    T.shape({
      score: T.number,
      timestamp: T.number,
      type: T.oneOf([eventTypes.composite, eventTypes.facialExpression])
    })
  ).isRequired,
  locale: T.string
};

export default PainMeasurementGraph;
