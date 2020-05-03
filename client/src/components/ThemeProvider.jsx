import React, { useCallback } from 'react';

import { useMappedState } from 'redux-react-hook';

// Styling
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

// Wrapping the ThemeProvider is required because we need to fetch the theme from redux first.
function ThemeProvider(props) {
  // Declare your memoized mapState function
  const mapState = useCallback(
    state => ({
      theme: state.theme
    }),
    []
  );

  // Get data from and subscribe to the store
  const { theme } = useMappedState(mapState);

  return (
    <StyledThemeProvider
      theme={{
        is: theme.is,
        PRIMARY_COLOR: theme.PRIMARY_COLOR,
        SECONDARY_COLOR: theme.SECONDARY_COLOR,
        PALLET: theme.PALLET
      }}
    >
      {props.children}
    </StyledThemeProvider>
  );
}

export default ThemeProvider;
