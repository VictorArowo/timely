import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import userEventsReducer from "./user-events";
import recordReducer from "./recorder";

const rootReducer = combineReducers({
  userEvents: userEventsReducer,
  recorder: recordReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
