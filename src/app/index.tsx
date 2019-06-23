import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

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
// @ts-ignore
ReactDOM.render(
  <App
    retailCityId={initialData.retailCityId}
    wholesaleCityId={initialData.wholesaleCityId}
    mapCenter={initialData.mapCenter}
  />,
  document.getElementById('root')
);
