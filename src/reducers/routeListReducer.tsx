import type { RouteListItemType, RouteListReducerDispatch } from "../types";

export default function routeListReducer(
  routes: RouteListItemType[],
  action: RouteListReducerDispatch
) {
  switch (action.type) {
    case "delete": {
      return routes.filter((route) => route.id !== action.route.id);
    }
    default: {
      throw new Error("Unknown action: " + action.type);
    }
  }
}
