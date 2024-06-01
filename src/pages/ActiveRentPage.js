import React, {useEffect, useState} from 'react';
import BikeMap from "../components/BikeMap";

const ActiveRentPage = ({client}) => {
    const [data, setPosition] = useState(
        {
            coords: [30.2675, -0.7409],
            name: "Current position",
        },
    );

    useEffect(() => {
        client.subscribe("test", (e) => {
            if (!e) {
                console.log("subscribed successfully");
            } else {
                console.log(e);
            }
        });
        client.on("message", (topic, message) => {
            if (topic === "test") {
                let jsonString = Array.from(message).map(byte => String.fromCharCode(byte)).join('');
                let json = JSON.parse(jsonString);
                console.log(JSON.stringify(json));
            }
        })
    }, []);

    const handleClick = () => {
        setPosition({coords: [0, 0], name: "Current position"})
    }

    return (
        <div>
            <button onClick={handleClick}>press me</button>
            <div style={{width: "50%"}}>
                <BikeMap data={[data]}/>
            </div>
        </div>
    );
}

export default ActiveRentPage