import React from "react";

import { AlertDropdownContext } from "../index";

// This function takes a component...
export default function withAlertDropdown(Component) {
  // ...and returns another component...
  return function Comp(props) {
    // ... and renders the wrapped component with the context theme!
    // Notice that we pass through any additional props as well
    return (
      <AlertDropdownContext.Consumer>
        {(alertDropdown) => (
          <Component {...props} alertDropdown={alertDropdown} />
        )}
      </AlertDropdownContext.Consumer>
    );
  };
}
