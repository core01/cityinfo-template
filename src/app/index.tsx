import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

interface initialData {
  retailCityId: number;
  wholesaleCityId: number;
}

let initialData: initialData = {
  retailCityId: 4,
  wholesaleCityId: 5,
};

if ((window as any).initialData !== undefined) {
  initialData = (window as any).initialData;
}
// @ts-ignore
ReactDOM.render(
  <App retailCityId={initialData.retailCityId}
       wholesaleCityId={initialData.wholesaleCityId}
  />, document.getElementById('root'),
);