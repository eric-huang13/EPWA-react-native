import React from "react";
import T from "prop-types";
import {
  Image,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  Share,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { DrawerActions } from 'react-navigation-drawer';
import { compose } from "redux";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { get } from "lodash";

import s from "./styles/CustomDrawerContentStyles";
import Icon from "./Icon";
import CustomDrawerItems from "./CustomDrawerItems";
import Button from "./Button";
import { colors } from "../themes";

import { getToken } from "../selectors/auth";
import iconMap from "../constants/iconMap";

class CustomDrawerContent extends React.Component {
  render() {
    const { authToken, t } = this.props;

    const closeDrawer = () => {
      this.props.navigation.dispatch(DrawerActions.closeDrawer());
    };

    const goToSettings = () => {
      this.props.navigation.navigate("Settings");
    };

    return (
      <ScrollView>
        <SafeAreaView
          style={s.container}
          forceInset={{ top: "always", horizontal: "never" }}
        >
          <View style={s.header}>
            <View style={s.headerRow}>
              <View style={s.headerLeftIcon}>
                <TouchableOpacity
                  hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                  onPress={closeDrawer}
                >
                  <Icon name={iconMap.close} size={16} color={colors.white} />
                </TouchableOpacity>
              </View>
              <View style={s.headerContent}>
                <Image
                  style={s.headerPhoto}
                  source={{
                    uri: this.props.data.pictureUrl,
                    headers: { Authorization: `Bearer ${authToken}` }
                  }}
                />
              </View>
              <View style={s.headerRightIcon}>
                <TouchableHighlight onPress={goToSettings}>
                  <Icon name={iconMap.edit} size={16} color={colors.white} />
                </TouchableHighlight>
              </View>
            </View>
            <Text style={s.headerText}>{this.props.data.name}</Text>
          </View>
          <CustomDrawerItems closeDrawer={closeDrawer} {...this.props} />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              width: "100%",
              marginBottom: 10
            }}
          >
            <Button
              style={{ width: 200 }}
              backgroundColor={colors.nero}
              label={t("shareApp")}
              onPress={() => {
                Share.share({
                  title: t("shareAppTitleDrawerMenu"),
                  message: t("shareAppContentDrawerMenu"),
                  url: this.props.t("shareAppUrl")
                });
              }}
              iconName={iconMap.share}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  }
}

CustomDrawerContent.propTypes = {
  authToken: T.string,
  t: T.func,
  data: T.shape({
    name: T.string,
    pictureUrl: T.string
  })
};

const mapStateToProps = (state) => {
  const firstName = get(state, "profile.firstName");
  const lastName = get(state, "profile.lastName");
  const pictureUrl = get(state, "profile.pictureUrl");
  const token = getToken(state);

  const result = {};

  if (firstName && lastName) {
    result.name = `${firstName} ${lastName}`;
  } else if (firstName) {
    result.name = `${firstName}`;
  } else if (lastName) {
    result.name = `${lastName}`;
  } else {
    result.name = "No name";
  }

  if (pictureUrl) {
    result.pictureUrl = pictureUrl;
  } else {
    result.pictureUrl = "https://via.placeholder.com/300x300";
  }

  return {
    data: result,
    authToken: token
  };
};

export default compose(
  connect(mapStateToProps),
  translate("root")
)(CustomDrawerContent);
