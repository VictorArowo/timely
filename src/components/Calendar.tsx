import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../redux/store";
import {
  selectUserEventsArray,
  loadUserEvents,
  UserEvent,
} from "../redux/user-events";
import addZero from "../utils/addZero";
import EventItem from "./EventItem";

const mapState = (state: RootState) => ({
  events: selectUserEventsArray(state),
});

const mapDispatch = {
  loadUserEvents,
};

const connector = connect(mapState, mapDispatch);

const createDateKey = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  return `${year}-${addZero(month)}-${addZero(day)}`;
};

const groupEventsByDay = (events: UserEvent[]) => {
  const groups: Record<string, UserEvent[]> = {};

  const addToGroup = (dateKey: string, event: UserEvent) => {
    if (groups[dateKey] === undefined) groups[dateKey] = [];

    groups[dateKey].push(event);
  };

  events.forEach((event) => {
    const dateStart = createDateKey(new Date(event.dateStart));
    const dateStop = createDateKey(new Date(event.dateEnd));

    addToGroup(dateStart, event);
    if (dateStop !== dateStart) addToGroup(dateStop, event);
  });

  return groups;
};

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {}

const Calendar: React.FC<Props> = ({ events, loadUserEvents }) => {
  useEffect(() => {
    loadUserEvents();
  }, []);

  let groupedEvents: ReturnType<typeof groupEventsByDay> | undefined;
  let sortedGroupedKeys: string[] | undefined;

  if (events.length) {
    groupedEvents = groupEventsByDay(events);

    sortedGroupedKeys = Object.keys(groupedEvents).sort(
      (date1, date2) => +new Date(date1) - +new Date(date2)
    );
  }

  return groupedEvents && sortedGroupedKeys ? (
    <div className="flex flex-col md:flex-row">
      {sortedGroupedKeys.map((dayKey) => {
        const events = groupedEvents![dayKey];
        const groupDate = new Date(dayKey);
        const day = groupDate.getDate();
        const month = groupDate.toLocaleDateString(undefined, {
          month: "long",
        });
        return (
          <div className="flex flex-col items-center md:ml-10 mt-10 md:mt-0">
            <span className="w-32 h-8 bg-blue-200 rounded text-gray-700 pt-1 flex items-center justify-center text-xl font-digital">
              {day} {month}
            </span>
            {events.map((event) => (
              <EventItem event={event} key={event.id} />
            ))}
          </div>
        );
      })}
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default connector(Calendar);
