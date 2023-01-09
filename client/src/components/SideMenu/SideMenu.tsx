import React, { useRef, useState, useEffect, useContext } from "react";
import {
  RoutesContext,
  RoutesDispatchContext,
} from "../../context/RoutesContext";
import classes from "./sidemenu.module.css";
import type {
  RouteListItemType,
  RouteNameType,
  SideMenuStatus,
  LineDataType,
  StationDataType,
  DirectionDataType,
} from "../../types";

export default function SideMenu({
  menuStatus,
  setMenuStatus,
  stationData,
}: {
  menuStatus: SideMenuStatus;
  setMenuStatus: React.Dispatch<React.SetStateAction<SideMenuStatus>>;
  stationData: RouteNameType[];
}) {
  const closeSideMenuRef = useRef<HTMLButtonElement>(null);
  const routes = useContext(RoutesContext);

  useEffect(() => {
    if (closeSideMenuRef.current) {
      closeSideMenuRef.current.focus();
    }
  }, [menuStatus]);

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      // prevent exiting a full screen window if a no menu open
      if (e.key === "Escape" && menuStatus !== "closed") {
        e.preventDefault();
        setMenuStatus("closed");
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [menuStatus]);

  return menuStatus === "closed" ? (
    <></>
  ) : (
    <>
      <div
        className={classes.backgroundContainer}
        onClick={() => {
          setMenuStatus("closed");
        }}
      ></div>
      <div className={classes.menuContainer}>
        <section className={classes.section}>
          <div className={classes.container}>
            <div className={classes.iconContainer}>
              <button
                className={classes.closeButton}
                ref={closeSideMenuRef}
                onClick={() => {
                  setMenuStatus("closed");
                }}
                title="Close"
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
                    d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3"
                  />
                </svg>
              </button>
            </div>
            <div className={classes.headerContainer}>
              {menuStatus === "addRoute" && (
                <h2 className={classes.aboutHeader}>Add route</h2>
              )}
              {menuStatus === "about" && (
                <h2 className={classes.aboutHeader}>About</h2>
              )}
            </div>
          </div>
          <div className={classes.contentContainer}>
            {menuStatus === "addRoute" && (
              <RouteForm setMenuStatus={setMenuStatus} routes={routes} />
            )}
            {menuStatus === "about" && (
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

function RouteForm({
  routes,
  setMenuStatus,
}: {
  routes: RouteListItemType[];
  setMenuStatus: React.Dispatch<React.SetStateAction<SideMenuStatus>>;
}) {
  const dispatch = useContext(RoutesDispatchContext);

  // available tube lines
  const [lineData, setLineData] = useState<LineDataType[]>([]);
  const [selectedLine, setSelectedLine] = useState<LineDataType | null>(null);

  // list of origin/destination pairs to get inbound/outbound parameter
  const [directionData, setDirectionData] = useState<DirectionDataType[]>([]);
  const [selectedDirection, setSelectedDirection] =
    useState<DirectionDataType | null>(null);

  // ordered list of stations based on line direction
  const [stationData, setStationData] = useState<StationDataType[]>([]);
  const [selectedStation, setSelectedStation] =
    useState<StationDataType | null>(null);

  useEffect(() => {
    console.log("useEffect: lineData");
    if (!lineData.length) {
      fetch("http://localhost:3000/lines")
        .then(async (response) => {
          const data = await response.json();
          const lineData = data.map(({ id, name }: LineDataType) => ({
            id,
            name,
          }));
          setLineData(lineData);
        })
        .catch((e) => console.error(e));
    }
  }, []);

  useEffect(() => {
    console.log("useEffect: directionData");
    const lineID = selectedLine?.id;
    if (!directionData.length && lineID) {
      fetch(`http://localhost:3000/routes?lineID=${lineID}`)
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
  }, [selectedLine]);

  useEffect(() => {
    console.log("useEffect: stationData");

    const lineID = selectedLine?.id;
    const direction = selectedDirection?.direction;

    if (!lineID || !direction) {
      console.error("Invalid lineID or direction", lineID, direction);
      return;
    }

    if (!stationData.length) {
      fetch(
        `http://localhost:3000/route-stoppoints?lineID=${lineID}&direction=${direction}`
      )
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

  function onLineChange(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log("onLineChange", e.target.value);

    const newLine = lineData.find((line) => line.id === e.target.value);
    if (!newLine) {
      console.error("Error: invalid direction data");
      return;
    }

    // clear selected route and station when a new line is selected
    if (selectedLine && selectedLine.id !== newLine.id) {
      if (selectedDirection) {
        setSelectedDirection(null);
      }
      if (selectedStation) {
        setSelectedStation(null);
      }
    }
    setSelectedLine(newLine);
  }

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

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log("onSubmit");
    e.preventDefault();
    if (selectedLine && selectedDirection && selectedStation) {
      console.log("onSubmit dispatch");
      dispatch({
        type: "add",
        route: {
          id: routes.length + 1, // TODO: use a unique ID
          selectedLine,
          selectedDirection,
          selectedStation,
        },
      });
      setMenuStatus("closed");
    }
    console.log(selectedLine, selectedDirection, selectedStation);
  }

  if (!lineData.length) {
    return <></>;
  } else {
    return (
      <>
        <form onSubmit={onSubmit} className={classes.addRouteForm}>
          <div>
            <div className={classes.addRouteFormLabelContainer}>
              <label htmlFor="line">Service: </label>
            </div>
            <select key="line" id="line" onChange={onLineChange}>
              <option>"Select line"</option>
              {lineData.map((line: LineDataType) => (
                <option key={line.id} value={line.id}>
                  {line.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className={classes.addRouteFormLabelContainer}>
              <label htmlFor="route">Direction: </label>
            </div>
            <select key="route" id="route" onChange={(e) => onRouteChange(e)}>
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
          <div>
            <div className={classes.addRouteFormLabelContainer}>
              <label htmlFor="departure">Departure station: </label>
            </div>
            <select key="departure" id="departure" onChange={onStationChange}>
              <option>"Select departure station"</option>
              {stationData.map((station: StationDataType) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>
          <div className={classes.addRouteFormButtonContainer}>
            <button type="submit">Submit</button>
          </div>
        </form>
      </>
    );
  }
}
