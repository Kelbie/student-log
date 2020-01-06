import { store } from '../store';
import * as ACTION_TYPES from "./action_types";

export const setDarkTheme = () => {
    return {
        type: ACTION_TYPES.SET_DARK_THEME
    }
}

export const setLightTheme = () => {
    return {
        type: ACTION_TYPES.SET_LIGHT_THEME
    }
}

export const setColorTheme = (theme) => {
    return {
        type: ACTION_TYPES.SET_COLOR_THEME,
        payload: theme
    }
}

export const toggleTheme = () => {
    return {
        type: ACTION_TYPES.TOGGLE_THEME
    }
}
