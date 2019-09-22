import React, { Component } from "react";
import { ScrollView, View, Text, Image } from "react-native";
import { translate } from "react-i18next";
import HamburgerButton from "../components/HamburgerButton";

import housingPhoto from "../images/housing.jpg";
import feedingPhoto from "../images/feeding.jpg";
import behaviourPhoto from "../images/behaviour.jpg";
import wellnessPhoto from "../images/wellness.jpg";

import { colors, fonts } from "../themes";

class Welfareinfo extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t.t("headerBar.welfareInfo"),
    headerTitleStyle: {
      ...fonts.style.h4,
      fontWeight: "400"
    },
    headerLeft: <HamburgerButton onPress={navigation.openDrawer} />
  });

  images = {
    housing: housingPhoto,
    feeding: feedingPhoto,
    behaviour: behaviourPhoto,
    wellness: wellnessPhoto
  };

  render() {
    const { t } = this.props;

    const textStyle = {
      ...fonts.style.normal,
      color: colors.nero,
      lineHeight: 20,
      marginBottom: 20
    };

    const titleStyle = {
      ...fonts.style.cta,
      color: colors.nero,
      lineHeight: 20,
      marginBottom: 10
    };

    const sections = t("info.welfare.sections", { returnObjects: true });

    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: colors.white,
            paddingTop: 20,
            paddingHorizontal: 20
          }}
        >
          {sections.map(({ title, content, imageTitle }) => (
            <View key={title}>
              <Text style={titleStyle}>{title}</Text>
              {imageTitle && (
                <Image
                  source={this.images[imageTitle]}
                  style={{ width: "100%", height: 200, marginBottom: 10 }}
                />
              )}
              <Text style={textStyle}>{content}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

export default translate("root")(Welfareinfo);
