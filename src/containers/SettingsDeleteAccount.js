import React from "react";
import T from "prop-types";
import * as yup from "yup";
import {
  View,
  TextInput,
  Text,
  Switch,
  StyleSheet,
  Platform
} from "react-native";
import { compose } from "ramda";
import { withFormik } from "formik";
import { translate } from "react-i18next";
import { hoistStatics } from "recompose";
import { HeaderBackButton } from "react-navigation-stack";
import { connect } from "react-redux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { DELETE_ACCOUNT } from "../actions/auth";

import Button from "../components/Button";
import Field from "../components/Field";
import withAlertDropdown from "../components/withAlertDropdown";
import withExitPrompt from "../components/withExitPrompt";

import { deleteAccountRequest } from "../actions/auth";
import iconMap from "../constants/iconMap";

import { colors, fonts } from "../themes";

class SettingsDeleteAccount extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t.t("headerBar.deleteAccount"),
    headerLeft: (
      <HeaderBackButton
        title={screenProps.t.t("headerBar.back")}
        tintColor={colors.nero}
        onPress={navigation.getParam("onBackPress")}
      />
    )
    // headerRight: (
    //   <TouchableOpacity
    //     hitSlop={{ top: 10, bottom: 10, left: 15, right: 30 }}
    //     onPress={navigation.getParam("onSubmitButtonPress")}
    //   >
    //     <MaterialIcons
    //       style={{ marginRight: 10 }}
    //       name={iconMap.send}
    //       size={24}t
    //       color={colors.mediumPurple}
    //     />
    //   </TouchableOpacity>
    // )
  });

  isAndroid = Platform.OS === "android";

  submitForm = () => {
    this.props.submitForm();
  };

  onDeleteAccount = (id, val) => {
    this.props.dispatch(deleteAccountRequest({ payload: { userId: id } }));
  };

  render() {
    const { setFieldValue, t } = this.props;
    // When you reset the form values are not passed through props and you get undefined is not an object error
    // We make an empty check to prevent it
    const values = this.props.values || {};

    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <View
          style={{
            height: 200,
            backgroundColor: colors.deleteRed,
            color: "white",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text styl={{ color: "white" }}>Te bepalen content</Text>
        </View>

        <View style={{ padding: 20 }}>
          <Button
            style={{
              minWidth: 200,
              marginBottom: 20
            }}
            label={this.props.t("deleteAccount")}
            onPress={this.submitForm}
          />
        </View>
      </View>
    );
  }
}

SettingsDeleteAccount.propTypes = {
  values: T.shape({
    // currentPassword: T.string,
    // password: T.string,
    // passwordConfirmation: T.string
  }),
  setFieldValue: T.func,
  submitForm: T.func,
  t: T.func
};

const validationSchema = yup.object().shape({
  delUserInfo: yup.bool().notRequired(),
  delAllInfo: yup.bool().notRequired()
});

const onSubmit = (values, formikBag) => {
  const { alertDropdown, dispatch, t } = formikBag.props;

  dispatch({ type: DELETE_ACCOUNT });
};

const formikOptions = {
  handleSubmit: onSubmit,
  mapPropsToValues: () => {},
  validationSchema
};

export default hoistStatics(
  compose(
    connect(),
    withAlertDropdown,
    translate("root"),
    withFormik(formikOptions),
    // Has to be below withFormik
    withExitPrompt
  )
)(SettingsDeleteAccount);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center"
  },
  row: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1
  }
});
