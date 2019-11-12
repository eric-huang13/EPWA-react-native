import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";

import Reactotron from "reactotron-react-native";

class RedirectToPainMeasurement extends Component {
  componentDidMount() {
    this.props.navigation.navigate("painMeasurement", {
      redirectPath: "Diary",
      forceAnimalSelection: true,
      animals: this.props.animals
    });
  }

  render() {
    return <View />;
  }
}

const mapStateToProps = state => ({
  animals: state.animals || []
});

export default connect(mapStateToProps)(RedirectToPainMeasurement);
