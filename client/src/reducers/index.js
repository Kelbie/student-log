import { combineReducers } from 'redux';

import theme from "./theme";
import filter from "./filter";
import results from "./results";
import resume from "./resume";

const allReducers = combineReducers({
    theme,
    filter,
    results,
    resume
});

export default allReducers;