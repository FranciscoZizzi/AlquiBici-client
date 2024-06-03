import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import mqtt from "mqtt";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UploadBikePage from "./pages/UploadBikePage";
import ActiveRentPage from "./pages/ActiveRentPage";
import {MQTT_HOSTNAME, MQTT_PORT} from "./utils/constants";
import AddFundsPage from "./pages/AddFundsPage";
import axios from "axios";

function App() {
    const email = localStorage.getItem("email");
    const mqttUri = 'ws://' + MQTT_HOSTNAME + ':' + MQTT_PORT;
    const client = mqtt.connect(mqttUri);

    client.on("connect", () => {
        console.log("Connected to MQTT")
    });

    let isLoggedIn = !!email;

    const homePage = isLoggedIn ? <HomePage client={client}/> : <LoginPage/>;
    const uploadBikePage = isLoggedIn ? <UploadBikePage/> : <LoginPage/>;
    const activeRentPage = isLoggedIn ? <ActiveRentPage client={client}/> : <LoginPage/>;
    const addFundsPage = isLoggedIn ? <AddFundsPage/> : <LoginPage/>;

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={'/login'} element={<LoginPage/>}/>
          <Route path={'/register'} element={<RegisterPage/>}/>
          <Route path={'/'} element={homePage}/>
          <Route path={'/upload-bike'} element={uploadBikePage}/>
          <Route path={'/map/:bikeId'} element={activeRentPage}/>
          <Route path={'/add-funds'} element={addFundsPage}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
