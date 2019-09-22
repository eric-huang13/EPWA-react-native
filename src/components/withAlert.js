import React, { Component } from "react";
import { Alert } from "react-native";

// TODO: Maybe you can place this logic to a component high in the tree that is always rendered and reacts only to redux changes
// That way you wouldn't need to wrap every component that can throw an error but have one entity that handles it.

// HOC reducing boilerplate for trigerring alerts
const withAlert = (WrappedComponent) =>
  class AlertHOC extends Component {
    show = ({ title, message, buttonLabel, onDismiss, buttons }) => {
      Alert.alert(
        title,
        message,
        buttons
          ? [...buttons]
          : [
              {
                text: buttonLabel,
                onPress: onDismiss
              }
            ],
        { cancelable: false }
      );
    };

    render() {
      return <WrappedComponent {...this.props} showAlert={this.show} />;
    }
  };
export default withAlert;
