import React, { createContext, useContext, useState } from 'react'

const AppCtx = createContext(null)

export function AppProvider({ children }) {
  const [branchId, setBranchId] = useState(null) // null = all
  return <AppCtx.Provider value={{ branchId, setBranchId }}>{children}</AppCtx.Provider>
}

export function useApp() { return useContext(AppCtx) }
