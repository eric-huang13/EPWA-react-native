import React, { Component } from "react";
import T from "prop-types";
import { Alert } from "react-native";
import { AndroidBackHandler } from "react-navigation-backhandler";

const withExitPrompt = (WrappedComponent) => {
  class Comp extends Component {
    componentDidMount() {
      this.props.navigation.setParams({
        onBackPress: this.onBackPress
      });
    }

    onBackPress = () => {
      const { dirty, navigation, t } = this.props;

      if (!dirty) {
        return navigation.goBack();
      }

      return Alert.alert(
        t("leavingFormTitle"),
        t(`leavingFormSubtitle`),
        [
          {
            text: t("leavingFormStayBtn"),
            onPress: () => {}
          },
          {
            text: t("leavingFormLeaveBtn"),
            onPress: () => {
              navigation.goBack();
            }
          }
        ],
        { cancelable: false }
      );
    };

    onAndroidBackButtonPress = () => {
      if (this.props.dirty) {
        this.onBackPress();
        return true;
      }

      return false;
    };

    render() {
      return (
        <AndroidBackHandler onBackPress={this.onAndroidBackButtonPress}>
          <WrappedComponent {...this.props} />
        </AndroidBackHandler>
      );
    }
  }

  Comp.propTypes = {
    dirty: T.bool,
    t: T.func
  };

  return Comp;
};

export default withExitPrompt;
