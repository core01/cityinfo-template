import {
  ActionTypes,
  SET_RATES,
  UPDATE_RATE,
  SET_BEST_RATES,
  SET_MODE,
  SET_SORT_BY,
  SET_SELECTED_POINT,
} from './types';

export interface State {
  rates: ExchangeRate[];
  best: BestRates;
  mode: string;
  sortBy: string;
  selected: number;
}

const initialState: State = {
  rates: [],
  best: {},
  mode: 'retail',
  sortBy: 'date_update',
  selected: 0,
};

const ratesReducer = (state = initialState, action: ActionTypes): State => {
  switch (action.type) {
    case SET_RATES:
      return {
        ...state,
        rates: action.payload,
      };
      break;
    case UPDATE_RATE:
      const { rate: newRate, index = null } = action.payload;
      const { best, rates } = state;

      if (index === null) {
        rates.push(newRate);
      } else {
        delete newRate.city_id;
        rates[index] = newRate;
      }

      for (let property in best) {
        if (property.substr(0, 3) === 'buy') {
          if (newRate[property] > best[property]) {
            best[property] = newRate[property];
          }
        } else {
          if (newRate[property] < best[property]) {
            best[property] = newRate[property];
          }
        }
      }
      return {
        ...state,
        best,
        rates,
      };
      break;
    case SET_BEST_RATES:
      return {
        ...state,
        best: action.payload,
      };
      break;

    case SET_MODE:
      return {
        ...state,
        mode: action.payload,
      };
      break;
    case SET_SORT_BY:
      return {
        ...state,
        sortBy: action.payload,
      };
    case SET_SELECTED_POINT:
      return {
        ...state,
        selected: action.payload,
      };
    default:
      return state;
  }
};

export { ratesReducer };
