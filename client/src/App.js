import React from 'react';

// Styling
import styled from 'styled-components';

// Global Styles
import './global.css';

// Components
import Router from "./components/Router";
import Theme from "./components/ThemeProvider";

// Redux
import { StoreContext } from 'redux-react-hook';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { store, persistor } from './store';

// GraphQL
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo-hooks';

const client = new ApolloClient({
  uri: `http://localhost:30662/graphql`
});

// Here we define all of the providers at the root level
function App(props) {
  return (
    <div {...props}>
      <StoreContext.Provider value={store}>
        <PersistGate loading={<></>} persistor={persistor}>
          <ApolloProvider client={client}>
            <Theme>
              <Router></Router>
            </Theme>
          </ApolloProvider>
        </PersistGate>
      </StoreContext.Provider>
    </div>
  );
}

App = styled(App)`
  .container {
    display: grid;
    grid-template-columns: max-content 1fr;
    width: 100%;
    max-width: 800px;
    margin: auto;

    > :last-child {
      flex-grow: 1;
    }
  }
`;

export default App;
