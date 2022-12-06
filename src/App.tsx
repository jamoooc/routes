import { useState } from "react";
import Header from "./components/Header/Header";
import Routes from "./components/Routes/Routes";
import SideMenu from "./components/SideMenu/SideMenu";
import "./App.css";

function App() {
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);

  return (
    <div className="App">
      <Header open={sideMenuOpen} setOpen={setSideMenuOpen} />
      <h1>Routes</h1>
      <SideMenu open={sideMenuOpen} setOpen={setSideMenuOpen} />
      <Routes />
    </div>
  );
}

export default App;
