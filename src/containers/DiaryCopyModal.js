import React, { Component } from "react";
import T from "prop-types";
import { StyleSheet, Text, View, Switch } from "react-native";
import Modal from "react-native-modal";
import { translate } from "react-i18next";
import { connect } from "react-redux";
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
  isSameDay
} from "date-fns";
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
  map
} from "ramda";

import Button from "../components/Button";
import DatePicker from "../components/DatePicker";
import FieldLabel from "../components/FieldLabel";
import SelectButton from "../components/SelectButton";
import withAlertDropdown from "../components/withAlertDropdown";

import { isDuringCurrentDate } from "../services/eventService";

import { colors, fonts } from "../themes";
import { eventCategories } from "../constants";
import getId from "../services/idGenerator";
import { addEvent } from "../actions/events";

class DiaryCopyModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      selectedDate: subDays(props.copyToDate, 1),
      checkboxValues: {
        [eventCategories.exercise]: false,
        [eventCategories.housing]: false,
        [eventCategories.feeding]: false,
        [eventCategories.medication]: false
      },
      isSubmitting: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isSameDay(this.props.selectedDate, nextProps.copyToDate)) {
      this.setState({
        selectedDate: subDays(nextProps.copyToDate, 1)
      });
    }
  }

  getEventsFromSelectedDate = (events) =>
    filter(isDuringCurrentDate(this.state.selectedDate))(events);

  getGroupedEventsByCategory = (events) => groupBy(prop("category"), events);

  setCopyModal(visible) {
    this.setState({ modalVisible: visible });
  }

  onCheckboxChange = (key, value) => {
    const checkboxValues = { ...this.state.checkboxValues };
    checkboxValues[key] = value;
    this.setState({ checkboxValues });
  };

  replaceEventIdWithLocalId = (event) =>
    compose(
      assoc("localId", getId()),
      omit(["localId"]),
      omit(["id"])
    )(event);

  replaceEventDateWithSelectedDate = (event) => {
    const clonedEvent = { ...event };

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
      this.props.copyToDate
    );

    if (clonedEvent.endDate) {
      clonedEvent.endDate = transformDate(
        clonedEvent.endDate,
        this.props.copyToDate
      );
    }

    return clonedEvent;
  };

  onSubmit = () => {
    const { dispatch, t, alertDropdown } = this.props;

    this.setState({ isSubmitting: true });
    this.setCopyModal(false);
  };

  onModalHidden = () => {
    if (this.state.isSubmitting) {
      const groupedEvents = compose(
        this.getGroupedEventsByCategory,
        this.getEventsFromSelectedDate
      )(this.props.events);

      const { checkboxValues } = this.state;

      const eventsToCopy = compose(
        map(this.replaceEventDateWithSelectedDate),
        map(this.replaceEventIdWithLocalId),
        flatten,
        values,
        mapObjIndexed((value, key) => (value ? groupedEvents[key] : []))
      )(checkboxValues);

      this.setState({ isSubmitting: false });

      this.props.dispatch(
        addEvent({ payload: eventsToCopy, formHelpers: null })
      );
    }
  };

  formatDateField = (timestamp) =>
    isValid(parse(timestamp))
      ? format(timestamp, this.props.t("dateFormat"))
      : "";

  hasEventsOnGivenDay = () =>
    Boolean(this.getEventsFromSelectedDate(this.props.events).length);

  renderDatePicker = () => {
    let ref;
    return (
      <View style={{ marginBottom: 50 }}>
        <DatePicker
          locale={this.props.i18n.language}
          t={this.props.t}
          ref={(element) => (ref = element)} // eslint-disable-line no-return-assign
          onPick={(date) => this.setState({ selectedDate: date })}
        />
        <FieldLabel style={{ marginBottom: 5 }}>{"Date label"}</FieldLabel>
        <SelectButton
          containerStyle={{ height: 70 }}
          onPress={() => ref.show()}
        >
          {this.formatDateField(this.state.selectedDate)}
        </SelectButton>
      </View>
    );
  };

  renderCheckboxSection = () => {
    const { t } = this.props;
    const groupedEvents = compose(
      this.getGroupedEventsByCategory,
      this.getEventsFromSelectedDate
    )(this.props.events);

    const fields = [
      {
        key: eventCategories.exercise,
        name: t(eventCategories.exercise),
        events: groupedEvents[eventCategories.exercise] || []
      },
      {
        key: eventCategories.housing,
        name: t(eventCategories.housing),
        events: groupedEvents[eventCategories.housing] || []
      },
      {
        key: eventCategories.feeding,
        name: t(eventCategories.feeding),
        events: groupedEvents[eventCategories.feeding] || []
      },
      {
        key: eventCategories.medication,
        name: t(eventCategories.medication),
        events: groupedEvents[eventCategories.medication] || []
      }
    ];

    return (
      <View>
        {fields.map((field) => (
          <View
            key={field.key}
            style={{ flexDirection: "row", marginBottom: 10 }}
          >
            <Text style={{ paddingRight: 10, flex: 1 }}>{field.name}</Text>
            <Switch
              disabled={!field.events.length}
              value={this.state.checkboxValues[field.key]}
              onValueChange={(value) => this.onCheckboxChange(field.key, value)}
            />
          </View>
        ))}
      </View>
    );
  };

  renderNoEventsWarning = () => {
    return <Text>No events on selected date!</Text>;
  };

  renderButton = (text, onPress, disabled = false) => (
    <Button
      style={{ minWidth: "50%", marginBottom: 20 }}
      backgroundColor={colors.mediumPurple}
      label={text}
      onPress={onPress}
      disabled={disabled}
    />
    // <TouchableOpacity onPress={onPress}>
    //   <View style={styles.button}>
    //     <Text>{text}</Text>
    //   </View>
    // </TouchableOpacity>
  );

  renderModalContent = () => {
    const { i18n, t } = this.props;
    const hasEventsOnCurrentDate = this.hasEventsOnGivenDay();

    return (
      <View style={styles.modalContent}>
        <View style={{ flex: 1 }}>
          {this.renderDatePicker()}
          {hasEventsOnCurrentDate
            ? this.renderCheckboxSection()
            : this.renderNoEventsWarning()}
        </View>
        <View style={{ flexDirection: "row" }}>
          {this.renderButton("Close", () => this.setCopyModal(false))}
          {this.renderButton(
            "Submit",
            () => this.onSubmit(),
            this.state.isSubmitting
          )}
        </View>
      </View>
    );
  };

  render() {
    return (
      <View>
        {this.renderButton("Copy entries", () => {
          this.setCopyModal(!this.state.modalVisible);
        })}
        <Modal
          hideModalContentWhileAnimating
          isVisible={this.state.modalVisible}
          onModalHide={this.onModalHidden}
        >
          {this.renderModalContent()}
        </Modal>
      </View>
    );
  }
}

DiaryCopyModal.propTypes = {
  t: T.func,
  i18n: T.shape({
    language: T.string
  })
};

export default compose(
  connect(),
  translate("root"),
  withAlertDropdown
)(DiaryCopyModal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContent: {
    flex: 1,
    backgroundColor: "white",
    padding: 22,
    // justifyContent: "center",
    // alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
  },
  scrollableModal: {
    height: 300
  },
  scrollableModalContent1: {
    height: 200,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center"
  },
  scrollableModalContent2: {
    height: 200,
    backgroundColor: "lightgreen",
    alignItems: "center",
    justifyContent: "center"
  }
});
