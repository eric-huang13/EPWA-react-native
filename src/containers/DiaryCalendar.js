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
import { format, isSameDay, isSameMonth } from "date-fns";
import nl from "date-fns/locale/nl";
import {
  isRelatedToAnimal,
  addRecurringCalendarEvents
} from "../services/eventService";

// import Reactotron from "reactotron-react-native";
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
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ],
  dayNamesShort: ["S", "M", "T", "W", "T", "V", "S"],
  today: "Today"
};

LocaleConfig.locales.es = {
  monthNames: [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "Mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre"
  ],
  MonthNamesShort: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "Mayo",
    "Junio",
    "Julio",
    "Ago",
    "Septiembre",
    "Oct",
    "Nov",
    "Dic"
  ],
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado"
  ],
  dayNamesShort: ["D", "L", "M", "M", "J", "V", "S"],
  today: "Hoy"
};

LocaleConfig.locales.de = {
  monthNames: [
    "Januar",
    "Februar",
    "März",
    "April",
    "Kann",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember"
  ],
  MonthNamesShort: [
    "Januar",
    "Februar",
    "März",
    "April",
    "Kann",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember"
  ],
  dayNames: [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag"
  ],
  dayNamesShort: ["S", "M", "D", "M", "D", "F", "S"],
  today: "Heute"
};

LocaleConfig.locales.fr = {
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Pouvez",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre"
  ],
  MonthNamesShort: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Pouvez",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre"
  ],
  dayNames: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi"
  ],
  dayNamesShort: ["D", "L", "M", "M", "J", "V", "S"],
  today: "Aujourd'hui"
};
// LocaleConfig.defaultLocale = "nl";

// const activity = {
//   color: colors.mediumPurple,
//   selectedDotColor: colors.mediumPurple
// };

function formatDate(date, lang) {
  let monthNames = [
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
  switch (lang) {
    case "nl":
      monthNames = [
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
      ];
      break;
    case "de":
      monthNames = [
        "Januar",
        "Februar",
        "März",
        "April",
        "Kann",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember"
      ];
      break;
    case "fr":
      monthNames = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Pouvez",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre"
      ];
      break;
    case "es":
      monthNames = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "Mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre"
      ];
      break;  
    default:
  }
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
      selected_date: new Date(),
      selected_month: format(new Date()),
      markedDates: []
    };
    LocaleConfig.defaultLocale = props.lang;
  }

  componentDidMount() {
    ///markedDates berekenen
    this.setMarkedDates();
    LocaleConfig.defaultLocale = this.props.lang;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selected_month !== prevState.selected_month) {
      // this.setMarkedDates();
    }
    if (this.props.events.length !== prevProps.events.length) {
      this.setMarkedDates();
    }
    if (prevProps.currentAnimal !== this.props.currentAnimal) {
      this.setMarkedDates();
    }
    if (prevProps.lang !== this.props.lang) {
      LocaleConfig.defaultLocale = this.props.lang;
    }
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
    this.setState({ selected_month: new Date(), selected_date: new Date() });
    this.props.tabToday(1);
  };

  calendarEvents() {
    return addRecurringCalendarEvents(
      this.props.events,
      this.state.selected_month
    );
  }

  setMarkedDates() {
    const events = this.calendarEvents();

    const eventsDates = events.map(event =>
      format(event.startDate, "YYYY-MM-DD", { locale: nl })
    );
    const uniqEventsDates = uniq(eventsDates);
    const alEventsInCalendar = uniqEventsDates.map(eventDate => ({
      [eventDate]: {
        dots: Array(5).fill(
          {
            color: colors.mediumPurple,
            selectedDotColor: colors.mediumPurple
          },
          0,
          eventsDates.filter(date => date === eventDate).length
        )
      }
    }));
    const marks =
      alEventsInCalendar.length > 0
        ? alEventsInCalendar.reduce((x, y) => ({ ...y, ...x }))
        : {};

    // return marks;
    this.setState({ markedDates: marks });
  }

  render() {
    const marks = this.state.markedDates;

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
          {isSameDay(format(this.state.selected_date), format(new Date())) &&
          isSameMonth(this.state.selected_month, format(new Date())) ? (
            <View>
              <Text style={{ ...fonts.style.dateFont }}>
                {formatDate(new Date(), this.props.lang)}
              </Text>
            </View>
          ) : (
            <TouchableOpacity onPress={this.resetToday}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.mediumPurple,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 3
                }}
              >
                <Text
                  style={[
                    { ...fonts.style.dateFont },
                    { fontSize: 16, color: colors.mediumPurple }
                  ]}
                >
                  {this.props.t("today")}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          <CalendarRevealButton
            onPress={this.toggleRevealCalendar}
            open={this.state.revealCalendar}
          />
        </View>

        <Collapsible collapsed={!this.state.revealCalendar}>
          <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}>
            <Calendar
              current={this.state.selected_month}
              markedDates={{
                ...marks,
                [this.state.selected_date]: {
                  ...marks[this.state.selected_date],
                  selected: true,
                  disableTouchEvent: true
                }
              }}
              onDayPress={day => {
                this.setSelectedDate(day);
                this.closeCalendar();
              }}
              onMonthChange={month => {
                this.setState({
                  selected_month: month.timestamp
                });
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
