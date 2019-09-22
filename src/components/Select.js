import React, { Component } from "react";
import T from "prop-types";
import RNPickerSelect from "react-native-picker-select";
import { translate } from "react-i18next";

import { colors } from "../themes";

class Select extends Component {
  render() {
    const {
      style = {
        inputIOS: {},
        inputAndroid: {},
        viewContainer: {},
        underline: {}
      },
      showBorder,
      t,
      ...props
    } = this.props;

    return (
      <RNPickerSelect
        hideIcon
        doneText={t("selectDone")}
        style={{
          inputIOS: {
            height: 46,
            paddingHorizontal: 10,
            borderRadius: 28,
            backgroundColor: colors.white,
            color: colors.nero,
            ...style.inputIOS
          },
          inputAndroid: {
            paddingHorizontal: 20,
            borderRadius: 28,
            backgroundColor: colors.white,
            color: colors.nero,
            ...style.inputAndroid
          },
          viewContainer: {
            borderRadius: 28,
            borderWidth: showBorder ? 1 : 0,
            borderColor: colors.mediumPurple,
            overflow: "hidden",
            ...style.viewContainer
          },
          underline: {
            borderTopWidth: 0,
            ...style.underline
          }
        }}
        {...props}
      />
    );
  }
}

Select.propTypes = {
  style: T.any, // eslint-disable-line
  showBorder: T.bool,
  t: T.func
};

export default translate("root")(Select);
