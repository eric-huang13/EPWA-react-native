import React, { Component } from "react";
import T from "prop-types";
import { Text, View } from "react-native";
import { translate } from "react-i18next";
import { compose } from "redux";

import s from "./styles/FieldStyles";

class Field extends Component {
  renderRequiredFieldSymbol = () =>
    this.props.required ? <Text style={s.requiredFieldSymbol}>*</Text> : null;

  renderLeftLabel = () => (
    <Text style={s.leftLabel}>
      {this.props.label}
      {this.renderRequiredFieldSymbol()}
    </Text>
  );

  renderRightLabel = () =>
    this.props.required ? (
      <Text style={s.rightLabel}>{this.props.t("requiredField")}</Text>
    ) : null;

  renderLabelRow = () =>
    this.props.label ? (
      <View style={[s.labelContainer, this.props.labelContainerStyle]}>
        {this.renderLeftLabel()}
        {this.renderRightLabel()}
      </View>
    ) : null;

  render() {
    return (
      <View style={[s.container, this.props.showBorder ? s.separator : {}]}>
        {this.renderLabelRow()}
        <View style={[s.inputContainer, this.props.innerWrapperStyle]}>
          {this.props.children}
        </View>
      </View>
    );
  }
}

Field.propTypes = {
  showBorder: T.bool,
  required: T.bool,
  label: T.string,
  labelContainerStyle: T.any,
  children: T.node,
  innerWrapperStyle: T.any,
  t: T.func
};

export default compose(translate("root"))(Field);
