export const getObservationFields = (isDonkey, t, path) => {
  const horseEarPhoto0 = "earScore0";
  const horseEarPhoto1 = "earScore1";
  const horseEarPhoto2 = "PAARD-gezichtsuitdrukking-oren-reactie-geluid-2";

  const horseNostrilPhoto0 = "nostrilScore0";
  const horseNostrilPhoto1 = "nostrilScore1";
  const horseNostrilPhoto2 = "nostrilScore2";

  const horseCornerMouthPhoto0 = "cornerMouthScore0";
  const horseCornerMouthPhoto1 = "cornerMouthScore1";
  const horseCornerMouthPhoto2 = "cornerMouthScore2";

  const horseEyelidPhoto0 = "eyelidScore0";
  const horseEyelidPhoto1 = "eyelidScore1";
  const horseEyelidPhoto2 = "eyelidScore2";

  const horseFocusPhoto0 = "focusScore0";
  const horseFocusPhoto1 = "focusScore1";
  const horseFocusPhoto2 = "focusScore2";

  const horseHeadPhoto0 = "PAARD-gezichtsuitdrukking-beweging-hoofd-0";
  const horseHeadPhoto1 = "PAARD-gezichtsuitdrukking-beweging-hoofd-1";
  const horseHeadPhoto2 = "PAARD-gezichtsuitdrukking-beweging-hoofd-2";

  const donkeyEyelidsPhoto0 = "eyelids0";
  const donkeyEyelidsPhoto1 = "eyelids1";
  const donkeyEyelidsPhoto2 = "eyelids2";

  const donkeyFocusPhoto0 = "focus0";
  const donkeyFocusPhoto1 = "focus1";
  const donkeyFocusPhoto2 = "focus2";

  const donkeyHeadPhoto0 = "head0";
  const donkeyHeadPhoto1 = "head2a";
  const donkeyHeadPhoto2 = "head2b";

  const donkeyMouthCornersPhoto0 = "mouthCorners0";
  const donkeyMouthCornersPhoto1 = "mouthCorners2";

  const donkeyNostrilsPhoto0 = "nostrils0";
  const donkeyNostrilsPhoto1 = "nostrils1";
  const donkeyNostrilsPhoto2 = "nostrils2";

  const donkeySoundResponsePhoto0 = "responseToAuditoryStimulus0";
  const donkeySoundResponsePhoto1 = "responseToAuditoryStimulus1";
  const donkeySoundResponsePhoto2 = "responseToAuditoryStimulus2";

  if (isDonkey) {
    return [
      {
        name: "focusScore",
        title: t(`${path}.focus`),
        labels: t(`${path}.focusOptions`, {
          returnObjects: true,
        }),
        photos: [donkeyFocusPhoto0, donkeyFocusPhoto1, donkeyFocusPhoto2],
      },
      {
        name: "headScore",
        title: t(`${path}.head`),
        labels: t(`${path}.headOptions`, {
          returnObjects: true,
        }),
        photos: [donkeyHeadPhoto0, donkeyHeadPhoto1, donkeyHeadPhoto2],
      },
      {
        name: "eyelidsScore",
        title: t(`${path}.eyelids`),
        labels: t(`${path}.eyelidsOptions`, {
          returnObjects: true,
        }),
        photos: [donkeyEyelidsPhoto0, donkeyEyelidsPhoto1, donkeyEyelidsPhoto2],
      },

      {
        name: "nostrilsScore",
        title: t(`${path}.nostrils`),
        labels: t(`${path}.nostrilsOptions`, {
          returnObjects: true,
        }),
        photos: [
          donkeyNostrilsPhoto0,
          donkeyNostrilsPhoto1,
          donkeyNostrilsPhoto2,
        ],
      },
      {
        name: "chronicMouthCornersScore",
        title: t(`${path}.chronicMouthCorners`),
        labels: t(`${path}.chronicMouthCornersOptions`, {
          returnObjects: true,
        }),
        photos: [
          donkeyMouthCornersPhoto0,
          donkeyMouthCornersPhoto1,
          donkeyMouthCornersPhoto1,
        ],
      },
      {
        name: "responseToAuditoryStimulusScore",
        title: t(`${path}.responseToAuditoryStimulus`),
        labels: t(`${path}.responseToAuditoryStimulusOptions`, {
          returnObjects: true,
        }),
        photos: [
          donkeySoundResponsePhoto0,
          donkeySoundResponsePhoto1,
          donkeySoundResponsePhoto2,
        ],
      },
      {
        name: "generalAppearanceScore",
        title: t(`${path}.generalAppearance`),
        labels: t(`${path}.generalAppearanceOptions`, {
          returnObjects: true,
        }),
        photos: [],
        showDivision: true,
      },
      {
        name: "bodyPostureScore",
        title: t(`${path}.bodyPosture`),
        labels: t(`${path}.bodyPostureOptions`, {
          returnObjects: true,
        }),
        photos: [],
      },
      {
        name: "weightDistributionScore",
        title: t(`${path}.weightDistribution`),
        labels: t(`${path}.weightDistributionOptions`, {
          returnObjects: true,
        }),
        photos: [],
      },
      {
        name: "weightShiftingOfFrontAndHindLimbsScore",
        title: t(`${path}.weightShiftingOfFrontAndHindLimbs`),
        labels: t(`${path}.weightShiftingOfFrontAndHindLimbsOptions`, {
          returnObjects: true,
        }),
        photos: [],
      },
      {
        name: "headCarriageScore",
        title: t(`${path}.headCarriage`),
        labels: t(`${path}.headCarriageOptions`, {
          returnObjects: true,
        }),
        photos: [],
      },
      {
        name: "musclesScore",
        title: t(`${path}.muscles`),
        labels: t(`${path}.musclesOptions`, {
          returnObjects: true,
        }),
        photos: [],
      },
      {
        name: "painReactionToPalpationOfTheBackScore",
        title: t(`${path}.painReactionToPalpationOfTheBack`),
        labels: t(`${path}.painReactionToPalpationOfTheBackOptions`, {
          returnObjects: true,
        }),
        photos: [],
      },
      {
        name: "painReactionToStandardizedFlexionOfFrontAndHindLimbsScore",
        title: t(
          `${path}.painReactionToStandardizedFlexionOfFrontAndHindLimbs`
        ),
        labels: t(
          `${path}.painReactionToStandardizedFlexionOfFrontAndHindLimbsOptions`,
          {
            returnObjects: true,
          }
        ),
        photos: [],
      },
      {
        name: "carrotappleTestScore",
        title: t(`${path}.carrotappleTest`),
        labels: t(`${path}.carrotappleTestOptions`, {
          returnObjects: true,
        }),
        photos: [],
      },
      {
        name: "movementScore",
        title: t(`${path}.movement`),
        labels: t(`${path}.movementOptions`, {
          returnObjects: true,
        }),
        photos: [],
      },
    ];
  } else {
    return [
      {
        name: "focusScore",
        title: t(`${path}.focus`),
        labels: t(`${path}.focusOptions`, {
          returnObjects: true,
        }),
        photos: [horseFocusPhoto0, horseFocusPhoto1, horseFocusPhoto2],
      },
      {
        name: "headScore",
        title: t(`${path}.head`),
        labels: t(`${path}.headOptions`, {
          returnObjects: true,
        }),
        photos: [horseHeadPhoto0, horseHeadPhoto1, horseHeadPhoto2],
      },
      {
        name: "eyelidScore",
        title: t(`${path}.eyelids`),
        labels: t(`${path}.eyelidsOptions`, {
          returnObjects: true,
        }),
        photos: [horseEyelidPhoto0, horseEyelidPhoto1, horseEyelidPhoto2],
      },
      {
        name: "nostrilScore",
        title: t(`${path}.nostrils`),
        labels: t(`${path}.nostrilsOptions`, {
          returnObjects: true,
        }),
        photos: [horseNostrilPhoto0, horseNostrilPhoto1, horseNostrilPhoto2],
      },
      {
        name: "chronicMouthCornersScore",
        title: t(`${path}.chronicMouthCorners`),
        labels: t(`${path}.chronicMouthCornersOptions`, {
          returnObjects: true,
        }),
        photos: [
          horseCornerMouthPhoto0,
          horseCornerMouthPhoto1,
          horseCornerMouthPhoto2,
        ],
      },
      {
        name: "earScore",
        title: t(`${path}.ears`),
        labels: t(`${path}.earsOptions`, {
          returnObjects: true,
        }),
        photos: [horseEarPhoto0, horseEarPhoto1, horseEarPhoto2],
      },
      {
        name: "generalAppearanceScore",
        title: t(`${path}.generalAppearance`),
        labels: t(`${path}.generalAppearanceOptions`, {
          returnObjects: true,
        }),
        photos: [],
        showDivision: true,
      },
      {
        name: "bodyPostureScore",
        title: t(`${path}.bodyPosture`),
        labels: t(`${path}.bodyPostureOptions`, {
          returnObjects: true,
        }),
        photos: [],
      },
      {
        name: "weightDistributionScore",
        title: t(`${path}.weightDistribution`),
        labels: t(`${path}.weightDistributionOptions`, {
          returnObjects: true,
        }),
        photos: [],
      },
      {
        name: "weightShiftingOfFrontAndHindLimbsScore",
        title: t(`${path}.weightShiftingOfFrontAndHindLimbs`),
        labels: t(`${path}.weightShiftingOfFrontAndHindLimbsOptions`, {
          returnObjects: true,
        }),
        photos: [],
      },
      {
        name: "headCarriageScore",
        title: t(`${path}.headCarriage`),
        labels: t(`${path}.headCarriageOptions`, {
          returnObjects: true,
        }),
        photos: [],
      },
      {
        name: "musclesScore",
        title: t(`${path}.muscles`),
        labels: t(`${path}.musclesOptions`, {
          returnObjects: true,
        }),
        photos: [],
      },
      {
        name: "painReactionToPalpationOfTheBackScore",
        title: t(`${path}.painReactionToPalpationOfTheBack`),
        labels: t(`${path}.painReactionToPalpationOfTheBackOptions`, {
          returnObjects: true,
        }),
        photos: [],
      },
      {
        name: "painReactionToStandardizedFlexionOfFrontAndHindLimbsScore",
        title: t(
          `${path}.painReactionToStandardizedFlexionOfFrontAndHindLimbs`
        ),
        labels: t(
          `${path}.painReactionToStandardizedFlexionOfFrontAndHindLimbsOptions`,
          {
            returnObjects: true,
          }
        ),
        photos: [],
      },
      {
        name: "carrotappleTestScore",
        title: t(`${path}.carrotappleTest`),
        labels: t(`${path}.carrotappleTestOptions`, {
          returnObjects: true,
        }),
        photos: [],
      },
      {
        name: "movementScore",
        title: t(`${path}.movement`),
        labels: t(`${path}.movementOptions`, {
          returnObjects: true,
        }),
        photos: [],
      },
    ];
  }
};
