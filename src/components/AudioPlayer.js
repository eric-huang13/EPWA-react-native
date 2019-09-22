import React, { Component } from "react";
import { Text, View } from "react-native";
import Sound from "react-native-sound";

import CircleButton from "../components/CircleButton";
import Icon from "../components/Icon";

import { colors, fonts } from "../themes";

import iconMap from "../constants/iconMap";

const PlayButton = ({ onPress }) => (
  <CircleButton onPress={onPress}>
    <View style={{ marginLeft: 5 }}>
      <Icon name={iconMap.play} size={30} color={colors.white} />
    </View>
  </CircleButton>
);

const PauseButton = ({ onPress }) => (
  <CircleButton onPress={onPress}>
    <Icon name={iconMap.pause} size={30} color={colors.white} />
  </CircleButton>
);

class AudioPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      audio: null,
      playing: false
    };

    this.loadAudio(props.fieldName);
    Sound.setCategory("Playback");
  }

  componentWillUnmount() {
    if (this.state.audio) {
      this.state.audio.pause();
    }
  }

  loadAudio = async (fieldName) => {
    const paths = {
      teethGrinding: "teeth_grinding.mp3",
      moaning: "moaning.mp3"
    };

    try {
      const soundObject = new Sound(
        paths[fieldName],
        Sound.MAIN_BUNDLE,
        (error) => {
          if (error) return;

          this.setState({ audio: soundObject });
        }
      );
    } catch (error) {}
  };

  startPlaying = async () => {
    this.state.audio.play((success) => {
      if (success) this.state.audio.setCurrentTime(0);
      this.setState({ playing: false });
    });
    this.setState({ playing: true });
  };

  pausePlaying = async () => {
    this.state.audio.pause();
    this.setState({ playing: false });
  };

  getDuration = () => {
    if (this.props.fieldName === "teethGrinding") {
      return "00:10";
    }

    if (this.props.fieldName === "moaning") {
      return "00:12";
    }

    return "00:00";
  };

  render() {
    const { fieldName, t } = this.props;

    return (
      <View
        style={{
          minHeight: 90,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20
        }}
      >
        <View style={{ marginRight: 20, justifyContent: "center" }}>
          {this.state.playing ? (
            <PauseButton onPress={() => this.pausePlaying()} />
          ) : (
            <PlayButton onPress={() => this.startPlaying()} />
          )}
        </View>
        <View style={{ justifyContent: "center" }}>
          <Text style={{ ...fonts.style.cta, paddingBottom: 5 }}>
            {t(`painMeasurement.head.timer.${fieldName}`)}
          </Text>
          <Text style={{ ...fonts.style.label }}>{this.getDuration()}</Text>
        </View>
      </View>
    );
  }
}

export default AudioPlayer;
