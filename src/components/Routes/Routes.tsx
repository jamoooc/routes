import { useEffect, useState } from "react";
import classes from "./routes.module.css";
import type {
  RouteNameType,
  RouteListItemType,
  RouteInformationType,
  RouteListReducerDispatch,
} from "../../types";

export default function Routes({
  routes,
  dispatch,
  stationData,
}: {
  routes: RouteListItemType[];
  dispatch: React.Dispatch<RouteListReducerDispatch>;
  stationData: RouteNameType[];
}): JSX.Element {
  return (
    <div className={classes.routeContainer}>
      <h1 className={classes.headerOne}>Routes</h1>
      <RouteList
        routes={routes}
        dispatch={dispatch}
        stationData={stationData}
      />
    </div>
  );
}

function RouteList({
  routes,
  dispatch,
  stationData,
}: {
  routes: RouteListItemType[];
  dispatch: React.Dispatch<RouteListReducerDispatch>;
  stationData: RouteNameType[];
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
              stationData={stationData}
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
  stationData,
  dispatch,
}: {
  routeListItem: RouteListItemType;
  stationData: RouteNameType[];
  dispatch: React.Dispatch<RouteListReducerDispatch>;
}): JSX.Element {
  const [editing, setEditing] = useState<boolean>(false);

  return (
    <li className={classes.routeListItem}>
      <div className={classes.routeListItemCard}>
        <RoutePoints
          editing={editing}
          dispatch={dispatch}
          setEditing={setEditing}
          stationData={stationData}
          currentRoute={routeListItem}
        />
        <RouteMenu
          editing={editing}
          dispatch={dispatch}
          setEditing={setEditing}
          routeListItem={routeListItem}
        />
        <RouteDepartureTimes
          editing={editing}
          routeInformation={{
            departureTimes: [
              new Date().toLocaleTimeString(),
              new Date().toLocaleTimeString(),
              new Date().toLocaleTimeString(),
            ],
          }}
        />
      </div>
    </li>
  );
}

function RoutePoints({
  currentRoute,
  editing,
  setEditing,
  stationData,
  dispatch,
}: {
  currentRoute: RouteListItemType;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  stationData: RouteNameType[];
  dispatch: React.Dispatch<RouteListReducerDispatch>;
}): JSX.Element {
  const [newOrigin, setNewOrigin] = useState<RouteNameType>(
    currentRoute.origin
  );
  const [newDestination, setNewDestination] = useState<RouteNameType>(
    currentRoute.destination
  );

  function onChange(
    e: React.ChangeEvent<HTMLSelectElement>,
    setState: React.Dispatch<React.SetStateAction<RouteNameType>>
  ) {
    console.log("called onChange");
    const selectedStation = stationData.find(
      (datum) => datum.naptanID === e.target.value
    );
    if (selectedStation) {
      setState(selectedStation);
    }
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log("onSubmit");
    e.preventDefault();
    dispatch({
      type: "update",
      route: {
        ...currentRoute,
        origin: newOrigin,
        destination: newDestination,
      },
    });
    setEditing(false);
  }
  return editing ? (
    <form className={classes.routePointsFormContainer} onSubmit={onSubmit}>
      <div className={classes.routePointsLabelContainer}>
        <label htmlFor="destination">To: </label>
        <select
          className={classes.routePointsSelect}
          key="destination"
          id="destination"
          defaultValue={currentRoute.destination.naptanID}
          onChange={(e) => onChange(e, setNewDestination)}
        >
          {stationData.map((station: RouteNameType) => (
            <option key={station.naptanID} value={station.naptanID}>
              {station.commonName}
            </option>
          ))}
        </select>
      </div>
      <div className={classes.routePointsLabelContainer}>
        <label htmlFor="origin">From: </label>
        <select
          className={classes.routePointsSelect}
          key="origin"
          id="origin"
          defaultValue={currentRoute.origin.naptanID}
          onChange={(e) => onChange(e, setNewOrigin)}
        >
          {stationData.map((station: RouteNameType) => (
            <option key={station.naptanID} value={station.naptanID}>
              {station.commonName}
            </option>
          ))}
        </select>
      </div>
      <div className={classes.editFormButtonContainer}>
        <button type="submit">
          <div>Submit</div>
        </button>
        <button type="button" onClick={() => setEditing(false)}>
          <div>Cancel</div>
        </button>
      </div>
    </form>
  ) : (
    <div className={classes.routePointsContainer}>
      <p className={classes.routePointsDirection}>
        To:{" "}
        <span className={classes.routePointsName}>
          {currentRoute.destination.commonName}
        </span>
      </p>
      <p className={classes.routePointsDirection}>
        From:{" "}
        <span className={classes.routePointsName}>
          {currentRoute.origin.commonName}
        </span>
      </p>
    </div>
  );
}

function RouteMenu({
  dispatch,
  routeListItem,
  editing,
  setEditing,
}: {
  dispatch: React.Dispatch<RouteListReducerDispatch>;
  routeListItem: RouteListItemType;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
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
    setOpen(false);
    setEditing(!editing);
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
  editing,
  routeInformation,
}: {
  editing: boolean;
  routeInformation: RouteInformationType;
}): JSX.Element {
  return (
    <div className={classes.routeDepartureTimeContainer}>
      <h4 className={classes.routeDepartureTimeTitle}>Departures:</h4>
      <ul
        className={
          classes.routeDepartureTimeList +
          " " +
          (editing === true ? classes.routeDepartureBg : "")
        }
      >
        {!routeInformation.departureTimes.length
          ? "No departures found"
          : routeInformation.departureTimes.map((departureTime, idx) => (
              <li key={idx} className={classes.routeDepartureTimeItem}>
                {departureTime}
              </li>
            ))}
      </ul>
    </div>
  );
}
