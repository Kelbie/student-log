import React from 'react';

import styled, { withTheme } from 'styled-components';

import date from 'date-and-time';

import { rgba } from 'polished';

import A from '../../components/common/A';

function Class(props) {
  return (
    <div {...props}>
      <div className="top">
        <div className="time raise">
          {date.format(new Date(parseInt(props.start)), 'YY HH:mm')} -{' '}
          {date.format(new Date(parseInt(props.end)), 'HH:mm')} • {props.type}
        </div>
        <A href={`/class/2`} className="title">
          {props.module.title}
        </A>
        <div className="module raise">{props.module.id}</div>
        <div className="module raise rooms">
          {props.rooms.map((room, i) => {
            return (
              <>
                <span>{room.number}</span>
                {i !== props.rooms.length - 1 ? ' • ' : ''}
              </>
            );
          })}
        </div>
      </div>
      <div className="bottom">
        <div className="duration-container">
          <div className="duration raise">{`${props.duration} hour`}</div>
        </div>
      </div>
    </div>
  );
}

Class = styled(Class)`

  ${A} {
    cursor: auto;
  }

  grid-column: 2;
  /* border: 2px solid ${props =>
    props.theme.is === 'dark' ? props.theme.PALLET['800'] : props.theme.PALLET['200']}; */
  position: relative;
  border-radius: 4px;
  /* box-shadow: 0px 0px 16px 0px ${props => rgba(props.theme.SECONDARY_COLOR, 0.3)}; */
  box-shadow: 0px 0px 16px 0px
        ${props => (props.theme.is === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(192, 192, 192, 0.3)')};

  .gradient {
    border-radius: 4px;
    position: absolute;
    content: "";
    display: block;
    height: calc(100% + 4px);
    width: calc(100% + 4px);
    top: -2px;
    left: -2px;
    background: linear-gradient(to bottom right, ${props => props.theme.PRIMARY_COLOR}, ${props =>
  props.theme.SECONDARY_COLOR});
    /* mix-blend-mode: ${props => (props.theme.is === 'dark' ? 'multiply' : 'lighten')}; */
}


  /* Styling for main section */
  &::before {
    position: absolute;
    z-index: 0;
    content: "";
    display: block;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    background: ${props => (props.theme.is === 'dark' ? 'black' : 'white')};
    border-radius: 4px;
  }

  .top {
    position: relative;
    z-index: 1;
    padding: 24px;
    border-radius: 4px 4px 0px 0px;
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['700'] : props.theme.PALLET['100']};
    /* mix-blend-mode: ${props => (props.theme.is === 'dark' ? 'lighten' : 'darken')}; */
    /* &::before {
      content: "";
      width: 100%;
      height: 100%;
      background: black;
    } */
  }

  .time {
    color: ${props => (props.theme.is === 'dark' ? '#cbcbcb' : '#848484')};
    font-size: 12px;
    font-weight: 600;
  }

  .title {
    position: sticky;
    font-weight: 600;
    background: -webkit-linear-gradient(${props => props.theme.PRIMARY_COLOR}, ${props =>
  props.theme.SECONDARY_COLOR});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 20px;    
  }

  .module {
    color: ${props => (props.theme.is === 'dark' ? '#cbcbcb' : '#848484')};
    font-size: 16px;
  }

  /* .raise {
    position: relative;
    z-index: 2;
    isolation: isolate;
  } */

  .drop {
    position: initial;
  }

  .bottom {
    position: relative;
    height: 24px;
    width: 100%;
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['800'] : props.theme.PALLET['200']};
    border-radius: 0px 0px 4px 4px;
  }

  .duration-container {
    position: absolute;
    display: inline-block;
    background: ${props => (props.theme.is === 'dark' ? '#24252d' : '#fff')};
    border: 2px solid ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['800'] : props.theme.PALLET['200']};
    bottom: 0;
    left: 24px;
    z-index: 1;
  }

  .duration {
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['700'] : props.theme.PALLET['100']};
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
    /* mix-blend-mode: lighten; */
  }

  img {
    width: 100%;
    height: 100%;
  }

  .image-container {
    width: 32px;
    height: 32px;
    border-radius: 100%;
    border: 2px solid ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['800'] : props.theme.PALLET['200']};
    background: ${props => (props.theme.is === 'dark' ? 'black' : 'white')};
    margin-left: -8px;
    overflow: hidden;
    background: gray;
  }

  grid-row: span ${props => props.index};
`;

export default withTheme(Class);
