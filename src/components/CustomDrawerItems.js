import React from "react";
import { View, Text, StyleSheet, SafeAreaView  } from "react-native";
import { compose } from "redux";
import { translate } from "react-i18next";

import TouchableItem from "./TouchableItem";

import { colors } from "../themes";
import { firstCharacterToLowerCase } from "../transforms";
import Icon from "./Icon";
import iconMap from "../constants/iconMap";

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */

/**
 * Component that renders the navigation list in the drawer.
 */
const DrawerNavigatorItems = ({
  navigation: { state, navigate },
  items,
  activeItemKey,
  activeTintColor,
  activeBackgroundColor,
  inactiveTintColor,
  inactiveBackgroundColor,
  getLabel,
  renderIcon,
  onItemPress,
  itemsContainerStyle,
  itemStyle,
  labelStyle,
  activeLabelStyle,
  inactiveLabelStyle,
  iconContainerStyle,
  drawerPosition,
  closeDrawer,
  t
}) => (
  <View style={[styles.container, itemsContainerStyle]}>
    {items.map((route, index) => {
      const focused = activeItemKey === route.key;
      const color = focused ? activeTintColor : inactiveTintColor;
      const backgroundColor = focused
        ? activeBackgroundColor
        : inactiveBackgroundColor;
      const scene = { route, index, focused, tintColor: color };
      const icon = renderIcon(scene);
      const label = getLabel(scene);
      const extraLabelStyle = focused ? activeLabelStyle : inactiveLabelStyle;

      return (
        <TouchableItem
          key={route.key}
          onPress={() => {
            if (focused) {
              closeDrawer();
            } else {
              onItemPress({ route, focused });
            }
          }}
          delayPressIn={0}
        >
          <SafeAreaView
            style={{ backgroundColor }}
            forceInset={{
              [drawerPosition]: "always",
              [drawerPosition === "left" ? "right" : "left"]: "never",
              vertical: "never"
            }}
          >
            <View style={[styles.item, itemStyle]}>
              {typeof label === "string" ? (
                <Text
                  style={[
                    styles.label,
                    { color },
                    labelStyle,
                    extraLabelStyle,
                    {
                      fontSize: 22,
                      fontFamily: "SourceSerifPro-Regular",
                      flex: 1
                    }
                  ]}
                >
                  {t(`headerBar.${firstCharacterToLowerCase(label)}`)}
                </Text>
              ) : (
                label
              )}
              <View
                style={[
                  styles.icon,
                  focused ? null : styles.inactiveIcon,
                  iconContainerStyle
                ]}
              >
                <Icon name={iconMap.arrowRight} size={15} color={colors.nero} />
              </View>
            </View>
          </SafeAreaView>
        </TouchableItem>
      );
    })}
  </View>
);

/* Material design specs - https://material.io/guidelines/patterns/navigation-drawer.html#navigation-drawer-specs */
DrawerNavigatorItems.defaultProps = {
  activeTintColor: colors.mediumPurple,
  activeBackgroundColor: "transparent",
  inactiveTintColor: colors.nero,
  inactiveBackgroundColor: "transparent"
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)"
  },
  icon: {
    marginHorizontal: 16,
    width: 24,
    alignItems: "center"
  },
  inactiveIcon: {
    /*
     * Icons have 0.54 opacity according to guidelines
     * 100/87 * 54 ~= 62
     */
    opacity: 0.62
  },
  label: {
    margin: 16
  }
});

export default compose(translate("root"))(DrawerNavigatorItems);
