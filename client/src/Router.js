import React, { useCallback } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import ReactDOM from 'react-dom';

import styled, { ThemeProvider } from 'styled-components';

import './styles.css';

import moment from 'moment';

import StepWizard from 'react-step-wizard';

import Timetable from './components/Timetable';
import TimetablePage from './components/TimetablePage';

import './styles.css';
import DayPicker from './components/DayPicker';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo-hooks';

import date from 'date-and-time';

import { StoreContext, useMappedState } from 'redux-react-hook';
import { store } from './store';

import Search from './components/Search';

import ical from 'ical';

import Header from './components/Header';
import Nav from './components/Nav';

import { AzureAD, AuthenticationStatus } from 'react-aad-msal';

import { setDarkTheme, setLightTheme } from './actions/actions';
import ResumePage from './components/ResumePage';
import WorkPage from './components/WorkPage';
import WorkPosting from './components/WorkPosting';
import AboutPage from './components/AboutPage';

const client = new ApolloClient({
  uri: 'http://localhost:30662/graphql'
});

function MyRouter(props) {
  return (
    <div {...props}>
      <Router>
        <Header />
        <div className="container">
          <Nav />
          <Switch>
            <Route exact path="/timetable" component={TimetablePage} />
            <Route exact path="/class/:id" />
            <Route exact path="/profile" />
            <Route exact path="/settings" />
            <Route exact path="/work" component={WorkPage} />
            <Route exact path="/work/:id" component={WorkPosting} />
            <Route exact path="/job/new" />
            <Route path="/resume" component={ResumePage} />
            <Route path="/about" component={AboutPage} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

MyRouter = styled(MyRouter)`
  min-height: 100vh;
  padding: 16px;
  background: ${props => (props.theme.is === 'dark' ? '#17171C' : '#F8F7F7')};

  ${Nav} {
    width: max-content;
  }
`;

function MyTheme(props) {
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
    <ThemeProvider
      theme={{
        is: theme.is,
        PRIMARY_COLOR: theme.PRIMARY_COLOR,
        SECONDARY_COLOR: theme.SECONDARY_COLOR
      }}
    >
      {props.children}
    </ThemeProvider>
  );
}

function App(props) {
  return (
    <div {...props}>
      {/* <AzureAD provider={authProvider} forceLogin={true}> */}
      <StoreContext.Provider value={store}>
        <ApolloProvider client={client}>
          <MyTheme>
            <MyRouter></MyRouter>
          </MyTheme>
        </ApolloProvider>
      </StoreContext.Provider>
      {/* </AzureAD> */}
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
