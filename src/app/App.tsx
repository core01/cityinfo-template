import * as React from 'react';
import { hot } from 'react-hot-loader';
import './App.css';
import * as socketIOClient from 'socket.io-client';

export interface Props {
}

interface State {
  endpoint: string;
  response: {
    name?: string
  },
}

class App extends React.Component<Props, State>  {
  constructor (props: Props) {
    super(props);
    this.state = {
      endpoint: process.env.SOCKET_URL,
      response: { },
    };
  }

  componentDidMount () {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.emit('test', 'this is test data emitted from frontend');
    socket.on('update', (data:any) => {
      this.setState({response: data});
    })
  }

  render () {
    return (
      <div className="App">
        { this.state.response.name ? <h1>{ this.state.response.name}</h1> : <h1>Нет данных</h1>}
      </div>
    );
  }
}

export default hot(module)(App);