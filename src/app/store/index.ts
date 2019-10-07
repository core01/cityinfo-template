import { combineReducers } from 'redux';

import { ratesReducer } from './rates/reducers';
import { errorReducer } from './errors/reducers';

import { ActionTypes as RatesActionType } from './rates/types';
import { ActionTypes as ErrorsActionType } from './rates/types';

const rootReducer = combineReducers({
  rates: ratesReducer,
  errors: errorReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export type ActionTypes = RatesActionType | ErrorsActionType;

export default rootReducer;
