import React, { Component } from "react";
import T from "prop-types";
import { View, Text, TouchableOpacity } from "react-native";
import Collapsible from "react-native-collapsible";
import { Calendar, LocaleConfig } from "react-native-calendars";
import R, {
  curry,
  filter,
  isEmpty,
  last,
  path,
  reject,
  uniq,
  sortBy,
  ascend,
  descend
} from "ramda";
import { colors, fonts } from "../themes";
import CalendarRevealButton from "../components/CalendarRevealButton";
import { format } from "date-fns";
import nl from "date-fns/locale/nl";
import { isRelatedToAnimal } from "../services/eventService";

import Reactotron from "reactotron-react-native";
import { compose } from "redux";

LocaleConfig.locales.nl = {
  monthNames: [
    "januari",
    "februari",
    "maart",
    "april",
    "mei",
    "juni",
    "juli",
    "augustus",
    "september",
    "oktober",
    "november",
    "december"
  ],
  monthNamesShort: [
    "januari",
    "februari",
    "maart",
    "april",
    "mei",
    "juni",
    "juli",
    "augustus",
    "september",
    "oktober",
    "november",
    "december"
  ],
  dayNames: [
    "Zondag",
    "Maandag",
    "Dinsdag",
    "Woensdag",
    "Donderdag",
    "Vrijdag",
    "Zaterdag"
  ],
  dayNamesShort: ["Z", "M", "D", "W", "D", "V", "Z"],
  today: "Vandaag"
};

LocaleConfig.locales.en = {
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],
  MonthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec"
  ],
  dayNames: [
    "zondag",
    "maandag",
    "dinsdag",
    "woensdag",
    "donderdag",
    "vrijdag",
    "zaterdag"
  ],
  dayNamesShort: ["S", "M", "T", "W", "T", "V", "S"],
  today: "Vandaag"
};
// LocaleConfig.defaultLocale = "nl";

const activity = {
  color: colors.mediumPurple,
  selectedDotColor: colors.mediumPurple
};

function formatDate(date, lang) {
  const monthNames =
    lang === "nl"
      ? [
          "januari",
          "februari",
          "maart",
          "april",
          "mei",
          "juni",
          "juli",
          "augustus",
          "september",
          "oktober",
          "november",
          "december"
        ]
      : [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const month = monthNames[monthIndex];
  const dateOutput = lang === "nl" ? `${day} ${month}` : `${month} ${day}`;
  return dateOutput;
}
export default class DiaryCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      revealCalendar: false,
      markedDates: this.setMarketDates(this.props.events),
      selected_date: new Date().toDateString
    };
  }

  toggleRevealCalendar = () => {
    this.setState(state => ({
      revealCalendar: !state.revealCalendar
    }));
  };

  closeCalendar = () => {
    this.setState({ revealCalendar: false });
  };

  setSelectedDate = day => {
    this.setState({ selected_date: day.dateString });
    this.props.onPress(new Date(day.timestamp));
  };

  resetToday = () => {
    this.props.onPress(new Date());
    this.setState({ selected_date: new Date().toDateString });
  };

  setMarketDates = events => {
    const a = events.map(event =>
      format(event.startDate, "YYYY-MM-DD", {locale: nl}),
    );
    const b = uniq(a);
    const c = b.map(item => ({
      [item]: {
        dots: Array(5).fill(
          activity,
          0,
          a.filter(event => event === item).length
        )
      }
    }));
    const d = c.length > 0 ? c.reduce((x, y) => ({ ...y, ...x })) : [];
    return d;
  };

  render() {
    LocaleConfig.defaultLocale = this.props.lang;
    return (
      <React.Fragment>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20
          }}
        >
          <TouchableOpacity onPress={this.resetToday}>
            <View>
              <Text style={{ ...fonts.style.dateFont }}>
                {formatDate(new Date(), this.props.lang)}
              </Text>
            </View>
          </TouchableOpacity>
          <CalendarRevealButton
            onPress={this.toggleRevealCalendar}
            open={this.state.revealCalendar}
          />
        </View>

        <Collapsible collapsed={!this.state.revealCalendar}>
          <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}>
            <Calendar
              current={this.state.selected_date}
              markedDates={{
                ...this.state.markedDates,
                [this.state.selected_date]: {
                  ...this.state.markedDates[this.state.selected_date],
                  selected: true,
                  disableTouchEvent: true
                }
              }}
              onDayPress={day => {
                this.setSelectedDate(day);
                this.closeCalendar();
              }}
              theme={{
                textSectionTitleColor: colors.black,
                monthTextColor: colors.black,
                textMonthFontFamily: fonts.type.emphasis.bold,
                textMonthFontWeight: "600",
                textMonthFontSize: 20,
                dotColor: colors.mediumPurple,
                arrowColor: colors.black,
                dayTextColor: colors.black,
                textDayFontSize: 14,
                textDayFontWeight: "bold",
                todayTextColor: "green",
                textDayHeaderFontSize: 20,
                textDayHeaderFontWeight: "700",
                "stylesheet.calendar.header": {
                  header: {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingLeft: 40,
                    paddingRight: 40,
                    marginTop: 6,
                    marginBottom: 20,
                    alignItems: "center"
                  }
                },
                "stylesheet.day.multiDot": {
                  text: {
                    top: 4,
                    marginTop: 4,
                    marginBottom: 12
                  },
                  selected: {
                    borderRadius: 16,
                    backgroundColor: colors.mediumPurple,
                    padding: 0
                  },
                  selectedText: {
                    color: colors.white
                  },
                  todayText: {
                    color: colors.black
                  },
                  today: {
                    backgroundColor: "transparent",
                    borderColor: colors.mediumPurple,
                    borderWidth: 1,
                    borderRadius: 16
                  },
                  dot: {
                    width: 4,
                    height: 4,
                    marginTop: 1,
                    marginLeft: 1,
                    marginRight: 1,
                    borderRadius: 2,
                    opacity: 0,
                    top: 2
                  }
                }
              }}
              firstDay={1}
              markingType="multi-dot"
            />
          </View>
        </Collapsible>
      </React.Fragment>
    );
  }
}

DiaryCalendar.propTypes = {
  lang: T.string,
  // eslint-disable-next-line react/forbid-prop-types
  events: T.array,
  onPress: T.func
};
