import * as React from 'react';
import ExchangeTable from './components/ExchangeTable';
// import Map from './components/map/Map';
import DGisMap from './components/map/DGisMap';
import YMap from './components/map/YMap';
import axios from 'axios';
import * as socketIOClient from 'socket.io-client';

interface BestCourses {
  [key: string]: number;
}

interface Props {
  retailCityId: number;
  wholesaleCityId: number;
}

interface State {
  rates: exchangeRate[];
  best: BestCourses;
  mode: string;
  sortBy: string;
  selectedPointId: number;
  map: string;
}

class App extends React.Component<Props, State> {
  state: State = {
    mode: 'retail',
    sortBy: 'date_update',
    rates: [],
    best: {},
    selectedPointId: 0,
    map: 'ymap',
  };

  setMode (mode: string) {
    this.setState({ mode: mode }, this.getRates);
  }

  setSortBy (sortBy: string) {
    this.setState({ sortBy: sortBy }, this.sortRates);
  }

  resetSelectedPoint () {
    this.setState({ selectedPointId: 0 });
  }

  getRates () {
    let cityId = this.props.retailCityId;
    if (this.state.mode === 'wholesale') {
      cityId = this.props.wholesaleCityId;
    }

    axios
      .get(process.env.API_URL + '/courses/' + cityId)
      .then(response => {
        this.setState({ rates: response.data.rates, best: response.data.best });
      })
      .catch(error => {
        console.log(error);
      });
  }

  selectPoint (id: number) {
    this.setState({ selectedPointId: id });
  }

  sortRates () {
    const sortBy = this.state.sortBy;

    let rates: exchangeRate[] = this.state.rates;

    if (sortBy.substr(0, 3) === 'sel') {
      let zeroedRates: exchangeRate[] = [];
      const filteredRates = rates.filter(rate => {
        if (rate[sortBy] === 0) {
          zeroedRates.push(rate);
          return false;
        }
        return true;
      });
      filteredRates.sort((first, second) => {
        if (first[sortBy] > second[sortBy] || first[sortBy] === 0) {
          return 1;
        }
        if (first[sortBy] < second[sortBy]) {
          return -1;
        }
        if (first[sortBy] === 0 && second[sortBy] > 0) {
          return 1;
        }
        if (first[sortBy] > 0 && second[sortBy] === 0) {
          return -1;
        }

        return 0;
      });

      rates = filteredRates.concat(zeroedRates);
    } else if (sortBy.substr(0, 3) === 'buy') {
      rates.sort((first, second) =>
        first[sortBy] < second[sortBy]
          ? 1
          : first[sortBy] > second[sortBy]
            ? -1
            : 0
      );
    } else {
      rates.sort((first, second) =>
        first.date_update > second.date_update
          ? -1
          : first.date_update < second.date_update
            ? 1
            : 0
      );
    }

    this.setState({ rates: rates });
  }

  switchMap (map: string) {
    this.setState({ map: map });
  }

  componentDidMount () {
    this.getRates();

    const socket = socketIOClient(process.env.SOCKET_URL, {
      path: '/ws',
    });
    socket.emit('join', 2);
    socket.on('update', (data: any) => {
      console.log('RECEIVED FROM SOCKET', data);
    });
  }

  render () {
    let map = null;
    if (this.state.map === 'ymap') {
      map = (
        <YMap
          rates={this.state.rates}
          selectedPointId={this.state.selectedPointId}
        />
      );
    }else if (this.state.map === '2gis'){
      map = (
        <DGisMap
          rates={this.state.rates}
          selectedPointId={this.state.selectedPointId}
          resetSelected={this.resetSelectedPoint.bind(this)}
        />
      );
    } 
    // else {
    //   map = (
    //     <Map
    //       rates={this.state.rates}
    //       selectedPointId={this.state.selectedPointId}
    //     />
    //   );
    // }
    return (
      <div className="flex justify-between flex-wrap">
        <div className="w-full">
          <div className="text-center my-2 flex justify-around">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={this.switchMap.bind(this, 'ymap')}
            >
              Yandex.Maps
            </button>
            {/* <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={this.switchMap.bind(this, 'osm')}
            >
              OpenstreetMaps
            </button> */}
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={this.switchMap.bind(this, '2gis')}
            >
              2gis
            </button>
          </div>
        </div>
        <div className="w-full xl:w-1/2 h-screen overflow-hidden">
          <ExchangeTable
            rates={this.state.rates}
            best={this.state.best}
            mode={this.state.mode}
            setMode={this.setMode.bind(this)}
            setSortBy={this.setSortBy.bind(this)}
            selectPoint={this.selectPoint.bind(this)}
          />
        </div>
        <div className="w-full xl:w-1/2">
          <div className="border border-gray-600">{map}</div>
        </div>
      </div>
    );
  }
}

export default App;
