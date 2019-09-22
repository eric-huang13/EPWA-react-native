import React, { Component } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { StyleSheet, View } from "react-native";
import TextInput from "./TextInput";

export default class PasswordTextInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      icEye: "visibility-off",
      password: true
    };
  }

  changePwdType = () => {
    let newState;
    if (this.state.password) {
      newState = {
        icEye: "visibility",
        password: false
      };
    } else {
      newState = {
        icEye: "visibility-off",
        password: true
      };
    }

    // set new state value
    this.setState(newState);
  };

  render() {
    return (
      <View>
        <TextInput {...this.props} secureTextEntry={this.state.password} />
        <MaterialIcons
          style={styles.icon}
          name={this.state.icEye}
          size={this.props.iconSize}
          color={this.props.iconColor}
          onPress={this.changePwdType}
        />
      </View>
    );
  }
}

export const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 25
  }
});
