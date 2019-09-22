import React from "react";
import T from "prop-types";
import { Image, Text, View, TouchableOpacity } from "react-native";

import s from "./styles/AnimalListItemStyles";

import Icon from "./Icon";

import iconMap from "../constants/iconMap";
import { colors } from "../themes";

const AnimalListItem = ({ animal, authToken, onPress }) => {
  const placeholderIconName =
    animal.type === "horse" ? iconMap.horse3 : "donkey";
  const hasPicture = Boolean(animal.pictureUrl);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={s.container}>
        <View style={[s.photoContainer, s.placeholderContainer]}>
          {hasPicture ? (
            <Image
              source={{
                uri: animal.pictureUrl,
                headers: { Authorization: `Bearer ${authToken}` }
              }}
              style={s.photoSize}
            />
          ) : (
            <Icon size={30} name={placeholderIconName} color={colors.white} />
          )}
        </View>
        <Text style={s.text} numberOfLines={1}>
          {animal.name}
        </Text>
        <Icon
          name={iconMap.arrowRight}
          size={20}
          color={colors.nero}
          style={s.icon}
        />
      </View>
    </TouchableOpacity>
  );
};

AnimalListItem.propTypes = {
  authToken: T.string,
  animal: T.shape({
    pictureUrl: T.string,
    name: T.string
  }),
  onPress: T.func
};

export default AnimalListItem;
