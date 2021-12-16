import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import { colors } from "../themes";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome";

const CATEGORIES = [
  "painMeasurement",
  "chronicPainMeasurement",
];

const MeasurementCategorySlider = ({
  selectedCategory,
  handleCategoryTypeChange,
}) => {
  const { width } = Dimensions.get("window");
  const existingIndex = CATEGORIES.findIndex(
    (item) => item === selectedCategory
  );
  const [currentIndex, setCurrentIndex] = useState(existingIndex);

  useEffect(() => {
    const existingIndex = CATEGORIES.findIndex(
      (item) => item === selectedCategory
    );
    if (currentIndex != existingIndex) {
      setCurrentIndex(existingIndex);
    }
  }, [selectedCategory]);

  const handleChange = useCallback(
    (key) => {
      let newIndex = 0;
      if (currentIndex === 0) {
        newIndex = 1;
      } else {
        newIndex = 0;
      }
      setCurrentIndex(newIndex);
      handleCategoryTypeChange(CATEGORIES[newIndex]);
    },
    [currentIndex]
  );

  const getCategoryNameBySlug = useCallback(() => {
    const { t } = this.props;
    let categoryName = "";
    if (selectedCategory == "painMeasurement") {
      categoryName = t("categoryAcutePainMeasurement");
    } else if (selectedCategory == "chronicPainMeasurement") {
      categoryName = t("categoryChronicPainMeasurement");
    }
    return categoryName;
  }, [selectedCategory]);
  return (
    <View style={{ width, marginTop: 25, marginBottom: 10 }}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => handleChange("prev")}>
          <FontAwesomeIcons
            name={"chevron-left"}
            size={25}
            color={colors.black}
          />
        </TouchableOpacity>
        <Text
          style={{
            width: 220,
            fontWeight: "bold",
            fontSize: 16,
            marginHorizontal: 20,
            textAlign: "center",
          }}
        >
          {getCategoryNameBySlug()}
        </Text>
        <TouchableOpacity onPress={() => handleChange("next")}>
          <FontAwesomeIcons
            name={"chevron-right"}
            size={25}
            color={colors.black}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MeasurementCategorySlider;
