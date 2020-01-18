import * as ACTION_TYPES from "../actions/action_types";

const PRIMARY_COLOR = "#E87BBE";
const SECONDARY_COLOR = "#8E9DEF";

const initialState = {
    PRIMARY_COLOR,
    SECONDARY_COLOR,
    is: "dark"
};

// Reducer
export default function reducer(state = initialState, action) {
    console.log(123, state);
    switch (action.type) {
        case ACTION_TYPES.TOGGLE_THEME:
            return {
                ...state,
                is: state.is === "dark" ? "light" : "dark"
            }
        case ACTION_TYPES.SET_DARK_THEME:
            return {
                ...state,
                is: "dark"
            };
        case ACTION_TYPES.SET_LIGHT_THEME:
            return {
                ...state,
                is: "light"
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