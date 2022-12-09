import { useState, useEffect, useReducer } from "react";
import Header from "./components/Header/Header";
import Routes from "./components/Routes/Routes";
import SideMenu from "./components/SideMenu/SideMenu";
import routeListReducer from "./reducers/routeListReducer";
import type { RouteNameType } from "./types";
import "./App.css";

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

function App() {
  const [aboutMenuOpen, setAboutMenuOpen] = useState<boolean>(false);
  const [routeMenuOpen, setRouteMenuOpen] = useState<boolean>(false);
  const [routes, dispatch] = useReducer(routeListReducer, []);
  const [stationData, setStationData] = useState<RouteNameType[]>([]);

  useEffect(() => {
    console.log("fetching stationData");
    setTimeout(() => {
      setStationData(data);
      console.log("fetched stationData");
    }, 1000);
  }, []);

  return (
    <div className="App">
      <Header
        setAboutMenuOpen={setAboutMenuOpen}
        setRouteMenuOpen={setRouteMenuOpen}
      />
      <SideMenu
        aboutMenuOpen={aboutMenuOpen}
        setAboutMenuOpen={setAboutMenuOpen}
        routeMenuOpen={routeMenuOpen}
        setRouteMenuOpen={setRouteMenuOpen}
        stationData={stationData}
        dispatch={dispatch}
        routes={routes}
      />
      <Routes routes={routes} dispatch={dispatch} stationData={stationData} />
    </div>
  );
}

export default App;
