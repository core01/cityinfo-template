const SET_SOCKET_ERROR = 'SET_SOCKET_ERROR';

interface SetSocketErrorAction {
  type: typeof SET_SOCKET_ERROR;
  payload: boolean;
}

export { SET_SOCKET_ERROR };

export type ActionTypes = SetSocketErrorAction;
