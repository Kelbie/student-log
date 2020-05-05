import React, { useState, useEffect } from 'react';

import { withRouter } from 'react-router-dom';

import Modal from 'styled-react-modal';

import Login from '../pages/login/Login';

// Common
import LinkRefactor from './common/LinkRefactor';
import ButtonRefactor from './common/ButtonRefactor';

// Styling
import styled from 'styled-components';
import {
  faBriefcase,
  faUser,
  faGraduationCap,
  faSignInAlt,
  faSignOutAlt,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

// GraphQL
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';

const GET_PROFILE = gql`
  query {
    getProfile {
      name
      email
    }
  }
`;

function Nav(props) {
  const [modalOpen, setModalOpen] = useState(false);

  const { data } = useQuery(GET_PROFILE, {
    fetchPolicy: 'cache-first',
    variables: {}
  });

  const [active, setActive] = useState(-1);

  useEffect(() => {
    setActive(props.location.pathname.replace('/', ''));
  }, []);

  return (
    <div {...props}>
      {/* Pop up modal for loggin in */}
      <Modal
        isOpen={modalOpen}
        onEscapeKeydown={() => setModalOpen(false)}
        onBackgroundClick={() => setModalOpen(false)}
      >
        <Login></Login>
      </Modal>
      <LinkRefactor
        responsive={true}
        to="/about"
        active={active === 'about' ? 1 : 0}
        icon={faInfoCircle}
        onClick={() => {
          setActive('about');
        }}
      >
        About
      </LinkRefactor>
      <LinkRefactor
        responsive={true}
        to="/work"
        active={active === 'work' ? 1 : 0}
        icon={faBriefcase}
        onClick={() => {
          setActive('work');
        }}
      >
        Work
      </LinkRefactor>
      <LinkRefactor
        responsive={true}
        to="/resume/templates"
        active={active === 'resume' ? 1 : 0}
        icon={faUser}
        onClick={() => {
          setActive('resume');
        }}
      >
        Résumé
      </LinkRefactor>
      {/* If the user is authenticated */}
      {data?.getProfile?.name ? (
        <ButtonRefactor
          responsive={true}
          icon={faSignOutAlt}
          variant={'fill'}
          onClick={() => (window.location.href = `/logout?redirect=${props.location.pathname}`)}
        >
          Logout
        </ButtonRefactor>
      ) : (
        <ButtonRefactor
          responsive={true}
          icon={faSignInAlt}
          variant={'fill'}
          onClick={() => setModalOpen(true)}
        >
          Student Login
        </ButtonRefactor>
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
    color: ${props => props.theme.PALLET['800']};
    text-shadow: 1px 1px rgba(0, 0, 0, 0.3);
  }
`;

export default withRouter(Nav);
