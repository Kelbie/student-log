import React, { useState, useEffect } from 'react';

import { withRouter } from 'react-router-dom';

import styled, { withTheme } from 'styled-components';
import { rgba } from 'polished';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faBriefcase,
  faComments,
  faBell,
  faCog,
  faUserCircle,
  faBook,
  faBus,
  faUser,
  faSignOutAlt,
  faSignInAlt,
  faGraduationCap,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

import { useWindowSize, useWindowWidth, useWindowHeight } from '@react-hook/window-size';

import Button, { Button2, ButtonLink2 } from './Button';

// GraphQL
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo-hooks';

const GET_PROFILE = gql`
  query {
    getProfile {
      name
    }
  }
`;

function Nav(props) {
  const { data } = useQuery(GET_PROFILE, {
    fetchPolicy: 'cache-first',
    variables: {}
  });

  const [active, setActive] = useState(-1);

  useEffect(() => {
    switch (props.location.pathname) {
      case '/profile':
        setActive('profile');
        break;
      case '/timetable':
        setActive('timetable');
        break;
      case '/work':
        setActive('work');
        break;
      case '/notifications':
        setActive('notifications');
        break;
      case '/settings':
        setActive('settings');
        break;
      case '/transport':
        setActive('transport');
        break;
      case '/library':
        setActive('library');
        break;
    }
  }, []);

  return (
    <div {...props}>
      <Button
        to="/student-log"
        number={1}
        active={active === 'student-log' ? 1 : 0}
        icon={faGraduationCap}
        onClick={() => {
          setActive('student-log');
        }}
      >
        {/* <span className="student">STUDENT</span><span className="log">LOG</span> */}
      </Button>
      <Button
        to="/about"
        active={active === 'about' ? 1 : 0}
        icon={faInfoCircle}
        onClick={() => {
          setActive('about');
        }}
      >
        About
      </Button>
      {data && data.getProfile && data.getProfile.name ? (
        <>
          <Button
            to="/profile"
            active={active === 'profile' ? 1 : 0}
            icon={faUserCircle}
            onClick={() => {
              setActive('profile');
            }}
          >
            Profile
          </Button>
          <Button
            to="/timetable"
            active={active === 'timetable' ? 1 : 0}
            icon={faCalendar}
            onClick={() => {
              setActive('timetable');
            }}
          >
            Timetable
          </Button>
        </>
      ) : (
        ''
      )}
      <Button
        to="/work"
        active={active === 'work' ? 1 : 0}
        icon={faBriefcase}
        onClick={() => {
          setActive('work');
        }}
      >
        Work
      </Button>
      <Button
        to="/resume"
        active={active === 'resume' ? 1 : 0}
        icon={faUser}
        onClick={() => {
          setActive('resume');
        }}
      >
        Résumé
      </Button>
      <Button
        to="/transport"
        active={active === 'transport' ? 1 : 0}
        icon={faBus}
        onClick={() => {
          setActive('transport');
        }}
      >
        Transport
      </Button>
      <Button
        to="/library"
        active={active === 'library' ? 1 : 0}
        icon={faBook}
        onClick={() => {
          setActive('library');
        }}
      >
        Library
      </Button>
      {data?.getProfile?.name ? (
        <>
          <Button
            to="/notifications"
            active={active === 'notifications' ? 1 : 0}
            icon={faBell}
            onClick={() => {
              setActive('notifications');
            }}
          >
            Notifications
          </Button>
          <Button
            to="/settings"
            active={active === 'settings' ? 1 : 0}
            icon={faCog}
            onClick={() => {
              setActive('settings');
            }}
          >
            Settings
          </Button>
        </>
      ) : (
        ''
      )}

      {data?.getProfile?.name ? (
        <Button
          icon={faSignOutAlt}
          variant={'fill'}
          onClick={() => (window.location.href = `/logout?redirect=${props.location.pathname}`)}
        >
          Logout
        </Button>
      ) : (
        <Button
          icon={faSignInAlt}
          variant={'fill'}
          onClick={() => (window.location.href = `/login?redirect=${props.location.pathname}`)}
        >
          Student Login
        </Button>
      )}
    </div>
  );
}

Nav = styled(Nav)`
  display: inline-block;
  margin-right: 8px;
  position: sticky;
  top: 16px;
  height: 1vh;

  a {
    text-decoration: none;
  }

  ${Button2} {
    width: 100%;
    white-space: normal;
    min-width: 100%;
  }

  h1 {
    padding: 0px 12px 4px 12px;
    font-size: 20px;
    color: ${props => (props.theme.is === 'dark' ? 'white' : '#939399')};

    @media only screen and (max-width: 480px) {
      display: none;
    }

    span.log {
      font-weight: 600;
      position: sticky;
      background: -webkit-linear-gradient(
        ${props => props.theme.PRIMARY_COLOR},
        ${props => props.theme.SECONDARY_COLOR}
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  p {
    margin-top: 16px;
    color: rgb(42, 42, 50);
    text-shadow: 1px 1px rgba(0, 0, 0, 0.3);
  }
`;

export default withRouter(Nav);
