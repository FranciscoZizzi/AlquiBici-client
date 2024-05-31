import React, {useState} from 'react';
import {Map, MapLayers, MapMarkerLayer, MapTileLayer} from '@progress/kendo-react-map';
import '@progress/kendo-theme-default/dist/all.css';
import BikeMap from "../components/BikeMap";

const ActiveRentPage = () => {
    const [data, setPosition] = useState([
        {
            coords: [30.2675, -0.7409],
            name: "Current position",
        },
    ]);

    return (
        <div>
            <h1>hola</h1>
            <div style={{width: "50%"}}>
                <BikeMap data={data}/>
            </div>
        </div>
    );
}

export default ActiveRentPage