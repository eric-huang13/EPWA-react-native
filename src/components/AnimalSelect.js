import React from "react";
import T from "prop-types";
import { View, Text } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { onlyUpdateForKeys } from "recompose";
import { map } from "ramda";

import Icon from "./Icon";
import TitleBar from "./TitleBar";

import iconMap from "../constants/iconMap";
import { colors, fonts } from "../themes";

const AnimalSelect = ({ animals, selectedAnimalId, t, setFieldValue }) => {
  const animalSelectItems = map((animal) => ({
    label: animal.name,
    value: animal.id
  }))(animals);
  const getAnimalById = (id) => animals.find((animal) => animal.id === id);
  const selectedAnimal = getAnimalById(selectedAnimalId);
  const selectedAnimalName = selectedAnimal ? selectedAnimal.name : undefined;

  return (
    <View style={{ paddingHorizontal: 5 }}>
      <TitleBar>{t("painMeasurement.misc.animalTypeQuestion")}</TitleBar>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly"
        }}
      >
        <RNPickerSelect
          placeholder={{}}
          style={{
            viewContainer: { flex: 1, minHeight: 46, maxWidth: "80%" },
            inputIOSContainer: { flex: 1, minHeight: 46 },
            headlessAndroidContainer: {
              flex: 1,
              minHeight: 46,
              maxWidth: "80%"
            }
          }}
          onValueChange={(animalId) => {
            const { type } = getAnimalById(animalId);
            setFieldValue("animalType", type);
            setFieldValue("animalId", animalId);
          }}
          items={animalSelectItems}
          doneText={t("selectDone")}
        >
          <View
            style={{
              flex: 1,
              minHeight: 46,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
              borderRadius: 28,
              backgroundColor: colors.white
            }}
          >
            <Text
              style={{
                flex: 1,
                ...fonts.style.medium,
                color: selectedAnimalId ? colors.nero : colors.grey
              }}
            >
              {selectedAnimalName || "Select an animal"}
            </Text>
            <Icon name={iconMap.dropdown} size={20} color={colors.nero} />
          </View>
        </RNPickerSelect>
      </View>
    </View>
  );
};

AnimalSelect.propTypes = {
  animals: T.arrayOf(
    T.shape({
      name: T.string,
      id: T.number
    })
  ),
  selectedAnimalId: T.number,
  t: T.func,
  setFieldValue: T.func
};

export default onlyUpdateForKeys([
  "animals",
  "selectedAnimalId",
  "t",
  "setFieldValue"
])(AnimalSelect);
