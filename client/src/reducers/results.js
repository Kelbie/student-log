import * as ACTION_TYPES from '../actions/action_types';

const initialState = [];

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_RESULTS:
      return [...action.payload];
    default:
      return state;
  }
}
