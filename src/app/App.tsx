import * as React from 'react';
import ExchangeTable from './components/ExchangeTable';
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
  rates: ExchangeRate[];
  best: BestCourses;
  mode: string;
  sortBy: string;
  selectedPointId: number;
}

class App extends React.Component<Props, State> {
  state: State = {
    mode: 'retail',
    sortBy: 'date_update',
    rates: [],
    best: {},
    selectedPointId: 0,
  };

  setMode(mode: string) {
    this.setState({ mode: mode, selectedPointId: 0 }, this.getRates);
  }

  setSortBy(sortBy: string) {
    this.setState({ sortBy: sortBy }, this.sortRates);
  }

  resetSelectedPoint() {
    this.setState({ selectedPointId: 0 });
  }

  getRates() {
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

  selectPoint(id: number) {
    this.setState({ selectedPointId: id }, () => {
      // Сбрасываем выбранную метку
      this.setState({ selectedPointId: 0 });
    });
  }

  sortRates() {
    const sortBy = this.state.sortBy;

    let rates: ExchangeRate[] = this.state.rates;

    if (sortBy.substr(0, 3) === 'sel') {
      let zeroedRates: ExchangeRate[] = [];
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

  updateRate(newRate: ExchangeRateUpdate) {
    let itemIndex;
    this.state.rates.map((rate, index) => {
      if (rate.id === newRate.id) {
        itemIndex = index;
      }
    });
    if (itemIndex !== undefined) {
      let newRates = this.state.rates;
      delete newRate.city_id;
      newRates[itemIndex as number] = newRate;
      this.updateBest(newRate);
      this.setState({ rates: newRates }, this.sortRates);
    } else {
      let rates = this.state.rates;
      rates.push(newRate);
      this.setState({ rates }, this.sortRates);
      this.updateBest(newRate);
    }
  }

  updateBest(rate: ExchangeRate) {
    let best = Object.assign({}, this.state.best);
    for (let property in this.state.best) {
      if (property.substr(0, 3) === 'buy') {
        if (rate[property] > best[property]) {
          best[property] = rate[property] as number;
        }
      } else {
        if (rate[property] < best[property]) {
          best[property] = rate[property] as number;
        }
      }
    }
    this.setState({ best });
  }

  componentDidMount() {
    this.getRates();
    const socket = socketIOClient(process.env.SOCKET_URL, {
      path: '/ws',
      transports: ['websocket'],
    });
    socket.on('disconnect', (reason: string) => {
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        socket.connect();
      }
      // else the socket will automatically try to reconnect
    });
    socket.on('error', (error: any) => {
      console.log(error);
    });
    socket.emit('join', this.props.retailCityId);
    socket.emit('join', this.props.wholesaleCityId);
    socket.on('update', (data: ExchangeRateUpdate) => {
      let needUpdate = false;
      if (
        data.city_id === this.props.retailCityId &&
        this.state.mode === 'retail'
      ) {
        needUpdate = true;
      } else if (
        data.city_id === this.props.wholesaleCityId &&
        this.state.mode === 'wholesale'
      ) {
        needUpdate = true;
      }

      if (needUpdate) {
        this.updateRate(data);
      }
    });
  }

  render() {
    return (
      <div className="flex justify-between flex-wrap">
        <div className="w-full lg:w-1/2 overflow-hidden">
          <ExchangeTable
            rates={this.state.rates}
            best={this.state.best}
            mode={this.state.mode}
            setMode={this.setMode.bind(this)}
            setSortBy={this.setSortBy.bind(this)}
            selectPoint={this.selectPoint.bind(this)}
          />
        </div>
        <div className="w-full lg:w-1/2 mt-2 md:mt-0">
          <YMap
            rates={this.state.rates}
            selectedPointId={this.state.selectedPointId}
            resetSelectedPointId={this.resetSelectedPoint.bind(this)}
            mode={this.state.mode}
          />
        </div>
      </div>
    );
  }
}

export default App;
