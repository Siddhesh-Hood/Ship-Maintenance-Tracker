
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorage';

const AppContext = createContext();

// Initial state with sample data
const initialState = {
  users: [
    { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123" },
    { id: "2", role: "Inspector", email: "inspector@entnt.in", password: "inspect123" },
    { id: "3", role: "Engineer", email: "engineer@entnt.in", password: "engine123" }
  ],
  ships: [
    { id: "s1", name: "Ever Given", imo: "9811000", flag: "Panama", status: "Active" },
    { id: "s2", name: "Maersk Alabama", imo: "9164263", flag: "USA", status: "Under Maintenance" }
  ],
  components: [
    { id: "c1", shipId: "s1", name: "Main Engine", serialNumber: "ME-1234", installDate: "2020-01-10", lastMaintenanceDate: "2024-03-12" },
    { id: "c2", shipId: "s2", name: "Radar", serialNumber: "RAD-5678", installDate: "2021-07-18", lastMaintenanceDate: "2023-12-01" }
  ],
  jobs: [
    { id: "j1", componentId: "c1", shipId: "s1", type: "Inspection", priority: "High", status: "Open", assignedEngineerId: "3", scheduledDate: "2025-05-05", createdDate: "2024-12-01", description: "Regular engine inspection" }
  ],
  notifications: [
    { id: "n1", message: "New inspection job created for Ever Given", type: "job-created", timestamp: "2024-12-01T10:00:00Z", read: false }
  ],
  currentUser: null,
  isAuthenticated: false,
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'ADD_SHIP':
      return { ...state, ships: [...state.ships, action.payload] };
    case 'UPDATE_SHIP':
      return {
        ...state,
        ships: state.ships.map(ship =>
          ship.id === action.payload.id ? action.payload : ship
        ),
      };
    case 'DELETE_SHIP':
      return {
        ...state,
        ships: state.ships.filter(ship => ship.id !== action.payload),
      };
    case 'ADD_COMPONENT':
      return { ...state, components: [...state.components, action.payload] };
    case 'UPDATE_COMPONENT':
      return {
        ...state,
        components: state.components.map(component =>
          component.id === action.payload.id ? action.payload : component
        ),
      };
    case 'DELETE_COMPONENT':
      return {
        ...state,
        components: state.components.filter(component => component.id !== action.payload),
      };
    case 'ADD_JOB':
      return { ...state, jobs: [...state.jobs, action.payload] };
    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map(job =>
          job.id === action.payload.id ? action.payload : job
        ),
      };
    case 'DELETE_JOB':
      return {
        ...state,
        jobs: state.jobs.filter(job => job.id !== action.payload),
      };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload ? { ...notification, read: true } : notification
        ),
      };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    default:
      return state;
  }
};

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = getFromLocalStorage();
    if (Object.keys(savedData).length > 0) {
      dispatch({ type: 'LOAD_DATA', payload: savedData });
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToLocalStorage(state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
