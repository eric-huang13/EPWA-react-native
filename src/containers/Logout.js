import React, { Component } from "react";
import T from "prop-types";
import { View } from "react-native";
import { connect } from "react-redux";

import { logout } from "../actions/auth";

class HomeScreen extends Component {
  componentDidMount() {
    this.props.dispatch(logout());
  }

  render() {
    return <View />;
  }
}

HomeScreen.propTypes = {
  dispatch: T.func
};

export default connect()(HomeScreen);
