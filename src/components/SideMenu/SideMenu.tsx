import React, { useRef, useState, useEffect, useContext } from "react";
import {
  RoutesContext,
  RoutesDispatchContext,
} from "../../context/RoutesContext";
import classes from "./sidemenu.module.css";
import type { RouteListItemType, RouteNameType } from "../../types";

export default function SideMenu({
  routeMenuOpen,
  aboutMenuOpen,
  setRouteMenuOpen,
  setAboutMenuOpen,
  stationData,
}: {
  aboutMenuOpen: boolean;
  routeMenuOpen: boolean;
  setRouteMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAboutMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  stationData: RouteNameType[];
}) {
  const closeSideMenuRef = useRef<HTMLButtonElement>(null);
  const routes = useContext(RoutesContext);

  useEffect(() => {
    if (closeSideMenuRef.current) {
      closeSideMenuRef.current.focus();
    }
  }, [aboutMenuOpen, routeMenuOpen]);

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      // prevent exiting a full screen window if a no menu open
      if (e.key === "Escape" && (routeMenuOpen || aboutMenuOpen)) {
        e.preventDefault();
        setAboutMenuOpen(false);
        setRouteMenuOpen(false);
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [aboutMenuOpen, routeMenuOpen]);

  return !aboutMenuOpen && !routeMenuOpen ? (
    <></>
  ) : (
    <>
      <div
        className={classes.backgroundContainer}
        onClick={() => {
          setAboutMenuOpen(false);
          setRouteMenuOpen(false);
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
                  setAboutMenuOpen(false);
                  setRouteMenuOpen(false);
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
              {routeMenuOpen && (
                <h2 className={classes.aboutHeader}>Add route</h2>
              )}
              {aboutMenuOpen && <h2 className={classes.aboutHeader}>About</h2>}
            </div>
          </div>
          <div className={classes.contentContainer}>
            {routeMenuOpen && (
              <RouteForm
                setRouteMenuOpen={setRouteMenuOpen}
                stationData={stationData}
                routes={routes}
              />
            )}
            {aboutMenuOpen && (
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
  stationData,
  routes,
  setRouteMenuOpen,
}: {
  stationData: RouteNameType[];
  routes: RouteListItemType[];
  setRouteMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  if (!stationData.length) {
    return <></>; // TODO: err
  }

  const dispatch = useContext(RoutesDispatchContext);
  const [origin, setOrigin] = useState<RouteNameType>(stationData[0]);
  const [destination, setDestination] = useState<RouteNameType>(stationData[0]);

  function onChange(
    e: React.ChangeEvent<HTMLSelectElement>,
    setState: React.Dispatch<React.SetStateAction<RouteNameType>>
  ) {
    console.log("onChange");
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
    if (origin?.naptanID && destination?.naptanID) {
      dispatch({
        type: "add",
        route: {
          id: routes.length + 1,
          origin,
          destination,
        },
      });
      setRouteMenuOpen(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={classes.addRouteForm}>
      <div>
        <div className={classes.addRouteFormLabelContainer}>
          <label htmlFor="origin">From: </label>
        </div>
        <select
          key="origin"
          id="origin"
          defaultValue={stationData[0].naptanID}
          onChange={(e) => onChange(e, setOrigin)}
        >
          {stationData.map((station: RouteNameType) => (
            <option key={station.naptanID} value={station.naptanID}>
              {station.commonName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <div className={classes.addRouteFormLabelContainer}>
          <label htmlFor="destination" className="destination-label">
            To:{" "}
          </label>
        </div>
        <select
          key="destination"
          id="destination"
          defaultValue={stationData[0].naptanID}
          onChange={(e) => onChange(e, setDestination)}
        >
          {stationData.map((station: RouteNameType) => (
            <option key={station.naptanID} value={station.naptanID}>
              {station.commonName}
            </option>
          ))}
        </select>
      </div>
      <div className={classes.addRouteFormButtonContainer}>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}
