import { useRef, useEffect, useState } from "react";
import classes from "./routes.module.css";
import type {
  RouteNameType,
  RouteListItemType,
  RouteDepartureTimesType,
  RouteListReducerDispatch,
} from "../../types";

export default function Routes({
  routes,
  dispatch,
}: {
  routes: RouteListItemType[];
  dispatch: React.Dispatch<RouteListReducerDispatch>;
}): JSX.Element {
  return (
    <div className={classes.routeContainer}>
      <h1 className={classes.headerOne}>Routes</h1>
      <RouteList routes={routes} dispatch={dispatch} />
    </div>
  );
}

function RouteList({
  routes,
  dispatch,
}: {
  routes: RouteListItemType[];
  dispatch: React.Dispatch<RouteListReducerDispatch>;
}): JSX.Element {
  return (
    <section className={classes.sectionContainer}>
      {!routes.length ? (
        <p>Add a route!</p>
      ) : (
        <ul className={classes.routeList}>
          {(routes || []).map((routeListItem: RouteListItemType) => (
            <RouteListItem
              key={routeListItem.id}
              routeListItem={routeListItem}
              dispatch={dispatch}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function RouteListItem({
  routeListItem,
  dispatch,
}: {
  routeListItem: RouteListItemType;
  dispatch: React.Dispatch<RouteListReducerDispatch>;
}): JSX.Element {
  const { origin, destination } = routeListItem;
  return (
    <li className={classes.routeListItem}>
      <div className={classes.routeListItemCard}>
        <RoutePoints origin={origin} destination={destination} />
        <RouteMenu dispatch={dispatch} routeListItem={routeListItem} />
        <RouteDepartureTimes
          departureTimes={[
            new Date().toLocaleTimeString(),
            new Date().toLocaleTimeString(),
            new Date().toLocaleTimeString(),
          ]}
        />
      </div>
    </li>
  );
}

function RoutePoints({
  origin,
  destination,
}: {
  origin: RouteNameType;
  destination: RouteNameType;
}): JSX.Element {
  return (
    <div className={classes.routePointsContainer}>
      <p className={classes.routePointsDirection}>
        To:{" "}
        <span className={classes.routePointsName}>
          {destination.commonName}
        </span>
      </p>
      <p className={classes.routePointsDirection}>
        From:{" "}
        <span className={classes.routePointsName}>{origin.commonName}</span>
      </p>
    </div>
  );
}

function RouteMenu({
  dispatch,
  routeListItem,
}: {
  dispatch: React.Dispatch<RouteListReducerDispatch>;
  routeListItem: RouteListItemType;
}): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);

  let timeoutID: NodeJS.Timeout;
  function onBlurHandler() {
    console.log("onBlurHandler");
    timeoutID = setTimeout(() => {
      setOpen(false);
    });
  }

  function onFocusHandler() {
    console.log("onFocusHandler");
    clearTimeout(timeoutID);
  }

  function onDeleteHandler(e: React.MouseEvent<HTMLButtonElement>) {
    console.log("onDeleteHandler");
    setOpen(false);
    dispatch({
      type: "delete",
      route: routeListItem,
    });
  }

  function onEditHandler(e: React.MouseEvent<HTMLButtonElement>) {
    console.log("onEditHandler");
  }

  return (
    <nav className={classes.routeMenuNav}>
      <button
        className={classes.routeMenuButton}
        onClick={() => setOpen(!open)}
        onBlur={onBlurHandler}
        onFocus={onFocusHandler}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={classes.svg}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
      </button>
      {open && (
        <div className={classes.menuContainer}>
          <ul>
            <li>
              <button
                title="Edit"
                onFocus={onFocusHandler}
                onClick={onEditHandler}
              >
                Edit
              </button>
            </li>
            <li>
              <button
                title="Delete"
                onFocus={onFocusHandler}
                onClick={onDeleteHandler}
              >
                Delete
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

function RouteDepartureTimes({
  departureTimes,
}: RouteDepartureTimesType): JSX.Element {
  return (
    <div className={classes.routeDepartureTimeContainer}>
      <h4 className={classes.routeDepartureTimeTitle}>Departures:</h4>
      <ul className={classes.routeDepartureTimeList}>
        {!departureTimes.length
          ? "No departures found"
          : departureTimes.map((departureTime, idx) => (
              <li key={idx} className={classes.routeDepartureTimeItem}>
                {departureTime}
              </li>
            ))}
      </ul>
    </div>
  );
}
