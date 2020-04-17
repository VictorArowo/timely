import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import axios from "axios";
import { RootState } from "./store";
import { selectDateStart } from "./recorder";
import generateId from "../utils/generateId";

export interface UserEvent {
  id: string;
  title: string;
  dateStart: string;
  dateEnd: string;
}

interface UserEventState {
  byIds: Record<UserEvent["id"], UserEvent>;
  allIds: UserEvent["id"][];
}

const selectUserEventsState = (rootState: RootState) => rootState.userEvents;

export const selectUserEventsArray = (rootState: RootState) => {
  const state = selectUserEventsState(rootState);

  return state.allIds.map((id) => state.byIds[id]);
};

const initialState: UserEventState = {
  byIds: {},
  allIds: [],
};

const LOAD_REQUEST = "userEvents/load_request";
const LOAD_SUCCESS = "userEvents/load_success";
const LOAD_FAILURE = "userEvents/load_failure";

type LoadRequestAction = Action<typeof LOAD_REQUEST>;
interface LoadSuccessAction extends Action<typeof LOAD_SUCCESS> {
  payload: {
    events: UserEvent[];
  };
}
interface LoadFailureAction extends Action<typeof LOAD_FAILURE> {
  error: string;
}

export const loadUserEvents = (): ThunkAction<
  void,
  RootState,
  undefined,
  LoadRequestAction | LoadSuccessAction | LoadFailureAction
> => async (dispatch) => {
  dispatch({
    type: LOAD_REQUEST,
  });

  try {
    const events: UserEvent[] = JSON.parse(localStorage.getItem("events")!);
    dispatch({
      type: LOAD_SUCCESS,
      payload: {
        events,
      },
    });
  } catch (error) {
    dispatch({
      type: LOAD_FAILURE,
      error: "Failed to load",
    });
  }
};

const CREATE_REQUEST = "userEvents/create_request";
const CREATE_SUCCESS = "userEvents/create_success";
const CREATE_FAILURE = "userEvents/create_failure";

type CreateRequestAction = Action<typeof CREATE_REQUEST>;
interface CreateSuccessAction extends Action<typeof CREATE_SUCCESS> {
  payload: {
    event: UserEvent;
  };
}
interface CreateFailureAction extends Action<typeof CREATE_FAILURE> {
  error: string;
}

export const createUserEvent = (): ThunkAction<
  Promise<void>,
  RootState,
  undefined,
  CreateRequestAction | CreateSuccessAction | CreateFailureAction
> => async (dispatch, getState) => {
  dispatch({
    type: CREATE_REQUEST,
  });

  try {
    const dateStart = selectDateStart(getState());
    const event: UserEvent = {
      dateStart,
      dateEnd: new Date().toISOString(),
      title: "Untitled Event",
      id: generateId(),
    };

    const events = JSON.parse(localStorage.getItem("events")!);
    events.push(event);
    localStorage.setItem("events", JSON.stringify(events));

    dispatch({
      type: CREATE_SUCCESS,
      payload: {
        event,
      },
    });
  } catch (error) {
    dispatch({
      type: CREATE_FAILURE,
      error: "Failed to load",
    });
  }
};

const DELETE_REQUEST = "userEvents/delete_request";
const DELETE_SUCCESS = "userEvents/delete_success";
const DELETE_FAILURE = "userEvents/delete_failure";

type DeleteRequestAction = Action<typeof DELETE_REQUEST>;
interface DeleteSuccessAction extends Action<typeof DELETE_SUCCESS> {
  payload: {
    id: UserEvent["id"];
  };
}
interface DeleteFailureAction extends Action<typeof DELETE_FAILURE> {
  error: string;
}

export const deleteUserEvent = (
  id: UserEvent["id"]
): ThunkAction<
  Promise<void>,
  RootState,
  undefined,
  DeleteRequestAction | DeleteSuccessAction | DeleteFailureAction
> => async (dispatch, getState) => {
  dispatch({
    type: DELETE_REQUEST,
  });

  try {
    const events: UserEvent[] = JSON.parse(localStorage.getItem("events")!);
    const filteredEvents = events.filter((event) => event.id !== id);
    localStorage.setItem("events", JSON.stringify(filteredEvents));

    dispatch({
      type: DELETE_SUCCESS,
      payload: {
        id,
      },
    });
  } catch (error) {
    dispatch({
      type: DELETE_FAILURE,
      error: "Failed to load",
    });
  }
};

const UPDATE_REQUEST = "userEvents/update_request";
const UPDATE_SUCCESS = "userEvents/update_success";
const UPDATE_FAILURE = "userEvents/update_failure";

type UpdateRequestAction = Action<typeof UPDATE_REQUEST>;
interface UpdateSuccessAction extends Action<typeof UPDATE_SUCCESS> {
  payload: {
    event: UserEvent;
  };
}
interface UpdateFailureAction extends Action<typeof UPDATE_FAILURE> {
  error: string;
}

export const updateUserEvent = (
  event: UserEvent
): ThunkAction<
  Promise<void>,
  RootState,
  undefined,
  UpdateRequestAction | UpdateSuccessAction | UpdateFailureAction
> => async (dispatch, getState) => {
  dispatch({
    type: UPDATE_REQUEST,
  });

  try {
    const events: UserEvent[] = JSON.parse(localStorage.getItem("events")!);
    const updatedEvents = events.map((oldEvent) =>
      oldEvent.id === event.id ? event : oldEvent
    );
    localStorage.setItem("events", JSON.stringify(updatedEvents));

    dispatch({
      type: UPDATE_SUCCESS,
      payload: {
        event,
      },
    });
  } catch (error) {
    dispatch({
      type: UPDATE_FAILURE,
      error: "Failed to load",
    });
  }
};

const userEventsReducer = (
  state: UserEventState = initialState,
  action:
    | LoadSuccessAction
    | CreateSuccessAction
    | DeleteSuccessAction
    | UpdateSuccessAction
) => {
  switch (action.type) {
    case LOAD_SUCCESS:
      const { events } = action.payload;
      return {
        ...state,
        allIds: events.map(({ id }) => id),
        byIds: events.reduce<UserEventState["byIds"]>((byIds, event) => {
          byIds[event.id] = event;
          return byIds;
        }, {}),
      };

    case CREATE_SUCCESS:
      const { event } = action.payload;
      return {
        ...state,
        allIds: [...state.allIds, event.id],
        byIds: { ...state.byIds, [event.id]: event },
      };

    case DELETE_SUCCESS:
      const { id } = action.payload;
      const newState = {
        ...state,
        byIds: { ...state.byIds },
        allIds: state.allIds.filter((storedId) => storedId !== id),
      };

      delete newState.byIds[id];
      return newState;

    case UPDATE_SUCCESS:
      const { event: updatedEvent } = action.payload;

      return {
        ...state,
        byIds: { ...state.byIds, [updatedEvent.id]: updatedEvent },
      };

    default:
      return state;
  }
};

export default userEventsReducer;
