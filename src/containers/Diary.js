import React, { Component } from "react";
import T from "prop-types";
import SideSwipe from "react-native-sideswipe";
import ActionButton from "react-native-action-button";
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  Share,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  View,
  Platform
} from "react-native";
import FeatherIcons from "react-native-vector-icons/Feather";
import { compose } from "redux";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { hoistStatics } from "recompose";
import {
  addDays,
  subDays,
  isThisSecond,
  isSameDay,
  format,
  isBefore,
  isAfter,
  isToday
} from "date-fns";
import nl from "date-fns/locale/nl";
import en from "date-fns/locale/en";

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
  descend,
  isNil
} from "ramda";
import Touchable from "react-native-platform-touchable";
import { get } from "lodash";

import s from "./styles/DiaryStyles";
import { colors, fonts } from "../themes";

import horsePhoto from "../images/horses.jpg";

import DiaryCalendar from "./DiaryCalendar";
import AnimalPhoto from "../components/AnimalPhoto";
import DateSlider from "../components/DateSlider";
import DatePicker from "../components/DatePicker";
import HamburgerButton from "../components/HamburgerButton";
import Icon from "../components/Icon";
import SliderIndexIndicators from "../components/SliderIndexIndicators";
import CategoryHeader from "../components/CategoryHeader";
import EventHeader from "../components/EventHeader";
import TypeHeader from "../components/TypeHeader";
import Button from "../components/Button";
import CircleButton from "../components/CircleButton";
import ButtonFullWidth from "../components/ButtonFullWidth";
import PainMeasurementGraph from "../components/PainMeasurementGraph";

import {
  isDuringCurrentDate,
  isRelatedToAnimal,
  isPainMeasurement,
  isFeeding,
  isSelectedTab,
  addRecurringEvents,
  addRecurringEvents2,
  isInRange
} from "../services/eventService";
import { eventTypeIconNames, eventCategories, eventTypes } from "../constants";
import { getToken } from "../selectors/auth";

import iconMap from "../constants/iconMap";
import {
  exportEvents,
  completeEvent,
  completeRecurringEvent
} from "../actions/events";
import DiaryTimeTab from "./DiaryTimeTab";

import EventsList, { AccordionView } from "./DiaryList";
import Reactotron from "reactotron-react-native";

class Diary extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t.t("headerBar.diary"),
    headerLeft: <HamburgerButton onPress={navigation.openDrawer} />
  });

  constructor(props) {
    super(props);

    const selectedAnimalIndex = this.getSelectedAnimalIndex(props);
    const isInitialValuePassed = selectedAnimalIndex !== -1;

    this.state = {
      currentIndex: isInitialValuePassed ? selectedAnimalIndex : 0,
      currentDate: new Date(),
      tabIndex: 1,
      initial: true
    };

    this.routes = {
      registerAppointment: "DiaryAppointmentForm",
      painMeasurement: "DiaryPainMeasurementForm",
      exercise: "DiaryExerciseForm",
      housing: "DiaryHousingForm",
      feeding: "DiaryFeedingForm",
      medication: "DiaryMedicationForm",
      startPainMeasurement: "painMeasurement",
      share: "DiaryShareForm"
    };

    this.setButtons();
  }

  setButtons() {
    this.actionButtons = [
      {
        color: colors.lightGrey,
        icon: "calendar",
        title: this.props.t("registerAppointment"),
        onPress: () =>
          this.navigateTo(this.routes.registerAppointment, {
            animal: this.getSelectedAnimalName()
          })
      },
      {
        color: colors.egyptianBlue,
        icon: iconMap.measurement,
        title: this.props.t("registerPainMeasurement"),
        onPress: () =>
          this.navigateTo(this.routes.painMeasurement, {
            animal: this.getSelectedAnimalName()
          })
      },
      {
        color: colors.lima,
        icon: iconMap.horse1,
        name: eventCategories.exercise,
        title: this.props.t("registerExercises"),
        onPress: () =>
          this.navigateTo(this.routes.exercise, {
            animal: this.getSelectedAnimalName()
          })
      },
      {
        color: colors.supernova,
        icon: iconMap.home,
        name: eventCategories.housing,
        title: this.props.t("registerHousing"),
        onPress: () =>
          this.navigateTo(this.routes.housing, {
            animal: this.getSelectedAnimalName()
          })
      },
      {
        color: colors.barleyCorn,
        icon: iconMap.carrot,
        name: eventCategories.feeding,
        title: this.props.t("registerFeeding"),
        onPress: () =>
          this.navigateTo(this.routes.feeding, {
            animal: this.getSelectedAnimalName()
          })
      },
      {
        color: colors.harleyDavidsonOrange,
        icon: iconMap.treatment,
        name: eventCategories.medication,
        title: this.props.t("addMedication"),
        onPress: () =>
          this.navigateTo(this.routes.medication, {
            animal: this.getSelectedAnimalName()
          })
      }
    ];
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.t !== this.props.t) {
      this.setButtons();
    }
    const { navigation, data } = this.props;

    const event = navigation.getParam("id");

    if (!isNil(event) && this.state.initial) {
      const animalId = event[0].animalId;
      const selectedAnimalIndex = data.animals.findIndex(
        animal => animal.id === animalId
      );
      const isInitialValuePassed = selectedAnimalIndex !== -1;
      const index = isInitialValuePassed ? selectedAnimalIndex : 0;

      this.changeInitial(index);
    }
  }
  changeInitial = index => {
    this.setState({ currentIndex: index, initial: false });
  };

  setCurrentIndex = index => {
    this.setState({ currentIndex: index });
  };

  onDatePicked = date => {
    this.setState({ currentDate: date });
  };

  getTypeIcon = name => (
    <Icon name={eventTypeIconNames[name]} size={28} color={colors.nero} />
  );

  getSelectedAnimalIndex = () => {
    const { navigation, data } = this.props;

    const animalId = navigation.getParam("id");
    const index = data.animals.findIndex(animal => animal.id === animalId);

    return index;
  };

  getSelectedAnimal = () => {
    let index = this.getSelectedAnimalIndex();
    if (index === -1) {
      index = this.state.currentIndex;
    }
    return this.props.data.animals[index];
  };

  getSelectedAnimalName = () => {
    const animal = this.getSelectedAnimal();
    return { type: animal.type, name: animal.name };
  };

  setDatePickerRef = element => {
    this.datePicker = element;
  };

  moveCurrentDateBack = () => {
    this.setState(prevState => ({
      currentDate: subDays(prevState.currentDate, 1)
    }));
  };

  moveCurrentDateForward = () => {
    this.setState(prevState => ({
      currentDate: addDays(prevState.currentDate, 1)
    }));
  };

  handleIndexChange = index => {
    this.setState({
      tabIndex: index
    });
  };

  navigateTo = curry((path, params = {}) => {
    this.props.navigation.navigate(path, {
      currentDate: this.state.currentDate,
      animalId: this.props.data.animals[this.state.currentIndex].id,
      animalType: this.props.data.animals[this.state.currentIndex].type,
      ...params
    });
  });

  findEventById = targetId => {
    const events = get(this.props, "data.events");

    if (!events) {
      return undefined;
    }

    return events.find(event => {
      const id = event.id || event.localId;
      return id === targetId;
    });
  };

  share = () => {
    const animal = this.getSelectedAnimal();
    // Share.share({
    //   title: this.props.t("shareAppTitleAnimalProfile"),
    //   message: this.props.t("shareAppContentAnimalProfile", {
    //     animalName: animal.name
    //   }),
    //   url: this.props.t("shareAppUrl")
    // });

    this.navigateTo(this.routes.share, {
      redirectPath: "Diary",
      animal: this.props.data.animals[this.state.currentIndex],
      currentDate: this.state.currentDate
    });
  };

  onEditAnimal = () => {
    this.props.navigation.navigate("AnimalForm", {
      initialValue: this.getSelectedAnimal()
    });
  };

  onToggleComplete = (id, val, type, endDate, startDate) => {
    const { t } = this.props;

    const dateNow = new Date();
    if (!isToday(startDate) && isAfter(startDate, dateNow)) {
      Alert.alert(t("noFutureCompletionTitle"), t("noFutureCompletionText"));
      return;
    }

    if (
      type === eventTypes.temperature ||
      type === eventTypes.recovery ||
      type === eventTypes.treatment
    ) {
      const localId =
        typeof id === "string" && id.includes("_") ? id.split("_")[0] : id;
      const localDate =
        typeof id === "string" && id.includes("_") ? id.split("_")[1] : null;

      this.navigateTo("DiaryMedicationForm", {
        initialValue: this.findEventById(+localId),
        localDate,
        completeEvent: true
      });
      return;
    }
    if (type === eventTypes.composite) {
      this.navigateTo(this.routes.startPainMeasurement, {
        redirectPath: "Diary",
        animal: this.props.data.animals[this.state.currentIndex],
        editId: id,
        editType: type
      });
      return;
    }
    if (type === eventTypes.facialExpression) {
      this.navigateTo(this.routes.startPainMeasurement, {
        redirectPath: "Diary",
        animal: this.props.data.animals[this.state.currentIndex],
        editId: id,
        editType: type
      });
      return;
    }

    if (typeof id === "string" && id.includes("_")) {
      const [localId, timeStamp] = id.split("_");
      this.props.dispatch(
        completeRecurringEvent({
          payload: {
            eventId: +localId,
            startDate: +timeStamp,
            endDate: endDate
          }
        })
      );
    } else {
      this.props.dispatch(
        completeEvent({ payload: { eventId: id, completed: !val } })
      );
    }
  };

  exportCSV = () => {
    const { t } = this.props;
    const { currentDate } = this.state;
    const currentAnimal = this.props.data.animals[this.state.currentIndex];

    const currentEvents = compose(
      filter(isDuringCurrentDate(currentDate)),
      filter(isRelatedToAnimal(currentAnimal))
    )(this.props.data.events);

    const goToLink = url => {
      Linking.canOpenURL(url)
        .then(supported => {
          if (!supported) {
            return false;
          }

          return Linking.openURL(url);
        })
        .catch(() => {});
    };

    const showAlert = url => {
      Alert.alert(t("exportEvents.alertTitle"), t("exportEvents.alertMsg"), [
        { text: t("exportEvents.alertCancelBtn"), style: "cancel" },
        {
          text: t("exportEvents.alertDownloadBtn"),
          onPress: () => goToLink(url)
        }
      ]);
    };

    this.props.dispatch(
      exportEvents({
        payload: {
          currentAnimal,
          currentDate,
          events: currentEvents
        },
        meta: {
          showAlert
        }
      })
    );
  };

  navigateToCopyScreen = () => {
    const animals = this.props.data.animals || [];
    const currentAnimal = animals[this.state.currentIndex];

    const events = this.props.data.events || [];
    const eventsWithoutPainMeasurements = compose(
      filter(isRelatedToAnimal(currentAnimal)),
      reject(isPainMeasurement)
    )(events);

    this.props.navigation.navigate("DiaryCopy", {
      events: eventsWithoutPainMeasurements,
      copyToDate: this.state.currentDate
    });
  };

  renderEmptyState = () => {
    const { i18n, t, navigation } = this.props;

    return (
      <View style={s.screenContainer}>
        <View>
          <Image
            source={horsePhoto}
            resizeMode="cover"
            style={{ height: 180, width: "100%" }}
          />
        </View>
        <View style={s.dateRow}>
          <DateSlider
            date={this.state.currentDate}
            lang={this.props.i18n.language}
            onLeftIconPress={this.moveCurrentDateBack}
            onTextPress={() => this.datePicker.show()}
            onRightIconPress={this.moveCurrentDateForward}
          />
          <TouchableOpacity
            onPress={() => {
              this.datePicker.show();
            }}
            hitSlop={{ left: 30, right: 30, top: 25, bottom: 25 }}
          >
            <Icon name={iconMap.calendar} size={24} color="black" />
          </TouchableOpacity>
          <DatePicker
            locale={i18n.language}
            t={t}
            ref={this.setDatePickerRef}
            onPick={this.onDatePicked}
          />
        </View>
        <ScrollView contentContainerStyle={s.scrollContainer}>
          <View>
            <CategoryHeader
              boxStyles={{
                paddingLeft: 0,
                backgroundColor: colors.whiteSmoke,
                borderBottomWidth: 0,
                marginBottom: 20
              }}
              textStyles={{ textAlign: "center" }}
            >
              {t("welcomeInDiary")}
            </CategoryHeader>
            <Text
              style={{
                paddingHorizontal: 20,
                paddingBottom: 20,
                ...fonts.style.normal
              }}
            >
              {t("noAnimalsInDiary")}
            </Text>
            <View style={{ alignItems: "center" }}>
              <Button
                style={{ width: 240, marginBottom: 20 }}
                backgroundColor={colors.mediumPurple}
                label={t("addHorse")}
                onPress={() =>
                  navigation.navigate("AnimalForm", { type: "horse" })
                }
                iconName={iconMap.arrowRight}
              />
              <Button
                style={{ width: 240, marginBottom: 20 }}
                backgroundColor={colors.mediumPurple}
                label={t("addDonkey")}
                onPress={() =>
                  navigation.navigate("AnimalForm", { type: "donkey" })
                }
                iconName={iconMap.arrowRight}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  renderEvents = (events, currentDate, tabIndex) => {
    const { t } = this.props;
    const locale = this.props.i18n.language === "nl" ? nl : en;

    const propsDataEvents = addRecurringEvents(events, currentDate, tabIndex);

    const nonFeedingevents = compose(
      filter(isSelectedTab(currentDate, tabIndex)),
      reject(isFeeding)
    )(propsDataEvents || []);

    const feedingEvents = compose(
      filter(isSelectedTab(currentDate, tabIndex)),
      filter(isFeeding)
    )(propsDataEvents || []);

    const feedingEventsTimes = uniq(
      feedingEvents.map(event => event.startDate)
    );

    const groupedFeedingEvents = feedingEventsTimes.map(time => {
      const sameTime = feedingEvents.filter(item => time === item.startDate);
      const groupedEvents = sameTime.map(
        ({ id, type, startDate, data, completed, animalId }) => ({
          id,
          type,
          startDate,
          data,
          completed,
          animalId
        })
      );
      return {
        id: `${time}${groupedEvents[0].id}`,
        category: "feeding",
        startDate: time,
        groupedEvents
      };
    });

    const allEvents = [...groupedFeedingEvents, ...nonFeedingevents].sort(
      (a, b) => a.startDate - b.startDate
    );

    if (tabIndex === 1) {
      return (
        <EventsList
          events={allEvents}
          navigateTo={this.navigateTo}
          t={t}
          findEventById={this.findEventById}
          toggleComplete={this.onToggleComplete}
        />
      );
    }

    const allDaysArr = uniq(
      allEvents
        .reverse((a, b) => a.startDate - b.startDate)
        .map(({ startDate }) => format(startDate, "D MMM", { locale }))
    );

    if (tabIndex === 0) {
      const eventsGroupedByDay = allDaysArr.map(date => {
        const sameDate = allEvents.filter(
          item => date === format(item.startDate, "D MMM", { locale })
        );
        if (sameDate.length === 0) {
          return null;
        }
        return {
          startDate: date,
          events: sameDate
        };
      });

      // const maxEventsTab0 = eventsGroupedByDay.slice(1, 16);
      const maxEventsTab0 = eventsGroupedByDay;
      return (
        <AccordionView
          data={maxEventsTab0}
          t={t}
          navigateTo={this.navigateTo}
          findEventById={this.findEventById}
          toggleComplete={this.onToggleComplete}
        />
      );
    }
    if (tabIndex === 2) {
      const eventsGroupedByDayTab2 = allDaysArr.sort().map(date => {
        const eventsOnSameDay = allEvents.filter(
          item => date === format(item.startDate, "D MMM", { locale })
        );
        if (eventsOnSameDay.length === 0) {
          return null;
        }
        return {
          startDate: date,
          events: eventsOnSameDay
        };
      });
      // const maxEventsTab2 = eventsGroupedByDayTab2.slice(0, 5);
      const maxEventsTab2 = eventsGroupedByDayTab2;
      return (
        <AccordionView
          data={maxEventsTab2}
          t={t}
          navigateTo={this.navigateTo}
          findEventById={this.findEventById}
          toggleComplete={this.onToggleComplete}
        />
      );
    }
  };

  renderGraph = ({ currentAnimal, currentDate }) => {
    const { t } = this.props;
    const allPainMeasurements = compose(
      filter(isInRange(currentDate)),
      filter(isRelatedToAnimal(currentAnimal)),
      filter(isPainMeasurement)
    )(this.props.data.events);

    if (isNil(allPainMeasurements.length)) {
      return (
        <View
          style={{
            height: 100,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text>{t("emptyPainMeasurementList")}</Text>
        </View>
      );
    }

    return (
      <PainMeasurementGraph
        currentDate={currentDate}
        currentAnimal={currentAnimal}
        items={allPainMeasurements}
        locale={this.props.i18n.language}
        t={t}
      />
    );
  };

  renderSliderItem = ({ item }) => {
    const { width } = Dimensions.get("window");

    return (
      <View style={{ flex: 1, width, backgroundColor: colors.white }}>
        <AnimalPhoto
          source={{
            uri: item.pictureUrl,
            headers: { Authorization: `Bearer ${this.props.authToken}` }
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: "center"
            }}
          >
            <View style={s.editIconContainer}>
              <TouchableOpacity
                onPress={this.onEditAnimal}
                hitSlop={{ left: 10, right: 30, top: 25, bottom: 25 }}
              >
                <Icon name={iconMap.edit} size={26} color={colors.white} />
              </TouchableOpacity>
            </View>
            <Text style={s.animalName} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
          {/* Use hidden element to align indicators to the center and share button to the right with space-between */}
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
              paddingHorizontal: 20
            }}
          >
            <View style={{ height: 46, width: 46 }} />
            <CircleButton
              onPress={this.share}
              containerStyles={{ shadowOpacity: 0, height: 46, width: 46 }}
            >
              <Icon name={iconMap.share} size={20} color={colors.white} />
            </CircleButton>
          </View>
        </AnimalPhoto>
      </View>
    );
  };

  render() {
    const { width } = Dimensions.get("window");
    const {
      i18n,
      t,
      data: { animals }
    } = this.props;

    if (!animals.length) {
      return this.renderEmptyState();
    }
    const allEvents = this.props.data.events || [];
    const currentAnimal = animals[this.state.currentIndex];
    const { currentDate, tabIndex } = this.state;
    const events = compose(filter(isRelatedToAnimal(currentAnimal)))(allEvents);

    return (
      <View style={(s.screenContainer, width)}>
        <ScrollView contentContainerStyle={s.scrollContainer}>
          <View>
            <SideSwipe
              index={this.state.currentIndex}
              itemWidth={width}
              style={{ width }}
              data={this.props.data.animals}
              threshold={90}
              useVelocityForIndex={false}
              onIndexChange={index => this.setState({ currentIndex: index })}
              renderItem={this.renderSliderItem}
            />
            <SafeAreaView style={{ flex: 1 }}>
              <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
            </SafeAreaView>

            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 20,
                flexDirection: "row",
                justifyContent: "center",
                marginHorizontal: 65
              }}
            >
              <SliderIndexIndicators
                currentIndex={this.state.currentIndex}
                itemIndex={this.state.currentIndex}
                itemCount={this.props.data.animals.length}
              />
            </View>
            <View
              style={{
                position: "absolute",
                top: 45,
                left: 20,
                width: 20
              }}
            />
          </View>
          <DiaryCalendar
            currentAnimal={currentAnimal}
            events={events}
            onPress={this.onDatePicked}
            lang={i18n.language}
            tabToday={this.handleIndexChange}
            t={t}
          />
          <DiaryTimeTab
            handleIndexChange={this.handleIndexChange}
            tabIndex={tabIndex}
            t={t}
            loc={this.props.i18n.language}
            currentDate={currentDate}
          />
          {this.renderGraph({ currentDate, currentAnimal })}

          <ButtonFullWidth
            onPress={() =>
              this.navigateTo(this.routes.startPainMeasurement, {
                redirectPath: "Diary",
                animal: this.props.data.animals[this.state.currentIndex]
              })
            }
            label={t("addPainMeasurement")}
          />
          {this.renderEvents(events, currentDate, tabIndex)}

          <View style={{ height: 80 }} />
        </ScrollView>
        <ActionButton
          buttonColor={colors.mediumPurple}
          bgColor="rgba(0,0,0,.5)"
          // Feedback on Android is square on round button.
          // Prevent this ugly issue with disabling native feedback on Android.
          useNativeFeedback={Platform.select({ ios: true, android: false })}
        >
          {this.actionButtons &&
            this.actionButtons.length > 0 &&
            this.actionButtons.map(({ color, icon, name, title, onPress }) => {
              if (
                currentAnimal &&
                currentAnimal.type === "donkey" &&
                name === eventCategories.exercise
              ) {
                return <View key={title} />;
              }

              return (
                <ActionButton.Item
                  key={title}
                  buttonColor={color}
                  title={title}
                  onPress={onPress}
                >
                  <Icon name={icon} color={colors.white} size={22} />
                </ActionButton.Item>
              );
            })}
        </ActionButton>
      </View>
    );
  }
}

Diary.propTypes = {
  authToken: T.string,
  t: T.func,
  i18n: T.shape({
    language: T.string,
    calendar: T.object
  }),
  data: T.shape({
    animals: T.arrayOf(
      T.shape({
        id: T.number,
        name: T.string,
        pictureUrl: T.string
      })
    ),
    events: T.arrayOf(
      T.shape({
        id: T.number,
        type: T.string,
        category: T.string,
        startDate: T.number,
        endDate: T.number
      })
    )
  })
};

const mapStateToProps = state => ({
  authToken: getToken(state),
  data: {
    animals: state.animals,
    events: state.events
  }
});

export default hoistStatics(
  compose(
    connect(mapStateToProps),
    translate("root")
  )
)(Diary);
