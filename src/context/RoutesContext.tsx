import { useReducer, createContext } from "react";
import routeListReducer from "../reducers/routeListReducer";
import type { RouteListItemType, RouteListReducerDispatch } from "../types";

export const RoutesContext = createContext<RouteListItemType[]>([]);
export const RoutesDispatchContext = createContext<
  React.Dispatch<RouteListReducerDispatch>
>(() => {});

function getStoredRoutes() {
  const storedRoutes = localStorage.getItem("routes");
  if (storedRoutes) {
    console.info("Restored routes from local storage.", storedRoutes);
  }
  return JSON.parse(storedRoutes || "[]");
}

export default function RoutesProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [routes, dispatch] = useReducer(routeListReducer, getStoredRoutes());

  return (
    <RoutesContext.Provider value={routes}>
      <RoutesDispatchContext.Provider value={dispatch}>
        {children}
      </RoutesDispatchContext.Provider>
    </RoutesContext.Provider>
  );
}
