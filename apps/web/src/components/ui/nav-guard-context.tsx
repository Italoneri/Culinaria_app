'use client';

import { createContext, useContext, useRef, useCallback } from 'react';

type NavGuardFn = (targetHref: string) => boolean;

type NavGuardContextValue = {
  registerGuard: (fn: NavGuardFn) => void;
  unregisterGuard: () => void;
  checkGuard: (targetHref: string) => boolean;
};

const NavGuardContext = createContext<NavGuardContextValue>({
  registerGuard: () => {},
  unregisterGuard: () => {},
  checkGuard: () => true,
});

export function NavGuardProvider({ children }: { children: React.ReactNode }) {
  const guardRef = useRef<NavGuardFn | null>(null);

  const registerGuard = useCallback((fn: NavGuardFn) => {
    guardRef.current = fn;
  }, []);

  const unregisterGuard = useCallback(() => {
    guardRef.current = null;
  }, []);

  // Returns true if navigation is allowed, false if blocked
  const checkGuard = useCallback((targetHref: string) => {
    if (!guardRef.current) return true;
    return guardRef.current(targetHref);
  }, []);

  return (
    <NavGuardContext.Provider value={{ registerGuard, unregisterGuard, checkGuard }}>
      {children}
    </NavGuardContext.Provider>
  );
}

export const useNavGuard = () => useContext(NavGuardContext);
