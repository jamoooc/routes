import { useState } from "react";
import Header from "./components/Header/Header";
import Routes from "./components/Routes/Routes";
import SideMenu from "./components/SideMenu/SideMenu";
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

function App() {
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);

  return (
    <div className="App">
      <Header setOpen={setSideMenuOpen} />
      <SideMenu open={sideMenuOpen} setOpen={setSideMenuOpen} />
      <Routes routes={routes} />
    </div>
  );
}

export default App;
