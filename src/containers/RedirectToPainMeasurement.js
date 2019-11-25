import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";

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
