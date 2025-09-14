import React, { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [branchId, setBranchId] = useState(null); // cơ sở đang chọn

  const value = useMemo(() => ({
    branchId,
    setBranchId,
  }), [branchId]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
