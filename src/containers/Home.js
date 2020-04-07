import React, { Component } from "react";
import T from "prop-types";
import ActionButton from "react-native-action-button";
import { FlatList, Text, View, Platform } from "react-native";
import { compose } from "redux";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { hoistStatics } from "recompose";

import s from "./styles/HomeStyles";

import Button from "../components/Button";
import AnimalListItem from "../components/AnimalListItem";
import HamburgerButton from "../components/HamburgerButton";
import CalendarButton from "../components/CalendarButton";
import StableImageBackground from "../components/StableImageBackground";
import Icon from "../components/Icon";
import withAlertDropdown from "../components/withAlertDropdown";

import { getAnimals } from "../actions/animals";

import { colors, fonts } from "../themes";
import { getToken } from "../selectors/auth";
import iconMap from "../constants/iconMap";

class HomeScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t.t("headerBar.stable"),
    headerTitleStyle: {
      ...fonts.style.h4,
      fontWeight: "400"
    },
    headerLeft: <HamburgerButton onPress={navigation.openDrawer} />,
    headerRight: (
      <CalendarButton
        hitSlop={{ top: 10, bottom: 10, left: 30, right: 30 }}
        onPress={() => navigation.navigate("Diary")}
      />
    )
  });

  // eslint-disable-next-line consistent-return
  componentDidMount() {
    // BIG HACK - for some reason, if you dispatch navigate to Auth from any other screen of App stack, it will rollback to Home route
    // To handle it, if there's no access token and profile id, it means that you should redirect
    if (this.shouldRedirectToAuth()) {
      return this.props.navigation.navigate("Auth");
    }

    const { alertDropdown, dispatch, isOnline, t } = this.props;

    if (isOnline) {
      dispatch(
        getAnimals({
          showNotification: alertDropdown,
          translate: t
        })
      );
    }
  }

  // eslint-disable-next-line consistent-return
  componentDidUpdate() {
    // BIG HACK - for some reason, if you dispatch navigate to Auth from any other screen of App stack, it will rollback to Home route
    if (this.shouldRedirectToAuth()) {
      return this.props.navigation.navigate("Auth");
    }
  }

  shouldRedirectToAuth = () => !this.props.accessToken && !this.props.profileId;

  moveToAddHorse = () => {
    this.props.navigation.navigate("AnimalForm", { type: "horse" });
  };

  moveToAddDonkey = () => {
    this.props.navigation.navigate("AnimalForm", { type: "donkey" });
  };

  moveToAnimalProfile = (item) => {
    this.props.navigation.navigate("AnimalProfile", { id: item.id });
  };

  keyExtractor = (item) => `${item.id}`; // key has to be a string

  renderItem = ({ item }) => (
    <AnimalListItem
      authToken={this.props.authToken}
      animal={item}
      onPress={() => this.moveToAnimalProfile(item)}
    />
  );

  renderActiveState = () => {
    const { data, t } = this.props;

    return (
      <View style={s.screenContainer}>
        <FlatList
          data={data.animals}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
        <ActionButton
          bgColor="rgba(0,0,0,.5)"
          buttonColor={colors.mediumPurple}
          // Feedback on Android is square on round button.
          // Prevent this ugly issue with disabling native feedback on Android.
          useNativeFeedback={Platform.select({ ios: true, android: false })}
        >
          <ActionButton.Item
            buttonColor={colors.mediumPurple}
            title={t("addHorse")}
            onPress={this.moveToAddHorse}
          >
            <Icon name={iconMap.horse3} color={colors.white} size={22} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor={colors.mediumPurple}
            title={t("addDonkey")}
            onPress={this.moveToAddDonkey}
          >
            <Icon name={iconMap.donkey} color={colors.white} size={22} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  };

  renderEmptyState = () => {
    const { t } = this.props;

    return (
      <StableImageBackground style={s.imageBackground}>
        <View style={s.contentContainer}>
          <Text style={s.text}>{t("noAnimalsToShow")}</Text>
          <Button
            style={s.btn}
            backgroundColor={colors.mediumPurple}
            label={t("addHorse")}
            onPress={this.moveToAddHorse}
            iconName={iconMap.arrowRight}
            textStyles={{ textAlign: "left", paddingLeft: 15 }}
          />
          <Button
            style={s.btn}
            backgroundColor={colors.mediumPurple}
            label={t("addDonkey")}
            onPress={this.moveToAddDonkey}
            iconName={iconMap.arrowRight}
            textStyles={{ textAlign: "left", paddingLeft: 15 }}
          />
        </View>
      </StableImageBackground>
    );
  };

  render() {
    if (!this.props.data.animals.length) {
      return this.renderEmptyState();
    }

    return this.renderActiveState();
  }
}

HomeScreen.propTypes = {
  authToken: T.string,
  alertDropdown: T.func,
  dispatch: T.func,
  data: T.shape({
    animals: T.arrayOf(
      T.shape({
        name: T.string,
        pictureUrl: T.string
      })
    )
  }),
  isOnline: T.bool,
  t: T.func
};

const mapStateToProps = (state) => ({
  authToken: getToken(state),
  data: {
    animals: state.animals,
    profile: state.profile
  },
  isOnline: state.offline.online,
  accessToken: state.auth.accessToken,
  profileId: state.profile.id
});

export default hoistStatics(
  compose(
    connect(mapStateToProps),
    translate("root"),
    withAlertDropdown
  )
)(HomeScreen);
