import * as React from "react"
import { type SidebarContext } from "./types"

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebarContext() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider")
  }
  return context
}

export { SidebarContext, useSidebarContext }