import * as React from 'react';
import ExchangeTable from './components/ExchangeTable';
import { Map, TileLayer } from 'react-leaflet';
import axios from 'axios';
import * as socketIOClient from "socket.io-client";

interface BestCourses {
  [key: string]: number
}

interface Props {
  retailCityId: number,
  wholesaleCityId: number,
}

interface State {
  rates: exchangeRate[],
  best: BestCourses,
  mode: string,
}

class App extends React.Component<Props, State> {

  state: State = {
    mode: 'retail',
    rates: [],
    best: {},
  };

  componentDidMount () {
    axios.all([
      axios.get(process.env.API_URL + '/courses/' + this.props.retailCityId),
      axios.get(process.env.API_URL + '/courses/' + this.props.wholesaleCityId),
    ]).then(responses => {
      this.setState({
        retailRates: responses[0].data.rates,
        retailRatesBest: responses[0].data.best,
        wholesaleRates: responses[1].data.rates,
        wholesaleRatesBest: responses[1].data.best,
      });
    });


    const socket = socketIOClient(process.env.SOCKET_URL, {
      path: '/ws',
    });
    socket.emit('join', 2);
    socket.on('update', (data: any) => {
      console.log('RECEIVED FROM SOCKET', data);
    });
  }

  render () {
    return (
      <div className="flex justify-between flex-wrap">
        <div className="w-full xl:w-1/2 h-screen overflow-hidden">
          <ExchangeTable retailCityId={this.props.retailCityId} wholesaleCityId={this.props.wholesaleCityId}/>
        </div>
        <div className="w-full xl:w-1/2">
          <div className="border border-gray-600">
            <Map center={[49.95, 82.61]} zoom={14}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://osm.apihit.com/?z={z}&x={x}&y={y}"
              />
            </Map>
          </div>
        </div>
      </div>
    );
  }
}

export default App;