import { combineReducers } from 'redux';

const auth = (state = {}, action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};

const reducers = combineReducers({
  auth
});

export default reducers;
