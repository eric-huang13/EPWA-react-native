import React, { Component } from "react";
import {
  Button,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import { translate } from "react-i18next";

import uniLogo from "../images/uniLogo.jpg";
import paardenkampLogo from "../images/paardenkampLogo.jpg";

import CircleButton from "../components/CircleButton";
import CategoryHeader from "../components/CategoryHeader";
import Icon from "../components/Icon";
import HamburgerButton from "../components/HamburgerButton";

import { colors, fonts } from "../themes";
import iconMap from "../constants/iconMap";

const tryOpenUrl = (url) => {
  if (!url) return;
  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) return false;
      return Linking.openURL(url);
    })
    .catch(() => {});
};

const Header = (props) => (
  <TouchableHighlight
    underlayColor={colors.transparent}
    onPress={() => tryOpenUrl(props.url)}
  >
    <CategoryHeader
      boxStyles={{
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomWidth: 0
      }}
    >
      {props.children}
    </CategoryHeader>
  </TouchableHighlight>
);

const Description = (props) => (
  <Text style={{ ...fonts.style.normal, padding: 20 }}>{props.children}</Text>
);

const Link = (props) => (
  <View style={{ paddingHorizontal: 20, ...props.style }}>
    <Button
      title={props.label}
      style={{ ...fonts.style.normal, padding: 20 }}
      onPress={() => {
        tryOpenUrl(props.url);
      }}
    />
  </View>
);

const Logo = ({ source, url }) => (
  <View
    style={{
      paddingTop: 20,
      height: 200
      // borderBottomWidth: 1,
      // borderBottomColor: colors.darkFilter
    }}
  >
    <TouchableHighlight
      underlayColor={colors.transparent}
      onPress={() => tryOpenUrl(url)}
    >
      <Image
        resizeMode="contain"
        source={source}
        style={{
          height: "100%",
          width: "100%"
        }}
      />
    </TouchableHighlight>
  </View>
);

const Section = (props) => (
  <View
    style={{
      borderBottomWidth: 1,
      borderBottomColor: colors.darkFilter
    }}
  >
    {props.children}
  </View>
);

class About extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t.t("headerBar.about"),
    headerTitleStyle: {
      ...fonts.style.h4,
      fontWeight: "400"
    },
    headerLeft: <HamburgerButton onPress={navigation.openDrawer} />
  });

  render() {
    const { t } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
            backgroundColor: colors.white
          }}
        >
          <Section>
            <Description>{t("aboutScreen.title")}</Description>
          </Section>
          <Section>
            <Header url={t("aboutScreen.university.link.url")}>
              {t("aboutScreen.university.title")}
            </Header>
            <Logo source={uniLogo} url={t("aboutScreen.university.link.url")} />
            <Description>{t("aboutScreen.university.description")}</Description>
            <Link
              label={t("aboutScreen.university.link.label")}
              url={t("aboutScreen.university.link.url")}
            />
          </Section>
          <Section>
            <Header url={t("aboutScreen.paardenkamp.link.url")}>
              {t("aboutScreen.paardenkamp.title")}
            </Header>
            <Logo
              source={paardenkampLogo}
              url={t("aboutScreen.paardenkamp.link.url")}
            />
            <Description>
              {t("aboutScreen.paardenkamp.description")}
            </Description>
            <Link
              label={t("aboutScreen.paardenkamp.link.label")}
              url={t("aboutScreen.paardenkamp.link.url")}
            />
            {/* <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  paddingBottom: 20
                }}
              >
                <CircleButton
                  onPress={() => {
                    tryOpenUrl("https://www.facebook.com/DePaardenkamp");
                  }}
                  containerStyles={{
                    backgroundColor: colors.facebookBlue,
                    marginRight: 20
                  }}
                >
                  <Icon
                    name={iconMap.facebook}
                    size={20}
                    color={colors.white}
                  />
                </CircleButton>
                <CircleButton
                  onPress={() => {
                    tryOpenUrl("https://twitter.com/DePaardenkamp");
                  }}
                  containerStyles={{ backgroundColor: colors.twitterBlue }}
                >
                  <Icon name={iconMap.twitter} size={20} color={colors.white} />
                </CircleButton>
              </View>
            </View> */}
          </Section>
          <Section>
            <Header url={t("aboutScreen.friends.link.url")}>
              {t("aboutScreen.friends.title")}
            </Header>
            <Description>{t("aboutScreen.friends.description")}</Description>
            <Link
              label={t("aboutScreen.friends.link.label")}
              url={t("aboutScreen.friends.link.url")}
            />
          </Section>
          <Section>
            <View
              style={{ paddingVertical: 40, paddingTop: 20, paddingBottom: 10 }}
            >
              {t("aboutScreen.more.links", { returnObjects: true }).map(
                ({ label, url }) => (
                  <Link label={label} url={url} style={{ marginBottom: 10 }} />
                )
              )}
            </View>
          </Section>
          {/* <Section>
            <View style={{ padding: 20 }}>
              <Text style={{ ...fonts.style.normal, paddingBottom: 10 }}>
                {t("aboutScreen.listIntro")}
              </Text>
              {t("aboutScreen.list", { returnObjects: true }).map(
                ({ label, url }) => (
                  <Text
                    key={label}
                    style={{
                      ...fonts.style.normal,
                      paddingBottom: 10,
                      color: url ? "rgb(0, 122, 255)" : colors.nero
                    }}
                    onPress={() => (url ? tryOpenUrl(url) : null)}
                  >
                    {"\u2022"} {label}
                  </Text>
                )
              )}
            </View>
          </Section> */}
          <Section>
            <Header>{t("aboutScreen.privacy.title")}</Header>
            <Description>{t("aboutScreen.privacy.description")}</Description>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 0,
                marginBottom: 40,
                width: "100%"
              }}
            >
              <Button
                style={{ width: 200, marginBottom: 20 }}
                title={t("aboutScreen.privacy.link.label")}
                onPress={() => {
                  tryOpenUrl(t("aboutScreen.privacy.link.url"));
                }}
                iconName={iconMap.share}
              />
            </View>
          </Section>
        </ScrollView>
      </View>
    );
  }
}

export default translate("root")(About);
