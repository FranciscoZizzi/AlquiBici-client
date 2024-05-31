import React, {useEffect, useState} from 'react';
import axios from "axios";
import {SERVER_HOSTNAME, SERVER_PORT} from "../utils/constants";
import {useNavigate} from "react-router-dom";

const Header = () => {
    const [userData, setUserData] = useState({balance: 0});
    const navigate = useNavigate();

    useEffect(() => {
        let email = localStorage.getItem("email");
        axios.get('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + `/users/get/${email}`).then(res => {
            setUserData(res.data);
        })
    }, []);

    const handleLogOut = () => {
        localStorage.clear();
        navigate('/login');
    }

    return(
        <div style={{height:"10%", padding: 10, backgroundColor:"lightgray", display: "flex", flexDirection:"row", justifyContent:"space-between"}}>
            <button onClick={handleLogOut}>Log out</button>
            <p>Balance: {userData.balance}</p>
        </div>
    );
}

export default Header;