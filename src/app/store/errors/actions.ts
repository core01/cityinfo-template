import { SET_SOCKET_ERROR, ActionTypes } from './types';

const setSocketError = (error: boolean): ActionTypes => {
  return {
    type: SET_SOCKET_ERROR,
    payload: error,
  };
};

export { setSocketError };
