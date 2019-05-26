import * as React from 'react';
import { hot } from 'react-hot-loader';
import ExchangeTable from './components/ExchangeTable';

interface Props {
  initialData?: {
    retailCityId: number,
    wholesaleCityId: number,
  }
}

interface State {
  retailCityId: number,
  wholesaleCityId: number,
}

class App extends React.Component<Props, State> {

  state = {
    retailCityId: this.props.initialData.retailCityId ? this.props.initialData.retailCityId : 4,
    wholesaleCityId: this.props.initialData.wholesaleCityId ? this.props.initialData.wholesaleCityId : 5,
  };

  render () {
    return (
      <div className="flex">
        <div className="w-4/6">
          <ExchangeTable retailCityId = {this.state.retailCityId} wholesaleCityId={this.state.wholesaleCityId}/>
        </div>
        <div className="w-1/3">
          <div className="map"></div>
        </div>
      </div>
    );
  }
}

export default hot(module)(App);