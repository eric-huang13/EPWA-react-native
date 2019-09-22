import React, { PureComponent } from "react";
import T from "prop-types";
import { View } from "react-native";

import s from "./styles/SliderIndexIndicatorsStyles";

// TODO: What if someone has 30 animals? You should make an option to show "..." in the middle of the indicators
class SliderIndexIndicators extends PureComponent {
  getStyle(index) {
    if (this.props.itemCount <= 1) return s.hiddenDot;
    return this.props.itemIndex === this.props.currentIndex &&
      this.props.itemIndex === index
      ? s.activeDot
      : s.dot;
  }

  render() {
    return (
      <View style={s.container}>
        {[...Array(this.props.itemCount)].map((e, index) => (
          <View
            key={index} // eslint-disable-line react/no-array-index-key
            style={this.getStyle(index)}
          />
        ))}
      </View>
    );
  }
}

SliderIndexIndicators.propTypes = {
  currentIndex: T.number,
  itemIndex: T.number,
  itemCount: T.number
};

export default SliderIndexIndicators;

/*
style={[
  s.dot,
  this.props.itemIndex === this.props.currentIndex &&
  this.props.itemIndex === index
    ? s.activeDot
    : {}
]}
*/
