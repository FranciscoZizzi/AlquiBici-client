import React, {useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import mqtt from "mqtt";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UploadBikePage from "./pages/UploadBikePage";
import ActiveRentPage from "./pages/ActiveRentPage";
import {MQTT_HOSTNAME, MQTT_PORT} from "./utils/constants";
import AddFundsPage from "./pages/AddFundsPage";


function App() {
    const mqttUri = 'ws://' + MQTT_HOSTNAME + ':' + MQTT_PORT;
    const client = mqtt.connect(mqttUri);

    client.on("connect", () => {
        console.log("Connected to MQTT")
    })

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<HomePage client={client}/>}/>
          <Route path={'/login'} element={<LoginPage/>}/>
          <Route path={'/register'} element={<RegisterPage/>}/>
          <Route path={'/upload-bike'} element={<UploadBikePage/>}/>
          <Route path={'/map/:bikeId'} element={<ActiveRentPage client={client}/>}/>
          <Route path={'/add-funds'} element={<AddFundsPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
