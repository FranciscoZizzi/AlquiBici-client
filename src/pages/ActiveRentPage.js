import React, {useState} from 'react';
import BikeMap from "../components/BikeMap";

const ActiveRentPage = ({client}) => {
    const [data, setPosition] = useState(
        {
            coords: [30.2675, -0.7409],
            name: "Current position",
        },
    );

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