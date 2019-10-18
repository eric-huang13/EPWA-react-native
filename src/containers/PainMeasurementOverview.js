import React from "react";
import { View, ScrollView } from "react-native";
import { compose, filter, prop, reverse, sortBy } from "ramda";
import { connect } from "react-redux";
import { translate } from "react-i18next";

import nl from "date-fns/locale/nl";
import en from "date-fns/locale/en";

import PainMeasurementList from "../components/PainMeasurementList";

import { isPainMeasurement, isRelatedToAnimal } from "../services/eventService";
import { colors } from "../themes";

import Reactotron from "reactotron-react-native";

class PainMeasurementOverview extends React.Component {
  get locale() {
    return this.props.i18n.language === "nl" ? nl : en;
  }

  onMeasurementClick = measurement => {
    this.props.navigation.navigate("PainMeasurementDetails");
  };

  render() {
    const animal = this.props.navigation.getParam("animal");
    const measurements = compose(
      reverse,
      sortBy(prop("startDate")),
      filter(isRelatedToAnimal(animal)),
      filter(isPainMeasurement)
    )(this.props.measurements);

    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <ScrollView enabled>
          <PainMeasurementList
            items={measurements}
            locale={this.locale}
            onClick={this.onMeasurementClick}
          />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const measurements = filter(isPainMeasurement)(state.events);

  return {
    measurements
  };
};

export default compose(
  connect(mapStateToProps),
  translate("root")
)(PainMeasurementOverview);
