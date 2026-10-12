"use client";
import { createContext, useContext, type ReactNode } from "react";
const NativeMarketplaceQuerySlots = createContext(false);
export const NativeMarketplaceQuerySlotsProvider = ({ children }: { children: ReactNode }) =>
  <NativeMarketplaceQuerySlots.Provider value>{children}</NativeMarketplaceQuerySlots.Provider>;
export const useNativeMarketplaceQuerySlots = () => useContext(NativeMarketplaceQuerySlots);
