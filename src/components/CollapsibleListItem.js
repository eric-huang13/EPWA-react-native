import React from "react";
import T from "prop-types";
import { Text, View, TouchableOpacity } from "react-native";
import Collapsible from "react-native-collapsible";

import s from "./styles/CollapsibleListItemStyles";

import Icon from "./Icon";

import { colors } from "../themes";
import iconMap from "../constants/iconMap";

const CollapsibleListItem = ({ children, collapsed, icon, title, onPress }) => (
  <View>
    <TouchableOpacity onPress={onPress}>
      <View style={s.container}>
        <View style={s.iconContainer}>{icon}</View>
        <Text style={s.text}>{title}</Text>
        <Icon
          name={iconMap.arrowRight}
          size={20}
          color={colors.nero}
          style={{ transform: [{ rotate: "90deg" }] }}
        />
      </View>
    </TouchableOpacity>
    <Collapsible collapsed={collapsed}>{children}</Collapsible>
  </View>
);

CollapsibleListItem.propTypes = {
  children: T.node,
  icon: T.node,
  collapsed: T.bool,
  onPress: T.func,
  title: T.string
};

export default CollapsibleListItem;
