import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import mqtt from "mqtt";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UploadBikePage from "./pages/UploadBikePage";
import ActiveRentPage from "./pages/ActiveRentPage";
import {MQTT_HOSTNAME, MQTT_PORT, SERVER_HOSTNAME, SERVER_PORT} from "./utils/constants";
import AddFundsPage from "./pages/AddFundsPage";
import axios from "axios";

function App() {
    const email = localStorage.getItem("email");
    const mqttUri = 'ws://' + MQTT_HOSTNAME + ':' + MQTT_PORT;
    const client = mqtt.connect(mqttUri);

    client.on("connect", () => {
        console.log("Connected to MQTT")
    });

    client.subscribe("alquibici/" + email + "/return", () => {
        console.log("Connected to account topic");
    });

    client.on("message", (topic, message) => {
        if (topic === 'alquibici/' + email + '/return') {
            let json = toJson(message);
            console.log(JSON.stringify(json))
            const modifyBalance = async () => {
                let bikeRes = await axios.get('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + `/bikes/get/${json.bikeId}`).catch((e) => console.log("error"));
                let price = bikeRes.data.price
                let funds = json.distance * price / 1000;
                await axios.post('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + '/users/add-funds', {email, funds: funds});
            }
            modifyBalance();
        }
    });

    const toJson = (byteArray) => {
        let jsonString = Array.from(byteArray).map(byte => String.fromCharCode(byte)).join('');
        console.log(jsonString)
        return JSON.parse(jsonString);
    }

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
