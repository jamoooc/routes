import { useState } from "react";
import classes from "./routes.module.css";

export type RouteNameType = {
  commonName: string;
  naptanID: string;
};

export type RouteListItemType = {
  id: number;
  origin: RouteNameType;
  destination: RouteNameType;
};

export type RouteDepartureTimesType = {
  departureTimes: string[]; // timestamp
};

const data: RouteNameType[] = [
  {
    commonName: "Liverpool Street Underground Station",
    naptanID: "940GZZLULVT",
  },
  {
    commonName: "East Acton Underground Station",
    naptanID: "940GZZLUEAN",
  },
];

const routes = [
  {
    id: 123,
    origin: data[0],
    destination: data[1],
  },
  {
    id: 456,
    origin: data[1],
    destination: data[0],
  },
  {
    id: 789,
    origin: data[0],
    destination: data[1],
  },
  {
    id: 135,
    origin: data[1],
    destination: data[0],
  },
  {
    id: 246,
    origin: data[0],
    destination: data[1],
  },
  {
    id: 654,
    origin: data[1],
    destination: data[0],
  },
  {
    id: 423,
    origin: data[0],
    destination: data[1],
  },
];

export default function Routes(): JSX.Element {
  return (
    <div className={classes.routeContainer}>
      <h1 className={classes.headerOne}>Routes</h1>
      <RouteList routes={routes} />
    </div>
  );
}

function RouteList({ routes }: { routes: RouteListItemType[] }): JSX.Element {
  return (
    <section className={classes.sectionContainer}>
      {!routes.length ? (
        <p>Add a route!</p>
      ) : (
        <ul className={classes.routeList}>
          {(routes || []).map((routeListItem: RouteListItemType) => (
            <RouteListItem
              key={routeListItem.origin.naptanID}
              routeListItem={routeListItem}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function RouteListItem({
  routeListItem,
}: {
  routeListItem: RouteListItemType;
}): JSX.Element {
  const { origin, destination } = routeListItem;
  return (
    <li className={classes.routeListItem}>
      <div className={classes.routeListItemCard}>
        <RoutePoints origin={origin} destination={destination} />
        <RouteMenu />
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

function RouteMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  let timeoutID: NodeJS.Timeout;
  function onBlurHandler() {
    console.log("onBlurHandler");
    timeoutID = setTimeout(() => {
      setIsOpen(false);
    });
  }

  function onFocusHandler() {
    console.log("onFocusHandler");
    clearTimeout(timeoutID);
  }

  return (
    <nav className={classes.routeMenuNav}>
      <button
        className={classes.routeMenuButton}
        onClick={() => setIsOpen(!isOpen)}
        onBlur={onBlurHandler}
        onFocus={onFocusHandler}
        aria-haspopup="menu"
        aria-expanded={isOpen}
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
      {isOpen && (
        <div className={classes.menuContainer}>
          <ul>
            <li>
              <button title="Edit" onClick={(e) => console.log("Edit")}>
                Edit
              </button>
            </li>
            <li>
              <button title="Delete" onClick={(e) => console.log("Delete")}>
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
