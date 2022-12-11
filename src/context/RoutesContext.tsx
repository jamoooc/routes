import { useReducer, createContext } from "react";
import routeListReducer from "../reducers/routeListReducer";
import type { RouteListItemType, RouteListReducerDispatch } from "../types";

export const RoutesContext = createContext<RouteListItemType[]>([]);
export const RoutesDispatchContext = createContext<
  React.Dispatch<RouteListReducerDispatch>
>(() => {});

export default function RoutesProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [routes, dispatch] = useReducer(routeListReducer, []);

  return (
    <RoutesContext.Provider value={routes}>
      <RoutesDispatchContext.Provider value={dispatch}>
        {children}
      </RoutesDispatchContext.Provider>
    </RoutesContext.Provider>
  );
}
