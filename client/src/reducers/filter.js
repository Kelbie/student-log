import * as ACTION_TYPES from '../actions/action_types';
import { stat } from 'fs';

const initialState = {
  types: [],
  companies: [],
  categories: [],
  locations: []
};

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_FILTER_TYPE:
      let types = state.types;
      let added = false;
      for (let i = 0; i < types.length; i++) {
        if (types[i].name === action.payload.name) {
          types[i] = action.payload;
          added = true;
          break;
        }
      }
      if (!added) {
        types.push(action.payload);
      }
      return {
        ...state,
        types: types
      };
    case ACTION_TYPES.UPDATE_FILTER_COMPANY:
      let companies = state.companies;
      let added2 = false;
      for (let i = 0; i < companies.length; i++) {
        if (companies[i].name === action.payload.name) {
          companies[i] = action.payload;
          added2 = true;
          break;
        }
      }
      if (!added2) {
        companies.push(action.payload);
      }
      return {
        ...state,
        companies: companies
      };
    case ACTION_TYPES.UPDATE_FILTER_CATEGORY:
      let categories = state.categories;
      let added3 = false;
      for (let i = 0; i < categories.length; i++) {
        if (categories[i].name === action.payload.name) {
          categories[i] = action.payload;
          added3 = true;
          break;
        }
      }
      if (!added3) {
        categories.push(action.payload);
      }
      return {
        ...state,
        categories: categories
      };
    case ACTION_TYPES.UPDATE_FILTER_LOCATION:
      let locations = state.locations;
      let added4 = false;
      for (let i = 0; i < locations.length; i++) {
        if (locations[i].name === action.payload.name) {
          locations[i] = action.payload;
          added4 = true;
          break;
        }
      }
      if (!added4) {
        locations.push(action.payload);
      }
      return {
        ...state,
        locations: locations
      };
    default:
      return state;
  }
}
