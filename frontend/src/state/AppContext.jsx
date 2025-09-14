// src/state/AppContext.jsx (ví dụ)
import React, { createContext, useContext } from "react";

const AppContext = createContext({});

export function AppProvider({ children }) {
  // hard-code admin
  const user = { username: "admin", role: "MANAGER" };

  return (
    <AppContext.Provider value={{ user }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
