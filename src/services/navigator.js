import { NavigationActions } from "react-navigation";

// Keep reference to root navigator of the app
let container;

// Called by root container that initializes root navigator
function setContainer(incomingContainer) {
  container = incomingContainer;
}

function navigate(routeName, params) {
  container.dispatch(
    NavigationActions.navigate({
      type: "Navigation/NAVIGATE",
      routeName,
      params
    })
  );
}

export default {
  setContainer,
  navigate
};
