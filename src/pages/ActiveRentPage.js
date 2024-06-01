import React, {useEffect, useState} from 'react';
import BikeMap from "../components/BikeMap";

const ActiveRentPage = ({client, bikeId}) => {
    const [positionData, setPositionData] = useState(
        {
            coords: [0, 0],
            name: "Current position",
        },
    );

    useEffect(() => {
        client.subscribe("position", (e) => {
            if (!e) {
                console.log("subscribed successfully");
            } else {
                console.log(e);
            }
        });
        client.subscribe("distance", (e) => {
            if (!e) {
                console.log("subscribed successfully");
            } else {
                console.log(e);
            }
        });
        client.on("message", (topic, message) => {
            if (topic === "position") { // TODO change to actual topic
                let json = toJson(message);
                setPosition(json.lat, json.long);
            }
            if (topic === "distance") { // TODO change to actual topic
                let distance = toInt(message);
                console.log(distance);
            }
        })
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
            <button onClick={handleClick}>press me</button>
            <div style={{width: "50%"}}>
                <BikeMap data={[positionData]}/>
            </div>
        </div>
    );
}

export default ActiveRentPage