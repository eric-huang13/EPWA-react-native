import React from "react";
import T from "prop-types";
import { View, TextInput } from "react-native";
import { onlyUpdateForKeys } from "recompose";

import FieldLabel from "./FieldLabel";

import s from "./styles/MultiLineTextFieldStyles";

const MultiLineTextField = ({
  value,
  onChangeText,
  hasError,
  label,
  maxLength
}) => (
  <View>
    <FieldLabel style={{ marginBottom: 5 }}>{label}</FieldLabel>
    <View style={[s.fieldContainer, hasError && s.fieldContainerHasError]}>
      <TextInput
        style={s.field}
        maxLength={maxLength}
        multiline
        onChangeText={onChangeText}
        underlineColorAndroid="transparent"
        value={value}
      />
    </View>
  </View>
);

MultiLineTextField.propTypes = {
  value: T.string,
  onChangeText: T.func,
  hasError: T.bool,
  label: T.string,
  maxLength: T.number
};

export default onlyUpdateForKeys([
  "value",
  "onChangeText",
  "hasError",
  "label",
  "maxLength"
])(MultiLineTextField);
