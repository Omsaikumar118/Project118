/**
 * Droppable Calendar Cell Component
 * 
 * Purpose: Handle event drops and display calendar cells
 * Features:
 * - Drop zone for events
 * - Visual feedback during drag over
 * - Handles recurring event updates
 */

import React from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { updateEvent } from '../../store/slices/calendarSlice';
import './DroppableCell.css';
import DraggableEvent from './DraggableEvent';

const DroppableCell = ({
  date,
  events,
  onEventClick,
  isToday,
  isCurrentMonth,
  view
}) => {
  const dispatch = useDispatch();

  const [{ isOver }, drop] = useDrop({
    accept: 'EVENT',
    drop: (item) => {
      const eventDate = new Date(date);
      const oldDate = new Date(item.event.date);
      
      // Preserve the time from the original event
      eventDate.setHours(oldDate.getHours());
      eventDate.setMinutes(oldDate.getMinutes());
      
      dispatch(updateEvent({ 
        id: item.event.id,
        event: {
          ...item.event,
          date: eventDate.toISOString()
        },
        updateRecurrences: item.event.recurringGroupId ? true : false 
      }));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const cellClasses = [
    'calendar-cell',
    isToday && 'today',
    !isCurrentMonth && 'different-month',
    isOver && 'is-over'
  ].filter(Boolean).join(' ');

  return (
    <div ref={drop} className={cellClasses}>
      <div className="date-display">
        <span>
          {date.toLocaleDateString(undefined, {
            weekday: view === 'day' ? 'long' : 'short',
            month: 'short',
            day: 'numeric',
          })}
        </span>
        {view === 'day' && (
          <span className="weekday">
            {date.toLocaleDateString(undefined, { weekday: 'long' })}
          </span>
        )}
      </div>
      
      <div className="events-container">
        {events.map((event) => (
          <DraggableEvent
            key={event.id}
            event={event}
            onClick={() => onEventClick(event)}
          />
        ))}
      </div>
    </div>
  );
};

export default DroppableCell;
