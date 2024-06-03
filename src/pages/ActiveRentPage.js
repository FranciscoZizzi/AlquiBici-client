import React, {useEffect, useState} from 'react';
import BikeMap from "../components/BikeMap";
import {useParams} from "react-router-dom";
import axios from "axios";
import {SERVER_HOSTNAME, SERVER_PORT} from "../utils/constants";

const ActiveRentPage = ({client}) => {
    const [positionData, setPositionData] = useState(
        {
            coords: [0, 0],
            name: "Current position",
        }
    );
    const [distance, setDistance] = useState(0);
    const [bikeData, setBikeData] = useState({ownerName: 'loading', rentDistance: 'loading', price: "loading", id:"loading"});
    const [clientData, setClientData] = useState({name: 'loading'});
    const [cost, setCost] = useState(0);
    const [isAllowed, setIsAllowed] = useState(false);

    const {bikeId} = useParams();


    useEffect(() => {
        const getBikeData = async () => {
            let bikeRes = await axios.get('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + `/bikes/get/${bikeId}`).catch((e) => console.log("error"));
            setBikeData(bikeRes.data);

            let bikeData = bikeRes.data

            let clientRes = bikeRes.data.renterEmail ? await axios.get('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + `/users/get/${bikeData.renterEmail}`) : {data: {name: 'loading'}};
            setClientData(clientRes.data);

            let email = localStorage.getItem("email");
            let userRes = await axios.get('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + `/users/get/${email}`);
            if (userRes.data.isAdmin || userRes.data.email === clientRes.data.email) {
                setIsAllowed(true);
            }

            client.subscribe('alquibici/' + bikeData.id + '/return', (e) => {
                if (!e) {
                    console.log('subscribed to alquibici/' + bikeData.id + '/return');
                } else {
                    console.log(e);
                }
            });

            let positionTopic = 'alquibici/' + bikeData.id + '/position'
            client.subscribe(positionTopic, (e) => {
                if (!e) {
                    console.log('subscribed to ' + positionTopic);
                } else {
                    console.log(e);
                }
            });
            client.publish('alquibici/' + bikeData.id + '/ping', "ping");
        }
        getBikeData();
    }, []);

    useEffect(() => {
        client.on("message", (topic, message) => {
            if (topic === 'alquibici/' + bikeData.id + '/position') {
                let json = toJson(message);
                let dist = parseFloat(json.distance);
                setPosition(json.lat, json.long);
                setDistance(dist);
                setCost(bikeData.price * dist / 1000.0);
            }
        });
    }, [bikeData]);

    const setPosition = (lat, long) => {
        setPositionData({coords: [lat, long], name: "Current position"});
    }

    const toJson = (byteArray) => {
        let jsonString = Array.from(byteArray).map(byte => String.fromCharCode(byte)).join('');
        console.log(jsonString)
        return JSON.parse(jsonString);
    }

    const handleReturnClick = () => {
        console.log(bikeData.id);
        axios.post('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + '/bikes/return', {bikeId: bikeData.id})
            .then(() => {
                client.publish('alquibici/' + bikeData.id + '/rent-status', 'return');
                alert("successfully returned");
            })
            .catch((e) => {
                alert(e.response.data.message);
            });
        client.on("message", (topic, message) => {
            console.log(topic);
            if (topic === 'alquibici/' + bikeData.id + '/return') {
                let json = toJson(message);
                console.log(JSON.stringify(json));
                const modifyBalance = async () => {
                    let bikeRes = await axios.get('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + `/bikes/get/${bikeData.id}`).catch((e) => console.log("error"));
                    let price = bikeRes.data.price
                    let funds = json.distance * price / 1000;
                    await axios.post('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + '/users/add-funds', {email: localStorage.getItem("email"), funds: -funds});
                }
                modifyBalance();
            }
        });
    }

    if (isAllowed) {
        return (
            <div style={{marginLeft: "5%"}}>
                <h1>Owner: {bikeData.ownerName}</h1>
                <p>Rented by: {clientData.name}</p>
                <p>Price: {bikeData.price}</p>
                <p>Distance traveled: {distance}m</p>
                <p>Cost: ${cost}</p>
                <button onClick={handleReturnClick}>Return</button>
                <div style={{width: "50%", height: "50%"}}>
                    <BikeMap data={[positionData]}/>
                </div>
            </div>
        );
    }
}

export default ActiveRentPage