import React, { Component } from "react";
import { HeaderBackButton } from "react-navigation-stack";
import { Text, View, ScrollView, Image } from "react-native";

import headMovementsImage from "../images/headMovements.jpg";
import kickingAtAbdomenImage from "../images/kickingAtAbdomen.jpg";
import pawingImage from "../images/pawing.jpg";
import rollingImage from "../images/rolling.jpg";
import tailFlickingImage from "../images/tailFlicking.jpg";
import yawningImage from "../images/yawning.jpg";
import flehmingImage from "../images/flehming.jpg";

// Donkey Images
import donkeyHeadShakingImage from "../images/donkey/headShaking.jpg";
import donkeyKickingAtAbdomenImage from "../images/donkey/kickingAtAbdomen.jpg";
import donkeyPawingImage from "../images/donkey/pawing.jpg";
import donkeyLookingAtAbdomenImage from "../images/donkey/lookingAtAbdomen.jpg";
import donkeyTailFlickingImage from "../images/donkey/tailFlicking.jpg";
import donkeyYawningImage from "../images/donkey/yawning.jpg";
import donkeyFlehmingImage from "../images/donkey/flehming.jpg";
import donkeyPointingTowardTheFloorImage from "../images/donkey/pointingTowardTheFloor.jpg";
import donkeySmackingImage from "../images/donkey/smacking.jpg";

import ppid from "../images/ppid.jpg";
import donkeyTeethGrinding from "../images/donkeyTeethGrinding.jpg";

import AudioPlayer from "../components/AudioPlayer";

import { colors, fonts } from "../themes";

class PainMeasurementTimerInfo extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      title: screenProps.t("painMeasurement.misc.headerTitle"),
      headerTitleStyle: {
        ...fonts.style.h4,
        fontWeight: "400"
      },
      headerLeft: (
        <HeaderBackButton
          tintColor={colors.nero}
          onPress={() => navigation.goBack()}
        />
      )
    };
  };

  renderAudioSection = (fieldName) => {
    if (fieldName === "painSounds") {
      return (
        <View
          style={{
            minHeight: 90,
            justifyContent: "center",
            paddingHorizontal: 20,
            borderTopWidth: 1,
            borderTopColor: colors.darkFilter
          }}
        >
          <View style={{ marginBottom: 10 }}>
            <AudioPlayer
              fieldName="teethGrinding"
              t={this.props.screenProps.t}
            />
          </View>
          <AudioPlayer fieldName="moaning" t={this.props.screenProps.t} />
        </View>
      );
    }

    if (fieldName === "teethGrinding" || fieldName === "moaning") {
      return (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.darkFilter
          }}
        >
          <AudioPlayer fieldName={fieldName} t={this.props.screenProps.t} />
        </View>
      );
    }

    return null;
  };

  getContentObject = (fieldName) => {
    const { form, t } = this.props.screenProps;
    const { animalType } = form.values;
    const isHorse = animalType === "horse";
    const translatedAnimalType =
      animalType === "horse"
        ? t("painMeasurement.misc.horse").toLowerCase()
        : t("painMeasurement.misc.donkey").toLowerCase();

    const content = {
      fullCountdown: {
        image: null,
        title: t(`painMeasurement.full.timer.${fieldName}`, { animalType }),
        content: t(`painMeasurement.explanationTexts.${fieldName}`, {
          animalType: translatedAnimalType,
          returnObjects: true
        })
      },
      headCountdown: {
        image: null,
        title: t(`painMeasurement.full.timer.${fieldName}`, { animalType }),
        content: t(`painMeasurement.explanationTexts.${fieldName}`, {
          animalType: translatedAnimalType,
          returnObjects: true
        })
      },
      tailFlicking: {
        image: isHorse ? tailFlickingImage : donkeyTailFlickingImage,
        title: t(`painMeasurement.full.timer.${fieldName}`, { animalType }),
        content: t(`painMeasurement.explanationTexts.${fieldName}`, {
          animalType: translatedAnimalType,
          returnObjects: true
        })
      },
      pawing: {
        image: isHorse ? pawingImage : donkeyPawingImage,
        title: t(`painMeasurement.full.timer.${fieldName}`, { animalType }),
        content: t(`painMeasurement.explanationTexts.${fieldName}`, {
          animalType: translatedAnimalType,
          returnObjects: true
        })
      },
      pointingTowardsTheFloor: {
        image: donkeyPointingTowardTheFloorImage,
        title: t(`painMeasurement.full.timer.${fieldName}`, { animalType }),
        content: t(`painMeasurement.explanationTexts.${fieldName}`, {
          animalType: translatedAnimalType,
          returnObjects: true
        })
      },
      layingDownRolling: {
        image: rollingImage,
        title: t(`painMeasurement.full.timer.${fieldName}`, { animalType }),
        content: t(`painMeasurement.explanationTexts.${fieldName}`, {
          animalType: translatedAnimalType,
          returnObjects: true
        })
      },
      headMovements: {
        image: headMovementsImage,
        title: t(`painMeasurement.full.timer.${fieldName}`, { animalType }),
        content: t(`painMeasurement.explanationTexts.${fieldName}`, {
          animalType: translatedAnimalType,
          returnObjects: true
        })
      },
      lookingAtAbdomen: {
        image: donkeyLookingAtAbdomenImage,
        title: t(`painMeasurement.full.timer.${fieldName}`, { animalType }),
        content: t(`painMeasurement.explanationTexts.${fieldName}`, {
          animalType: translatedAnimalType,
          returnObjects: true
        })
      },
      kickingAtAbdomen: {
        image: isHorse ? kickingAtAbdomenImage : donkeyKickingAtAbdomenImage,
        title: t(`painMeasurement.full.timer.${fieldName}`, { animalType }),
        content: t(`painMeasurement.explanationTexts.${fieldName}`, {
          animalType: translatedAnimalType,
          returnObjects: true
        })
      },
      painSounds: {
        image: isHorse ? ppid : donkeyTeethGrinding,
        title: t(`painMeasurement.full.timer.${fieldName}`, { animalType }),
        content: t(`painMeasurement.explanationTexts.${fieldName}`, {
          animalType: translatedAnimalType,
          returnObjects: true
        })
      },
      flehming: {
        image: isHorse ? flehmingImage : donkeyFlehmingImage,
        title: t(`painMeasurement.head.timer.${fieldName}`, { animalType }),
        content: t(`painMeasurement.explanationTexts.${fieldName}`, {
          animalType: translatedAnimalType,
          returnObjects: true
        })
      },
      yawning: {
        image: isHorse ? yawningImage : donkeyYawningImage,
        title: t(`painMeasurement.head.timer.${fieldName}`, { animalType }),
        content: t(`painMeasurement.explanationTexts.${fieldName}`, {
          animalType: translatedAnimalType,
          returnObjects: true
        })
      },
      teethGrinding: {
        image: isHorse ? ppid : donkeyTeethGrinding,
        title: t(`painMeasurement.head.timer.${fieldName}`, { animalType }),
        content: t(`painMeasurement.explanationTexts.${fieldName}`, {
          animalType: translatedAnimalType,
          returnObjects: true
        })
      },
      moaning: {
        image: isHorse ? ppid : donkeyTeethGrinding,
        title: t(`painMeasurement.head.timer.${fieldName}`, { animalType }),
        content: t(`painMeasurement.explanationTexts.${fieldName}`, {
          animalType: translatedAnimalType,
          returnObjects: true
        })
      },
      headShaking: {
        image: donkeyHeadShakingImage,
        title: t(`painMeasurement.head.timer.${fieldName}`, { animalType }),
        content: t(`painMeasurement.explanationTexts.${fieldName}`, {
          animalType: translatedAnimalType,
          returnObjects: true
        })
      },
      smacking: {
        image: donkeySmackingImage,
        title: t(`painMeasurement.head.timer.${fieldName}`, { animalType }),
        content: t(`painMeasurement.explanationTexts.${fieldName}`, {
          animalType: translatedAnimalType,
          returnObjects: true
        })
      }
    };

    return content[fieldName];
  };

  render() {
    const { t } = this.props.screenProps;
    const fieldName = this.props.navigation.getParam("fieldName");
    const content = this.getContentObject(fieldName);

    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1
          }}
        >
          {content.image && (
            <Image
              source={content.image}
              resizeMode="cover"
              style={{
                height: 200,
                width: "100%",
                backgroundColor: colors.mediumPurple,
                paddingBottom: 10
              }}
            />
          )}
          <View style={{ padding: 20 }}>
            <Text style={{ ...fonts.style.h4, marginBottom: 30 }}>
              {content.title}
            </Text>
            {content.content.map((text) => (
              <Text
                key={text}
                style={{ ...fonts.style.normal, marginBottom: 10 }}
              >
                {text}
              </Text>
            ))}
          </View>
          {this.renderAudioSection(fieldName)}
        </ScrollView>
      </View>
    );
  }
}

export default PainMeasurementTimerInfo;
