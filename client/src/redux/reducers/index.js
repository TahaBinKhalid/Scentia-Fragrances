import { combineReducers } from 'redux';
import authReducer from './authReducer';
import cartReducer from './cartReducer';
// import other reducers...

const appReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  // ...other reducers
});

const rootReducer = (state, action) => {
  // THIS IS THE FIX: If the action is LOGOUT, wipe the entire state
  if (action.type === 'LOGOUT_SUCCESS') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;