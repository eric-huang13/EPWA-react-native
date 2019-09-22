import React, { PureComponent } from "react";
import T from "prop-types";
import { Image, View, TouchableOpacity } from "react-native";

import Icon from "./Icon";

import s from "./styles/AnimalPhotoStyles";

import { colors } from "../themes";

class AnimalPhoto extends PureComponent {
  renderIcon = () => (
    <TouchableOpacity
      onPress={this.props.onIconPress}
      disabled={!this.props.onIconPress}
    >
      <Icon name={this.props.iconName} size={50} color={colors.white} />
    </TouchableOpacity>
  );

  renderEmptyState = () => (
    <View
      style={[s.photoContainer, { justifyContent: this.props.contentPosition }]}
    >
      {this.props.iconName ? this.renderIcon() : this.props.children}
    </View>
  );

  renderActiveState = () => (
    <View
      style={[s.photoContainer, { justifyContent: this.props.contentPosition }]}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image
          source={this.props.source}
          style={{
            width: "100%",
            flex: 1
          }}
        />
      </View>
      {this.props.iconName ? this.renderIcon() : this.props.children}
    </View>
  );

  render() {
    return this.props.source
      ? this.renderActiveState()
      : this.renderEmptyState();
  }
}

AnimalPhoto.defaultProps = {
  contentPosition: "flex-end"
};

AnimalPhoto.propTypes = {
  iconName: T.string,
  contentPosition: T.string,
  onIconPress: T.func,
  children: T.node,
  source: T.object // eslint-disable-line react/forbid-prop-types
};

export default AnimalPhoto;
