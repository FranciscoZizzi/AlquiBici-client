import React, {useEffect, useState} from "react";
import {BASE_URL, PORT} from "../utils/constants";
import axios from 'axios';
import BikeInfo from "../components/BikeInfo";

const HomePage = () => {

    const [bikes, setBikes] = useState([{id:12}, {id:'buenas'}, {id:123}]);

    useEffect(() => {
        axios.get(BASE_URL + ':' + PORT + "/api/bikes").then(res => setBikes(res.data)).catch(e => console.log(e))
    }, []);

    const rows = [];
    bikes.forEach(bike => rows.push(<BikeInfo bikeId={bike.id}/>));

    return(
        <div>
            <h1>Available Bikes</h1>
            {rows}
        </div>
    );
}

export default HomePage;
