import { useContext, useEffect, useState, useRef } from "react";
import {
  RoutesContext,
  RoutesDispatchContext,
} from "../../context/RoutesContext";
import classes from "./routes.module.css";
import type {
  RouteNameType,
  RouteListItemType,
  RouteInformationType,
  StationDataType,
  DirectionDataType,
} from "../../types";

export default function Routes({
  stationData,
}: {
  stationData: RouteNameType[];
}): JSX.Element {
  return (
    <div className={classes.routeContainer}>
      <h1 className={classes.headerOne}>Routes</h1>
      <RouteList stationData={stationData} />
    </div>
  );
}

function RouteList({
  stationData,
}: {
  stationData: RouteNameType[];
}): JSX.Element {
  const routes = useContext(RoutesContext);

  return (
    <section className={classes.sectionContainer}>
      {!routes.length ? (
        <p>Add a route!</p>
      ) : (
        <ul
          className={
            routes.length > 3
              ? classes.routeList
              : classes.routeListSingleColumn
          }
        >
          {(routes || []).map((routeListItem: RouteListItemType) => (
            <RouteListItem
              key={routeListItem.id}
              routeListItem={routeListItem}
              stationData={stationData}
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
}: {
  routeListItem: RouteListItemType;
  stationData: RouteNameType[];
}): JSX.Element {
  const [editing, setEditing] = useState<boolean>(false);
  const routes = useContext(RoutesContext);

  return (
    <li
      className={
        routes.length > 3
          ? classes.routeListItem
          : classes.routeListItemSingleColumn
      }
    >
      <div className={classes.routeListItemCard}>
        <RoutePoints
          editing={editing}
          setEditing={setEditing}
          // stationData={stationData}
          currentRoute={routeListItem}
        />
        <RouteMenu setEditing={setEditing} routeListItem={routeListItem} />
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
}: {
  currentRoute: RouteListItemType;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element {
  // list of origin/destination pairs to get inbound/outbound parameter
  const [directionData, setDirectionData] = useState<DirectionDataType[]>([]);
  const [selectedDirection, setSelectedDirection] =
    useState<DirectionDataType | null>(currentRoute.selectedDirection);

  // ordered list of stations based on line direction
  const [stationData, setStationData] = useState<StationDataType[]>([]);
  const [selectedStation, setSelectedStation] =
    useState<StationDataType | null>(currentRoute.selectedStation);

  const dispatch = useContext(RoutesDispatchContext);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log("onSubmit");
    e.preventDefault();

    if (selectedDirection && selectedStation) {
      if (
        // only update if the values have changed
        selectedDirection !== currentRoute.selectedDirection ||
        selectedStation !== currentRoute.selectedStation
      ) {
        dispatch({
          type: "update",
          route: {
            ...currentRoute,
            selectedDirection,
            selectedStation,
          },
        });
      }
    } else {
      console.log("Error: invalid parameters");
      return;
    }
    setEditing(false);
  }

  useEffect(() => {
    console.log("useEffect: directionData");
    if (!directionData.length) {
      fetch("http://localhost:3000/routes")
        .then(async (response) => {
          const data = await response.json();
          const directionData = data.map(
            ({
              name,
              direction,
              originator,
              originationName,
              destination,
              destinationName,
            }: DirectionDataType) => ({
              name,
              direction,
              originator,
              originationName,
              destinationName,
              destination,
            })
          );
          setDirectionData(directionData);
        })
        .catch((e) => console.error(e));
    }
  }, [editing]);

  useEffect(() => {
    console.log("useEffect: stationData");
    if (!stationData.length) {
      fetch("http://localhost:3000/route-stoppoints")
        .then(async (response) => {
          const data = await response.json();
          const stationData = data.map(({ id, name }: StationDataType) => ({
            id,
            name,
          }));
          setStationData(stationData);
        })
        .catch((e) => console.error(e));
    }
  }, [selectedDirection]);

  function onRouteChange(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log("onRouteChange", e.target.value);

    const newDirection = directionData.find(
      (direction) => direction.name === e.target.value
    );

    if (!newDirection) {
      console.error("Error: invalid direction data");
      return;
    }

    // clear selected station when a new direction is selected
    if (selectedDirection && selectedDirection.name !== newDirection.name) {
      if (selectedStation) {
        setSelectedStation(null);
      }
    }
    setSelectedDirection(newDirection);
  }

  function onStationChange(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log("onDepartureChange", e.target.value);

    const station = stationData.find(
      (station) => station.id === e.target.value
    );
    if (!station) {
      console.error("Error: invalid station data");
      return;
    }
    setSelectedStation(station);
  }

  return editing ? (
    <form className={classes.routePointsFormContainer} onSubmit={onSubmit}>
      <div className={classes.routePointsLabelContainer}>
        <label htmlFor="direction">Route: </label>
        <select
          className={classes.routePointsSelect}
          key="direction"
          id="direction"
          onChange={(e) => onRouteChange(e)}
          defaultValue={currentRoute.selectedDirection.name}
        >
          <option>"Select direction"</option>
          {directionData.map((route: DirectionDataType) => (
            <option
              key={`${route.originator}${route.destination}`}
              value={route.name}
            >
              {`${route.originationName} -> ${route.destinationName} (${route.direction})`}
            </option>
          ))}
        </select>
      </div>
      <div className={classes.routePointsLabelContainer}>
        <label htmlFor="departure">From: </label>
        <select
          className={classes.routePointsSelect}
          key="departure"
          id="departure"
          onChange={onStationChange}
        >
          <option disabled={true} selected={true}>
            "Select departure station"
          </option>
          {stationData.map((station: StationDataType) => (
            <option key={station.id} value={station.id}>
              {station.name}
            </option>
          ))}
        </select>
      </div>
      <div className={classes.editFormButtonContainer}>
        <button type="submit" onClick={() => console.log("click")}>
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
        Route:{" "}
        <span className={classes.routePointsName}>
          {currentRoute.selectedDirection.name}
        </span>
      </p>
      <p className={classes.routePointsDirection}>
        From:{" "}
        <span className={classes.routePointsName}>
          {currentRoute.selectedStation.name}
        </span>
      </p>
    </div>
  );
}

function RouteMenu({
  routeListItem,
  setEditing,
}: {
  routeListItem: RouteListItemType;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useContext(RoutesDispatchContext);

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
    setEditing((editing) => !editing);
  }

  return (
    <nav className={classes.routeMenuNav}>
      <button
        className={classes.routeMenuButton}
        onClick={() => setOpen((open) => !open)}
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
