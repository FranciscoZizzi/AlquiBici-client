import React, {useState} from 'react';
import axios from "axios";
import {SERVER_HOSTNAME, SERVER_PORT} from "../utils/constants";
import {useNavigate} from "react-router-dom";

const AddFundsPage = () => {
    const [funds, setFunds] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const addFunds = async () => {
            let email = localStorage.getItem("email");
            await axios.post('http://' + SERVER_HOSTNAME + ':' + SERVER_PORT + '/users/add-funds',{email:email, funds:funds});
            alert("added funds successfully");
            navigate('/');
        }
        addFunds();
    }

    return(
        <div style={{margin: 40}}>
            <h1>Add Funds</h1>
            <form>
                <label>Funds:</label>
                <input type="number" value={funds} onChange={e => setFunds(e.target.value)}/>$<br></br>
                <input type="submit" onClick={handleSubmit}/>
            </form>
        </div>
    );
}

export default AddFundsPage;