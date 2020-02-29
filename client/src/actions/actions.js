import { store } from '../store';
import * as ACTION_TYPES from './action_types';

export const setDarkTheme = () => {
  return {
    type: ACTION_TYPES.SET_DARK_THEME
  };
};

export const setLightTheme = () => {
  return {
    type: ACTION_TYPES.SET_LIGHT_THEME
  };
};

export const setColorTheme = theme => {
  return {
    type: ACTION_TYPES.SET_COLOR_THEME,
    payload: theme
  };
};

export const toggleTheme = () => {
  return {
    type: ACTION_TYPES.TOGGLE_THEME
  };
};

export const updateFilterLocation = filter => {
  return {
    type: ACTION_TYPES.UPDATE_FILTER_LOCATION,
    payload: filter
  };
};

export const updateFilterType = filter => {
  return {
    type: ACTION_TYPES.UPDATE_FILTER_TYPE,
    payload: filter
  };
};

export const updateFilterCompany = filter => {
  return {
    type: ACTION_TYPES.UPDATE_FILTER_COMPANY,
    payload: filter
  };
};

export const updateFilterCategory = filter => {
  return {
    type: ACTION_TYPES.UPDATE_FILTER_CATEGORY,
    payload: filter
  };
};

export const setResults = results => {
  return {
    type: ACTION_TYPES.SET_RESULTS,
    payload: results
  };
};

export const saveResume = resume => {
  return {
    type: ACTION_TYPES.SAVE_RESUME,
    payload: resume
  };
};
