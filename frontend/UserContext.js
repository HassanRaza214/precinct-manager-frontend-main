// UserContext.js
import { createContext } from 'react';

const UserContext = createContext({
  pollingStation: null,
  setPollingStation: () => {},
  precinctName: null,
  setPrecinctName: () => {},
  precinctAddress: null,  // Add this line
  setPrecinctAddress: () => {}, // Add this line
});

export default UserContext;