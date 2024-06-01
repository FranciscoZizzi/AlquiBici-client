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
                console.log(message);
                console.log(distance);
            }
        })
    }, []);

    const handleClick = () => {
        setPosition(0, 0);
    }

    const setPosition = (lat, long) => {
        setPositionData({coords: [0, 0], name: "Current position"});
    }

    const toJson = (byteArray) => {
        let jsonString = Array.from(byteArray).map(byte => String.fromCharCode(byte)).join('');
        console.log(jsonString)
        return JSON.parse(jsonString);
    }

    const toInt = (byteArray) => {
        let value = 0;
        for (let i = 0; i < byteArray.length; i++) {
            value = (value << 8) | byteArray[i];
        }
        return value;
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