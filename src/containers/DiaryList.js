import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Dimensions
} from "react-native";
import T from "prop-types";
import { uniq } from "ramda";

import { colors, fonts } from "../themes";
import ButtonFullWidth from "../components/ButtonFullWidth";
import Checkbox from "../images/svg/checkbox.svg";
import { eventTypeIconNames, eventCategories, eventTypes } from "../constants";
import CheckboxChecked from "../images/svg/checkbox-checked.svg";
import IconMed from "../images/svg/icon-med.svg";
import IconMap from "../constants/iconMap";
import Icon from "../components/Icon";
import { format, isThisMonth } from "date-fns";
import Collapsible from "react-native-collapsible";
import Accordion from "react-native-collapsible/Accordion";
import Arrow from "../images/svg/arrow-down-black.svg";
import nl from "date-fns/locale/nl";
import en from "date-fns/locale/en";

import Reactotron from "reactotron-react-native";

export default function EventsList({
  events,
  t,
  navigateTo,
  findEventById,
  toggleComplete
}) {
  return (
    <View style={{ paddingRight: 20, minHeight: 200 }}>
      {events.map((event, index) => (
        <NewListItem
          {...event}
          t={t}
          key={index}
          navigateTo={navigateTo}
          findEventById={findEventById}
          toggleComplete={toggleComplete}
        />
      ))}
    </View>
  );
}
export class AccordionView extends Component {
  state = {
    activeSections: []
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeSections[0] === this.state.activeSections[0]) {
      return false;
    }
    true;
  }

  _renderHeader = (section, _, isActive) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 25,
        borderTopColor: colors.whiteSmoke,
        borderTopWidth: 2
      }}
    >
      <View>
        <View style={{ paddingBottom: 20 }}>
          <Text style={fonts.style.altTitle}>{section.startDate}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            width: 260
          }}
        >
          {!isActive &&
            uniq(section.events.map(({ category }) => category)).map(
              category => (
                <View
                  key={category}
                  style={{ paddingRight: 10, paddingBottom: 10 }}
                >
                  <Text style={fonts.style.normal}>
                    {this.props.t(`categories.${category}`)}
                  </Text>
                </View>
              )
            )}
        </View>
      </View>
      <View
        style={{
          width: 50,
          paddingHorizontal: 20,
          paddingTop: 20
        }}
      >
        <Arrow style={isActive ? { transform: [{ rotate: "180deg" }] } : ""} />
      </View>
    </View>
  );

  _renderContent = (section, index, isActive) => {
    return (
      <View
        style={{
          paddingRight: 20,
          paddingBottom: 25
        }}
      >
        {section.events.map(event => {
          return (
            <NewListItem
              {...event}
              key={event.id}
              t={this.props.t}
              navigateTo={this.props.navigateTo}
              findEventById={this.props.findEventById}
              toggleComplete={this.props.toggleComplete}
            />
          );
        })}
      </View>
    );
  };

  _updateSections = activeSections => {
    this.setState({ activeSections });
  };

  render() {
    return (
      <Accordion
        sections={this.props.data}
        activeSections={this.state.activeSections}
        renderSectionTitle={this._renderSectionTitle}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
        onChange={this._updateSections}
        touchableComponent={TouchableOpacity}
        expandMultiple={false}
        containerStyle={{ minHeight: 200 }}
      />
    );
  }
}

function CheckInput({
  id,
  completed,
  toggleComplete,
  type,
  endDate,
  startDate
}) {
  return (
    <View style={{ width: 60 }}>
      <TouchableOpacity
        style={{ width: 60, justifyContent: "center", alignItems: "center" }}
        onPress={() => toggleComplete(id, completed, type, endDate, startDate)}
        underlayColor="#fff"
        disabled={
          (type === eventTypes.facialExpression ||
            type === eventTypes.composite) &&
          Boolean(completed)
        }
      >
        {completed ? <CheckboxChecked /> : <Checkbox />}
      </TouchableOpacity>
    </View>
  );
}

export function NewListItem({
  id,
  completed,
  startDate,
  endDate,
  toggleComplete,
  category,
  type,
  data,
  groupedEvents = [],
  t,
  navigateTo,
  findEventById
}) {
  const { width } = Dimensions.get("window");

  const content = (
    <ItemContent
      category={category}
      completed={completed}
      type={type}
      data={data}
      groupedEvents={groupedEvents}
      t={t}
      navigateTo={navigateTo}
      findEventById={findEventById}
      id={id}
      toggleComplete={toggleComplete}
      startDate={startDate}
      endDate={endDate}
    />
  );
  const time = format(startDate, "HH:mm");
  const feedingCompleted =
    groupedEvents.filter(event => Boolean(event.completed) === true).length ===
    groupedEvents.length
      ? true
      : false;

  const eventTitle =
    category !== eventTypes.appointment
      ? t(`categories.${category}`)
      : data.noteTitle;

  return (
    <View style={[styles.itemContainer, width]}>
      <View style={styles.contentContainer}>
        {category !== "feeding" ? (
          <Text style={[styles.title, completed ? styles.completed : ""]}>
            {eventTitle}
          </Text>
        ) : (
          <Text
            style={[styles.title, feedingCompleted ? styles.completed : ""]}
          >
            {t(`categories.${category}`)}
          </Text>
        )}

        {category !== "feeding" ? (
          <View style={styles.itemContentContainer}>
            <CheckInput
              id={id}
              completed={completed}
              toggleComplete={toggleComplete}
              type={type}
              startDate={startDate}
              endDate={endDate}
            />
            <View
              style={[
                styles.itemContentContainer,
                completed ? styles.completed : ""
              ]}
            >
              {content}
            </View>
          </View>
        ) : (
          content
        )}
      </View>
      <View>
        {category !== "feeding" ? (
          <View style={[styles.time, completed ? styles.completed : null]}>
            <Text style={{ fontSize: 14, fontWeight: "700" }}>{time}</Text>
          </View>
        ) : (
          <View
            style={[styles.time, feedingCompleted ? styles.completed : null]}
          >
            <Text style={{ fontSize: 14, fontWeight: "700" }}>{time}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function ItemContent({
  category,
  type,
  groupedEvents,
  t,
  navigateTo,
  findEventById,
  id,
  completed,
  data,
  toggleComplete,
  startDate,
  endDate
}) {
  switch (category) {
    case eventCategories.painMeasurement:
      return (
        <PainMeasureContent
          type={type}
          t={t}
          navigateTo={navigateTo}
          findEventById={findEventById}
          id={id}
          completed={completed}
        />
      );
    case eventCategories.exercise:
      return (
        <ExerciseContent
          type={type}
          t={t}
          navigateTo={navigateTo}
          findEventById={findEventById}
          id={id}
          completed={completed}
          startDate={startDate}
          endDate={endDate}
        />
      );
    case eventCategories.housing:
      return (
        <HousingContent
          type={type}
          t={t}
          navigateTo={navigateTo}
          findEventById={findEventById}
          id={id}
          completed={completed}
          startDate={startDate}
          endDate={endDate}
        />
      );
    case eventCategories.feeding:
      return (
        <FeedingContent
          groupedEvents={groupedEvents}
          t={t}
          navigateTo={navigateTo}
          findEventById={findEventById}
          id={id}
          completed={completed}
          toggleComplete={toggleComplete}
        />
      );
    case eventCategories.medication:
      return (
        <MedicationContent
          type={type}
          t={t}
          navigateTo={navigateTo}
          findEventById={findEventById}
          id={id}
          completed={completed}
          data={data}
        />
      );
    case eventCategories.appointment:
      return (
        <AppointmentContent
          type={type}
          t={t}
          navigateTo={navigateTo}
          findEventById={findEventById}
          id={id}
          completed={completed}
          data={data}
        />
      );
    default:
      return (
        <View>
          <Text>DEBUG THIS</Text>
        </View>
      );
  }
}

function PainMeasureContent({
  type,
  navigateTo,
  t,
  findEventById,
  id,
  completed
}) {
  const localId =
    typeof id === "string" && id.includes("_") ? id.split("_")[0] : id;
  const localDate =
    typeof id === "string" && id.includes("_") ? id.split("_")[1] : null;
  const isFacialExpression = type === eventTypes.facialExpression;
  const painMeasurementType =
    type === eventTypes.facialExpression
      ? t("facialMeasure")
      : t("compositeMeasure");
  const { width } = Dimensions.get("window");
  return (
    <React.Fragment>
      <PainMesIcon isFacialExpression={isFacialExpression} />
      <TouchableOpacity
        key={id}
        onPress={() =>
          navigateTo("DiaryPainMeasurementForm", {
            initialValue: findEventById(+localId)
          })
        }
      >
        <View style={styles.itemContent}>
          <Text style={{ ...fonts.style.normal, width: width - 160 }}>
            {"- "}
            {painMeasurementType}
          </Text>
        </View>
      </TouchableOpacity>
    </React.Fragment>
  );
}

function MedicationContent({ type, navigateTo, t, findEventById, id, data }) {
  const localId =
    typeof id === "string" && id.includes("_") ? id.split("_")[0] : id;
  const localDate =
    typeof id === "string" && id.includes("_") ? id.split("_")[1] : null;

  const content =
    type === eventTypes.pill
      ? `${data.quantity} ${data.unit} ${data.name}`
      : `${t(type)}`;

  return (
    <React.Fragment>
      <MedicalIcon type={type} />
      <TouchableOpacity
        key={id}
        onPress={() =>
          navigateTo("DiaryMedicationForm", {
            initialValue: findEventById(+localId),
            localDate
          })
        }
      >
        <View style={styles.itemContent}>
          <Text style={fonts.style.normal}>{content}</Text>
        </View>
      </TouchableOpacity>
    </React.Fragment>
  );
}

function FeedingContent({
  groupedEvents,
  t,
  navigateTo,
  findEventById,
  toggleComplete
}) {
  return (
    <React.Fragment>
      {groupedEvents.map(({ type, data, id, completed, startDate }, index) => {
        const localId =
          typeof id === "string" && id.includes("_") ? id.split("_")[0] : id;
        const localDate =
          typeof id === "string" && id.includes("_") ? id.split("_")[1] : null;

        return (
          <View key={index} style={styles.subItemContentContainer}>
            <CheckInput
              id={id}
              completed={completed}
              toggleComplete={toggleComplete}
              startDate={startDate}
            />
            <TouchableOpacity
              onPress={() =>
                navigateTo("DiaryFeedingForm", {
                  initialValue: findEventById(+localId),
                  localDate
                })
              }
            >
              <View
                style={[
                  styles.itemContentContainer,
                  completed && styles.completed
                ]}
              >
                <FeedingIcon type={type} />
                <Text style={fonts.style.normal}>
                  {t(type)} {data.unit !== "unlimited" ? data.quantity : null}{" "}
                  {t(data.unit)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
    </React.Fragment>
  );
}

function HousingContent({
  type,
  t,
  navigateTo,
  findEventById,
  id,
  startDate,
  endDate
}) {
  const localId =
    typeof id === "string" && id.includes("_") ? id.split("_")[0] : id;
  const localDate =
    typeof id === "string" && id.includes("_") ? id.split("_")[1] : null;

  const startTime = format(startDate, "HH:mm");
  const endTime = format(endDate, "HH:mm");

  return (
    <React.Fragment>
      <HousingIcon type={type} />
      <TouchableOpacity
        key={id}
        onPress={() =>
          navigateTo("DiaryHousingForm", {
            initialValue: findEventById(+localId),
            localDate
          })
        }
      >
        <View style={styles.itemContent}>
          <Text style={fonts.style.normal}>
            {`${t(type)}  ${startTime} - ${endTime}`}
          </Text>
        </View>
      </TouchableOpacity>
    </React.Fragment>
  );
}
function ExerciseContent({
  type,
  t,
  navigateTo,
  findEventById,
  id,
  startDate,
  endDate
}) {
  const localId =
    typeof id === "string" && id.includes("_") ? id.split("_")[0] : id;
  const localDate =
    typeof id === "string" && id.includes("_") ? id.split("_")[1] : null;

  const startTime = format(startDate, "HH:mm");
  const endTime = format(endDate, "HH:mm");

  return (
    <React.Fragment>
      <HousingIcon type={type} />
      <TouchableOpacity
        key={id}
        onPress={() =>
          navigateTo("DiaryExerciseForm", {
            initialValue: findEventById(+localId),
            localDate
          })
        }
      >
        <View style={styles.itemContent}>
          <Text style={fonts.style.normal}>
            {`${t(type)}  ${startTime} - ${endTime}`}
          </Text>
        </View>
      </TouchableOpacity>
    </React.Fragment>
  );
}

function AppointmentContent({
  type,
  t,
  navigateTo,
  findEventById,
  id,
  startDate,
  data
}) {
  const localId =
    typeof id === "string" && id.includes("_") ? id.split("_")[0] : id;
  const localDate =
    typeof id === "string" && id.includes("_") ? id.split("_")[1] : null;

  // const startTime = format(startDate, "HH:mm");
  const { width } = Dimensions.get("window");

  return (
    <React.Fragment>
      <TouchableOpacity
        key={id}
        onPress={() =>
          navigateTo("DiaryAppointmentForm", {
            initialValue: findEventById(+localId),
            localDate
          })
        }
      >
        <View style={{ ...styles.itemContent, flexDirection: "column" }}>
          <Text
            style={{
              ...fonts.style.normal,
              flexShrink: 1,
              width: width - 150
            }}
          >
            {data.note}
          </Text>
        </View>
      </TouchableOpacity>
    </React.Fragment>
  );
}

function PainMesIcon({ isFacialExpression }) {
  const boxColor = isFacialExpression ? colors.lightBlue : colors.lima;
  return (
    <View
      style={{
        width: 17,
        height: 15,
        borderRadius: 3,
        backgroundColor: boxColor,
        marginRight: 7,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6
      }}
    />
  );
}

function MedicalIcon({ type }) {
  switch (type) {
    case eventTypes.supplement:
      return (
        <Icon
          name={IconMap.medication}
          style={{ marginRight: 10 }}
          size={20}
          color={colors.black}
        />
      );
    case eventTypes.treatment:
      return (
        <Icon
          name={IconMap.treatment}
          style={{ marginRight: 10 }}
          size={20}
          color={colors.black}
        />
      );
    case eventTypes.temperature:
      return (
        <Icon
          name={IconMap.temperature}
          style={{ marginRight: 10 }}
          size={20}
          color={colors.black}
        />
      );
    case eventTypes.pill:
      return (
        <Icon
          name={IconMap.medication}
          style={{ marginRight: 10 }}
          size={20}
          color={colors.black}
        />
      );
    case eventTypes.recovery:
      return (
        <Icon
          name={IconMap.recovery}
          style={{ marginRight: 10 }}
          size={20}
          color={colors.black}
        />
      );
    default:
      return null;
  }
}

function FeedingIcon({ type }) {
  switch (type) {
    case eventTypes.supplement:
      return (
        <Icon
          name={IconMap.supplements}
          style={{ marginRight: 10 }}
          size={20}
          color={colors.black}
        />
      );
    case eventTypes.concentrate:
      return (
        <Icon
          name={IconMap.bowl}
          style={{ marginRight: 10 }}
          size={20}
          color={colors.black}
        />
      );
    case eventTypes.roughage:
      return (
        <Icon
          name={IconMap.grain}
          style={{ marginRight: 10 }}
          size={20}
          color={colors.black}
        />
      );
    default:
      return null;
  }
}

function HousingIcon({ type }) {
  switch (type) {
    case eventTypes.paddock:
      return (
        <Icon
          name={IconMap.riding}
          style={{ marginRight: 10 }}
          size={20}
          color={colors.black}
        />
      );
    case eventTypes.pasture:
      return (
        <Icon
          name={IconMap.pasture}
          style={{ marginRight: 10 }}
          size={20}
          color={colors.black}
        />
      );
    case eventTypes.stable:
      return (
        <Icon
          name={IconMap.home}
          style={{ marginRight: 10 }}
          size={20}
          color={colors.black}
        />
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25
  },
  time: {
    backgroundColor: colors.whiteSmoke,
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 3,
    marginTop: 15,
    width: 55,
    alignItems: "center",
    height: 25
  },
  title: {
    fontSize: 19,
    paddingLeft: 60,
    marginBottom: 5
  },
  itemContentContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  subItemContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    minHeight: 40
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: "400",
    color: "#282828"
  },
  completed: {
    opacity: 0.2
  }
});

NewListItem.propTypes = {
  checked: T.bool,
  onPress: T.func
};

PainMesIcon.propTypes = {
  pain: T.bool
};
