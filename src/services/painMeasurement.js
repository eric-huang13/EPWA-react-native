import {
  always,
  any,
  assoc,
  compose,
  cond,
  equals,
  ifElse,
  isNil,
  lt,
  map,
  mapObjIndexed,
  multiply,
  pick,
  prop,
  propEq,
  props,
  sum,
  T,
  values,
  when
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

  if (measurement.data.animalType === "donkey") {
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
  "painSoundCount"
];

export const timerFieldsForFacialExpressionMeasurement = [
  "flehmingCount",
  "yawningCount",
  "teethGrindingCount",
  "moaningCount"
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

export const selectObservationScores = (formData) =>
  ifElse(
    isCompositeMeasurement,
    props(["behaviourPostureScore", "sweatingScore"]),
    props([
      "headScore",
      "eyelidScore",
      "focusScore",
      "nostrilScore",
      "cornerMouthScore",
      "muscleToneHeadScore",
      "earScore"
    ])
  )(formData);

const selectTimerFields = (formData) =>
  ifElse(
    isCompositeMeasurement,
    props(timerFieldsForCompositeMeasurement),
    props(timerFieldsForFacialExpressionMeasurement)
  )(formData);

const selectInteractionScores = (formData) =>
  props(["reactionToPalpationScore", "overallAppearanceScore"])(formData);

const selectVetScores = (formData) =>
  props([
    "respiratoryRateScore",
    "heartRateScore",
    "digestiveSoundsScore",
    "rectalTemperatureScore"
  ])(formData);

const projectRollCountIntoScore = (count) =>
  cond([
    [equals(0), always(0)],
    [equals(1), always(1)],
    [equals(2), always(1)],
    [T, always(2)]
  ])(count);

const projectTimerCountIntoScore = (count) =>
  cond([
    [equals(0), always(0)],
    [equals(1), always(1)],
    [equals(2), always(1)],
    [equals(3), always(2)],
    [equals(4), always(2)],
    [T, always(3)]
  ])(count);

const calculateCompositeMeasurementScore = (formData) => {
  let timerScores = compose(
    sum,
    map(projectTimerCountIntoScore),
    selectTimerFields,
    // Without mutating incoming data, change to 0, the score for it will be added further into the function
    assoc("headMovementCount", 0),
    assoc("tailFlickCount", 0),
    // Roll Count score will be calculated later, taking into the account "lying continuously in unnatural position"
    // Without mutating incoming data, change to 0, the score for it will be added further into the function
    assoc("rollCount", 0)
  )(formData);

  timerScores = formData.isLyingInUnnaturalPosition
    ? timerScores + 3
    : timerScores + projectRollCountIntoScore(formData.rollCount);

  timerScores = formData.isVet
    ? timerScores + projectTimerCountIntoScore(formData.headMovementCount)
    : // When user is not a vet, head movements should have factor of 0
      timerScores;

  timerScores = formData.isVet
    ? timerScores + projectTimerCountIntoScore(formData.tailFlickCount)
    : // When user is not a vet, head movements should have factor of 0
      timerScores;

  let observationScores;

  if (formData.isVet) {
    observationScores = compose(
      sum,
      selectObservationScores
    )(formData);
  } else if (isCompositeMeasurement(formData)) {
    observationScores = compose(
      multiply(2),
      sum,
      selectObservationScores
    )(formData);
  } else {
    observationScores = compose(
      sum,
      selectObservationScores
    )(formData);
  }

  let vetScores;

  if (formData.isVet) {
    vetScores = compose(
      sum,
      selectVetScores
    )(formData);
  }

  let interactionScores;

  if (isCompositeMeasurement(formData)) {
    if (formData.isVet) {
      interactionScores = compose(
        sum,
        selectInteractionScores
      )(formData);
    } else {
      interactionScores = compose(
        multiply(2),
        sum,
        selectInteractionScores
      )(formData);
    }
  }

  const payload = map(when(isNil, always(0)))([
    timerScores,
    observationScores,
    vetScores,
    interactionScores
  ]);

  return sum(payload);
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

  const scoreStep02 = [0, 2];
  const scoreStep022 = [0, 2, 2];
  const scoreStep012 = [0, 1, 2];
  const fields = [
    {
      scoreSteps: scoreStep022,
      selectedAnswerIndex: formData.headScore
    },
    {
      scoreSteps: scoreStep012,
      selectedAnswerIndex: formData.eyelidsScore
    },
    {
      scoreSteps: scoreStep012,
      selectedAnswerIndex: formData.focusScore
    },
    {
      scoreSteps: scoreStep012,
      selectedAnswerIndex: formData.nostrilsScore
    },
    {
      scoreSteps: scoreStep02,
      selectedAnswerIndex: formData.mouthCornersScore
    },
    {
      scoreSteps: scoreStep012,
      selectedAnswerIndex: formData.muscleToneHeadScore
    },
    {
      scoreSteps: scoreStep02,
      selectedAnswerIndex: formData.sweatingBehindTheEarsScore
    },
    {
      scoreSteps: scoreStep022,
      selectedAnswerIndex: formData.earPositionScore
    },
    {
      scoreSteps: scoreStep012,
      selectedAnswerIndex: formData.responseToAuditoryStimulusScore
    }
  ];

  const observationScores = compose(
    sum,
    map((field) => field.scoreSteps[field.selectedAnswerIndex])
  )(fields);

  return sum([timerScores, observationScores]);
};

const calculateDonkeyCompositeMeasurementScore = (formData) => {
  let timerScores = 0;

  const oneOfTwoCalculation = (countA, countB) => {
    if (isGreaterThanTwo(countB)) return 3;
    if (isGreaterThanZero(countB)) return 2;
    if (isGreaterThanZero(countA)) return 1;
    return 0;
  };

  timerScores += oneOfTwoCalculation(
    formData.lookAtAbdomenCount,
    formData.kickAtAbdomenCount
  );
  timerScores += oneOfTwoCalculation(
    formData.pointingTowardsTheFloorCount,
    formData.pawCount
  );
  timerScores += projectTimerCountIntoScore(formData.tailFlickCount);
  timerScores += projectTimerCountIntoScore(formData.painSoundCount);

  const scoreStep0123 = [0, 1, 2, 3];
  const scoreStep03 = [0, 3];
  const scoreStep023 = [0, 2, 3];

  const standardFields = [
    "layingDownRollingScore",
    "overallAppearanceScore",
    "earPositionScore",
    "postureScore",
    "weightDistributionScore",
    "headCarriageScore",
    "eatingScore",
    "sweatingScore",
    "changesInBehaviourScore",
    "reactionToObserverScore",
    "reactionToPalpationScore",
    "movementScore"
  ];

  const vetFields = [
    ...standardFields,
    "respiratoryRateScore",
    "heartRateScore",
    "digestiveSoundsScore",
    "rectalTemperatureScore"
  ];

  const fieldScoreSteps = {
    layingDownRollingScore: scoreStep0123,
    overallAppearanceScore: scoreStep0123,
    earPositionScore: scoreStep03,
    postureScore: scoreStep0123,
    weightDistributionScore: scoreStep03,
    headCarriageScore: scoreStep023,
    eatingScore: scoreStep023,
    sweatingScore: scoreStep0123,
    changesInBehaviourScore: scoreStep03,
    reactionToObserverScore: scoreStep023,
    reactionToPalpationScore: scoreStep023,
    movementScore: scoreStep0123,
    respiratoryRateScore: scoreStep0123,
    heartRateScore: scoreStep0123,
    digestiveSoundsScore: scoreStep0123,
    rectalTemperatureScore: scoreStep0123
  };

  const answerMap = ifElse(
    () => formData.isVet,
    pick(vetFields),
    pick(standardFields)
  )(formData);

  const questionScores = compose(
    sum,
    values,
    mapObjIndexed((val, key) => fieldScoreSteps[key][val])
  )(answerMap);

  return sum([timerScores, questionScores]);
};

// eslint-disable-next-line import/prefer-default-export
export const calculateScore = (formData) => {
  if (formData.animalType === "donkey") {
    return ifElse(
      isCompositeMeasurement,
      calculateDonkeyCompositeMeasurementScore,
      calculateDonkeyFacialExpressionMeasurementScore
    )(formData);
  }

  return ifElse(
    isCompositeMeasurement,
    calculateCompositeMeasurementScore,
    calculateFacialExpressionMeasurementScore
  )(formData);
};
