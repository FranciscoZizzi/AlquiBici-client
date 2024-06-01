import React, {useEffect, useState} from 'react';
import BikeMap from "../components/BikeMap";
import {useParams} from "react-router-dom";
import axios from "axios";
import {SERVER_HOSTNAME, SERVER_PORT} from "../utils/constants";

const ActiveRentPage = ({client}) => {
    const [positionData, setPositionData] = useState(
        {
            coords: [30, 30],
            name: "Current position",
        },
    );
    const [distance, setDistance] = useState(0);
    const [bikeData, setBikeData] = useState({ownerName: 'loading', rentDistance: 'loading', price: "loading", id:"loading"});
    const [clientData, setClientData] = useState({name: 'loading'});

    const {bikeId} = useParams();


    useEffect(() => {
        const getBikeData = async () => {
            let bikeRes = await axios.get('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + `/bikes/get/${bikeId}`).catch((e) => console.log("error"));
            setBikeData(bikeRes.data);

            let bikeData = bikeRes.data
            console.log(bikeRes.data);

            let clientRes = bikeRes.data.renterEmail ? await axios.get('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + `/users/get/${bikeData.renterEmail}`) : {data: {name: 'loading'}};
            setClientData(clientRes.data);

            let positionTopic = 'alquibici/' + bikeData.id + '/position'
            client.subscribe(positionTopic, (e) => {
                console.log(bikeData.id)
                if (!e) {
                    console.log('subscribed to ' + positionTopic);
                } else {
                    console.log(e);
                }
            });

            let distanceTopic = 'alquibici/' + bikeData.id + '/distance'
            client.subscribe(distanceTopic, (e) => {
                if (!e) {
                    console.log('subscribed to ' + distanceTopic);
                } else {
                    console.log(e);
                }
            });
        }
        getBikeData();
    }, []);

    useEffect(() => {
        client.on("message", (topic, message) => {
            if (topic === 'alquibici/' + bikeData.id + '/position') {
                let json = toJson(message);
                setPosition(json.lat, json.long);
            }
            if (topic === 'alquibici/' + bikeData.id + '/distance') {
                let distance = toInt(message);
                setDistance(distance);
            }
        })
    }, [bikeData]);

    const setPosition = (lat, long) => {
        console.log("updating")
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
            <p>Distance traveled: {distance}</p>
            <p>Price: {bikeData.price}</p>
            <div style={{width: "50%", height:"50%"}}>
                <BikeMap data={[positionData]}/>
            </div>
        </div>
    );
}

export default ActiveRentPage