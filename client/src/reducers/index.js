import { combineReducers } from 'redux';

import theme from "./theme";
import resume from "./resume";

const allReducers = combineReducers({
    theme,
    resume
});

export default allReducers;