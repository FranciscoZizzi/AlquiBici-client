import React, {useEffect, useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import mqtt from "mqtt";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UploadBikePage from "./pages/UploadBikePage";
import ActiveRentPage from "./pages/ActiveRentPage";
import {MQTT_HOSTNAME, MQTT_PORT} from "./utils/constants";


function App() {
    const mqttUri = 'ws://' + MQTT_HOSTNAME + ':' + MQTT_PORT;

    const [client, setClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (client != null) {
            console.log(client)
            client.on('connect', () => {
                if (!isConnected) {
                    setIsConnected(true);
                }
            });
            client.on('error', (err) => {
                console.error('Connection error: ', err);
                client.end();
                setIsConnected(false);
            });
        } else {
            setClient(mqtt.connect(mqttUri));
        }

    }, [client, isConnected]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<HomePage/>}/>
          <Route path={'/login'} element={<LoginPage/>}/>
          <Route path={'/register'} element={<RegisterPage/>}/>
          <Route path={'/upload-bike'} element={<UploadBikePage/>}/>
          {client ? <Route path={'/map/:bikeId'} element={<ActiveRentPage client={client}/>}/>: null}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
