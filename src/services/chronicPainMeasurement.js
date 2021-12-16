import {
  always,
  any,
  compose,
  cond,
  equals,
  ifElse,
  lt,
  map,
  prop,
  propEq,
  props,
  sum,
  T,
} from "ramda";

export const getMaximalScore = (measurement) => {
  if (measurement.data.animalType === "horse") {
    if (measurement.type === "composite") {
      return 52;
    }

    if (measurement.type === "facialExpression") {
      return 22;
    }
  }

  if (
    measurement.data.animalType === "donkey" ||
    measurement.data.animalType === "mule"
  ) {
    if (measurement.type === "composite") {
      return 60;
    }

    if (measurement.type === "facialExpression") {
      return 30;
    }
  }
};

export const timerFieldsForCompositeMeasurement = [
  "rollCount",
  "tailFlickCount",
  "kickAtAbdomenCount",
  "pawCount",
  "headMovementCount",
  "painSoundCount",
];

export const timerFieldsForFacialExpressionMeasurement = [
  "flehmingCount",
  "yawningCount",
  "teethGrindingCount",
  "moaningCount",
];

export const isCompositeMeasurement = propEq("measurementType", "composite");
export const isGreaterThanZero = lt(0);
export const isGreaterThanOne = lt(1);
export const isGreaterThanTwo = lt(2);

export const formatCountdown = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  const leadingZeroMinutes = minutes < 10 ? "0" : "";
  const leadingZeroSeconds = seconds < 10 ? "0" : "";

  return `${leadingZeroMinutes}${minutes}:${leadingZeroSeconds}${seconds}`;
};

export const selectObservationScores = (formData) => {
  let data = props(
    [
      "headScore",
      "eyelidScore",
      "focusScore",
      "nostrilScore",
      "chronicMouthCornersScore",
      "earScore",
      "generalAppearanceScore",
      "bodyPostureScore",
      "weightDistributionScore",
      "weightShiftingOfFrontAndHindLimbsScore",
      "headCarriageScore",
      "musclesScore",
      "painReactionToPalpationOfTheBackScore",
      "painReactionToStandardizedFlexionOfFrontAndHindLimbsScore",
      "carrotappleTestScore",
      "movementScore",
    ],
    formData
  );
  if (data[14] == 1) {
    data[14] = 2;
  } else if (data[14] == 2) {
    data[14] = 3;
  }
  return data;
};

const calculateFacialExpressionMeasurementScore = (formData) => {
  let timerScores = 0;

  if (
    any(isGreaterThanZero, props(["yawningCount", "flehmingCount"], formData))
  ) {
    timerScores += 2;
  }

  if (
    any(
      isGreaterThanZero,
      props(["moaningCount", "teethGrindingCount"], formData)
    )
  ) {
    timerScores += 2;
  }

  const observationScores = compose(
    sum,
    selectObservationScores
  )(formData);

  const result = sum([timerScores, observationScores]);

  return result;
};

const calculateDonkeyFacialExpressionMeasurementScore = (formData) => {
  let timerScores = 0;

  if (
    any(
      isGreaterThanZero,
      props(["yawningCount", "flehmingCount", "smackingCount"], formData)
    )
  ) {
    timerScores += 2;
  }

  if (
    any(
      isGreaterThanZero,
      props(["teethGrindingCount", "moaningCount"], formData)
    )
  ) {
    timerScores += 2;
  }

  if (isGreaterThanZero(prop("headShakingCount", formData))) {
    timerScores += 2;
  }

  const scoreStep022 = [0, 2, 2];
  const scoreStep012 = [0, 1, 2];
  const scoreStep023 = [0, 2, 3];
  const scoreStep0123 = [0, 1, 2, 3];
  const fields = [
    {
      scoreSteps: scoreStep022,
      selectedAnswerIndex: formData.headScore,
    },
    {
      scoreSteps: scoreStep012,
      selectedAnswerIndex: formData.eyelidsScore,
    },
    {
      scoreSteps: scoreStep012,
      selectedAnswerIndex: formData.focusScore,
    },
    {
      scoreSteps: scoreStep012,
      selectedAnswerIndex: formData.nostrilsScore,
    },
    {
      scoreSteps: scoreStep012,
      selectedAnswerIndex: formData.chronicMouthCornersScore,
    },
    {
      scoreSteps: scoreStep0123,
      selectedAnswerIndex: formData.generalAppearanceScore,
    },
    {
      scoreSteps: scoreStep0123,
      selectedAnswerIndex: formData.bodyPostureScore,
    },
    {
      scoreSteps: scoreStep0123,
      selectedAnswerIndex: formData.weightDistributionScore,
    },

    {
      scoreSteps: scoreStep0123,
      selectedAnswerIndex: formData.weightShiftingOfFrontAndHindLimbsScore,
    },
    {
      scoreSteps: scoreStep0123,
      selectedAnswerIndex: formData.headCarriageScore,
    },
    {
      scoreSteps: scoreStep0123,
      selectedAnswerIndex: formData.musclesScore,
    },

    {
      scoreSteps: scoreStep0123,
      selectedAnswerIndex: formData.painReactionToPalpationOfTheBackScore,
    },
    {
      scoreSteps: scoreStep0123,
      selectedAnswerIndex:
        formData.painReactionToStandardizedFlexionOfFrontAndHindLimbsScore,
    },
    {
      scoreSteps: scoreStep023,
      selectedAnswerIndex: formData.carrotappleTestScore,
    },
    {
      scoreSteps: scoreStep0123,
      selectedAnswerIndex: formData.movementScore,
    },
    {
      scoreSteps: scoreStep012,
      selectedAnswerIndex: formData.responseToAuditoryStimulusScore,
    },
  ];

  const observationScores = compose(
    sum,
    map((field) => field.scoreSteps[field.selectedAnswerIndex])
  )(fields);

  return sum([timerScores, observationScores]);
};

// eslint-disable-next-line import/prefer-default-export
export const calculateScore = (formData) => {
  if (formData.animalType === "donkey" || formData.animalType === "mule") {
    return calculateDonkeyFacialExpressionMeasurementScore(formData);
  }

  return calculateFacialExpressionMeasurementScore(formData);
};
