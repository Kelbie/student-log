import React, { useCallback, useMemo, useState, useEffect } from 'react';

import styled from 'styled-components';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import { rgba } from 'polished';

function StyledDropdown(props) {
  return <Dropdown {...props} />;
}

export default styled(StyledDropdown)`
  .Dropdown-control {
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['400'] : props.theme.PALLET['600']};
    background: -webkit-linear-gradient(
      ${props => rgba(props.theme.PRIMARY_COLOR, 0.05)},
      ${props => rgba(props.theme.SECONDARY_COLOR, 0.05)}
    );
    border: 1px solid ${props => rgba(props.theme.PRIMARY_COLOR, 0.5)};
    cursor: pointer;
  }

  .Dropdown-arrow {
    border-color: ${props =>
        props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['500']}
      transparent transparent;
  }

  .is-open {
    background: red !important;
  }

  .Dropdown-menu {
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['800'] : props.theme.PALLET['200']};
    border: 1px solid ${props => rgba(props.theme.PRIMARY_COLOR, 0.5)};
  }

  .Dropdown-option {
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['400'] : props.theme.PALLET['600']};
  }

  .Dropdown-option.is-selected {
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['300']};
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['400'] : props.theme.PALLET['600']};
  }

  .Dropdown-option:hover {
    background: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['900'] : props.theme.PALLET['300']};
    color: ${props =>
      props.theme.is === 'dark' ? props.theme.PALLET['400'] : props.theme.PALLET['600']};
  }
`;
