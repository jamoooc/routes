import { useState, useEffect } from "react";
import RoutesProvider from "./context/RoutesContext";
import Header from "./components/Header/Header";
import Routes from "./components/Routes/Routes";
import SideMenu from "./components/SideMenu/SideMenu";
import type { RouteNameType, SideMenuStatus } from "./types";
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
  const [menuStatus, setMenuStatus] = useState<SideMenuStatus>("closed");
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
      <RoutesProvider>
        <>
          <Header setMenuStatus={setMenuStatus} />
          <SideMenu
            menuStatus={menuStatus}
            setMenuStatus={setMenuStatus}
            stationData={stationData}
          />
          <Routes stationData={stationData} />
        </>
      </RoutesProvider>
    </div>
  );
}

export default App;
