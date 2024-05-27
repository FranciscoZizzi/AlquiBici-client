import React, {useEffect, useState} from "react";
import {BASE_URL, PORT} from "../utils/constants";
import axios from 'axios';
import BikeInfo from "../components/BikeInfo";
import {useNavigate} from "react-router-dom";
import Header from "../components/Header";

const HomePage = () => {
    const [bikes, setBikes] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("email")) {
            navigate('/login');
        }
        axios.get(BASE_URL + ':' + PORT + "/bikes").then(res => setBikes(res.data)).catch(e => console.log(e));
        axios.get(BASE_URL + ':' + PORT + `/users/get/${localStorage.getItem("email")}`).then(res => setIsAdmin(res.data.isAdmin));
    }, []);

    const rows = [];
    bikes.forEach(bike => rows.push(<BikeInfo bike={bike}/>));

    return(
        <div>
            <Header/>
            <div style={{
                margin:"2.5%"
            }}>
                <div style={{display:"flex", flexDirection:"column", gap:"5px"}}>
                    <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
                        <h1>Available Bikes</h1>
                        {isAdmin ?<button>Upload Bike</button>:null}
                    </div>
                    {rows}
                </div>
            </div>
        </div>
    );
}

export default HomePage;
