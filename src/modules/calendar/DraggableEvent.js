/**
 * Draggable Event Component
 * 
 * Purpose: Render draggable calendar events with advanced features
 * Features:
 * - Drag and drop support
 * - Visual feedback during drag
 * - Recurring event indicators
 * - Priority styling
 */

import React from 'react';
import { useDrag } from 'react-dnd';
import { PRIORITY_LEVELS } from '../../store/slices/calendarSlice';

const DraggableEvent = ({ event, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'EVENT',
    item: { event },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case PRIORITY_LEVELS.URGENT:
        return 'bg-red-100 border-red-500';
      case PRIORITY_LEVELS.HIGH:
        return 'bg-orange-100 border-orange-500';
      case PRIORITY_LEVELS.MEDIUM:
        return 'bg-yellow-100 border-yellow-500';
      case PRIORITY_LEVELS.LOW:
        return 'bg-green-100 border-green-500';
      default:
        return 'bg-blue-100 border-blue-500';
    }
  };

  return (
    <div
      ref={drag}
      onClick={onClick}
      className={`event-item ${event.status} ${isDragging ? 'opacity-50' : ''}`}
    >
      <span className="event-time">
        {new Date(event.date).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </span>
      <span className="event-title">{event.companyName}</span>
      {event.isRecurring && (
        <span className="recurring-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </span>
      )}
    </div>
  );
};

export default DraggableEvent;
