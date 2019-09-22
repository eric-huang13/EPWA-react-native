import React, { Component } from "react";
import {
  Alert,
  Image,
  View,
  ScrollView,
  Text,
  TouchableOpacity
} from "react-native";
import { HeaderBackButton } from "react-navigation-stack";
import Touchable from "react-native-platform-touchable";
import { all, compose, ifElse, last, map, takeLast } from "ramda";
import { isFinite, toNumber } from "lodash";

import { colors, fonts } from "../themes";

import buikspierenPhoto from "../images/ppid/buikspieren.jpg";
import drinkenEnPlassenPhoto from "../images/ppid/drinkenEnPlassen.jpg";
import eetlustPhoto from "../images/ppid/eetlust.jpg";
import hoefbevangenPhoto from "../images/ppid/hoefbevangen.png";
import holtesBovenDeOgenPhoto from "../images/ppid/holtesBovenDeOgen.jpg";
import leeftijdPhoto from "../images/ppid/leeftijd.jpg";
import lusteloosheidPhoto from "../images/ppid/lusteloosheid.jpg";
import mindereWeerstandPhoto from "../images/ppid/mindereWeerstand.jpg";
import plotselingBlindPhoto from "../images/ppid/plotselingBlind.jpg";
import rugspierenPhoto from "../images/ppid/rugspieren.jpg";
import vachtveranderingPhoto from "../images/ppid/vachtverandering.jpg";
import vruchtbaarPhoto from "../images/ppid/vruchtbaar.jpg";
import wintervachtPhoto from "../images/ppid/wintervacht.jpg";
import zwetenPhoto from "../images/ppid/zweten.jpg";

class PPIDQuestion extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t("headerBar.syndromes"),
    headerTitleStyle: {
      ...fonts.style.h4,
      fontWeight: "400"
    },
    headerLeft: (
      <HeaderBackButton
        tintColor={colors.nero}
        onPress={() => navigation.goBack()}
      />
    ),
    headerRight: (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 30, right: 30 }}
          style={{ marginRight: 30 }}
          onPress={() => {
            const { t } = screenProps;
            Alert.alert(t("ppidQuitTitle"), t("ppidQuitMessage"), [
              { text: t("cancel"), style: "cancel" },
              {
                text: t("quit"),
                onPress: () => navigation.popToTop()
              }
            ]);
          }}
        >
          <Text>{screenProps.t("quit")}</Text>
        </TouchableOpacity>
      </View>
    )
  });

  get navigation() {
    return this.props.navigation;
  }

  get setFieldValue() {
    return this.props.screenProps.form.setFieldValue;
  }

  getContent = (routeName) => {
    const { t } = this.props.screenProps;
    const lastLetterInRoute = last(routeName).toLowerCase();

    const images = {
      a: holtesBovenDeOgenPhoto,
      b: vachtveranderingPhoto,
      c: drinkenEnPlassenPhoto,
      d: hoefbevangenPhoto,
      others: [
        leeftijdPhoto,
        eetlustPhoto,
        lusteloosheidPhoto,
        wintervachtPhoto,
        zwetenPhoto,
        mindereWeerstandPhoto,
        rugspierenPhoto,
        buikspierenPhoto,
        plotselingBlindPhoto,
        vruchtbaarPhoto
      ]
    };

    if (
      lastLetterInRoute === "a" ||
      lastLetterInRoute === "b" ||
      lastLetterInRoute === "c" ||
      lastLetterInRoute === "d"
    ) {
      return {
        fieldName: lastLetterInRoute,
        image: images[lastLetterInRoute],
        title: t(`ppidCheck.title.${lastLetterInRoute}`),
        content: t(`ppidCheck.content.${lastLetterInRoute}`)
      };
    }

    const questionNumber = compose(
      ifElse(
        all(isFinite),
        compose((arr) => toNumber(`${arr[0]}${arr[1]}`)),
        compose(last)
      ),
      map(toNumber),
      takeLast(2)
    )(routeName);

    return {
      fieldName: questionNumber,
      image: images.others[questionNumber - 1],
      title: t(`ppidCheck.title.others.${questionNumber - 1}`),
      content: t(`ppidCheck.content.others.${questionNumber - 1}`)
    };
  };

  onAnswer = (fieldName, hasAnsweredYes) => {
    this.setFieldValue(fieldName, hasAnsweredYes);

    if (fieldName === "a") {
      this.navigation.navigate(`PPIDQuestionB`);
      return;
    }

    if (fieldName === "b") {
      this.navigation.navigate(`PPIDQuestionC`);
      return;
    }

    if (fieldName === "c") {
      this.navigation.navigate(`PPIDQuestionD`);
      return;
    }

    if (fieldName === "d") {
      this.navigation.navigate(`PPIDQuestion1`);
      return;
    }

    if (fieldName === 10) {
      this.navigation.navigate(`PPIDResult`);
      return;
    }

    this.navigation.navigate(`PPIDQuestion${fieldName + 1}`);
  };

  render() {
    const { t } = this.props.screenProps;
    const content = this.getContent(this.navigation.state.routeName);

    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
            backgroundColor: colors.white
          }}
        >
          <Image
            source={content.image}
            style={{
              height: 245,
              width: "100%",
              backgroundColor: colors.mediumPurple
            }}
          />
          <View style={{ padding: 20, flexGrow: 1 }}>
            <Text style={{ ...fonts.style.h4, marginBottom: 20 }}>
              {content.title}
            </Text>
            <Text style={{ marginBottom: 20 }}>{content.content}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Touchable
              onPress={() => this.onAnswer(content.fieldName, false)}
              style={{
                flex: 1,
                minHeight: 60,
                backgroundColor: colors.egyptianBlueDark,
                justifyContent: "center",
                alignItems: "center",
                borderRightWidth: 1,
                borderRightColor: colors.white
              }}
            >
              <Text style={{ ...fonts.style.cta, color: colors.white }}>
                {t("noOrNa")}
              </Text>
            </Touchable>
            <Touchable
              onPress={() => this.onAnswer(content.fieldName, true)}
              style={{
                flex: 1,
                minHeight: 60,
                backgroundColor: colors.egyptianBlueDark,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={{ ...fonts.style.cta, color: colors.white }}>
                {t("yes")}
              </Text>
            </Touchable>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default PPIDQuestion;
