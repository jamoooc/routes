import type { RouteListItemType, RouteListReducerDispatch } from "../types";

function setLocalStorage(newRoutes: RouteListItemType[]) {
  try {
    console.info("Stored routes in local storage.");
    localStorage.setItem("routes", JSON.stringify(newRoutes));
  } catch (e) {
    console.error("Error adding routes to local storage: ", e);
  }
}

export default function routeListReducer(
  routes: RouteListItemType[],
  action: RouteListReducerDispatch
) {
  switch (action.type) {
    case "add": {
      const newRoutes = [...routes, action.route];
      setLocalStorage(newRoutes);
      return newRoutes;
    }
    case "update": {
      console.log("routeListReducer:update");
      const newRoutes = routes.map((route) =>
        route.id === action.route.id ? action.route : route
      );
      setLocalStorage(newRoutes);
      return newRoutes;
    }
    case "delete": {
      console.log("routeListReducer:delete");
      const newRoutes = routes.filter((route) => route.id !== action.route.id);
      setLocalStorage(newRoutes);
      return newRoutes;
    }
    default: {
      throw new Error("Unknown action: " + action.type);
    }
  }
}
