import React, { Suspense, lazy } from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { ModalProvider, BaseModalBackground } from 'styled-react-modal';

// Styling
import styled from 'styled-components';
import { rgba } from 'polished';

// Components
import Header from './Header';
import Nav from './Nav';

// Common
import Loader from './common/Loader/Loader';

// Lazy load pages
const WorkPosting = lazy(() => import('../pages/job/WorkPosting'));
const AboutPage = lazy(() => import('../pages/about/AboutPage'));
const ResumePage = lazy(() => import('../pages/resume/ResumePage'));
const WorkPage = lazy(() => import('../pages/work/WorkPage'));
const PostJobPage = lazy(() => import('../pages/post_job/PostJobPage'));

const FadingBackground = styled(BaseModalBackground)`
  opacity: ${props => props.opacity};
  transition: opacity ease 200ms;
`;

function Router(props) {
  return (
    <div {...props}>
      <ModalProvider backgroundComponent={FadingBackground}>
        <BrowserRouter>
          <Header />
          <div className="container">
            <Nav />
            <Suspense fallback={<Loader />}>
              <Switch>
                <Route exact path="/class/:id" />
                <Route exact path="/profile" />
                <Route exact path="/settings" />
                <Route exact path="/work" component={WorkPage} />
                <Route exact path="/work/:id/:string" component={WorkPosting} />
                <Route exact path="/job/new" component={PostJobPage} />
                <Route path="/resume" component={ResumePage} />
                <Route exact path="/about" component={AboutPage} />
              </Switch>
            </Suspense>
          </div>
        </BrowserRouter>
      </ModalProvider>
      <div className="gradient"></div>
      <div className="pattern"></div>
    </div>
  );
}

Router = styled(Router)`
    min-height: 100vh;
    padding: 16px;
    
    .gradient {
        z-index: -1;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        position: fixed;
        display: block;
        background: linear-gradient(0deg, ${props =>
          props.theme.is === 'dark'
            ? rgba(props.theme.PALLET['900'], 0.1)
            : rgba(props.theme.PALLET['100'], 0.1)} 0%, ${props =>
  props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['200']} 100%);
    }

    .pattern {
        z-index: -2;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        display: block;
        position: fixed;
        background-color: ${props =>
          props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['300']};
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23${props =>
          props.theme.is === 'dark'
            ? props.theme.PALLET['800'].replace('#', '')
            : props.theme.PALLET['100'].replace(
                '#',
                ''
              )}' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    ${Nav} {
        width: max-content;
    }
`;

export default Router;
