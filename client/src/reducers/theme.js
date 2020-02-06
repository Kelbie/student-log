import * as ACTION_TYPES from '../actions/action_types';

// const PRIMARY_COLOR = "#E360B1";
// const SECONDARY_COLOR = "#C3327A";

// const PRIMARY_COLOR = "#F6AD55";
// const SECONDARY_COLOR = "#ED8936";

const PRIMARY_COLOR = '#63B3ED';
const SECONDARY_COLOR = '#4299E1';

const PALLET = {
  // Gray
  '100': '#F7FAFC',
  '200': '#EDF2F7',
  '300': '#E2E8F0',
  '400': '#CBD5E0',
  '500': '#A0AEC0',
  '600': '#718096',
  '700': '#4A5568',
  '800': '#2D3748',
  '900': '#1A202C'
};

const initialState = {
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  PALLET,
  is: 'dark'
};

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.TOGGLE_THEME:
      return {
        ...state,
        is: state.is === 'dark' ? 'light' : 'dark'
      };
    case ACTION_TYPES.SET_DARK_THEME:
      return {
        ...state,
        is: 'dark'
      };
    case ACTION_TYPES.SET_LIGHT_THEME:
      return {
        ...state,
        is: 'light'
      };
    case ACTION_TYPES.SET_COLOR_THEME:
      return {
        ...state,
        PRIMARY_COLOR: action.payload.PRIMARY_COLOR,
        SECONDARY_COLOR: action.payload.SECONDARY_COLOR
      };
    default:
      return state;
  }
}
