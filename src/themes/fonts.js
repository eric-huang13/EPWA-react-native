const type = {
  base: {
    bold: "Ubuntu-Bold",
    medium: "Ubuntu-Medium",
    regular: "Ubuntu-Regular",
    light: "Ubuntu-Light",
    lightItalic: "Ubuntu-LightItalic"
  },
  emphasis: {
    bold: "SourceSerifPro-Bold",
    semibold: "SourceSerifPro-Semibold",
    regular: "SourceSerifPro-Regular"
  }
};

const size = {
  h1: 36,
  h2: 32,
  h3: 28,
  h4: 22,
  h5: 18,
  h6: 16,
  large: 20,
  input: 18,
  regular: 17,
  medium: 14,
  small: 11,
  tiny: 8.5
};

const style = {
  h1: {
    fontFamily: type.emphasis.regular,
    fontSize: size.h1
  },
  h2: {
    fontFamily: type.emphasis.regular,
    fontSize: size.h2
  },
  h3: {
    fontFamily: type.emphasis.regular,
    fontSize: size.h3
  },
  h4: {
    fontFamily: type.emphasis.regular,
    fontSize: size.h4
  },
  h5: {
    fontFamily: type.emphasis.regular,
    fontSize: size.h5
  },
  h6: {
    fontFamily: type.emphasis.regular,
    fontSize: size.h6
  },
  bold: {
    fontFamily: type.base.regular,
    fontSize: size.medium
  },
  normal: {
    fontFamily: type.base.light,
    fontSize: size.medium
  },
  italic: {
    fontFamily: type.base.lightItalic,
    fontSize: size.medium,
    fontStyle: "italic"
  },
  cta: {
    fontFamily: type.base.medium,
    fontSize: size.medium
  },
  label: {
    fontFamily: type.base.regular,
    fontSize: size.small
  },
  dateFont: {
    fontFamily: type.emphasis.semibold,
    fontSize: size.large,
    fontWeight: "600"
  },
  titleFont: {
    fontFamily: type.emphasis.semibold,
    fontSize: size.large
  },
  altTitle: {
    fontFamily: type.emphasis.regular,
    fontSize: size.large
  }
};

export default {
  type,
  size,
  style
};
