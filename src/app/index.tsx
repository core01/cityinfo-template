import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

let initialData = {};
if ((window as any).initialData !== undefined) {
  initialData = (window as any).initialData;
}
// @ts-ignore
ReactDOM.render(<App initialData={initialData}/>, document.getElementById('root'));