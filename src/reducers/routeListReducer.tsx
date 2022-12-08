import type { RouteListItemType, RouteListReducerDispatch } from "../types";

export default function routeListReducer(
  routes: RouteListItemType[],
  action: RouteListReducerDispatch
) {
  switch (action.type) {
    case "update": {
      console.log("routeListReducer:update");
      return routes.map((route) =>
        route.id === action.route.id ? action.route : route
      );
    }
    case "delete": {
      console.log("routeListReducer:delete");
      return routes.filter((route) => route.id !== action.route.id);
    }
    default: {
      throw new Error("Unknown action: " + action.type);
    }
  }
}
