import React, {useEffect, useState} from "react";
import {BASE_URL, PORT} from "../utils/constants";
import axios from 'axios';
import BikeInfo from "../components/BikeInfo";
import {useNavigate} from "react-router-dom";

const HomePage = () => {
    const [bikes, setBikes] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("email")) {
            navigate('/login');
        }
        axios.get(BASE_URL + ':' + PORT + "/bikes").then(res => setBikes(res.data)).catch(e => console.log(e))
    }, []);

    const rows = [];
    bikes.forEach(bike => rows.push(<BikeInfo bike={bike}/>));

    return(
        <div style={{
            marginLeft:"2.5%"
        }}>
            <div style={{display:"flex", flexDirection:"column", gap:"5px"}}>
                <h1>Available Bikes</h1>
                {rows}
            </div>
        </div>
    );
}

export default HomePage;
