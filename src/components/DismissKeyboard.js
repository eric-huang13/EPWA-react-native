import React from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";

// Use full screen Touchable to let user close the keyboard by clicking outside TextInput
// More info at: https://stackoverflow.com/questions/29685421/hide-keyboard-in-react-native

// eslint-disable-next-line react/prop-types
const DismissKeyboard = (Comp) => ({ children, ...props }) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <Comp {...props}>{children}</Comp>
  </TouchableWithoutFeedback>
);

export default DismissKeyboard;
