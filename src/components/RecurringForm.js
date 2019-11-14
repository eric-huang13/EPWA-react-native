import React, { Component } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import Collapsible from "react-native-collapsible";
import SegmentedControlTab from "react-native-segmented-control-tab";
import {
  format,
  parse,
  getHours,
  getMinutes,
  getTime,
  isValid
} from "date-fns";
import { __, compose, flatten, isNil, indexOf } from "ramda";

import { colors, fonts } from "../themes";
import DatePicker from "./DatePicker";
import {
  setHours,
  setMinutes,
  setSecondsToZero,
  setMillisecondsToZero
} from "../services/date";
import SelectButton from "./SelectButton";
import nlLocale from "date-fns/locale/nl";

const recurringVal = {
  0: "d",
  1: "w",
  2: "m",
  3: "y"
};
const recurringIndex = ["d", "w", "m", "y"];

class RecurringForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reveal: this.setRecurring() || false,
      notification: false,
      tabIndex: 1,
      recurring_untill: this.setRecurringUntill() || null
    };
  }

  componentDidMount() {
    const { values } = this.props;

    if (isNil(values)) {
      return;
    }
    this.setRecurringTab();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.reveal !== prevState.reveal) {
      return;
    }
    const prevFlattenValues = compose(
      flatten,
      Object.values
    )(prevProps.values);
    const thisFlattenValues = compose(
      flatten,
      Object.values
    )(this.props.values);
    if (
      this.state.reveal &&
      prevFlattenValues.length < thisFlattenValues.length
    ) {
      this.handleAddRecurringEvents();
      return;
    }
    return null;
  }

  toggleReveal = () => {
    if (this.state.reveal === false) {
      this.handleAddRecurringEvents();
    } else {
      this.handleDeleteRecurringEvents();
    }

    this.setState(prevState => ({
      reveal: !prevState.reveal
    }));
  };

  handleAddRecurringEvents = () => {
    const { setFieldValue, values } = this.props;

    Object.keys(values).map(eventType => {
      values[eventType].map((_, i) => {
        setFieldValue(
          `${eventType}[${i}].recurring`,
          recurringVal[this.state.tabIndex]
        );
        setFieldValue(
          `${eventType}[${i}].recurring_untill`,
          recurringVal[this.state.recurring_untill] || null
        );
      });
    });
  };

  handleDeleteRecurringEvents = () => {
    const { setFieldValue, values } = this.props;

    Object.keys(values).map(eventType => {
      values[eventType].map((_, i) => {
        delete values[eventType][i].recurring;
        delete values[eventType][i].recurring_untill;
      });
    });
  };

  handleIndexChange = index => {
    const { setFieldValue, values } = this.props;

    Object.keys(values).map(eventType => {
      values[eventType].map((_, i) => {
        setFieldValue(`${eventType}[${i}].recurring`, recurringVal[index]);
      });
    });

    this.setState({
      tabIndex: index
    });
  };

  handleDateChange = date => {
    const { setFieldValue, values } = this.props;

    Object.keys(values).map(eventType => {
      values[eventType].map((_, i) => {
        setFieldValue(`${eventType}[${i}].recurring_untill`, date);
      });
    });

    this.setState({
      recurring_untill: date
    });
  };

  setRecurring = () => {
    const { values } = this.props;
    if (isNil(Object.keys(values)[0])) {
      return false;
    }
    const firstType = Object.keys(values)[0];
    const recurVal = values[firstType][0].recurring;
    if (isNil(recurVal)) {
      return false;
    }
    return true;
  };

  setRecurringTab = () => {
    const { values } = this.props;
    if (isNil(Object.keys(values)[0])) {
      return 1;
    }

    const firstType = Object.keys(values)[0];

    if (isNil(values[firstType][0].recurring)) {
      return 1;
    }
    const recurVal = values[firstType][0].recurring;

    const indexForTab = indexOf(recurVal, recurringIndex);

    this.setState({ tabIndex: indexForTab });
  };

  setRecurringUntill = () => {
    const { values } = this.props;
    if (isNil(Object.keys(values)[0])) {
      return null;
    }
    const firstType = Object.keys(values)[0];
    if (isNil(values[firstType][0].recurringUntill)) {
      return null;
    }
    const recurUntill = values[firstType][0].recurringUntill;
    return recurUntill;
  };

  setNotification = () => {
    this.setState(prevState => ({
      notification: !prevState.notification
    }));
  };
  setDatePickerRef = element => {
    this.datePicker = element;
  };

  parseDateField = dateInstance => {
    const pickedTime = {
      hours: getHours(dateInstance),
      minutes: getMinutes(dateInstance)
    };

    return compose(
      getTime,
      setMillisecondsToZero,
      setSecondsToZero,
      setMinutes(__, pickedTime.minutes),
      setHours(__, pickedTime.hours),
      parse
    )(dateInstance);
  };

  formatDateField = timestamp => {
    const lang = this.props.i18n.language;
    return isValid(parse(timestamp))
      ? lang === "nl"
        ? format(timestamp, "DD MMMM, YYYY", { locale: nlLocale })
        : format(timestamp, "MMMM DD, YYYY")
      : "";
  };

  render() {
    const { t, i18n, setFieldValue, values, currentDate } = this.props;
    let ref;
    return (
      <View>
        <View style={[styles.container, styles.borderBottom]}>
          <Text style={fonts.style.normal}>{t("notification")}</Text>
          <Switch
            style={{ marginLeft: 20 }}
            value={this.state.notification}
            trackColor={{ true: colors.lima }}
            onValueChange={this.setNotification}
          />
        </View>
        <View style={styles.container}>
          <Text style={fonts.style.normal}>{t("recurring")}</Text>
          <Switch
            style={{ marginLeft: 20 }}
            value={this.state.reveal}
            trackColor={{ true: colors.lima }}
            onValueChange={this.toggleReveal}
          />
        </View>
        <Collapsible collapsed={!this.state.reveal}>
          <SegmentedControlTab
            values={[t("daily"), t("weekly"), t("monthly"), t("yearly")]}
            selectedIndex={this.state.tabIndex}
            onTabPress={this.handleIndexChange}
            borderRadius={0}
            tabTextStyle={styles.tabTextStyle}
            tabStyle={styles.tabStyle}
            activeTabStyle={styles.activeTabStyle}
            activeTabTextStyle={styles.activeTabTextStyle}
          />
          <View style={styles.contentContainer}>
            <View style={{ height: 80 }}>
              <Text
                style={[
                  fonts.style.normal,
                  { marginTop: 40, marginBottom: 10 }
                ]}
              >
                {t("recurringTill")}
              </Text>
            </View>
            <View style={{ height: 50 }}>
              <DatePicker
                locale={i18n.language}
                t={t}
                mode="date"
                date={currentDate}
                ref={el => (ref = el)} // eslint-disable-line no-return-assign
                onPick={date =>
                  this.handleDateChange(this.parseDateField(date))
                }
              />
              <SelectButton
                containerStyle={
                  [
                    // f.dateInput,
                    // this.props.submitCount > 0 && hasErrors && f.dateInputWithError,
                  ]
                }
                onPress={() => ref.show()}
              >
                {this.state.recurring_untill
                  ? this.formatDateField(this.state.recurring_untill)
                  : t("selectDate")}
              </SelectButton>
            </View>
          </View>
        </Collapsible>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center"
  },
  contentContainer: {
    paddingHorizontal: 20
  },
  tabStyle: {
    height: 70,
    backgroundColor: colors.whiteSmoke,
    borderColor: colors.whiteSmoke,
    borderLeftColor: "#AAAAAA",
    borderRightColor: "#AAAAAA"
  },
  tabTextStyle: {
    color: colors.black,
    ...fonts.style.bold
  },
  activeTabStyle: {
    backgroundColor: colors.white,
    borderBottomColor: colors.white,
    borderLeftColor: colors.white,
    borderRightColor: colors.white
  },
  activeTabTextStyle: {
    color: colors.black
  },
  tabContent: {
    color: "#444444",
    fontSize: 18,
    margin: 24
  },
  tabContentTitle: {
    ...fonts.style.titleFont,
    textAlign: "center",
    marginVertical: 40
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.darkFilter
  }
});

export default RecurringForm;
