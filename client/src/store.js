import { createStore } from 'redux';

import reducer from './reducers/index';
import actions from './actions/actions';

export const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
