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

import uniLogoNe from "../images/uniLogo-ne.png";
import uniLogoEn from "../images/uniLogo-en.png";
import paardenkampLogo from "../images/paardenkampLogo.jpg";
import vriendenNeLogo from "../images/vrienden_ne.png";
import vriendenEnLogo from "../images/vrienden_en.png";
import dechraLogo from "../images/sponsor/dechra.jpg";
import donkeySanctuaryLogo from "../images/sponsor/donkey-sanctuary.png";
import msmLogo from "../images/sponsor/msm.png";
import pavoLogo from "../images/sponsor/pavo.png";
import scmFondsLogo from "../images/sponsor/scm-fonds.png";
import stichtingNijdierLogo from "../images/sponsor/stichting-nijdier.png";
import stichtingLogo from "../images/sponsor/stichting.jpg";
import verenigingHetLogo from "../images/sponsor/vereniging-het.png";

import CircleButton from "../components/CircleButton";
import CategoryHeader from "../components/CategoryHeader";
import Icon from "../components/Icon";
import HamburgerButton from "../components/HamburgerButton";

import { colors, fonts } from "../themes";
import iconMap from "../constants/iconMap";

images = {
  vriendenNeLogoImg: vriendenNeLogo,
  vriendenEnLogoImg: vriendenEnLogo,
  uniLogoNeImg: uniLogoNe,
  uniLogoEnImg: uniLogoEn
};

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
            <View
              style={{
                marginTop: 10,
                height: 120,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Image
                resizeMode="contain"
                source={images[t("aboutScreen.university.logo")]}
                style={{ width: '80%'}}
              />
            </View>
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
          </Section>
          <Section>
            <Header url={t("aboutScreen.friends.link.url")}>
              {t("aboutScreen.friends.title")}
            </Header>
            <View
              style={{
                marginTop: 10,
                height: 120,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Image
                resizeMode="contain"
                source={images[t("aboutScreen.friends.logo")]}
                style={{ width: '80%'}}
              />
            </View>
            <Description>{t("aboutScreen.friends.description")}</Description>
            <Link
              label={t("aboutScreen.friends.link.label")}
              url={t("aboutScreen.friends.link.url")}
            />
          </Section>
          <Section>
            <Header>
              {t("aboutScreen.sponsor.title")}
            </Header>
            <View 
              style={{
                marginVertical: 10,
                paddingLeft: '5%',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '90%',
                height: 500
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 100,
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={dechraLogo}
                    style={{ width: '60%'}}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={stichtingNijdierLogo}
                    style={{ width: '80%'}}
                  />
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  height: 100,
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={scmFondsLogo}
                    style={{ width: '60%'}}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={stichtingLogo}
                    style={{ width: '60%'}}
                  />
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  marginTop: 20,
                  height: 100,
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={donkeySanctuaryLogo}
                    style={{ width: '60%'}}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={msmLogo}
                    style={{ width: '65%'}}
                  />
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  marginTop: 30,
                  height: 100,
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={verenigingHetLogo}
                    style={{ width: '60%'}}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={pavoLogo}
                    style={{ width: '70%'}}
                  />
                </View>
              </View>
            </View>
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
