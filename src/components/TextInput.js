import React, { Component } from "react";
import T from "prop-types";
import { TextInput } from "react-native";

import s from "./styles/TextInputStyles";

class TextField extends Component {
  setRef = (element) => {
    this.field = element;
  };

  focus = () => {
    this.field.focus();
  };

  blur = () => {
    this.field.blur();
  };

  render() {
    const { style, ...props } = this.props;

    return (
      <TextInput
        ref={this.setRef}
        style={[s.field, { ...style }]}
        underlineColorAndroid="transparent"
        {...props}
      />
    );
  }
}

TextField.propTypes = {
  style: T.any // eslint-disable-line
};

export default TextField;
