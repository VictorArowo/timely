import React, { useState, useRef, useEffect } from "react";
import {
  UserEvent,
  deleteUserEvent,
  updateUserEvent,
} from "../redux/user-events";
import { useDispatch } from "react-redux";

interface Props {
  event: UserEvent;
}

const EventItem: React.FC<Props> = ({ event }) => {
  const [editable, setEditable] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const [title, setTitle] = useState(event.title);

  useEffect(() => {
    if (editable) {
      inputRef.current?.focus();
    }
  }, [editable]);

  const handleDelete = (id: UserEvent["id"]) => {
    dispatch(deleteUserEvent(id));
  };

  const handleTitleClick = () => {
    setEditable(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleBlur = () => {
    setEditable(false);
    if (title !== event.title) dispatch(updateUserEvent({ ...event, title }));
  };

  const startTime = new Date(event.dateStart).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const endTime = new Date(event.dateEnd).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div>
      <div className="flex justify-between px-2 bg-blue-200 rounded mt-5 w-64 h-12 items-center shadow-xl">
        <div>
          <div className="text-gray-700 text-sm">
            {startTime} - {endTime}
          </div>
          {editable ? (
            <input
              value={title}
              onChange={handleInputChange}
              ref={inputRef}
              onBlur={handleBlur}
            />
          ) : (
            <span className="text-gray-800 text-lg" onClick={handleTitleClick}>
              {event.title}
            </span>
          )}
        </div>
        <button
          className="text-4xl text-gray-800"
          onClick={() => handleDelete(event.id)}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default EventItem;
