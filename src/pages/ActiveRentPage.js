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
        },
    );
    const [bikeData, setBikeData] = useState({});
    const [clientData, setClientData] = useState({});

    const {bikeId} = useParams();


    useEffect(() => {
        const getBikeData = async () => {
            let bikeRes = await axios.get('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + `/bikes/get/${bikeId}`);
            setBikeData(bikeRes.data);

            let bikeData = bikeRes.data
            console.log(bikeRes.data);

            let clientRes = bikeRes.data.renterEmail ? await axios.get('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + `/users/get/${bikeData.renterEmail}`) : {};
            setClientData(clientRes.data);

            client.subscribe('alquibici/' + bikeData.id + '/position', (e) => {
                console.log(bikeData.id)
                if (!e) {
                    console.log("subscribed to position topic successfully");
                } else {
                    console.log(e);
                }
            });
            client.subscribe('alquibici/' + bikeData.id + '/distance', (e) => {
                if (!e) {
                    console.log("subscribed to distance topic successfully");
                } else {
                    console.log(e);
                }
            });
            client.on("message", (topic, message) => {
                if (topic === 'alquibici/' + bikeData.id + '/position') {
                    let json = toJson(message);
                    setPosition(json.lat, json.long);
                }
                if (topic === 'alquibici/' + bikeData.id + '/distance') {
                    let distance = toInt(message);
                    console.log(distance);
                }
            })
        }
        getBikeData()

    }, []);

    const setPosition = (lat, long) => {
        setPositionData({coords: [lat, long], name: "Current position"});
    }

    const toJson = (byteArray) => {
        let jsonString = Array.from(byteArray).map(byte => String.fromCharCode(byte)).join('');
        console.log(jsonString)
        return JSON.parse(jsonString);
    }

    const toInt = (byteArray) => {
        let string =  Array.from(byteArray).map(byte => String.fromCharCode(byte)).join('');
        return parseInt(string);
    }

    return (
        <div>
            <h1>Owner: {bikeData.ownerName}</h1>
            <p>Rented by: {clientData.name}</p>
            <p>Distance traveled: {bikeData.rentDistance}</p>
            <p>Price: {bikeData.price}</p>
            <div style={{width: "50%", height:"50%"}}>
                <BikeMap data={[positionData]}/>
            </div>
        </div>
    );
}

export default ActiveRentPage