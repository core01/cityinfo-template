import * as React from 'react';
import { render } from 'react-dom';
import App from './App';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import AppState from './store';

const store = createStore(AppState);

interface InitialData {
  retailCityId: number;
  wholesaleCityId: number | null;
  mapCenter: number[];
}

let initialData: InitialData = {
  retailCityId: 4,
  wholesaleCityId: 5,
  mapCenter: [49.95, 82.61],
};

if ((window as any).initialData !== undefined) {
  initialData = (window as any).initialData;
}

render(
  <Provider store={store}>
    <App
      retailCityId={initialData.retailCityId}
      wholesaleCityId={initialData.wholesaleCityId}
      mapCenter={initialData.mapCenter}
    />
  </Provider>,
  document.getElementById('root')
);
