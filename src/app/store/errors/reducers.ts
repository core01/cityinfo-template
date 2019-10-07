import { ActionTypes, SET_SOCKET_ERROR } from './types';

export interface State {
  socketError: boolean;
}

const initialState: State = {
  socketError: false,
};

const errorReducer = (state = initialState, action: ActionTypes) => {
  switch (action.type) {
    case SET_SOCKET_ERROR:
      return {
        ...state,
        socketError: action.payload,
      };
      break;
    default:
      return state;
  }
};

export { errorReducer };
