import { colors } from "../themes";
import { apiBasePath } from "../../env.json";
import iconMap from "./iconMap";

export const basePath = apiBasePath;
export const apiPath = `${apiBasePath}/api`;
export const assetPath = `${apiBasePath}`;
export const csvUploadPath = `${apiBasePath}`;

export const eventCategories = {
  exercise: "exercise",
  housing: "housing",
  feeding: "feeding",
  medication: "medication",
  painMeasurement: "painMeasurement",
  chronicPainMeasurement: "chronicPainMeasurement",
  appointment: "appointment"
};

export const eventTypes = {
  groundWork: "groundWork",
  riding: "riding",
  driving: "driving",
  lunging: "lunging",
  workInHand: "workInHand",
  paddock: "paddock",
  pasture: "pasture",
  stable: "stable",
  roughage: "roughage",
  concentrate: "concentrate",
  supplement: "supplement",
  pill: "pill",
  injection: "injection",
  treatment: "treatment",
  temperature: "temperature",
  recovery: "recovery",
  facialExpression: "facialExpression",
  composite: "composite",
  appointment: "appointment"
};

export const eventTypeIconNames = {
  groundWork: iconMap.groundwork,
  riding: iconMap.riding,
  driving: iconMap.groundwork,
  lunging: iconMap.groundwork,
  workInHand: iconMap.groundwork,
  paddock: iconMap.riding,
  pasture: iconMap.pasture,
  stable: iconMap.home,
  roughage: iconMap.grain,
  concentrate: iconMap.bowl,
  supplement: iconMap.supplements,
  pill: iconMap.medication,
  treatment: iconMap.treatment,
  temperature: iconMap.temperature,
  recovery: iconMap.recovery
};

export const eventCategoryColors = {
  [eventCategories.exercise]: colors.lima,
  [eventCategories.housing]: colors.supernova,
  [eventCategories.feeding]: colors.barleyCorn,
  [eventCategories.medication]: colors.harleyDavidsonOrange
};

export const cropImages = {
  a: {x: 24, y: 0},
  b: {x: 24, y: .25},
  c: {x: 24, y: .6},
};