import React from 'react';

import styled, { withTheme } from 'styled-components';

import getSlug from 'speakingurl';

import A from '../../components/common/A';

import moment from 'moment';
import { ButtonExternal } from '../../components/common/Button';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

function Class(props) {
  return (
    <div {...props}>
      <div className="gradient" />
      <div className="top">
        <div className="photo-container">
          <img src={`/logos/${props.logo}.png`} />
        </div>
        <div className="text">
          <div className="left">
            <A
              to={
                props.apply_link
                  ? null
                  : `/work/${props.job_id}/${getSlug(props.title + ' ' + props.company)}`
              }
              className="title"
            >
              {props.title}
            </A>
            <div className="company">{props.company}</div>
            <div className="module raise">
              {props.apply_link ? `${props.location} • ` : null}
              {props.date.format('MMM DD')}
              {` • `}
              {props.job_type}
            </div>
          </div>
          {props.apply_link ? (
            <ButtonExternal variant={'fill'} href={props.apply_link} icon={faExternalLinkAlt}>
              Apply
            </ButtonExternal>
          ) : (
            <div className="right">
              <div>{props.location}</div>
              <div className="new">
                {props.date.add(3, 'days').isAfter(moment(new Date())) ? 'NEW' : ''}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Class = styled(Class)`
  grid-column: 2;
  position: relative;
  border-radius: 4px;

  .top {
    display: flex;
    position: relative;
    z-index: 1;
    padding: 16px;
    margin-left: 22px;
    border-radius: 4px;
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['700'] : props.theme.PALLET['100']};
  }

  &::after {
    content: '';
    position: absolute;
    right: -4px;
    width: 8px;
    height: 75%;
    background: -webkit-linear-gradient(
      ${props => (props.featured ? props.theme.PRIMARY_COLOR : 'transparent')},
      ${props => (props.featured ? props.theme.SECONDARY_COLOR : 'transparent')}
    );
    top: 50%;
    transform: translateY(-50%);
    border-radius: 8px;
  }

  .photo-container-highlight {
    margin-left: -38px;
    width: 48px;
    height: 48px;
    margin-right: 8px;
    flex-shrink: 0;
    border-radius: 100%;
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['300']};
    border: 1px solid ${props => props.theme.PRIMARY_COLOR};
  }

  .photo-container {
    overflow: hidden;
    margin-left: -38px;
    width: 48px;
    height: 48px;
    margin-right: 8px;
    flex-shrink: 0;
    border-radius: 100%;
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['300']};
    border: 2px solid
      ${props =>
        props.theme.is === 'dark' ? props.theme.PALLET['700'] : props.theme.PALLET['100']};

    img {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }

  .text {
    display: grid;
    grid-template-columns: 1fr max-content;
    flex-grow: 1;

    .left {
      padding-right: 8px;
    }

    .right {
      text-align: right;
      color: ${props => (props.theme.is === 'dark' ? '#cbcbcb' : '#848484')};
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 8px;

      .new {
        position: sticky;
        font-weight: 600;
        background: -webkit-linear-gradient(
          ${props => props.theme.PRIMARY_COLOR},
          ${props => props.theme.SECONDARY_COLOR}
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 12px;
      }
    }
  }

  .time {
    color: ${props => (props.theme.is === 'dark' ? '#cbcbcb' : '#848484')};
    font-size: 12px;
    font-weight: 600;
  }

  .title {
    position: sticky;
    font-weight: 600;
    background: -webkit-linear-gradient(
      ${props => props.theme.PRIMARY_COLOR},
      ${props => props.theme.SECONDARY_COLOR}
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 16px;
    margin-right: 4px;
  }

  .company {
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['300'] : props.theme.PALLET['600']};
  }

  .module {
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['500'] : props.theme.PALLET['500']};
    font-size: 12px;
  }

  .raise {
    position: relative;
    z-index: 2;
    isolation: isolate;
  }

  .drop {
    position: initial;
  }

  .bottom {
    position: relative;
    height: 24px;
    width: 100%;
    background: ${props => (props.theme.is === 'dark' ? 'white' : 'black')};
  }

  .duration-container {
    position: absolute;
    display: inline-block;
    background: ${props => (props.theme.is === 'dark' ? '#24252d' : '#fff')};
    border: 2px solid ${props => (props.theme.is === 'dark' ? 'white' : 'black')};
    bottom: 0;
    left: 24px;
  }

  .duration {
    background: ${props => (props.theme.is === 'dark' ? '#24252d' : '#fff')};
    padding: 8px;
    color: ${props => (props.theme.is === 'dark' ? '#cbcbcb' : '#919191')};
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .images {
    display: flex;
    position: absolute;
    bottom: 0;
    right: 24px;
  }

  .image {
    width: 100%;
    height: 100%;
    mix-blend-mode: lighten;
  }

  img {
    width: 100%;
    height: 100%;
  }

  .image-container {
    width: 32px;
    height: 32px;
    border-radius: 100%;
    border: 2px solid ${props => (props.theme.is === 'dark' ? 'white' : 'black')};
    background: ${props => (props.theme.is === 'dark' ? 'black' : 'white')};
    margin-left: -8px;
    overflow: hidden;
    background: gray;
  }

  grid-row: span ${props => props.index};
`;

export default withTheme(Class);
