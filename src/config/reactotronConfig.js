import { NativeModules } from "react-native";
import Reactotron from "reactotron-react-native";
import { reactotronRedux as reduxPlugin } from "reactotron-redux";
import sagaPlugin from "reactotron-redux-saga";

import { useReactotron } from "../../env.json";

if (useReactotron) {
  const {
    SourceCode: { scriptURL }
  } = NativeModules;
  const scriptHostname = scriptURL.split("://")[1].split(":")[0];

  Reactotron.configure({ name: "EPWA", host: scriptHostname })
    .useReactNative()
    .use(reduxPlugin())
    .use(sagaPlugin())
    .connect();

  // Let's clear Reactotron on every time we load the app
  Reactotron.clear();

  // Totally hacky, but this allows you to not both importing reactotron-react-native
  // on every file.  This is just DEV mode, so no big deal.
  console.tron = Reactotron;
}

export default Reactotron;
