import { format } from "date-fns";
import nlLocale from "date-fns/locale/nl";
import deLocale from "date-fns/locale/de";
import frLocale from "date-fns/locale/fr";
import enLocale from "date-fns/locale/en";
import esLocale from "date-fns/locale/es";

export const getStartDateText = (date, lang) => {
  let locale = enLocale;
  switch (lang) {
    case "nl":
      locale = nlLocale;
      break;
    case "de":
      locale = deLocale;
      break;
    case "fr":
      locale = frLocale;
      break;
    case "es":
      locale = esLocale;
      break;
    default:
      locale = enLocale;
  }
  return format(date, "dddd DD MMMM", { locale });
};
